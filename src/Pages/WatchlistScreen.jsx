import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function WatchlistScreen() {
  const [movies, setMovies] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const navigate = useNavigate();
  const providers = [
    "All",
    ...new Set(movies.flatMap((movie) => movie.providers || [])),
  ];

  function toggleProvider(provider) {
    if (provider === "All") {
      setSelectedProviders([]);
      return;
    }

    if (selectedProviders.includes(provider)) {
      setSelectedProviders(selectedProviders.filter((p) => p !== provider));
    } else {
      setSelectedProviders([...selectedProviders, provider]);
    }
  }

  useEffect(() => {
    async function loadMovies() {
      const userRef = doc(db, "users", auth.currentUser.uid);

      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setMovies(userSnap.data().watchlistMovies || []);
      }
    }

    loadMovies();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-6">Watchlist</h1>

      <button
        onClick={() => navigate("/solo-quiz")}
        className="mb-6 bg-purple-600 text-white px-4 py-2 rounded"
      >
        What Should I Watch?
      </button>

      <div className="flex gap-2 mb-6 flex-wrap">
        {providers.map((provider) => (
          <button
            key={provider}
            onClick={() => toggleProvider(provider)}
            className={`
        px-3 py-1 rounded
        ${
          (
            provider === "All"
              ? selectedProviders.length === 0
              : selectedProviders.includes(provider)
          )
            ? "bg-purple-600 text-white"
            : "bg-gray-200"
        }
        `}
          >
            {provider}(
            {provider === "All"
              ? movies.length
              : movies.filter((movie) => movie.providers?.includes(provider))
                  .length}
            )
          </button>
        ))}
      </div>

      {movies
        .filter((movie) => {
          if (selectedProviders.length === 0) {
            return true;
          }

          return selectedProviders.some((provider) =>
            movie.providers?.includes(provider)
          );
        })
        .map((movie, index) => (
          <div key={index} className="flex gap-4 border-b py-4">
            <img
              src={
                movie.posterPath
                  ? `https://image.tmdb.org/t/p/w200${movie.posterPath}`
                  : "https://via.placeholder.com/100x150"
              }
              alt={movie.Name}
              className="w-20 rounded-lg"
            />

            <div>
              <h3 className="font-bold text-lg">{movie.Name}</h3>

              <p className="text-gray-500">{movie.Year}</p>

              {movie.rating && <p>⭐ {movie.rating.toFixed(1)}</p>}

              <div className="flex flex-wrap gap-2 mt-2">
                {movie.providers?.map((provider) => (
                  <span
                    key={provider}
                    className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm"
                  >
                    {provider}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default WatchlistScreen;