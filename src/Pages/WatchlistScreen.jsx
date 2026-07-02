import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import MovieModal from "../components/MovieModal";
import {
  markMovieAsWatched,
  removeMovieFromWatchlist,
  searchWatchlist,
} from "../utils/watchlist";

const ICONS = {
  dice:        "/src/assets/dice.png",        // Used in: "Pick for Me" button
  star:        "/src/assets/star.png",        // Used in: modal rating chip + poster hover rating
  clock:       "/src/assets/clock.png",       // Used in: modal runtime line
  clapperboard:"/src/assets/clapperboard.png",// Used in: empty watchlist state
};

function WatchlistScreen() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const allProviders = [...new Set(movies.flatMap((m) => m.providers || []))];
  const providers = ["All", ...allProviders];

  function toggleProvider(provider) {
    if (provider === "All") { setSelectedProviders([]); return; }
    setSelectedProviders(prev =>
      prev.includes(provider) ? prev.filter(p => p !== provider) : [...prev, provider]
    );
  }

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (snap.exists()) setMovies(snap.data().watchlistMovies || []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleMarkWatched(movie) {
    const { watchlistMovies } = await markMovieAsWatched(movie);
    setMovies(watchlistMovies);
    setSelectedMovie(null);
  }

  async function handleRemove(movie) {
    const watchlistMovies = await removeMovieFromWatchlist(movie);
    setMovies(watchlistMovies);
    setSelectedMovie(null);
  }

  const filtered = searchWatchlist(movies, searchTerm).filter(m => {
    if (selectedProviders.length === 0) return true;
    return selectedProviders.some(p => m.providers?.includes(p));
  });

  return (
    <>
      <div className="page-wide">

        {/*Header*/}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div className="eyebrow">Collection</div>
            <h1 className="display-title">Watchlist</h1>
          </div>
          <button className="btn btn-primary btn-large" onClick={() => navigate("/solo-quiz")}>
            {/* ICON: dice — "Pick for Me" button */}
            <img src={ICONS.dice} alt="" className="icon-sm" />
            Pick for Me
          </button>
        </div>

        {/*search within watchlist*/}
        {movies.length > 0 && (
          <div style={{ maxWidth: 340, marginBottom: "1.5rem" }}>
            <input
              type="text"
              className="input"
              placeholder="Search your watchlist…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/*filtering pills*/}
        {allProviders.length > 0 && (
          <div className="filter-bar">
            {providers.map(provider => {
              const count = provider === "All"
                ? movies.length
                : movies.filter(m => m.providers?.includes(provider)).length;
              return (
                <button
                  key={provider}
                  className={`pill ${(provider === "All" ? selectedProviders.length === 0 : selectedProviders.includes(provider)) ? "active" : ""}`}
                  onClick={() => toggleProvider(provider)}
                >
                  {provider} · {count}
                </button>
              );
            })}
          </div>
        )}

        {loading ? (
          <div className="empty-state">
            <p className="empty-state-text">Loading your watchlist…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <img src={ICONS.clapperboard} alt="" className="empty-state-icon-img" />
            <p className="empty-state-text">
              {movies.length === 0
                ? "Your watchlist is empty. Import a CSV from your profile, or search for a movie above."
                : searchTerm.trim()
                ? `No films match "${searchTerm}".`
                : "No films match the selected filters."}
            </p>
          </div>
        ) : (
          <div className="poster-grid">
            {filtered.map((movie, i) => (
              <button
                key={i}
                className="poster-card"
                onClick={() => setSelectedMovie(movie)}
              >
                <img
                  src={
                    movie.posterPath
                      ? `https://image.tmdb.org/t/p/w300${movie.posterPath}`
                      : "https://via.placeholder.com/200x300"
                  }
                  alt={movie.Name}
                  className="poster-image"
                />
                <div className="poster-hover-info">
                  <span className="poster-hover-title">{movie.Name}</span>
                  {movie.rating && (
                    <span className="poster-hover-rating">
                      <img src={ICONS.star} alt="" className="icon-xs" />
                      {movie.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Movie detail modal ── */}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onMarkWatched={handleMarkWatched}
        onRemove={handleRemove}
      />
    </>
  );
}

export default WatchlistScreen;