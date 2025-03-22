import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isLoggedIn', true);
      navigate('/admin');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Container>
      <h2>Login</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  padding: 20px; display: flex; flex-direction: column; max-width: 300px;
  margin: auto;
  input { padding: 10px; margin-bottom: 10px; width: 100%; }
  button {
    padding: 10px; background: #3498db; color: white; border: none;
    cursor: pointer; transition: 0.3s;
    &:hover { background: #2980b9; }
  }
`;
