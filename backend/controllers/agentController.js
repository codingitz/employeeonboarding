import Agent from '../models/Agent.js';

export const registerAgent = async (req, res) => {
  try {
    const {
      name, email, phone, city, state, qualification, message,
      panNumber, aadhaarNumber
    } = req.body;

    // Basic validation
    if (!name || !email || !phone || !city || !state || !qualification || !panNumber || !aadhaarNumber) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    // Check if email already exists
    const existing = await Agent.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // File size/type validation (max 100KB for profilePhoto, only images for all)
    const files = req.files || {};
    const getUrl = (file) => file?.path || file?.url || '';
    const profilePhotoFile = files.profilePhoto?.[0];
    if (profilePhotoFile) {
      if (!profilePhotoFile.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Profile photo must be an image.' });
      }
      if (profilePhotoFile.size > 100 * 1024) {
        return res.status(400).json({ message: 'Profile photo must be less than 100KB.' });
      }
    }
    // Validate other files (optional, but must be images if present)
    const fileFields = ['panPhoto', 'aadhaarFront', 'aadhaarBack'];
    for (const field of fileFields) {
      const file = files[field]?.[0];
      if (file && !file.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: `${field} must be an image.` });
      }
    }
    // Certificates: allow images or pdfs
    if (files.certificates) {
      for (const cert of files.certificates) {
        if (!cert.mimetype.startsWith('image/') && cert.mimetype !== 'application/pdf') {
          return res.status(400).json({ message: 'Certificates must be images or PDFs.' });
        }
      }
    }

    const profilePhoto = getUrl(profilePhotoFile);
    const panPhoto = getUrl(files.panPhoto?.[0]);
    const aadhaarFront = getUrl(files.aadhaarFront?.[0]);
    const aadhaarBack = getUrl(files.aadhaarBack?.[0]);
    const certificates = files.certificates ? files.certificates.map(f => getUrl(f)) : [];

    const agent = new Agent({
      name, email, phone, city, state, qualification, message,
      panNumber, aadhaarNumber,
      profilePhoto, panPhoto, aadhaarFront, aadhaarBack, certificates,
      status: 'PENDING',
    });
    await agent.save();
    res.status(201).json({ message: 'Registration successful. Your application is pending review.' });
  } catch (err) {
    // Log everything possible about the error
    console.error('Registration error:');
    console.error('Type:', typeof err);
    try {
      console.error('String:', String(err));
    } catch (e) {
      console.error('String conversion failed:', e);
    }
    try {
      console.error('JSON:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    } catch (e) {
      console.error('JSON stringify failed:', e);
    }
    if (err instanceof Error) {
      console.error('Message:', err.message);
      console.error('Stack:', err.stack);
    }
    // Log all keys/values
    if (err && typeof err === 'object') {
      for (const key of Object.keys(err)) {
        console.error(`err[${key}]:`, err[key]);
      }
    }
    // Always return a clear error message
    res.status(500).json({ message: err.message || 'Server error' });
  }
}; 