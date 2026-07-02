import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const moods = [
  { value: "fun", label: "Something fun", emoji: "(˶ᵔ ᵕ ᵔ˶)" },
  { value: "serious", label: "Serious & thoughtful", emoji: "(ㆆ_ㆆ)" },
  { value: "emotional", label: "Emotional & moving", emoji: "(╥‸╥)" },
  { value: "any", label: "Surprise me", emoji: "🎲" },
];

const lengths = [
  { value: "short", label: "Under 90 min", sub: "Quick watch" },
  { value: "medium", label: "90 – 120 min", sub: "Just right" },
  { value: "long", label: "Over 120 min", sub: "Epic evening" },
  { value: "any", label: "Any length", sub: "Doesn't matter" },
];

const regions = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "eastAsian", label: "East Asian" },
  { value: "international", label: "International" },
  { value: "any", label: "Doesn't matter" },
];

function SoloQuizScreen() {
  const navigate = useNavigate();
  const [mood, setMood] = useState("");
  const [length, setLength] = useState("");
  const [region, setRegion] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const canContinue = mood && length && region;

  useEffect(() => {

    async function loadPlatforms() {

      if (!auth.currentUser) {
        return;
      }

      const userRef = doc(
        db,
        "users",
        auth.currentUser.uid
      );

      const userSnap =
        await getDoc(userRef);

      const movies =
        userSnap.data()
          ?.watchlistMovies || [];

      const uniquePlatforms =
        [...new Set(
          movies.flatMap(
            movie =>
              movie.providers || []
          )
        )];

      setPlatforms(uniquePlatforms);
    }

    loadPlatforms();

  }, []);

  function togglePlatform(platform) {

    if (
      selectedPlatforms.includes(
        platform
      )
    ) {

      setSelectedPlatforms(
        selectedPlatforms.filter(
          p => p !== platform
        )
      );

    } else {

      setSelectedPlatforms([
        ...selectedPlatforms,
        platform
      ]);

    }

  }

  return (
    <div className="page" style={{ maxWidth: 600 }}>

      <button className="back-btn" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M10 13L5 8l5-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </button>

      <div className="eyebrow">Pick for Me</div>
      <h1 className="display-title" style={{ marginBottom: "0.5rem" }}>What's the mood?</h1>
      <p style={{ color: "var(--cream-dim)", fontSize: "0.9rem", marginBottom: "2.5rem" }}>
        Answer a few quick questions and we'll pull something from your watchlist.
      </p>

      {/* Mood */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div className="eyebrow" style={{ marginBottom: "0.75rem" }}>Mood</div>
        <div className="quiz-grid">
          {moods.map(m => (
            <button
              key={m.value}
              className={`quiz-option ${mood === m.value ? "selected" : ""}`}
              onClick={() => setMood(m.value)}
            >
              <span style={{ fontSize: "1.2rem", marginRight: "0.5rem" }}>{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Length */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div className="eyebrow" style={{ marginBottom: "0.75rem" }}>Length</div>
        <div className="quiz-grid">
          {lengths.map(l => (
            <button
              key={l.value}
              className={`quiz-option ${length === l.value ? "selected" : ""}`}
              onClick={() => setLength(l.value)}
            >
              <div style={{ fontWeight: 500, color: length === l.value ? "var(--cream)" : "var(--cream-dim)" }}>
                {l.label}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--cream-muted)", marginTop: "0.2rem" }}>{l.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/*language/region*/}
      <div style={{ marginBottom: "2.5rem" }}>
        <div className="eyebrow" style={{ marginBottom: "0.75rem" }}>
          Language / Region
        </div>

        <div className="quiz-grid">
          {regions.map(r => (
            <button
              key={r.value}
              className={`quiz-option ${region === r.value ? "selected" : ""}`}
              onClick={() => setRegion(r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      
      {/*platform*/}
      <div style={{ marginBottom: "2.5rem" }}>

        <div
          className="eyebrow"
          style={{ marginBottom: "0.75rem" }}
        >
          Streaming Service
        </div>

        <div className="quiz-grid">

          {platforms.map(platform => (

            <button
              key={platform}
              className={`quiz-option ${
                selectedPlatforms.includes(
                  platform
                )
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                togglePlatform(platform)
              }
            >
              {platform}
            </button>

          ))}

        </div>

      </div>

      <button
        className="btn btn-primary btn-large btn-full"
        onClick={() =>
          navigate("/recommendation", {
            state: {
              mood,
              length,
              region,
              selectedPlatforms
            }
          })
        }
        disabled={!canContinue}
        style={{ opacity: canContinue ? 1 : 0.4, cursor: canContinue ? "pointer" : "not-allowed" }}
      >
        Find My Film →
      </button>
    </div>
  );
}

export default SoloQuizScreen;