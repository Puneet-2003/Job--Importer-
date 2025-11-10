import axios from 'axios';
import xml2js from 'xml2js';

async function convertXmlToJobs(xmlData, source) {
  return new Promise((resolve) => {
    const parser = new xml2js.Parser({ explicitArray: false });
    
    parser.parseString(xmlData, (err, result) => {
      if (err) {
        console.log('XML parsing error:', err);
        resolve([]);
        return;
      }

      const jobs = [];
      const items = result?.rss?.channel?.item;
      
      if (!items) {
        resolve([]);
        return;
      }

      const jobList = Array.isArray(items) ? items : [items];
      
      jobList.forEach(item => {
        const job = {
          jobId: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: item.title || 'No Title',
          company: item.company || item['hr:company'] || 'Unknown Company',
          location: item.location || item['hr:location'] || 'Remote',
          description: item.description || '',
          category: item.category || 'general',
          applyUrl: item.link || '',
          publishedDate: new Date(item.pubDate || Date.now()),
          source: source.includes('jobicy') ? 'Jobicy' : 
                 source.includes('higheredjobs') ? 'HigherEdJobs' : 'Other'
        };
        
        jobs.push(job);
      });
      
      resolve(jobs);
    });
  });
}

async function getJobsFromApi(apiUrl) {
  try {
    console.log(`📡 Fetching jobs from: ${apiUrl}`);
    
    const response = await axios.get(apiUrl, { timeout: 15000 });
    
    let jobs = [];
    if (apiUrl.includes('jobicy.com') || apiUrl.includes('higheredjobs.com')) {
      jobs = await convertXmlToJobs(response.data, apiUrl);
    } else {
      jobs = await convertXmlToJobs(response.data, 'unknown');
    }
    
    console.log(`✅ Found ${jobs.length} jobs from ${apiUrl}`);
    return jobs;
    
  } catch (error) {
    console.log(`❌ Error getting jobs from ${apiUrl}:`, error.message);
    return [];
  }
}

export { getJobsFromApi, convertXmlToJobs };