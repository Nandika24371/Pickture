import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const questions = [
  {
    id: 1,
    question: "What's the vibe?",
    options: [
      { id: 'chill', label: 'Chill & Relaxed', emoji: '😌' },
      { id: 'intense', label: 'Intense & Thrilling', emoji: '😱' },
      { id: 'funny', label: 'Light & Funny', emoji: '😂' },
      { id: 'emotional', label: 'Deep & Emotional', emoji: '🥺' }
    ]
  },
  {
    id: 2,
    question: "How are you feeling?",
    options: [
      { id: 'escape', label: 'Need an escape', emoji: '🚀' },
      { id: 'laugh', label: 'Want to laugh', emoji: '🤣' },
      { id: 'cry', label: 'Ready to feel', emoji: '😭' },
      { id: 'think', label: 'Want to think', emoji: '🤔' }
    ]
  },
  {
    id: 3,
    question: "Movie length?",
    options: [
      { id: 'short', label: 'Under 90 min', emoji: '⚡' },
      { id: 'medium', label: '90-120 min', emoji: '🎬' },
      { id: 'long', label: '2+ hours', emoji: '🍿' },
      { id: 'any', label: 'Don\'t care', emoji: '🤷' }
    ]
  },
  {
    id: 4,
    question: "Seen it before?",
    options: [
      { id: 'new', label: 'Only new movies', emoji: '✨' },
      { id: 'rewatch', label: 'Open to rewatches', emoji: '🔄' },
      { id: 'classic', label: 'Prefer classics', emoji: '🎞️' },
      { id: 'any', label: 'Surprise me', emoji: '🎲' }
    ]
  }
];

function QuizScreen() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (optionId) => {
    const newAnswers = {
      ...answers,
      [questions[currentQuestion].id]: optionId
    };
    setAnswers(newAnswers);

    // Move to next question or finish
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      // Quiz complete
      handleSubmitQuiz(newAnswers);
    }
  };

  const handleSubmitQuiz = (finalAnswers) => {
    setIsSubmitting(true);
    
    // Store answers (in real app, send to backend)
    localStorage.setItem('quizAnswers', JSON.stringify(finalAnswers));
    
    setTimeout(() => {
      navigate(`/room/${roomCode}/swipe`);
    }, 1000);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex flex-col p-6">
      {/* Header with Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-2xl"
          >
            ←
          </button>
          <span className="text-white font-semibold">
            {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      {!isSubmitting ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              {question.question}
            </h2>

            <div className="space-y-4">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-4"
                >
                  <span className="text-4xl">{option.emoji}</span>
                  <span className="text-lg font-semibold text-gray-800 flex-1 text-left">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl font-semibold">
              Preparing your matches...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizScreen;