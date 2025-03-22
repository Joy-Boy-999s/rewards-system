import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return <Spinner />;
};

export default Loader;

const Spinner = styled.div`
  width: 40px; height: 40px;
  border: 5px solid #f3f3f3; border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;
