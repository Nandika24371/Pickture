import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function JoinRoomScreen() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [userName, setUserName] = useState('');

  const handleJoinRoom = async () => {
    if (!roomCode.trim() || !userName.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const formattedCode = roomCode.trim().toUpperCase();

    try {
      const roomRef = doc(db, "rooms", formattedCode);
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        alert("Room not found!");
        return;
      }

      const userId = crypto.randomUUID();

      const currentUsers = roomSnap.data().users || [];

      await updateDoc(roomRef, {
        users: [...currentUsers, { userId, name: userName }],
        lastActivity: Date.now()
      });

      navigate(`/room/${formattedCode}/waiting?uid=${userId}`);

    } catch (err) {
      console.error("Join error:", err);
      alert("Something went wrong. Check console.");
    }
  };

  const handleCodeChange = (e) => {
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
