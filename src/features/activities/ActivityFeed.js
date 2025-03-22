import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchActivities } from "./activitiesSlice";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";

const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => (theme === "dark" ? "#121212" : "#f0f0f0")};
    color: ${({ theme }) => (theme === "dark" ? "#ffffff" : "#333")};
    transition: all 0.3s ease-in-out;
  }
`;

const FeedContainer = styled(motion.div)`
  padding: 20px;
  max-width: 600px;
  width: 90%;
  margin: 80px auto 0;
  background: ${({ theme }) => (theme === "dark" ? "#1e1e1e" : "#ffffff")};
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 50vh;
  text-align: center;
`;

const ActivityItem = styled(motion.div)`
  background: ${({ theme }) => (theme === "dark" ? "#333" : "#fff")};
  padding: 15px;
  margin: 10px 0;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActivityText = styled.span`
  font-size: 1.2rem;
`;

const Points = styled.span`
  font-weight: bold;
  color: #28a745;
`;

const Loading = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: #555;
`;

function ActivityFeed() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.activities);
  const [userNames, setUserNames] = useState({});
  const theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  useEffect(() => {
    dispatch(fetchActivities());
  }, [dispatch]);

  useEffect(() => {
    const fetchUserNames = async () => {
      try {
        const response = await fetch("http://localhost:5000/users");
        const users = await response.json();
        const userMap = users.reduce((acc, user) => {
          acc[user.id] = user.name;
          return acc;
        }, {});
        setUserNames(userMap);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUserNames();
  }, []);

  if (loading) return <Loading>Loading activities...</Loading>;

  return (
    <>
      <GlobalStyle theme={theme} />
      <FeedContainer theme={theme}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Recent Activities</h2>
        {list.map((activity) => (
          <ActivityItem
            key={activity.id}
            theme={theme}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * list.indexOf(activity) }}
          >
            <ActivityText>{userNames[activity.userId] || `User ${activity.userId}`} - {activity.description}</ActivityText>
            <Points>+{activity.points}</Points>
          </ActivityItem>
        ))}
      </FeedContainer>
    </>
  );
}

export default ActivityFeed;