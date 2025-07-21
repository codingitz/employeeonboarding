import express from 'express';
import mongoose from 'mongoose';
import agentRoutes from './routes/agent.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agent-onboarding';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.error('Is your MongoDB server running?');
  });

app.use('/api/agent', agentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Backend is reachable' });
});

// 404 handler (must be last)
app.use((req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Global error handler (must be after all other app.use and routes)
app.use((err, req, res, next) => {
  console.error('Global error handler:');
  console.error('Type:', typeof err);
  try { console.error('String:', String(err)); } catch (e) {}
  try { console.error('JSON:', JSON.stringify(err, Object.getOwnPropertyNames(err))); } catch (e) {}
  if (err instanceof Error) {
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);
  }
  if (err && typeof err === 'object') {
    for (const key of Object.keys(err)) {
      console.error(`err[${key}]:`, err[key]);
    }
  }
  res.status(500).json({ message: err.message || 'Server error (global handler)' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});