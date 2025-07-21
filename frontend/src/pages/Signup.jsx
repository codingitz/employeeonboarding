import React from 'react';
import SignupForm from '../components/SignupForm';

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="rounded-xl shadow-lg p-8 w-full max-w-md mx-4 flex flex-col items-center border-4" style={{ background: 'linear-gradient(135deg, #f0fff4 60%, #e0f7fa 100%)', borderImage: 'linear-gradient(90deg, #22c55e, #38bdf8) 1' }}>
        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">Signup</h2>
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup; 