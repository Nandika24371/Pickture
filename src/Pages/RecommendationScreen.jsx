import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { markMovieAsWatched, removeMovieFromWatchlist } from "../utils/watchlist";

const moodLabels = {
  fun: "Something Fun",
  serious: "Serious & Thoughtful",
  emotional: "Emotional & Moving",
  any: "Surprise Pick",
};

const lengthLabels = {
  short: "Under 90 min",
  medium: "90 – 120 min",
  long: "Over 120 min",
  any: "Any length",
};

function RecommendationScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState(null);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const selectedPlatforms = location.state?.selectedPlatforms || [];

  async function loadMovies() {
    const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
    const movies = snap.data()?.watchlistMovies || [];
    setAllMovies(movies);
    return movies;
  }

  function pickRandom(movies) {
    const {
      length,
      region,
      selectedPlatforms = []
    } = location.state || {};

    let pool = [...movies];

    // Length filtering

    if (length === "short") {
      pool = pool.filter(
        m => m.runtime && m.runtime < 90
      );
    }

    if (length === "medium") {
      pool = pool.filter(
        m =>
          m.runtime >= 90 &&
          m.runtime <= 120
      );
    }

    if (length === "long") {
      pool = pool.filter(
        m => m.runtime > 120
      );
    }

    // Region filtering

    if (region === "english") {
      pool = pool.filter(
        m => m.originalLanguage === "en"
      );
    }

    if (region === "hindi") {
      pool = pool.filter(
        m => m.originalLanguage === "hi"
      );
    }

    if (region === "eastAsian") {
      pool = pool.filter(
        m =>
          ["ja", "ko", "zh", "th"]
            .includes(m.originalLanguage)
      );
    }

    if (region === "international") {
      pool = pool.filter(
        m => m.originalLanguage !== "en"
      );
    }

    // Streaming platform filtering

    if (selectedPlatforms.length > 0) {

      pool = pool.filter(movie =>

        selectedPlatforms.some(
          platform =>
            movie.providers?.includes(
              platform
            )
        )

      );

    }

    // Fallback

    if (pool.length === 0) {
      pool = movies;
    }

    if (pool.length === 0) return null;

    return pool[
      Math.floor(
        Math.random() * pool.length
      )
    ];
  }

  useEffect(() => {
    loadMovies().then(movies => {
      if (movies.length > 0) setRecommendation(pickRandom(movies));
      setLoading(false);
    });
  }, []);

  const handleSuggestAnother = () => {
    if (allMovies.length > 0) setRecommendation(pickRandom(allMovies));
  };

  async function handleMarkWatched() {
    if (!recommendation || actionLoading) return;
    setActionLoading(true);
    setActionMessage("");
    try {
      const { watchlistMovies } = await markMovieAsWatched(recommendation);
      setAllMovies(watchlistMovies);
      setRecommendation(watchlistMovies.length > 0 ? pickRandom(watchlistMovies) : null);
      setActionMessage("Marked as watched");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRemove() {
    if (!recommendation || actionLoading) return;
    setActionLoading(true);
    setActionMessage("");
    try {
      const watchlistMovies = await removeMovieFromWatchlist(recommendation);
      setAllMovies(watchlistMovies);
      setRecommendation(watchlistMovies.length > 0 ? pickRandom(watchlistMovies) : null);
      setActionMessage("Removed from watchlist");
    } finally {
      setActionLoading(false);
    }
  }

  const { mood, length } = location.state || {};

  return (
    <div className="page page-wide">

      <button className="back-btn" onClick={() => navigate("/solo-quiz")}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M10 13L5 8l5-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Change Preferences
      </button>

      <div className="eyebrow">Tonight's Pick</div>
      <h1 className="display-title" style={{ marginBottom: "0.5rem" }}>We chose for you</h1>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
        {mood && <span className="badge">{moodLabels[mood] || mood}</span>}
        {length && <span className="badge">{lengthLabels[length] || length}</span>}
      </div>

      {loading ? (
        <div className="empty-state">
          <p className="empty-state-text">Finding your film…</p>
        </div>
      ) : !recommendation ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎬</div>
          <p className="empty-state-text">Your watchlist is empty. Add some films first.</p>
          <button className="btn btn-outline" style={{ marginTop: "1rem" }} onClick={() => navigate("/profile")}>
            Go to Profile
          </button>
        </div>
      ) : (
        <div className="fade-up" style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
          <img
            src={recommendation.posterPath
              ? `https://image.tmdb.org/t/p/w300${recommendation.posterPath}`
              : "https://via.placeholder.com/200x300/422838/AEB8A0?text=?"
            }
            alt={recommendation.Name}
            className="rec-poster"
          />

          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1.2, marginBottom: "0.35rem" }}>
              {recommendation.Name}
            </h2>
            <p style={{ color: "var(--cream-muted)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>{recommendation.Year}</p>

            {recommendation.rating && (
              <p style={{ color: "var(--sage)", fontWeight: 600, marginBottom: "0.5rem" }}>
                ★ {recommendation.rating.toFixed(1)}
              </p>
            )}

            {recommendation.runtime && (
              <p style={{ fontSize: "0.8rem", color: "var(--cream-muted)", marginBottom: "1rem" }}>
                {recommendation.runtime} min
              </p>
            )}

            {recommendation.overview && (
  <div style={{ marginBottom: "1.5rem" }}>
    <div
      style={{
        fontSize: "0.72rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--cream-muted)",
        marginBottom: "0.5rem"
      }}
    >
      Summary
    </div>

    <p
      style={{
        color: "var(--cream-dim)",
        lineHeight: 1.7,
        fontSize: "0.9rem"
      }}
    >
      {recommendation.overview}
    </p>
  </div>
)}

            {recommendation.providers?.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--cream-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Available on</div>
                <div className="providers-row">
                  {recommendation.providers.map(p => (
                    <span key={p} className="badge">{p}</span>
                  ))}
                </div>
              </div>
            )}



            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button className="btn btn-outline" onClick={handleSuggestAnother} disabled={actionLoading}>
                Try Another
              </button>
              <button className="btn btn-ghost" onClick={() => navigate("/watchlist")}>
                View Watchlist
              </button>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
              <button className="btn btn-primary" onClick={handleMarkWatched} disabled={actionLoading}>
                {actionLoading ? "…" : "Mark as Watched"}
              </button>
              <button className="btn btn-danger" onClick={handleRemove} disabled={actionLoading}>
                {actionLoading ? "…" : "Remove from Watchlist"}
              </button>
            </div>

            {actionMessage && (
              <p style={{ fontSize: "0.78rem", color: "var(--sage)", marginTop: "0.75rem" }}>
                {actionMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecommendationScreen;