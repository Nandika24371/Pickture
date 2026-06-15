import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function RecommendationScreen() {
  const location = useLocation();

  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    async function generateRecommendation() {
      const userRef = doc(
        db,
        "users",
        auth.currentUser.uid
      );

      const userSnap = await getDoc(userRef);

      const movies =
        userSnap.data().watchlistMovies || [];

      if (movies.length === 0) {
        return;
      }

      const randomMovie =
        movies[
          Math.floor(
            Math.random() * movies.length
          )
        ];

      setRecommendation(randomMovie);
    }

    generateRecommendation();
  }, []);

  return (
    <div className="min-h-screen p-6">

      <h1 className="text-4xl font-bold mb-6">
        Your Recommendation
      </h1>

      <p className="mb-8">
        Mood: {location.state?.mood}
      </p>

      {recommendation && (
        <div className="max-w-md">

          <img
            src={`https://image.tmdb.org/t/p/w300${recommendation.posterPath}`}
            alt={recommendation.Name}
            className="rounded-lg mb-4"
          />

          <h2 className="text-3xl font-bold">
            {recommendation.Name}
          </h2>

          <p className="text-gray-500 mb-2">
            {recommendation.Year}
          </p>

          {recommendation.rating && (
            <p className="mb-4">
              ⭐ {recommendation.rating.toFixed(1)}
            </p>
          )}

          <button
            onClick={() => {
              window.location.reload();
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Suggest Another
          </button>

        </div>
      )}

    </div>
  );
}

export default RecommendationScreen;