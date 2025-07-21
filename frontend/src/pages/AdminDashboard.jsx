import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllAgents, fetchAgentById, approveAgent, rejectAgent } from '../services/api';

const TABS = ['PENDING', 'APPROVED', 'REJECTED'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [tab, setTab] = useState('PENDING');
  const [search, setSearch] = useState('');
  const [approveId, setApproveId] = useState('');
  const [approvePw, setApprovePw] = useState('');
  const [toast, setToast] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleView = async (agentId) => {
    setError('');
    setActionLoading(true);
    try {
      const data = await fetchAgentById(agentId);
      setSelectedAgent(data.agent);
      setApproveId(data.agent.email || ''); // Pre-fill with current email
      setApprovePw('');
      setModalOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async (agentId) => {
    setActionLoading(true);
    setError('');
    try {
      await approveAgent(agentId, approveId, approvePw);
      setModalOpen(false);
      setToast('Agent approved and credentials sent!');
      setAgents(agents.map(a => a._id === agentId ? { ...a, status: 'APPROVED', agentId: approveId || a.agentId } : a));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (agentId) => {
    setActionLoading(true);
    setError('');
    try {
      await rejectAgent(agentId, rejectionReason);
      setModalOpen(false);
      setToast('Agent rejected.');
      setAgents(agents.map(a => a._id === agentId ? { ...a, status: 'REJECTED' } : a));
      setRejectionReason('');
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResend = async (agentId) => {
    setSendLoading(true);
    setError('');
    try {
      await fetch(`/api/admin/agents/${agentId}/resend`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      setToast('Credentials email resent!');
    } catch (err) {
      setError('Failed to resend credentials.');
    } finally {
      setSendLoading(false);
    }
  };

  useEffect(() => {
    const getAgents = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAllAgents();
        setAgents(data.agents || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getAgents();
  }, []);

  const filteredAgents = agents.filter(a =>
    a.status === tab &&
    (a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      (a.agentId || '').toLowerCase().includes(search.toLowerCase()))
  );

  // Add spinner CSS (if not already present)
  // Place this at the top, after imports, or in your CSS file if preferred
  const spinner = (
    <svg className="animate-spin h-5 w-5 mr-2 inline-block text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-8" style={{ background: 'linear-gradient(135deg, #e0f7fa 0%, #f0fff4 60%, #38bdf8 100%)' }}>
      {/* Add Navbar at the top */}
      <div className="w-full bg-gradient-to-r from-green-400 to-sky-400 py-4 px-8 flex items-center justify-between shadow-md mb-8">
        <div className="text-2xl font-bold text-white tracking-wide">Admin Portal</div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-white text-green-700 rounded-full font-semibold shadow hover:bg-green-50 border border-green-200"
        >
          Logout
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-4xl" style={{ background: 'linear-gradient(135deg, #f0fff4 60%, #e0f7fa 100%)' }}>
        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">Admin Dashboard</h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div className="flex gap-2">
            {TABS.map(t => (
              <button
                key={t}
                className={`px-4 py-2 rounded-full font-semibold transition border-2 ${tab === t ? 'bg-gradient-to-r from-green-400 to-sky-400 text-white border-green-400' : 'bg-white text-green-700 border-green-200 hover:bg-green-50'}`}
                onClick={() => setTab(t)}
              >
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or Agent ID"
            className="px-4 py-2 border border-green-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-300 bg-white text-green-700"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {toast && <div className="text-green-700 text-center mb-4 font-semibold">{toast}</div>}
        {loading ? (
          <div className="text-center text-green-700">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-green-100 to-sky-100">
                  <th className="py-2 px-3 text-green-700">Name</th>
                  <th className="py-2 px-3 text-green-700">Email</th>
                  <th className="py-2 px-3 text-green-700">Phone</th>
                  <th className="py-2 px-3 text-green-700">Agent ID</th>
                  <th className="py-2 px-3 text-green-700">Status</th>
                  <th className="py-2 px-3 text-green-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-700">No agent applications found.</td>
                  </tr>
                ) : (
                  filteredAgents.map(agent => (
                    <tr key={agent._id} className="border-t bg-gradient-to-r from-white to-green-50">
                      <td className="py-2 px-3 text-gray-700">{agent.name}</td>
                      <td className="py-2 px-3 text-gray-700">{agent.email}</td>
                      <td className="py-2 px-3 text-gray-700">{agent.phone}</td>
                      <td className="py-2 px-3 text-gray-700">{agent.agentId || '-'}</td>
                      <td className={`py-2 px-3 font-semibold ${agent.status === 'APPROVED' ? 'text-green-600' : agent.status === 'REJECTED' ? 'text-red-500' : 'text-yellow-600'}`}>{agent.status}</td>
                      <td className="py-2 px-3 text-gray-700">
                        <button
                          className="px-4 py-1 rounded-lg bg-gradient-to-r from-green-400 to-sky-400 text-white font-semibold shadow hover:from-green-500 hover:to-sky-500 transition"
                          onClick={() => handleView(agent._id)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Agent Detail Modal */}
      {modalOpen && selectedAgent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 overflow-auto" style={{ background: 'linear-gradient(135deg, #bbf7d0 60%, #f0fff4 100%)' }}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative" style={{ background: 'linear-gradient(135deg, #f0fff4 60%, #e0f7fa 100%)', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setModalOpen(false)}>&times;</button>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Agent Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-4">
              <div>
                <div className="mb-2"><span className="font-bold text-gray-800">Name:</span> <span className="text-gray-700">{selectedAgent.name}</span></div>
                <div className="mb-2"><span className="font-bold text-gray-800">Email:</span> <span className="text-gray-700">{selectedAgent.email}</span></div>
                <div className="mb-2"><span className="font-bold text-gray-800">Phone:</span> <span className="text-gray-700">{selectedAgent.phone}</span></div>
                <div className="mb-2"><span className="font-bold text-gray-800">City:</span> <span className="text-gray-700">{selectedAgent.city}</span></div>
                <div className="mb-2"><span className="font-bold text-gray-800">State:</span> <span className="text-gray-700">{selectedAgent.state}</span></div>
                <div className="mb-2"><span className="font-bold text-gray-800">Qualification:</span> <span className="text-gray-700">{selectedAgent.qualification}</span></div>
                <div className="mb-2"><span className="font-bold text-gray-800">PAN Number:</span> <span className="text-gray-700">{selectedAgent.panNumber}</span></div>
                <div className="mb-2"><span className="font-bold text-gray-800">Aadhaar Number:</span> <span className="text-gray-700">{selectedAgent.aadhaarNumber}</span></div>
                <div className="mb-2"><span className="font-bold text-gray-800">Status:</span> <span className="text-gray-700">{selectedAgent.status}</span></div>
                <div className="mb-2"><span className="font-bold text-gray-800">Agent ID:</span> <span className="text-gray-700">{selectedAgent.agentId || '-'}</span></div>
                <div className="mb-2"><span className="font-bold text-gray-800">Message:</span> <span className="text-gray-700">{selectedAgent.message || '-'}</span></div>
              </div>
              <div>
                <div className="mb-2"><span className="font-bold text-gray-800">Profile Photo:</span> {selectedAgent.profilePhoto && <a href={`${selectedAgent.profilePhoto}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline ml-2">View</a>}</div>
                <div className="mb-2"><span className="font-bold text-gray-800">PAN Photo:</span> {selectedAgent.panPhoto && <a href={`${selectedAgent.panPhoto}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline ml-2">View</a>}</div>
                <div className="mb-2"><span className="font-bold text-gray-800">Aadhaar Front:</span> {selectedAgent.aadhaarFront && <a href={`${selectedAgent.aadhaarFront}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline ml-2">View</a>}</div>
                <div className="mb-2"><span className="font-bold text-gray-800">Aadhaar Back:</span> {selectedAgent.aadhaarBack && <a href={`${selectedAgent.aadhaarBack}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline ml-2">View</a>}</div>
                <div className="mb-2"><span className="font-bold text-gray-800">Certificates:</span> {selectedAgent.certificates && selectedAgent.certificates.length > 0 ? selectedAgent.certificates.map((c, i) => <a key={i} href={`${c}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline ml-2">View {i+1}</a>) : <span className="text-gray-700">-</span>}</div>
              </div>
            </div>
            
            {/* Action buttons for PENDING agents */}
            {selectedAgent.status === 'PENDING' && (
              <div className="mt-4 border-t pt-4">
                <h4 className="text-xl font-bold text-gray-800 mb-2">Actions</h4>
                <div className="flex flex-col gap-2">
                  <div>
                    <label className="font-semibold text-gray-700">Agent ID (Email)</label>
                    <input
                      className="w-full border rounded p-2"
                      value={approveId}
                      onChange={e => setApproveId(e.target.value)}
                      type="email"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Password</label>
                    <input
                      className="w-full border rounded p-2"
                      placeholder="Enter temporary password"
                      value={approvePw}
                      onChange={e => setApprovePw(e.target.value)}
                      type="text"
                    />
                  </div>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600 disabled:bg-gray-400"
                    onClick={() => handleApprove(selectedAgent._id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Approving...' : 'Approve'}
                  </button>
                  <div className="mt-4">
                    <label className="font-semibold text-gray-700">Rejection Reason</label>
                    <textarea
                      className="w-full border rounded p-2"
                      placeholder="Provide a reason for rejection"
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                    />
                  </div>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600 disabled:bg-gray-400"
                    onClick={() => handleReject(selectedAgent._id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Rejecting...' : 'Reject'}
                  </button>
                </div>
              </div>
            )}

            {/* Credentials section for approved agents */}
            {selectedAgent.status === 'APPROVED' && (
              <div className="mt-4 flex flex-col gap-2 border-t pt-4 bg-green-50 p-4 rounded">
                <div className="font-semibold text-green-700 mb-2">Update Agent Credentials</div>
                <label className="font-semibold text-green-700">Agent ID:</label>
                <input
                  className="w-full border border-green-200 rounded p-2 bg-gray-100 text-green-700 mb-2 cursor-not-allowed"
                  value={selectedAgent.agentId || ''}
                  readOnly
                  disabled
                />
                <label className="font-semibold text-green-700">Email:</label>
                <input
                  className="w-full border border-green-200 rounded p-2 bg-white text-green-700 mb-2"
                  placeholder="Email"
                  value={approveId}
                  onChange={e => setApproveId(e.target.value)}
                  type="email"
                  required
                />
                <label className="font-semibold text-green-700">Password:</label>
                <input
                  className="w-full border border-green-200 rounded p-2 bg-white text-green-700 mb-2"
                  placeholder="Password"
                  value={approvePw}
                  onChange={e => setApprovePw(e.target.value)}
                  type="text"
                />
                <button
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-sky-400 text-white rounded font-semibold hover:from-green-500 hover:to-sky-500"
                  onClick={async () => {
                    setUpdateLoading(true);
                    setError('');
                    try {
                      if (!approveId) throw new Error('Email is required');
                      if (!approvePw) throw new Error('Password is required');
                      const res = await fetch(`/api/admin/agents/${selectedAgent._id}/credentials`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                        body: JSON.stringify({ email: approveId, password: approvePw })
                      });
                      if (!res.ok) throw new Error((await res.json()).message);
                      setToast('Credentials updated successfully!');
                    } catch (err) {
                      setError(err.message);
                    } finally {
                      setUpdateLoading(false);
                    }
                  }}
                  disabled={updateLoading}
                >
                  {updateLoading ? (<>{spinner}Updating...</>) : 'Update Credentials'}
                </button>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-sky-400 text-white rounded font-semibold hover:from-green-500 hover:to-sky-500 mt-2"
                  onClick={() => handleResend(selectedAgent._id)}
                  disabled={sendLoading}
                >
                  {sendLoading ? (<>{spinner}Sending...</>) : 'Send Credentials'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 