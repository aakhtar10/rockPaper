import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketContext } from '../socketContext/socketContext';

const Game = () => {
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [result, setResult] = useState('');
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const socket = useContext(SocketContext);
  const { id } = useParams();
  const navigate = useNavigate(); 

  const handlePlay = (choice) => {
    const opponentChoice = getRandomChoice();
    setOpponentChoice(opponentChoice);

    socket.emit('play', { playerId: socket.id, opponentId: id, choice, opponentChoice });
  };

  useEffect(() => {
    socket.on('result', ({ result, playerScore, opponentScore }) => {
      setResult(result);
      setScore(playerScore);
      setOpponentScore(opponentScore);
      if (playerScore >= 3 || opponentScore >= 3) {
        setGameOver(true);
      }
    });

    return () => {
      socket.off('result');
    };
  }, [socket, id]);

  const getRandomChoice = () => {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Game</h2>
      {!gameOver && (
        <>
          <div style={styles.buttonContainer}>
            <button 
              style={hoveredButton === 'rock' ? {...styles.button, ...styles.buttonHover} : styles.button}
              onMouseEnter={() => setHoveredButton('rock')}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={() => handlePlay('rock')}
            >
              Rock
            </button>
            <button 
              style={hoveredButton === 'paper' ? {...styles.button, ...styles.buttonHover} : styles.button}
              onMouseEnter={() => setHoveredButton('paper')}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={() => handlePlay('paper')}
            >
              Paper
            </button>
            <button 
              style={hoveredButton === 'scissors' ? {...styles.button, ...styles.buttonHover} : styles.button}
              onMouseEnter={() => setHoveredButton('scissors')}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={() => handlePlay('scissors')}
            >
              Scissors
            </button>
          </div>
          {opponentChoice && <p style={styles.text}>Opponent chose: {opponentChoice}</p>}
          {result && <p style={styles.text}>Result: {result}</p>}
          <p style={styles.text}>Your score: {score}</p>
          <p style={styles.text}>Opponent's score: {opponentScore}</p>
        </>
      )}
      {gameOver && (
        <>
          <p style={styles.text}>Game Over</p>
          <button style={styles.button} onClick={() => navigate('/leaderboard')}>View Leaderboard</button>
        </>
      )}
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
    boxSizing: 'border-box'
  },
  heading: {
    fontSize: '2em',
    marginBottom: '20px'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  button: {
    padding: '10px 20px',
    margin: '0 10px',
    fontSize: '1em',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
  text: {
    fontSize: '1.2em',
    margin: '10px 0'
  }
};

export default Game;
