import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await login(email, password);
      localStorage.setItem('token', res.token);
      localStorage.setItem('role', res.role);
      if (res.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/agent');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6 w-full" onSubmit={handleSubmit} autoComplete="off">
      <div>
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-700 placeholder-gray-400 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-700 placeholder-gray-400 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <button type="button" className="text-xs text-gray-500 hover:underline" tabIndex={-1}>
          Forgot Password?
        </button>
      </div>
      {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 border border-red-200 rounded p-2">{error}</div>}
      <button
        type="submit"
        className="w-full py-2 mt-2 rounded-full border border-gray-400 bg-gradient-to-r from-blue-400 to-pink-400 text-white font-semibold text-lg shadow-sm hover:bg-gray-100 transition disabled:opacity-50 flex items-center justify-center"
        disabled={loading}
      >
        {loading && <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>}
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <div className="text-center text-sm text-gray-600 mt-2">
        Not a Member?{' '}
        <Link to="/signup" className="text-blue-600 hover:underline font-medium">Signup</Link>
      </div>
    </form>
  );
};

export default LoginForm; 