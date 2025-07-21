import React from 'react';
import LoginForm from '../components/LoginForm';
import logo from '../assets/react.svg';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="rounded-xl shadow-lg p-8 w-full max-w-sm mx-4 flex flex-col items-center border-4" style={{ background: 'linear-gradient(135deg, #f0fff4 60%, #e0f7fa 100%)', borderImage: 'linear-gradient(90deg, #22c55e, #38bdf8) 1' }}>
        <img src={logo} alt="Logo" className="h-16 w-16 mb-4 mx-auto" />
        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">Login</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login; 