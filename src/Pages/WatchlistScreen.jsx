import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
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
    <>
      <div className="page-wide">

        {/* ── Header ── */}
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

        {/* ── Provider filter pills ── */}
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

        {/* ── Grid / empty states ── */}
        {loading ? (
          <div className="empty-state">
            <p className="empty-state-text">Loading your watchlist…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            {/* ICON: clapperboard — empty state */}
            <img src={ICONS.clapperboard} alt="" className="empty-state-icon-img" />
            <p className="empty-state-text">
              {movies.length === 0
                ? "Your watchlist is empty. Import a CSV from your profile."
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
                {/* Hover overlay — title + rating revealed via CSS */}
                <div className="poster-hover-info">
                  <span className="poster-hover-title">{movie.Name}</span>
                  {movie.rating && (
                    <span className="poster-hover-rating">
                      {/* ICON: star — poster hover rating */}
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
      {selectedMovie && (
        <div
          className="movie-modal-overlay"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="movie-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient glow — blurred poster bleeds into modal background */}
            {selectedMovie.posterPath && (
              <div
                className="modal-ambient-glow"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w300${selectedMovie.posterPath})`
                }}
              />
            )}

            {/* Close button */}
            <button
              className="movie-modal-close"
              onClick={() => setSelectedMovie(null)}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            <div className="movie-modal-content">

              {/* Poster */}
              <img
                src={
                  selectedMovie.posterPath
                    ? `https://image.tmdb.org/t/p/w500${selectedMovie.posterPath}`
                    : "https://via.placeholder.com/300x450"
                }
                alt={selectedMovie.Name}
                className="movie-modal-poster"
              />

              {/* Info */}
              <div className="movie-modal-info">

                {/* Eyebrow: year · runtime */}
                <div className="modal-eyebrow">
                  {selectedMovie.Year}
                  {selectedMovie.runtime && (
                    <span> · {selectedMovie.runtime} min</span>
                  )}
                </div>

                {/* Title */}
                <h2 className="modal-title">{selectedMovie.Name}</h2>

                {/* Rating chip */}
                {selectedMovie.rating && (
                  <div className="modal-rating">
                    {/* ICON: star — modal rating chip */}
                    <img src={ICONS.star} alt="" className="icon-sm" />
                    {selectedMovie.rating.toFixed(1)}
                    <span style={{ opacity: 0.5, fontWeight: 400, fontSize: "0.75rem" }}> / 10</span>
                  </div>
                )}

                {/* Genres */}
                {selectedMovie.genres?.length > 0 && (
                  <div className="modal-genre-row">
                    {selectedMovie.genres.map(genre => (
                      <span key={genre} className="badge">{genre}</span>
                    ))}
                  </div>
                )}

                {/* Synopsis */}
                {selectedMovie.overview && (
                  <>
                    <div className="modal-divider" />
                    <div className="modal-section-label">Synopsis</div>
                    <p className="modal-overview">{selectedMovie.overview}</p>
                  </>
                )}

                {/* Where to Watch */}
                {selectedMovie.providers?.length > 0 && (
                  <>
                    <div className="modal-divider" />
                    <div className="modal-section-label">Where to Watch</div>
                    <div className="providers-row">
                      {selectedMovie.providers.map(provider => (
                        <span key={provider} className="badge">{provider}</span>
                      ))}
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WatchlistScreen;