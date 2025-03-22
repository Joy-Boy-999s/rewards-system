import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const Button = styled(Link)`
  padding: 12px 24px;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background: #ff7b00;
  border-radius: 8px;
  text-decoration: none;
  transition: 0.3s;
  &:hover {
    background: #ff5200;
    transform: scale(1.05);
  }
`;

function Home() {
  return (
    <HomeContainer>
      <Title>Welcome to the Rewards Dashboard 🎉</Title>
      <Subtitle>Earn, Track, and Redeem Points for Amazing Rewards!</Subtitle>
      <Button to="/rewards">View Rewards</Button>
    </HomeContainer>
  );
}

export default Home;
