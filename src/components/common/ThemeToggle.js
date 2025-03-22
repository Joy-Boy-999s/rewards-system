import React, { useState } from 'react';
import styled from 'styled-components';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.style.background = darkMode ? '#fff' : '#2c3e50';
  };

  return <Button onClick={toggleTheme}>{darkMode ? 'Light Mode' : 'Dark Mode'}</Button>;
};

export default ThemeToggle;

const Button = styled.button`
  padding: 10px 20px; background: #f1c40f; border: none;
  cursor: pointer; transition: 0.3s;
  &:hover { background: #d4ac0d; }
`;
