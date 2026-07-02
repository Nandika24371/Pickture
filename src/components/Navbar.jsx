import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { searchMovies } from "../api/tmdb";
import { addMovieToWatchlist, getWatchlistTmdbIds } from "../utils/watchlist";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [existingIds, setExistingIds] = useState(new Set());
  const [addedIds, setAddedIds] = useState(new Set());
  const [addingId, setAddingId] = useState(null);

  const searchBoxRef = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  // Refresh the "already on watchlist" set whenever a user signs in.
  useEffect(() => {
    if (!user) {
      setExistingIds(new Set());
      return;
    }
    getWatchlistTmdbIds().then(setExistingIds);
  }, [user]);

  // Debounced TMDB search as the user types.
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const found = await searchMovies(query);
        setResults(found);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [query]);

  // Close the dropdown on outside click.
  useEffect(() => {
    function handleClick(e) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleAdd(movie) {
    if (!user) return;
    setAddingId(movie.tmdbId);
    try {
      await addMovieToWatchlist(movie);
      setAddedIds((prev) => new Set(prev).add(movie.tmdbId));
    } catch (err) {
      console.error("Failed to add movie to watchlist:", err);
    } finally {
      setAddingId(null);
    }
  }

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const hiddenRoutes = ["/", "/auth"];
  if (hiddenRoutes.includes(location.pathname)) return null;

  return (
    <nav className="navbar">
      <a className="navbar-logo" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
        Pick<span>ture</span>
      </a>

      {user && (
        <div className="navbar-search" ref={searchBoxRef}>
          <svg className="navbar-search-icon" width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M11.5 11.5L15 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search movies…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
          />

          {showResults && query.trim() && (
            <div className="navbar-search-dropdown">
              {searching ? (
                <div className="search-dropdown-empty">Searching…</div>
              ) : results.length === 0 ? (
                <div className="search-dropdown-empty">No movies found</div>
              ) : (
                results.map((movie) => {
                  const added = existingIds.has(movie.tmdbId) || addedIds.has(movie.tmdbId);
                  const isAdding = addingId === movie.tmdbId;
                  return (
                    <div key={movie.tmdbId} className="search-result-row">
                      <img
                        src={
                          movie.posterPath
                            ? `https://image.tmdb.org/t/p/w92${movie.posterPath}`
                            : "https://via.placeholder.com/60x90"
                        }
                        alt=""
                        className="search-result-poster"
                      />
                      <div className="search-result-info">
                        <div className="search-result-title">{movie.title}</div>
                        <div className="search-result-year">{movie.year}</div>
                      </div>
                      <button
                        className={`search-result-add ${added ? "added" : ""}`}
                        disabled={added || isAdding}
                        onClick={() => handleAdd(movie)}
                      >
                        {added ? "Added" : isAdding ? "…" : "+ Add"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      <div className="navbar-links">
        <button
          className={`navbar-link ${location.pathname === "/profile" ? "active" : ""}`}
          onClick={() => navigate("/profile")}
        >
          Profile
        </button>
        <button
          className={`navbar-link ${location.pathname === "/watchlist" ? "active" : ""}`}
          onClick={() => navigate("/watchlist")}
        >
          Watchlist
        </button>
        <button
          className={`navbar-link ${location.pathname === "/solo-quiz" ? "active" : ""}`}
          onClick={() => navigate("/solo-quiz")}
        >
          Pick for Me
        </button>
        {user && (
          <button className="navbar-link logout" onClick={handleLogout}>
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;