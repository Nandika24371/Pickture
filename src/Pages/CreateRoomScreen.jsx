import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateRoomScreen() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [hostName, setHostName] = useState('');

  const handleCreateRoom = () => {
    if (!roomName.trim() || !hostName.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // Generate a random 6-character room code
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Store room data (in a real app, this would go to a backend)
    const roomData = {
      code: roomCode,
      name: roomName,
      host: hostName,
      participants: [hostName]
    };
    
    localStorage.setItem('currentRoom', JSON.stringify(roomData));
    navigate(`/room/${roomCode}/waiting`);
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
        <h1 className="text-2xl font-bold text-white ml-4">Create Room</h1>
      </div>

      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Room Name
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Movie Night"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="Alex"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>

            <button
              onClick={handleCreateRoom}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Create Room
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              You'll get a code to share with friends
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRoomScreen;