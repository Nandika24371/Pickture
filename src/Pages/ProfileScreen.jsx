import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { searchMovie, getWatchProviders, getMovieDetails } from "../api/tmdb";

function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleWatchlistUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const movies = results.data.filter((m) => m.Name);
        for (const movie of movies) {
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
        const currentUser = auth.currentUser;
        await updateDoc(doc(db, "users", currentUser.uid), {
          watchlistMovies: movies,
          watchlistCount: movies.length,
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

  if (!userData) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--cream-muted)", fontSize: "0.85rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Loading…
        </p>
      </div>
    );
  }

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
          Upload a CSV from Letterboxd or a compatible export to populate your watchlist.
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

        {userData.watchlistMovies?.length > 0 ? (
          <div>
            {userData.watchlistMovies.slice(0, 8).map((movie, i) => (
              <div key={i} className="watchlist-preview-item">
                <span style={{ color: "var(--cream)" }}>{movie.Name}</span>
                <span style={{ color: "var(--cream-muted)", marginLeft: "0.5rem" }}>({movie.Year})</span>
              </div>
            ))}
            {userData.watchlistMovies.length > 8 && (
              <p style={{ fontSize: "0.78rem", color: "var(--cream-muted)", marginTop: "0.75rem" }}>
                +{userData.watchlistMovies.length - 8} more films
              </p>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🎬</div>
            <p className="empty-state-text">Your watchlist is empty. Import a CSV to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileScreen;