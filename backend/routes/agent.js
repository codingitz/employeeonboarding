import express from 'express';
import { registerAgent } from '../controllers/agentController.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
import Agent from '../models/Agent.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'agent-onboarding',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    public_id: `${file.fieldname}-${Date.now()}`,
    transformation: [{ quality: 'auto' }],
  }),
});

const upload = multer({ storage });

const agentUpload = upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'panPhoto', maxCount: 1 },
  { name: 'aadhaarFront', maxCount: 1 },
  { name: 'aadhaarBack', maxCount: 1 },
  { name: 'certificates', maxCount: 10 },
]);

router.post('/register', agentUpload, registerAgent);

// GET /api/agent/profile - get full agent profile for logged-in agent
router.get('/profile', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: 'Unauthorized' });
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const agent = await Agent.findById(decoded.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    res.json({ agent });
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

export default router; 