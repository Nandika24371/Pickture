import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

function AuthScreen() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.mode !== "signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/profile");
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", cred.user.uid), {
          name, email, createdAt: Date.now(),
          watchedCount: 0, watchlistCount: 0,
          watchedMovies: [], watchlistMovies: []
        });
        navigate("/profile");
      }
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/ \(auth\/.*\)/, ""));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box fade-up">

        <button className="back-btn" onClick={() => navigate("/")}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M10 13L5 8l5-5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        <div className="eyebrow">Pickture</div>
        <h1 className="auth-title">{isLogin ? "Welcome back" : "Join Pickture"}</h1>
        <p className="auth-sub">
          {isLogin ? "Log in to your watchlist." : "Create an account to get started."}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {!isLogin && (
            <div className="input-group">
              <label className="input-label">Name</label>
              <input
                className="input"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {error && (
            <p style={{ color: "#d27a7a", fontSize: "0.8rem", marginBottom: "1rem" }}>{error}</p>
          )}

          <button className="btn btn-primary btn-full btn-large" onClick={handleSubmit}>
            {isLogin ? "Log In" : "Create Account"}
          </button>
        </div>

        <div className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => { setIsLogin(!isLogin); setError(""); }}>
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;
