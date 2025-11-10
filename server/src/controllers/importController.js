import ImportLog from '../models/ImportLog.js';
import { addImportJob, getQueueStats } from '../workers/queueService.js';
import Job from '../models/Job.js';

async function startImport(req, res) {
  try {
    const { apiUrl } = req.body;

    if (!apiUrl) {
      return res.json({ error: 'Please provide an API URL' });
    }


    const importLog = await ImportLog.create({
      fileName: apiUrl,
      status: 'waiting'
    });


    await addImportJob(apiUrl, importLog._id);

    res.json({
      message: 'Import started!',
      importId: importLog._id,
      status: 'queued'
    });

  } catch (error) {
    console.log('Error starting import:', error);
    res.json({ error: 'Failed to start import' });
  }
}


async function getImportHistory(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;


    const imports = await ImportLog.find()
      .sort({ importDateTime: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ImportLog.countDocuments();

    res.json({
      imports,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalImports: total
    });

  } catch (error) {
    console.log('Error getting history:', error);
    res.json({ error: 'Failed to get import history' });
  }
}

async function getImportDetails(req, res) {
  try {
    const { id } = req.params;
    
    const importLog = await ImportLog.findById(id);
    
    if (!importLog) {
      return res.json({ error: 'Import not found' });
    }

    res.json(importLog);

  } catch (error) {
    console.log('Error getting import details:', error);
    res.json({ error: 'Failed to get import details' });
  }
}
async function getQueueStatistics(req, res) {
  try {
    const stats = await getQueueStats();
    res.json(stats);
  } catch (error) {
    console.log('Error getting queue stats:', error);
    res.json({ error: 'Failed to get queue statistics' });
  }
}


async function triggerAllImports(req, res) {
  try {
    const jobApis = [
      'https://jobicy.com/?feed=job_feed',
      'https://www.higheredjobs.com/rss/articleFeed.cfm'
    ];

    const results = [];

    for (const apiUrl of jobApis) {
      try {
        const importLog = await ImportLog.create({
          fileName: apiUrl,
          status: 'waiting'
        });

        await addImportJob(apiUrl, importLog._id);
        results.push({ apiUrl, status: 'queued', importId: importLog._id });
      } catch (error) {
        results.push({ apiUrl, status: 'failed', error: error.message });
      }
    }

    res.json({
      message: 'Started imports for all APIs',
      results
    });

  } catch (error) {
    console.log('Error triggering all imports:', error);
    res.json({ error: 'Failed to trigger imports' });
  }
}

async function getJobs(req, res) {
  try {
    console.log('📋 Fetching all jobs from database...');
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;


    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments();

    console.log(`✅ Found ${jobs.length} jobs in database (Total: ${total})`);
    
    res.json({
      success: true,
      data: {
        jobs,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.log('❌ Error fetching jobs:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch jobs from database: ' + error.message 
    });
  }
}


export { 
  startImport, 
  getImportHistory, 
  getImportDetails, 
  getQueueStatistics,
  triggerAllImports,
  getJobs  
};