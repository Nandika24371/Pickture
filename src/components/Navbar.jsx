import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

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