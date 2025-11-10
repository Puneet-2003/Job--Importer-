import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { getJobsFromApi } from '../services/apiService.js';
import Job from '../models/Job.js';
import ImportLog from '../models/ImportLog.js';

let jobQueue = null;
let worker = null;

function initializeQueue() {
  const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
  
  jobQueue = new Queue('job-import-queue', {
    connection: redisConnection
  });

  startWorker(redisConnection);
  
  console.log('✅ Queue system initialized');
}

function startWorker(redisConnection) {
  worker = new Worker('job-import-queue', processJob, {
    connection: redisConnection,
    concurrency: 3
  });

  worker.on('completed', (job) => {
    console.log(`🎉 Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.log(`❌ Job ${job.id} failed:`, err.message);
  });

  console.log('👷 Worker started and ready for jobs');
}

async function processJob(job) {
  const { apiUrl, importLogId } = job.data;
  
  console.log(`👷 Processing job from: ${apiUrl}`);
  
  try {
    await ImportLog.findByIdAndUpdate(importLogId, { status: 'processing' });

    const jobs = await getJobsFromApi(apiUrl);
    
    let newJobsCount = 0;
    let updatedJobsCount = 0;
    let failedJobsCount = 0;

    for (const jobData of jobs) {
      try {
        const existingJob = await Job.findOne({ 
          title: jobData.title, 
          company: jobData.company 
        });

        if (existingJob) {
          await Job.findByIdAndUpdate(existingJob._id, jobData);
          updatedJobsCount++;
          console.log(`✏️ Updated job: ${jobData.title}`);
        } else {
          await Job.create(jobData);
          newJobsCount++;
          console.log(`🆕 New job: ${jobData.title}`);
        }
      } catch (error) {
        failedJobsCount++;
        console.log(`❌ Failed to save job: ${jobData.title}`, error.message);
      }
    }

    await ImportLog.findByIdAndUpdate(importLogId, {
      status: 'completed',
      total: jobs.length,
      new: newJobsCount,
      updated: updatedJobsCount,
      failed: failedJobsCount,
      fileName: getFileNameFromUrl(apiUrl)
    });

    console.log(`✅ Import completed: ${newJobsCount} new, ${updatedJobsCount} updated, ${failedJobsCount} failed`);

    return {
      success: true,
      new: newJobsCount,
      updated: updatedJobsCount,
      failed: failedJobsCount
    };

  } catch (error) {
    await ImportLog.findByIdAndUpdate(importLogId, {
      status: 'failed',
      failed: 1
    });
    
    console.log('❌ Job processing failed:', error);
    throw error;
  }
}

function getFileNameFromUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `jobs_from_${domain}_${Date.now()}`;
  } catch {
    return `jobs_import_${Date.now()}`;
  }
}

async function addImportJob(apiUrl, importLogId) {
  if (!jobQueue) {
    throw new Error('Queue not initialized. Call initializeQueue() first.');
  }

  const job = await jobQueue.add('import-job', {
    apiUrl,
    importLogId
  }, {
    jobId: `import-${Date.now()}`
  });

  console.log(`📥 Added job to queue: ${job.id}`);
  return job;
}

async function getQueueStats() {
  if (!jobQueue) {
    return { error: 'Queue not initialized' };
  }

  try {
    const [waiting, active, completed, failed] = await Promise.all([
      jobQueue.getWaiting(),
      jobQueue.getActive(),
      jobQueue.getCompleted(),
      jobQueue.getFailed()
    ]);

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length
    };
  } catch (error) {
    console.log('Error getting queue stats:', error);
    return { error: 'Failed to get queue stats' };
  }
}

export { 
  initializeQueue, 
  addImportJob, 
  getQueueStats, 
  processJob 
};