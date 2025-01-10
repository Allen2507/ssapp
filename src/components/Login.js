import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './css/login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // For toggling between login and register
  const navigate = useNavigate();
  
  // Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? 'https://sunday-school-db.onrender.com/register' : 'https://sunday-school-db.onrender.com/login';
      const response = await axios.post(endpoint, { username, password });
      if (!isRegistering) {
        localStorage.setItem('token', response.data.token);
        navigate('/landing');
      } else {
        alert('User registered successfully. Please log in.');
        setIsRegistering(false);
      }
    } catch (err) {
      setError('Invalid credentials or registration failed. Please try again.');
    }
  };

  // Login/Registration Form
  return (
    <div className={styles.container}>
      <h2>{isRegistering ? 'Register' : 'Admin Login'}</h2>
      {error && <p className='error'>{error}</p>}
        <form className={styles.form_container}  onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input className={styles.input_box} type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password: </label>
          <input className={styles.input_box} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className={styles.button} type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>
      <button className={styles.register_button} onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Go to Login' : 'Create New User'}
      </button>
    </div>
  );
};

export default Login;
