import { useState } from "react";

const ICONS = {
  star: "/src/assets/star.png",
};

function MovieModal({ movie, onClose, onRemove, onMarkWatched }) {
  const [busy, setBusy] = useState(false);

  if (!movie) return null;

  async function handleMarkWatched() {
    if (!onMarkWatched || busy) return;
    setBusy(true);
    await onMarkWatched(movie);
    setBusy(false);
  }

  async function handleRemove() {
    if (!onRemove || busy) return;
    setBusy(true);
    await onRemove(movie);
    setBusy(false);
  }

  return (
    <div className="movie-modal-overlay" onClick={onClose}>
      <div className="movie-modal" onClick={(e) => e.stopPropagation()}>
        {/* Ambient glow — blurred poster bleeds into modal background */}
        {movie.posterPath && (
          <div
            className="modal-ambient-glow"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w300${movie.posterPath})`,
            }}
          />
        )}

        <button className="movie-modal-close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="movie-modal-content">
          {/* Poster */}
          <img
            src={
              movie.posterPath
                ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                : "https://via.placeholder.com/300x450"
            }
            alt={movie.Name}
            className="movie-modal-poster"
          />

          {/* Info */}
          <div className="movie-modal-info">
            <div className="modal-eyebrow">
              {movie.Year}
              {movie.runtime && <span> · {movie.runtime} min</span>}
            </div>

            <h2 className="modal-title">{movie.Name}</h2>

            {movie.rating && (
              <div className="modal-rating">
                <img src={ICONS.star} alt="" className="icon-sm" />
                {movie.rating.toFixed(1)}
                <span style={{ opacity: 0.5, fontWeight: 400, fontSize: "0.75rem" }}> / 10</span>
              </div>
            )}

            {movie.genres?.length > 0 && (
              <div className="modal-genre-row">
                {movie.genres.map((genre) => (
                  <span key={genre} className="badge">{genre}</span>
                ))}
              </div>
            )}

            {movie.overview && (
              <>
                <div className="modal-divider" />
                <div className="modal-section-label">Synopsis</div>
                <p className="modal-overview">{movie.overview}</p>
              </>
            )}

            {movie.providers?.length > 0 && (
              <>
                <div className="modal-divider" />
                <div className="modal-section-label">Where to Watch</div>
                <div className="providers-row">
                  {movie.providers.map((provider) => (
                    <span key={provider} className="badge">{provider}</span>
                  ))}
                </div>
              </>
            )}

            {(onMarkWatched || onRemove) && (
              <>
                <div className="modal-divider" />
                <div className="modal-actions">
                  {onMarkWatched && (
                    <button className="btn btn-outline" onClick={handleMarkWatched} disabled={busy}>
                      {busy ? "…" : "Mark as Watched"}
                    </button>
                  )}
                  {onRemove && (
                    <button className="btn btn-danger" onClick={handleRemove} disabled={busy}>
                      {busy ? "…" : "Remove from Watchlist"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;