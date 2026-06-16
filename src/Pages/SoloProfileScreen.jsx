import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";

function SoloProfileScreen() {
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const navigate = useNavigate();

  const handleWatchlistUpload = (e) => {
    Papa.parse(e.target.files[0], {
      header: true,
      complete: (r) => setWatchlistMovies(r.data.filter(m => m.Name)),
    });
  };

  const handleWatchedUpload = (e) => {
    Papa.parse(e.target.files[0], {
      header: true,
      complete: (r) => setWatchedMovies(r.data.filter(m => m.Name)),
    });
  };

  return (
    <div className="page" style={{ maxWidth: 640 }}>

      <div style={{ marginBottom: "2.5rem" }}>
        <div className="eyebrow">Solo Mode</div>
        <h1 className="display-title">My Profile</h1>
      </div>

      <div className="stats-row" style={{ marginBottom: "2.5rem" }}>
        <div className="stat">
          <div className="stat-number">{watchedMovies.length}</div>
          <div className="stat-label">Films Watched</div>
        </div>
        <div style={{ width: "1px", background: "var(--sage-border)" }} />
        <div className="stat">
          <div className="stat-number">{watchlistMovies.length}</div>
          <div className="stat-label">On Watchlist</div>
        </div>
      </div>

      <hr className="divider" />

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
        <div className="section-title">Import Your Lists</div>

        <label className="upload-row" style={{ cursor: "pointer" }}>
          <div>
            <div style={{ fontSize: "0.85rem", color: "var(--cream)", fontWeight: 500 }}>Watched Films</div>
            <div style={{ fontSize: "0.75rem", color: "var(--cream-muted)", marginTop: "0.2rem" }}>
              {watchedMovies.length > 0 ? `${watchedMovies.length} films loaded` : "CSV export from Letterboxd"}
            </div>
          </div>
          <span className="btn btn-outline" style={{ pointerEvents: "none" }}>Browse</span>
          <input type="file" accept=".csv" onChange={handleWatchedUpload} style={{ display: "none" }} />
        </label>

        <label className="upload-row" style={{ cursor: "pointer" }}>
          <div>
            <div style={{ fontSize: "0.85rem", color: "var(--cream)", fontWeight: 500 }}>Watchlist</div>
            <div style={{ fontSize: "0.75rem", color: "var(--cream-muted)", marginTop: "0.2rem" }}>
              {watchlistMovies.length > 0 ? `${watchlistMovies.length} films loaded` : "CSV export from Letterboxd"}
            </div>
          </div>
          <span className="btn btn-outline" style={{ pointerEvents: "none" }}>Browse</span>
          <input type="file" accept=".csv" onChange={handleWatchlistUpload} style={{ display: "none" }} />
        </label>
      </div>

      {watchlistMovies.length > 0 && (
        <>
          <hr className="divider" />
          <div className="section-title">Watchlist</div>
          {watchlistMovies.slice(0, 10).map((m, i) => (
            <div key={i} className="watchlist-preview-item">
              <span style={{ color: "var(--cream)" }}>{m.Name}</span>
              {m.Year && <span style={{ color: "var(--cream-muted)", marginLeft: "0.5rem" }}>({m.Year})</span>}
            </div>
          ))}
          {watchlistMovies.length > 10 && (
            <p style={{ fontSize: "0.78rem", color: "var(--cream-muted)", marginTop: "0.5rem" }}>
              +{watchlistMovies.length - 10} more
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default SoloProfileScreen;