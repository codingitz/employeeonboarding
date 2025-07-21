import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AgentDashboard = () => {
  const [agent, setAgent] = useState({ agentId: '', name: '', email: '', phone: '', city: '', state: '', qualification: '', panNumber: '', aadhaarNumber: '', message: '', profilePhoto: '', panPhoto: '', aadhaarFront: '', aadhaarBack: '', certificates: [] });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      try {
        const res = await fetch('/api/agent/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        setAgent({
          agentId: data.agent.agentId || '',
          name: data.agent.name || '',
          email: data.agent.email || '',
          phone: data.agent.phone || '',
          city: data.agent.city || '',
          state: data.agent.state || '',
          qualification: data.agent.qualification || '',
          panNumber: data.agent.panNumber || '',
          aadhaarNumber: data.agent.aadhaarNumber || '',
          message: data.agent.message || '',
          profilePhoto: data.agent.profilePhoto || '',
          panPhoto: data.agent.panPhoto || '',
          aadhaarFront: data.agent.aadhaarFront || '',
          aadhaarBack: data.agent.aadhaarBack || '',
          certificates: data.agent.certificates || [],
        });
      } catch {
        navigate('/login');
      }
    }
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #e0f7fa 0%, #f0fff4 60%, #38bdf8 100%)' }}>
      {/* Navbar */}
      <div className="w-full bg-gradient-to-r from-green-400 to-sky-400 py-4 px-8 flex items-center justify-between shadow-md mb-8">
        <div className="flex items-center gap-6">
          <div className="text-xl font-bold text-white tracking-wide">Agent Portal</div>
          <div className="bg-white text-green-700 rounded-full px-4 py-1 font-semibold shadow border border-green-200">
            ID: {agent.agentId}
          </div>
          <div className="text-white font-semibold">{agent.name}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-white font-medium">{agent.email}</div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white text-green-700 rounded-full font-semibold shadow hover:bg-green-50 border border-green-200"
          >
            Logout
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl" style={{ background: 'linear-gradient(135deg, #f0fff4 60%, #e0f7fa 100%)' }}>
          <h2 className="text-3xl font-bold text-center mb-6 text-green-700">Welcome, {agent.name}!</h2>
          <div className="text-center text-lg text-gray-700 mb-4">
            Your Agent ID: <span className="font-semibold text-green-700">{agent.agentId}</span>
          </div>
          <div className="text-center text-gray-600 mb-6">
            Here you can view your profile and submitted documents.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-2 font-semibold text-green-700">Name:</div>
              <div className="mb-4 text-gray-700">{agent.name}</div>
              <div className="mb-2 font-semibold text-green-700">Email:</div>
              <div className="mb-4 text-gray-700">{agent.email}</div>
              <div className="mb-2 font-semibold text-green-700">Phone:</div>
              <div className="mb-4 text-gray-700">{agent.phone}</div>
              <div className="mb-2 font-semibold text-green-700">City:</div>
              <div className="mb-4 text-gray-700">{agent.city}</div>
              <div className="mb-2 font-semibold text-green-700">State:</div>
              <div className="mb-4 text-gray-700">{agent.state}</div>
              <div className="mb-2 font-semibold text-green-700">Qualification:</div>
              <div className="mb-4 text-gray-700">{agent.qualification}</div>
              <div className="mb-2 font-semibold text-green-700">PAN Number:</div>
              <div className="mb-4 text-gray-700">{agent.panNumber}</div>
              <div className="mb-2 font-semibold text-green-700">Aadhaar Number:</div>
              <div className="mb-4 text-gray-700">{agent.aadhaarNumber}</div>
              <div className="mb-2 font-semibold text-green-700">Message:</div>
              <div className="mb-4 text-gray-700">{agent.message}</div>
            </div>
            <div>
              <div className="mb-2 font-semibold text-green-700">Profile Photo:</div>
              {agent.profilePhoto ? (
                <a href={agent.profilePhoto} target="_blank" rel="noopener noreferrer">
                  <img src={agent.profilePhoto} alt="Profile" className="w-32 h-32 object-cover rounded shadow border" />
                </a>
              ) : <div className="text-gray-500">Not uploaded</div>}
              <div className="mt-4 mb-2 font-semibold text-green-700">PAN Card Photo:</div>
              {agent.panPhoto ? (
                <a href={agent.panPhoto} target="_blank" rel="noopener noreferrer">
                  <img src={agent.panPhoto} alt="PAN" className="w-32 h-20 object-cover rounded shadow border" />
                </a>
              ) : <div className="text-gray-500">Not uploaded</div>}
              <div className="mt-4 mb-2 font-semibold text-green-700">Aadhaar Front:</div>
              {agent.aadhaarFront ? (
                <a href={agent.aadhaarFront} target="_blank" rel="noopener noreferrer">
                  <img src={agent.aadhaarFront} alt="Aadhaar Front" className="w-32 h-20 object-cover rounded shadow border" />
                </a>
              ) : <div className="text-gray-500">Not uploaded</div>}
              <div className="mt-4 mb-2 font-semibold text-green-700">Aadhaar Back:</div>
              {agent.aadhaarBack ? (
                <a href={agent.aadhaarBack} target="_blank" rel="noopener noreferrer">
                  <img src={agent.aadhaarBack} alt="Aadhaar Back" className="w-32 h-20 object-cover rounded shadow border" />
                </a>
              ) : <div className="text-gray-500">Not uploaded</div>}
              <div className="mt-4 mb-2 font-semibold text-green-700">Certificates:</div>
              {agent.certificates && agent.certificates.length > 0 ? (
                <ul className="list-disc pl-5">
                  {agent.certificates.map((c, i) => (
                    <li key={i} className="mb-2">
                      <a href={c} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">View Certificate {i + 1}</a>
                    </li>
                  ))}
                </ul>
              ) : <div className="text-gray-500">No certificates uploaded</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard; 