import User from '../models/User.js';
import Agent from '../models/Agent.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Try admin login (by email, case-insensitive)
    let user = await User.findOne({ email: new RegExp('^' + username + '$', 'i') });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
      return res.json({ token, role: user.role, user: { email: user.email } });
    }

    // Agent login (by email, not Agent ID)
    let agent = await Agent.findOne({ email: username, status: 'APPROVED' });
    if (agent && agent.password) {
      const isMatch = await bcrypt.compare(password, agent.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });
      const token = jwt.sign({ id: agent._id, role: 'agent' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
      return res.json({ token, role: 'agent', user: { agentId: agent.agentId, name: agent.name, email: agent.email } });
    }

    return res.status(401).json({ message: 'Invalid credentials.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}; 