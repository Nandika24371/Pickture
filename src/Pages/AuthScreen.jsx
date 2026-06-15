import { useState } from "react";
import { auth, db } from "../firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

import {
  doc,
  setDoc
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        navigate("/profile");
      } else {
        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

        const uid = userCredential.user.uid;

        await setDoc(doc(db, "users", uid), {
        name,
        email,
        createdAt: Date.now(),

        watchedCount: 0,
        watchlistCount: 0,

        watchedMovies: [],
        watchlistMovies: []
        });

        navigate("/profile");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">

      <h1 className="text-4xl font-bold mb-8">
        {isLogin ? "Log In" : "Create Account"}
      </h1>

      {!isLogin && (
        <input
          className="border p-3 mb-3 w-80"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <input
        className="border p-3 mb-3 w-80"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="border p-3 mb-3 w-80"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-purple-600 text-white px-6 py-3 rounded"
      >
        {isLogin ? "Log In" : "Create Account"}
      </button>

      <button
        className="mt-4 text-purple-600"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Need an account?"
          : "Already have an account?"}
      </button>
    </div>
  );
}

export default AuthScreen;