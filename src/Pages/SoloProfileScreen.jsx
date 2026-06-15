import { useState } from "react";
import Papa from "papaparse";

function SoloProfileScreen() {
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);

  const handleWatchlistUpload = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setWatchlistMovies(results.data);
      }
    });
  };

  const handleWatchedUpload = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setWatchedMovies(results.data);
      }
    });
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-6">
        My Profile
      </h1>

      <div className="mb-6">
        <p>Movies Watched: {watchedMovies.length}</p>
        <p>Watchlist: {watchlistMovies.length}</p>
      </div>

      <div className="mb-6">
        <h2 className="font-bold">Import Watched CSV</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleWatchedUpload}
        />
      </div>

      <div className="mb-6">
        <h2 className="font-bold">Import Watchlist CSV</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleWatchlistUpload}
        />
      </div>

      <h2 className="text-2xl font-bold mt-8">
        Watchlist
      </h2>

      {watchlistMovies.map((movie, index) => (
        <div key={index}>
          {movie.Name} ({movie.Year})
        </div>
      ))}
    </div>
  );
}

export default SoloProfileScreen;