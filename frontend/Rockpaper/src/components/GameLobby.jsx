import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../socketContext/socketContext';

const GameLobby = () => {
  const [players, setPlayers] = useState([]);
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('updatePlayers', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    return () => {
      socket.off('updatePlayers');
    };
  }, [socket]);

  const handleChallenge = (opponentId) => {
    socket.emit('challenge', socket.id, opponentId);
    console.log(opponentId);

    navigate(`/game/${opponentId}`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Game Lobby</h2>
      <ul style={styles.playerList}>
        {players.map((player) => (
          <li key={player.id} style={styles.playerItem}>
            {player.username}{' '}
            <button style={styles.button} onClick={() => handleChallenge(player.id)}>Play</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    boxSizing: 'border-box',
  },
  heading: {
    fontSize: '2em',
    marginBottom: '20px',
  },
  playerList: {
    listStyleType: 'none',
    padding: 0,
    width: '100%',
    maxWidth: '600px',
  },
  playerItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    margin: '10px 0',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  button: {
    padding: '5px 10px',
    fontSize: '1em',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
};

export default GameLobby;
