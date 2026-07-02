import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthScreen from './Pages/AuthScreen';
import WelcomeScreen from './Pages/WelcomeScreen';
import ProfileScreen from './Pages/ProfileScreen';
import WatchlistScreen from './Pages/WatchlistScreen';
import SoloQuizScreen from "./Pages/SoloQuizScreen";
import RecommendationScreen from "./Pages/RecommendationScreen";
import Navbar from "./components/Navbar";
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/auth" element={<AuthScreen />} />
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/watchlist" element={<WatchlistScreen />}/>
          <Route path="/solo-quiz" element={<SoloQuizScreen />}/>
          <Route path="/recommendation" element={<RecommendationScreen />}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;