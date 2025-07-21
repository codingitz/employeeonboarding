import Agent from '../models/Agent.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.json({ agents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json({ agent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper to generate next Agent ID
async function getNextAgentId() {
  const last = await Agent.findOne({ agentId: { $exists: true } }).sort({ agentId: -1 });
  if (!last || !last.agentId) return 'A2Z0001';
  const num = parseInt(last.agentId.replace('A2Z', '')) + 1;
  return 'A2Z' + num.toString().padStart(4, '0');
}

async function sendCredentialsEmail(agent, agentId, password) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: `"A2Z FINSERV INSURANCE MARKETINGLLP" <${process.env.EMAIL_USER}>`,
    to: agent.email,
    subject: 'Welcome Aboard! Your Agent Portal Credentials',
    html: `
      <p>Dear ${agent.name},</p>
      <p>Congratulations and welcome to the team! Your application has been approved.</p>
      <p>You can now access the agent portal using the following credentials:</p>
      <ul>
        <li><strong>Agent ID:</strong> ${agentId}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>
      <p>Please log in to the portal to get started. We recommend changing your password after your first login.</p>
      <p>Best Regards,</p>
      <p><strong>The A2Z FINSURE INSURE MARKETING LLP Team</strong></p>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (emailErr) {
    console.error('Email send error:', emailErr);
    // Optionally, re-throw the error to be handled by the caller
    throw new Error('Failed to send credentials email.');
  }
}

export const approveAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    if (agent.status === 'APPROVED') return res.status(400).json({ message: 'Already approved' });

    let agentId = req.body.agentId || agent.email;
    const password = req.body.password;

    if (!password) {
      return res.status(400).json({ message: 'Password is required to approve an agent.' });
    }
    
    if (agentId !== agent.email) {
      const exists = await Agent.findOne({ agentId });
      if (exists) return res.status(409).json({ message: 'Agent ID already exists' });
    } else {
      agentId = await getNextAgentId();
    }
    
    const hashed = await bcrypt.hash(password, 10);

    agent.agentId = agentId;
    agent.password = hashed;
    agent.status = 'APPROVED';
    await agent.save();

    await sendCredentialsEmail(agent, agentId, password);

    res.json({ message: 'Agent approved and credentials sent', agentId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

export const resendCredentials = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    if (!agent.agentId || !agent.password) return res.status(400).json({ message: 'Agent credentials not set' });

    // For security, it's better to have a dedicated password reset flow.
    // However, per the request, we will generate a new password and send it.
    const newPassword = Math.random().toString(36).slice(-8);
    agent.password = await bcrypt.hash(newPassword, 10);
    await agent.save();
    
    await sendCredentialsEmail(agent, agent.agentId, newPassword);
    res.json({ message: 'A new password has been sent to the agent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

export const rejectAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    agent.status = 'REJECTED';
    agent.rejectionReason = req.body.reason || '';
    await agent.save();
    res.json({ message: 'Agent rejected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCredentials = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    if (agent.status !== 'APPROVED') return res.status(400).json({ message: 'Agent must be approved' });

    let { email, password } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    if (!password) return res.status(400).json({ message: 'Password is required' });

    // If agentId is based on email, check for uniqueness if it's being changed.
    if (email !== agent.email) {
      const exists = await Agent.findOne({ email });
      if (exists) return res.status(409).json({ message: 'This email is already in use.' });
    }

    agent.email = email;
    agent.password = await bcrypt.hash(password, 10);
    await agent.save();

    // Send the updated credentials via email
    await sendCredentialsEmail(agent, agent.agentId, password);
    
    res.json({ message: 'Credentials updated and email sent successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
}; 