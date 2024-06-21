// App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SocketProvider } from './socketContext/socketContext';
import Login from "./components/Login";
import GameLobby from './components/GameLobby';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';

const App = () => {
  return (
    <Router>
      <SocketProvider>
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route path="/lobby" element={<GameLobby/>} />
          <Route path="/game/:id" element={<Game/>} />
          <Route path="/leaderboard" element={<Leaderboard/>} />
        </Routes>
      </SocketProvider>
    </Router>
  );
};

export default App;
