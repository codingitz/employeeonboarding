import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agent-onboarding';

async function checkPassword() {
  await mongoose.connect(MONGO_URI);
  const email = 'AdminA2zAgentOnboard.in';
  const password = 'AdminAgentOnboarding2025';
  const user = await User.findOne({ email: new RegExp('^' + email + '$', 'i') });
  if (!user) {
    console.log('Admin user not found');
    process.exit(1);
  }
  const match = await bcrypt.compare(password, user.password);
  console.log('Password matches hash:', match);
  process.exit(0);
}

checkPassword(); 