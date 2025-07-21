import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agent-onboarding';

async function updateAdmin() {
  await mongoose.connect(MONGO_URI);
  const email = 'a2z@agentonboarding.in';
  const password = 'agentonboarding2025';
  const hashed = await bcrypt.hash(password, 10);

  // Update the first admin user found
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    await User.create({ email, password: hashed, role: 'admin' });
    console.log('Admin created');
  } else {
    admin.email = email;
    admin.password = hashed;
    await admin.save();
    console.log('Admin updated');
  }
  process.exit(0);
}

updateAdmin(); 