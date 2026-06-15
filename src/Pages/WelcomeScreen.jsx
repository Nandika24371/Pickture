import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPopularMovies } from "../api/tmdb"; // <-- import the function

import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex flex-col items-center justify-center p-6">

      <div className="max-w-md w-full text-center">

        <h1 className="text-6xl mb-4">🎬</h1>

        <h2 className="text-5xl font-bold text-white mb-4">
          Pickture
        </h2>

        <p className="text-white/90 text-lg mb-12">
          Find what to watch,
          <br />
          alone or together.
        </p>

        <button
          onClick={() => navigate("/auth")}
          className="w-full bg-white text-purple-600 font-semibold py-4 rounded-2xl shadow-lg"
        >
          Get Started
        </button>

        <button
          onClick={() => navigate("/auth")}
          className="mt-6 text-white underline"
        >
          Already have an account? Log In
        </button>

      </div>

    </div>
  );
}

export default WelcomeScreen;