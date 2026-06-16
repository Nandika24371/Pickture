import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function WatchlistScreen() {
  const [movies, setMovies] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState([]);
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

  const filtered = movies.filter(m => {
    if (selectedProviders.length === 0) return true;
    return selectedProviders.some(p => m.providers?.includes(p));
  });

  return (
    <div className="page-wide">

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div className="eyebrow">Collection</div>
          <h1 className="display-title">Watchlist</h1>
        </div>
        <button className="btn btn-primary btn-large" onClick={() => navigate("/solo-quiz")}>
          🎲 Pick for Me
        </button>
      </div>

      {/* Provider filters */}
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
          <div className="empty-state-icon">🎬</div>
          <p className="empty-state-text">
            {movies.length === 0
              ? "Your watchlist is empty. Import a CSV from your profile."
              : "No films match the selected filters."}
          </p>
        </div>
      ) : (
        <div>
          {filtered.map((movie, i) => (
            <div key={i} className="movie-row">
              <img
                src={movie.posterPath
                  ? `https://image.tmdb.org/t/p/w200${movie.posterPath}`
                  : "https://via.placeholder.com/72x108/422838/AEB8A0?text=?"
                }
                alt={movie.Name}
                className="movie-poster"
              />
              <div style={{ flex: 1 }}>
                <div className="movie-title">{movie.Name}</div>
                <div className="movie-year">{movie.Year}</div>
                {movie.rating && (
                  <div className="movie-rating">★ {movie.rating.toFixed(1)}</div>
                )}
                {movie.runtime && (
                  <div style={{ fontSize: "0.75rem", color: "var(--cream-muted)", marginBottom: "0.5rem" }}>
                    {movie.runtime} min
                  </div>
                )}
                {movie.providers?.length > 0 && (
                  <div className="providers-row">
                    {movie.providers.map(p => (
                      <span key={p} className="badge">{p}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WatchlistScreen;