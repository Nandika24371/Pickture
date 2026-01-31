import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ResultsScreen() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate waiting for all participants to finish
    setTimeout(() => {
      // Get liked movies from storage
      const likedMovies = JSON.parse(localStorage.getItem('likedMovies') || '[]');
      
      // In a real app, this would compare with other participants' choices
      // For now, simulate some matches
      const matchedMovies = likedMovies.slice(0, Math.min(3, likedMovies.length));
      setMatches(matchedMovies);
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleStartOver = () => {
    localStorage.removeItem('currentRoom');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('quizAnswers');
    localStorage.removeItem('likedMovies');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Finding your matches...
          </h2>
          <p className="text-white/80">
            Waiting for everyone to finish swiping
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex flex-col p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          🎉 It's a Match!
        </h1>
        <p className="text-white/90">
          {matches.length > 0 
            ? `Everyone loved ${matches.length === 1 ? 'this movie' : 'these movies'}`
            : 'No perfect matches, but here are some options'}
        </p>
      </div>

      {/* Matches List */}
      {matches.length > 0 ? (
        <div className="flex-1 space-y-4 mb-6">
          {matches.map((movie, index) => (
            <div
              key={movie.id}
              className="bg-white rounded-3xl overflow-hidden shadow-xl"
            >
              <div className="flex">
                {/* Movie Poster */}
                <div className="w-32 h-48 bg-gray-200 flex-shrink-0">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x300?text=Poster';
                    }}
                  />
                </div>

                {/* Movie Info */}
                <div className="flex-1 p-4">
                  {index === 0 && (
                    <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                      TOP PICK
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {movie.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-gray-600 text-sm mb-2">
                    <span>{movie.year}</span>
                    <span>•</span>
                    <span>⭐ {movie.rating}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre}
                        className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center mb-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 text-center">
            <p className="text-white text-lg mb-2">
              No unanimous matches this time
            </p>
            <p className="text-white/80 text-sm">
              Try swiping on more movies or adjusting preferences
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {matches.length > 0 && (
          <button
            onClick={() => alert('Opening streaming services... (feature coming soon)')}
            className="w-full bg-white text-purple-600 font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Where to Watch
          </button>
        )}
        
        <button
          onClick={() => navigate(`/room/${roomCode}/swipe`)}
          className="w-full bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all duration-200"
        >
          See More Options
        </button>
        
        <button
          onClick={handleStartOver}
          className="w-full bg-transparent text-white font-semibold py-4 px-6 rounded-2xl hover:bg-white/10 transition-all duration-200"
        >
          Start New Session
        </button>
      </div>

      {/* Share Results */}
      <div className="mt-6 text-center">
        <button
          onClick={() => alert('Sharing feature coming soon!')}
          className="text-white/80 text-sm underline hover:text-white transition-colors"
        >
          Share Results with Friends
        </button>
      </div>
    </div>
  );
}

export default ResultsScreen;