import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function JoinRoomScreen() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [userName, setUserName] = useState('');

  const handleJoinRoom = () => {
    if (!roomCode.trim() || !userName.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // In a real app, validate room code with backend
    const formattedCode = roomCode.trim().toUpperCase();
    
    // Store user data
    const userData = {
      name: userName,
      roomCode: formattedCode
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    navigate(`/room/${formattedCode}/waiting`);
  };

  const handleCodeChange = (e) => {
    // Auto-capitalize and limit to 6 characters
    const value = e.target.value.toUpperCase().substring(0, 6);
    setRoomCode(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/')}
          className="text-white text-2xl"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-white ml-4">Join Room</h1>
      </div>

      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={handleCodeChange}
                placeholder="ABC123"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-center text-2xl font-bold tracking-widest"
                maxLength={6}
              />
              <p className="text-gray-400 text-sm mt-2 text-center">
                Enter the 6-character code
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Sam"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>

            <button
              onClick={handleJoinRoom}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinRoomScreen;