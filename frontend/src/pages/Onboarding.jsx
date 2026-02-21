import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Onboarding = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Welcome to Blue Lotus</h1>
        <p className="text-gray-400 mb-8">Get started building amazing apps with AI</p>
        <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
