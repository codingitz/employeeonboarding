import React, { useState } from 'react';
import { registerAgent } from '../services/api';

const initialState = {
  name: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  qualification: '',
  message: '',
  panNumber: '',
  aadhaarNumber: '',
  profilePhoto: null,
  panPhoto: null,
  aadhaarFront: null,
  aadhaarBack: null,
  certificates: [],
};

const SignupForm = () => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'certificates') {
      setForm((prev) => ({ ...prev, certificates: Array.from(files) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccess('');
    setErrors({});
    try {
      // Basic validation (add more as needed)
      const required = ['name','email','phone','city','state','qualification','panNumber','aadhaarNumber'];
      let errs = {};
      required.forEach((f) => { if (!form[f]) errs[f] = 'Required'; });
      if (Object.keys(errs).length) {
        setErrors(errs);
        setLoading(false);
        return;
      }
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'certificates') {
          value.forEach((file) => formData.append('certificates', file));
        } else if (value) {
          formData.append(key, value);
        }
      });
      await registerAgent(formData);
      setSuccess('Registration successful! Your application is pending review.');
      setForm(initialState);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} encType="multipart/form-data">
      <input name="name" type="text" placeholder="Full Name" className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none bg-white text-gray-700" value={form.name} onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none bg-white text-gray-700" value={form.email} onChange={handleChange} />
      <input name="phone" type="tel" placeholder="Phone Number" className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none bg-white text-gray-700" value={form.phone} onChange={handleChange} />
      <input name="city" type="text" placeholder="City" className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none bg-white text-gray-700" value={form.city} onChange={handleChange} />
      <input name="state" type="text" placeholder="State" className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none bg-white text-gray-700" value={form.state} onChange={handleChange} />
      <input name="qualification" type="text" placeholder="Qualification" className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none bg-white text-gray-700" value={form.qualification} onChange={handleChange} />
      <textarea name="message" placeholder="Optional Message" className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none bg-white text-gray-700" value={form.message} onChange={handleChange} />
      <input name="panNumber" type="text" placeholder="PAN Number" className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none bg-white text-gray-700" value={form.panNumber} onChange={handleChange} />
      <input name="aadhaarNumber" type="text" placeholder="Aadhaar Number" className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none bg-white text-gray-700" value={form.aadhaarNumber} onChange={handleChange} />
      <div>
        <label className="block text-sm text-gray-800">Profile Photo (max 100KB)</label>
        <input name="profilePhoto" type="file" accept="image/*" className="w-full text-gray-700" onChange={handleFileChange} />
      </div>
      <div>
        <label className="block text-sm text-gray-800">PAN Card Photo</label>
        <input name="panPhoto" type="file" accept="image/*" className="w-full text-gray-700" onChange={handleFileChange} />
      </div>
      <div>
        <label className="block text-sm text-gray-800">Aadhaar Front Photo</label>
        <input name="aadhaarFront" type="file" accept="image/*" className="w-full text-gray-700" onChange={handleFileChange} />
      </div>
      <div>
        <label className="block text-sm text-gray-800">Aadhaar Back Photo</label>
        <input name="aadhaarBack" type="file" accept="image/*" className="w-full text-gray-700" onChange={handleFileChange} />
      </div>
      <div>
        <label className="block text-sm text-gray-800">Educational Certificates (multiple)</label>
        <input name="certificates" type="file" accept="application/pdf,image/*" multiple className="w-full text-gray-700" onChange={handleFileChange} />
      </div>
      {errorMsg && <div className="text-red-500 text-sm text-center">{errorMsg}</div>}
      {success && <div className="text-green-600 text-sm text-center">{success}</div>}
      <button type="submit" className="w-full py-2 mt-2 rounded-full border border-gray-400 bg-white text-black font-semibold text-lg shadow-sm hover:bg-gray-100 transition" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
    </form>
  );
};

export default SignupForm; 