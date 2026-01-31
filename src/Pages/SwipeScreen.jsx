import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Sample movie data (in real app, fetch from API based on quiz answers)
const sampleMovies = [
  {
    id: 1,
    title: 'Inception',
    year: 2010,
    poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    genres: ['Sci-Fi', 'Thriller'],
    rating: 8.8,
    runtime: '148 min'
  },
  {
    id: 2,
    title: 'The Grand Budapest Hotel',
    year: 2014,
    poster: 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg',
    genres: ['Comedy', 'Drama'],
    rating: 8.1,
    runtime: '99 min'
  },
  {
    id: 3,
    title: 'Parasite',
    year: 2019,
    poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    genres: ['Thriller', 'Drama'],
    rating: 8.6,
    runtime: '132 min'
  },
  {
    id: 4,
    title: 'Knives Out',
    year: 2019,
    poster: 'https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg',
    genres: ['Mystery', 'Comedy'],
    rating: 7.9,
    runtime: '131 min'
  },
  {
    id: 5,
    title: 'Everything Everywhere All at Once',
    year: 2022,
    poster: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
    genres: ['Sci-Fi', 'Comedy'],
    rating: 8.0,
    runtime: '139 min'
  }
];

function SwipeScreen() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const [movies, setMovies] = useState(sampleMovies);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [likedMovies, setLikedMovies] = useState([]);
  const cardRef = useRef(null);

  const currentMovie = movies[currentIndex];
  const remainingCount = movies.length - currentIndex;

  const handleSwipe = (direction) => {
    if (!currentMovie) return;

    setSwipeDirection(direction);

    if (direction === 'right') {
      setLikedMovies([...likedMovies, currentMovie]);
    }

    setTimeout(() => {
      if (currentIndex === movies.length - 1) {
        // All movies swiped, go to results
        localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
        navigate(`/room/${roomCode}/results`);
      } else {
        setCurrentIndex(currentIndex + 1);
        setSwipeDirection(null);
      }
    }, 300);
  };

  if (!currentMovie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-white text-2xl"
        >
          ←
        </button>
        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
          <span className="text-white font-semibold">
            {remainingCount} left
          </span>
        </div>
      </div>

      {/* Movie Card */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full relative">
          <div
            ref={cardRef}
            className={`bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
              swipeDirection === 'left' ? 'transform -translate-x-full opacity-0' :
              swipeDirection === 'right' ? 'transform translate-x-full opacity-0' : ''
            }`}
          >
            {/* Movie Poster */}
            <div className="relative h-96 bg-gray-200">
              <img
                src={currentMovie.poster}
                alt={currentMovie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x750?text=Movie+Poster';
                }}
              />
              
              {/* Rating Badge */}
              <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 font-bold px-3 py-1 rounded-full">
                ⭐ {currentMovie.rating}
              </div>
            </div>

            {/* Movie Info */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {currentMovie.title}
              </h2>
              <div className="flex items-center space-x-3 text-gray-600 mb-4">
                <span>{currentMovie.year}</span>
                <span>•</span>
                <span>{currentMovie.runtime}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentMovie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Buttons */}
      <div className="flex items-center justify-center space-x-6 mt-6">
        <button
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 bg-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center"
        >
          <span className="text-3xl">👎</span>
        </button>
        
        <button
          onClick={() => handleSwipe('right')}
          className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center"
        >
          <span className="text-4xl">❤️</span>
        </button>
      </div>

      {/* Swipe Hint */}
      <div className="text-center mt-6">
        <p className="text-white/80 text-sm">
          Swipe right to like • Swipe left to pass
        </p>
      </div>
    </div>
  );
}

export default SwipeScreen;