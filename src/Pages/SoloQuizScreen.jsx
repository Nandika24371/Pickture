import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SoloQuizScreen() {

  const navigate = useNavigate();

  const [mood, setMood] = useState("");
  const [length, setLength] = useState("");

  const handleSubmit = () => {

    navigate("/recommendation", {
      state: {
        mood,
        length
      }
    });

  };

  return (

    <div className="min-h-screen p-6">

      <h1 className="text-3xl font-bold mb-6">
        What are you in the mood for?
      </h1>

      <div className="space-y-3">

        <button
          onClick={() => setMood("fun")}
        >
          Fun
        </button>

        <button
          onClick={() => setMood("serious")}
        >
          Serious
        </button>

        <button
          onClick={() => setMood("emotional")}
        >
          Emotional
        </button>

      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">
        How long?
      </h2>

      <div className="space-y-3">

        <button
          onClick={() => setLength("short")}
        >
          Under 90 minutes
        </button>

        <button
          onClick={() => setLength("medium")}
        >
          90 - 120 minutes
        </button>

        <button
          onClick={() => setLength("long")}
        >
          Over 120 minutes
        </button>

      </div>

      <button
        onClick={handleSubmit}
      >
        Continue
      </button>

    </div>

  );
}

export default SoloQuizScreen;