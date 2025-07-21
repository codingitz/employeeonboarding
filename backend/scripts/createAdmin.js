import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agent-onboarding';

async function createAdmin() {
  await mongoose.connect(MONGO_URI);
  const email = 'AdminA2zAgentOnboard.in';
  const password = 'AdminAgentOnboarding2025';
  const hashed = await bcrypt.hash(password, 10);
  const exists = await User.findOne({ email });
  if (exists) {
    console.log('Admin already exists');
    process.exit(0);
  }
  await User.create({ email, password: hashed });
  console.log('Admin created');
  process.exit(0);
}

createAdmin(); 