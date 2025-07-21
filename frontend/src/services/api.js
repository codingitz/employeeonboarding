export const registerAgent = async (formData) => {
  const response = await fetch('/api/agent/register', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }
  return response.json();
};

export const login = async (username, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  return response.json();
};

export const fetchAllAgents = async () => {
  const response = await fetch('/api/admin/agents', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch agents');
  }
  return response.json();
};

export const fetchAgentById = async (agentId) => {
  const response = await fetch(`/api/admin/agents/${agentId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch agent');
  }
  return response.json();
};

export const approveAgent = async (agentId) => {
  const response = await fetch(`/api/admin/agents/${agentId}/approve`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to approve agent');
  }
  return response.json();
};

export const rejectAgent = async (agentId, reason) => {
  const response = await fetch(`/api/admin/agents/${agentId}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ reason }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to reject agent');
  }
  return response.json();
}; 