import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addActivity } from "./activitiesSlice";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";

const activityOptions = [
  { type: "Task Completion", points: 10 },
  { type: "Daily Login Streak", points: 5 },
  { type: "Content Creation", points: 20 },
  { type: "Community Engagement", points: 15 },
];

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => (theme === "dark" ? "#121212" : "#f0f0f0")};
    color: ${({ theme }) => (theme === "dark" ? "#ffffff" : "#333")};
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  }
`;

const LogContainer = styled(motion.div)`
  padding: 25px;
  max-width: 500px;
  width: 90%;
  margin: 120px auto 0;
  background: ${({ $darkMode }) => ($darkMode ? "#1e1e1e" : "#ffffff")};
  border-radius: 12px;
  box-shadow: ${({ $darkMode }) =>
    $darkMode
      ? "2px 2px 12px rgba(255, 255, 255, 0.1)"
      : "2px 2px 12px rgba(0, 0, 0, 0.1)"};
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 50vh;
  text-align: center;
  transition: all 0.3s ease-in-out;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  transition: all 0.3s;
  font-size: 16px;
  font-weight: 500;

  &:hover {
    border-color: #007bff;
  }
`;

const Button = styled(motion.button)`
  padding: 12px;
  margin-top: 15px;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #0056b3;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ThemeToggle = styled.button`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: ${({ $darkMode }) => ($darkMode ? "#292929" : "#ffffff")};
  color: ${({ $darkMode }) => ($darkMode ? "#ffffff" : "#333")};
  border: none;
  padding: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: ${({ $darkMode }) => ($darkMode ? "#3a3a3a" : "#e0e0e0")};
  }

  svg {
    font-size: 22px;
  }
`;

function ActivityLog() {
  const dispatch = useDispatch();
  const [selectedActivity, setSelectedActivity] = useState(activityOptions[0]);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleLogActivity = () => {
    dispatch(
      addActivity({
        id: Date.now(),
        description: selectedActivity.type,
        points: selectedActivity.points,
      })
    );
  };

  return (
    <>
      <GlobalStyle theme={darkMode ? "dark" : "light"} />
      <LogContainer
        $darkMode={darkMode}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Log New Activity</h2>
        <Select
          onChange={(e) =>
            setSelectedActivity(activityOptions[e.target.selectedIndex])
          }
        >
          {activityOptions.map((activity, index) => (
            <option key={index} value={activity.type}>
              {activity.type} (+{activity.points} Points)
            </option>
          ))}
        </Select>
        <Button
          onClick={handleLogActivity}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
        >
          Submit Activity
        </Button>
      </LogContainer>

      <ThemeToggle onClick={toggleDarkMode} $darkMode={darkMode}>
        {darkMode ? <BsSunFill /> : <BsMoonStarsFill />}
      </ThemeToggle>
    </>
  );
}

export default ActivityLog;