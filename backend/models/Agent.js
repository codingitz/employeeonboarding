import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  qualification: { type: String, required: true },
  message: { type: String },
  panNumber: { type: String, required: true },
  aadhaarNumber: { type: String, required: true },
  profilePhoto: { type: String },
  panPhoto: { type: String },
  aadhaarFront: { type: String },
  aadhaarBack: { type: String },
  certificates: [{ type: String }],
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  rejectionReason: { type: String },
  agentId: { type: String, unique: true, sparse: true },
  password: { type: String }, // Only set after approval
}, { timestamps: true });

const Agent = mongoose.model('Agent', agentSchema);
export default Agent; 