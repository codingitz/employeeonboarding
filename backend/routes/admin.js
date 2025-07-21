import express from 'express';
import { getAllAgents, getAgentById, approveAgent, rejectAgent, resendCredentials, updateCredentials } from '../controllers/adminController.js';
const router = express.Router();

router.get('/agents', getAllAgents);
router.get('/agents/:id', getAgentById);
router.post('/agents/:id/approve', approveAgent);
router.post('/agents/:id/reject', rejectAgent);
router.post('/agents/:id/resend', resendCredentials);
router.post('/agents/:id/credentials', updateCredentials);

export default router; 