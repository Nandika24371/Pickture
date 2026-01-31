import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomeScreen from './Pages/WelcomeScreen';
import CreateRoomScreen from './Pages/CreateRoomScreen';
import JoinRoomScreen from './Pages/JoinRoomScreen';
import WaitingRoomScreen from './Pages/WaitingRoomScreen';
import QuizScreen from './Pages/QuizScreen';
import SwipeScreen from './Pages/SwipeScreen';
import ResultsScreen from './Pages/ResultsScreen';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/create-room" element={<CreateRoomScreen />} />
          <Route path="/join-room" element={<JoinRoomScreen />} />
          <Route path="/room/:roomCode/waiting" element={<WaitingRoomScreen />} />
          <Route path="/room/:roomCode/quiz" element={<QuizScreen />} />
          <Route path="/room/:roomCode/swipe" element={<SwipeScreen />} />
          <Route path="/room/:roomCode/results" element={<ResultsScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;