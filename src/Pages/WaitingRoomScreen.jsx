import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

function WaitingRoomScreen() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("uid");

  const [participants, setParticipants] = useState([]);
  const [roomData, setRoomData] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const roomRef = doc(db, "rooms", roomCode);

    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setRoomData(data);
        setParticipants(data.users || []);
      }
    });

    return () => unsubscribe();
  }, [roomCode]);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleStartSession = () => {
    navigate(`/room/${roomCode}/quiz?uid=${userId}`);
  };

  // Host = first user in users array
  const isHost =
    participants.length > 0 &&
    participants[0].userId === userId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex flex-col p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/')}
          className="text-white text-2xl"
        >
          ←
        </button>
        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
          <span className="text-white font-semibold">
            {roomData?.name || 'Room'}
          </span>
        </div>
      </div>

      {/* Room Code Card */}
      <div className="bg-white rounded-3xl p-6 shadow-2xl mb-6">
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-2">Room Code</p>
          <div className="flex items-center justify-center space-x-3">
            <p className="text-4xl font-bold text-purple-600 tracking-widest">
              {roomCode}
            </p>
            <button
              onClick={copyRoomCode}
              className="bg-purple-100 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors"
            >
              {copiedCode ? '✓' : '📋'}
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Share this code with friends
          </p>
        </div>
      </div>

      {/* Participants List */}
      <div className="bg-white rounded-3xl p-6 shadow-2xl mb-6 flex-1">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Participants ({participants.length})
        </h2>
        
        <div className="space-y-3">
          {participants.map((participant, index) => (
            <div
              key={participant.userId}
              className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                {participant.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {participant.name}
                  {index === 0 && (
                    <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                      Host
                    </span>
                  )}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          ))}
        </div>

        {participants.length < 2 && (
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Waiting for others to join...
            </p>
          </div>
        )}
      </div>

      {/* Start Button (only for host) */}
      {isHost && (
        <button
          onClick={handleStartSession}
          disabled={participants.length < 1}
          className="w-full bg-white text-purple-600 font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Start Session
        </button>
      )}

      {!isHost && (
        <div className="bg-white/20 backdrop-blur-sm text-white text-center py-4 px-6 rounded-2xl">
          Waiting for host to start...
        </div>
      )}
    </div>
  );
}

export default WaitingRoomScreen;
