import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { searchMovie, getWatchProviders, getMovieDetails } from "../api/tmdb";
import MovieModal from "../components/MovieModal";
import {
  markMovieAsWatched,
  removeMovieFromWatchlist,
  dedupeAgainstWatchlist,
} from "../utils/watchlist";

const ICONS = {
  star: "/src/assets/star.png",
};

const PREVIEW_COUNT = 4;

function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();

  const handleWatchlistUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const currentUser = auth.currentUser;
        const userRef = doc(db, "users", currentUser.uid);

        // Re-fetch the latest watchlist so we're deduping against current data,
        // not whatever was loaded when the page first rendered.
        const snap = await getDoc(userRef);
        const existingMovies = snap.exists()
          ? snap.data().watchlistMovies || []
          : [];

        const parsedMovies = results.data.filter((m) => m.Name);
        const newMovies = dedupeAgainstWatchlist(parsedMovies, existingMovies);

        for (const movie of newMovies) {
          const tmdbData = await searchMovie(movie.Name, movie.Year);
          if (tmdbData) {
            movie.tmdbId = tmdbData.tmdbId;
            movie.posterPath = tmdbData.posterPath;
            movie.rating = tmdbData.rating;
            movie.providers = await getWatchProviders(tmdbData.tmdbId);
            const details =
              await getMovieDetails(
                tmdbData.tmdbId
              );

            movie.runtime =
              details.runtime;

            movie.genreIds =
              details.genreIds;

            movie.genres =
              details.genres;

            movie.overview =
              details.overview;

            movie.originalLanguage =
              details.originalLanguage;
          }
        }

        const mergedMovies = [...newMovies, ...existingMovies];

        await updateDoc(userRef, {
          watchlistMovies: mergedMovies,
          watchlistCount: mergedMovies.length,
        });
        setUploading(false);
        window.location.reload();
      },
    });
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return;
      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) setUserData(snap.data());
    });
    return () => unsub();
  }, []);

  async function handleMarkWatched(movie) {
    const { watchlistMovies, watchedMovies } = await markMovieAsWatched(movie);
    setUserData((prev) => ({
      ...prev,
      watchlistMovies,
      watchlistCount: watchlistMovies.length,
      watchedMovies,
      watchedCount: watchedMovies.length,
    }));
    setSelectedMovie(null);
  }

  async function handleRemove(movie) {
    const watchlistMovies = await removeMovieFromWatchlist(movie);
    setUserData((prev) => ({
      ...prev,
      watchlistMovies,
      watchlistCount: watchlistMovies.length,
    }));
    setSelectedMovie(null);
  }

  if (!userData) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--cream-muted)", fontSize: "0.85rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Loading…
        </p>
      </div>
    );
  }

  const previewMovies = userData.watchlistMovies?.slice(0, PREVIEW_COUNT) || [];

  return (
    <div className="page">

      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div className="eyebrow">Profile</div>
        <h1 className="display-title">{userData.name}</h1>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat">
          <div className="stat-number">{userData.watchedCount ?? 0}</div>
          <div className="stat-label">Films Watched</div>
        </div>
        <div style={{ width: "1px", background: "var(--sage-border)", alignSelf: "stretch" }} />
        <div className="stat">
          <div className="stat-number">{userData.watchlistCount ?? 0}</div>
          <div className="stat-label">On Watchlist</div>
        </div>
      </div>

      <hr className="divider" />

      {/* Import */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div className="section-title">Import Watchlist</div>
        <p style={{ color: "var(--cream-dim)", fontSize: "0.85rem", marginBottom: "1rem" }}>
          Upload a CSV from Letterboxd or a compatible export to add films to your watchlist — films already on your list are skipped automatically. You can also use the search bar above to add films one at a time.
        </p>

        <label className="upload-row" style={{ cursor: "pointer" }}>
          <div>
            <div style={{ fontSize: "0.85rem", color: "var(--cream)", fontWeight: 500 }}>
              {uploading ? "Importing your films…" : "Choose a CSV file"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--cream-muted)", marginTop: "0.2rem" }}>
              {uploading ? "This may take a moment" : "Letterboxd watchlist export supported"}
            </div>
          </div>
          <span className="btn btn-outline" style={{ pointerEvents: "none" }}>
            {uploading ? "…" : "Browse"}
          </span>
          <input type="file" accept=".csv" onChange={handleWatchlistUpload} style={{ display: "none" }} />
        </label>
      </div>

      <hr className="divider" />

      {/* Watchlist preview */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div className="section-title" style={{ marginBottom: 0 }}>Watchlist Preview</div>
          <button className="btn btn-ghost" onClick={() => navigate("/watchlist")}>
            See all →
          </button>
        </div>

        {previewMovies.length > 0 ? (
          <div className="poster-grid">
            {previewMovies.map((movie, i) => (
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
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🎬</div>
            <p className="empty-state-text">Your watchlist is empty. Import a CSV or search for a film above to get started.</p>
          </div>
        )}
      </div>

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onMarkWatched={handleMarkWatched}
        onRemove={handleRemove}
      />
    </div>
  );
}

export default ProfileScreen;