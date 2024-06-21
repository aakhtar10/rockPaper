import { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../socketContext/socketContext';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState({});
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on('updateLeaderboard', (updatedLeaderboard) => {
      setLeaderboard(updatedLeaderboard);
    });

    return () => {
      socket.off('updateLeaderboard');
    };
  }, [socket]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Leaderboard</h2>
      <ul style={styles.list}>
        {Object.entries(leaderboard).map(([username, score]) => (
          <li key={username} style={styles.listItem}>
            {username}: {score}
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
    boxSizing: 'border-box'
  },
  heading: {
    fontSize: '2em',
    marginBottom: '20px',
    color: '#333'
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    width: '100%',
    maxWidth: '400px',
  },
  listItem: {
    backgroundColor: '#fff',
    padding: '10px',
    margin: '5px 0',
    borderRadius: '5px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.2em',
    
  }
};

export default Leaderboard;
