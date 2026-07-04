import { useNavigate } from "react-router-dom";

function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="welcome-screen">
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 420 }}>

        <div className="eyebrow" style={{ marginBottom: "1.5rem" }}>Your watchlist companion</div>

        <h1 className="display-title" style={{ marginBottom: "1rem", fontSize: "3.8rem" }}>
          Pick<span style={{ color: "var(--sage)" }}>ture</span>
        </h1>

        <p style={{ color: "var(--cream-dim)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "3rem" }}>
          Discover what to watch from your own list,<br />based on <i>your </i>mood
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button
            onClick={() => navigate("/auth", { state: { mode: "signup" } })}
            className="btn btn-primary btn-large btn-full"
          >
            Create Account
          </button>

          <button
            onClick={() => navigate("/auth", { state: { mode: "login" } })}
            className="btn btn-ghost btn-large btn-full"
          >
            Log In
          </button>
        </div>

        <p style={{ marginTop: "3rem", fontSize: "0.72rem", color: "var(--cream-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Your watchlist. Your picks.
        </p>
      </div>
    </div>
  );
}

export default WelcomeScreen;
