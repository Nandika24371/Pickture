import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc} from "firebase/firestore";
import {
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import {
  searchMovie,
  getWatchProviders
} from "../api/tmdb";

function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const handleWatchlistUpload = (event) => {
  const file = event.target.files[0];

  Papa.parse(file, {
    header: true,

    complete: async (results) => {
      const movies = results.data
        .filter(movie => movie.Name);

        for (const movie of movies) {

        const tmdbData =
            await searchMovie(
            movie.Name,
            movie.Year
            );

        if (tmdbData) {

        movie.tmdbId = tmdbData.tmdbId;

        movie.posterPath =
            tmdbData.posterPath;

        movie.rating =
            tmdbData.rating;

        movie.providers =
            await getWatchProviders(
            tmdbData.tmdbId
            );
        }
        }

      const currentUser = auth.currentUser;

      await updateDoc(
        doc(db, "users", currentUser.uid),
        {
          watchlistMovies: movies,
          watchlistCount: movies.length
        }
      );

      window.location.reload();
    }
  });
};

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
        auth,
        async (currentUser) => {
        if (!currentUser) return;

        const userRef = doc(
            db,
            "users",
            currentUser.uid
        );

        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            setUserData(userSnap.data());
        }
        }
    );

    return () => unsubscribe();
    }, []);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-6">
        Welcome, {userData.name}
      </h1>

      <div className="space-y-2 text-xl">
        <p>
            Movies Watched: {userData.watchedCount}
        </p>

        <p>
            Watchlist: {userData.watchlistCount}
        </p>
        </div>

        <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">
            Import Watchlist
        </h2>

        <input
            type="file"
            accept=".csv"
            onChange={handleWatchlistUpload}
        />
        </div>


        <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
            Watchlist
        </h2>

        <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">
            Watchlist Preview
        </h2>

        {userData.watchlistMovies
            ?.slice(0, 10)
            .map((movie, index) => (
            <div
                key={index}
                className="border-b py-2"
            >
                {movie.Name} ({movie.Year})
            </div>
        ))}
        </div>

        <button
        onClick={() => navigate("/watchlist")}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
        >
        See All
        </button>
        </div>

        <button
        onClick={async () => {
            await signOut(auth);
            window.location.href = "/";
        }}
        className="mt-8 bg-red-500 text-white px-4 py-2 rounded"
        >
        Log Out
        </button>
    </div>
    
  );
  
}


export default ProfileScreen;