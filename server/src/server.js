import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import { 
  startImport, 
  getImportHistory, 
  getImportDetails, 
  getQueueStatistics,
  triggerAllImports ,
  getJobs 
} from './controllers/importController.js';

import { initializeQueue } from './workers/queueService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/import/start', startImport);
app.get('/api/import/history', getImportHistory);
app.get('/api/import/:id', getImportDetails);
app.get('/api/queue/stats', getQueueStatistics);
app.post('/api/import/trigger-all', triggerAllImports);
app.get('/api/jobs', getJobs);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Job Importer API is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', async (req, res) => {
  res.json({ 
    message: 'Server is working!',
    endpoints: [
      'POST /api/import/start - Start a job import',
      'GET /api/import/history - Get import history', 
      'GET /api/import/:id - Get import details',
      'GET /api/queue/stats - Get queue statistics',
      'POST /api/import/trigger-all - Import from all APIs'
    ]
  });
});

async function startServer() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('👷 Starting queue system...');
    initializeQueue();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
    });

  } catch (error) {
    console.log('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();