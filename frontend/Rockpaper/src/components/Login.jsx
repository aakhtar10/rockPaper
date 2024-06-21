import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../socketContext/socketContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username.trim() !== '') {
      socket.emit('join', username);
      navigate('/lobby');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Login </h2>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleLogin} style={styles.button}>Login</button>
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
  input: {
    padding: '10px',
    marginBottom: '20px',
    fontSize: '1em',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
    maxWidth: '300px',
    boxSizing: 'border-box'
  },
  button: {
    padding: '10px 20px',
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
};

export default Login;
