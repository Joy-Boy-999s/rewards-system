import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f8f9fa;
  text-align: center;
`;

const ErrorText = styled.h1`
  font-size: 5rem;
  color: #ff4d4d;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1.5rem;
  color: #555;
  margin-bottom: 2rem;
`;

const HomeButton = styled(Link)`
  padding: 12px 24px;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background: #007bff;
  border-radius: 8px;
  text-decoration: none;
  transition: 0.3s;
  &:hover {
    background: #0056b3;
    transform: scale(1.05);
  }
`;

function NotFound() {
  return (
    <NotFoundContainer>
      <ErrorText>404</ErrorText>
      <Message>Oops! The page you're looking for doesn't exist.</Message>
      <HomeButton to="/">Go Home</HomeButton>
    </NotFoundContainer>
  );
}

export default NotFound;
