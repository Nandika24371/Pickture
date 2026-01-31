import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">🎬</h1>
          <h2 className="text-4xl font-bold text-white mb-2">Watch Together</h2>
          <p className="text-white/90 text-lg">Decide what to watch, together</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/create-room')}
            className="w-full bg-white text-purple-600 font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Create a Room
          </button>
          
          <button
            onClick={() => navigate('/join-room')}
            className="w-full bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all duration-200"
          >
            Join a Room
          </button>
        </div>

        {/* Info Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/70 text-sm">
            No endless debates. Just swipe and watch.
          </p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;