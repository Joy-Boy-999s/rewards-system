import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { Home, Users, Gift, Shield, Activity, ClipboardList, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    isMobile: window.innerWidth <= 768,
    isSmall: window.innerWidth <= 480,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        isMobile: window.innerWidth <= 768,
        isSmall: window.innerWidth <= 480,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <>
      <GlobalStyles $darkMode={darkMode} />
      <Nav $darkMode={darkMode} $screenSize={screenSize}>
        <NavLinks $screenSize={screenSize}>
          <StyledLink to="/" $active={location.pathname === "/" ? "true" : "false"} $darkMode={darkMode} $screenSize={screenSize}>
            <Home size={screenSize.isSmall ? 16 : screenSize.isMobile ? 18 : 20} />
          </StyledLink>
          <StyledLink to="/users" $active={location.pathname === "/users" ? "true" : "false"} $darkMode={darkMode} $screenSize={screenSize}>
            <Users size={screenSize.isSmall ? 16 : screenSize.isMobile ? 18 : 20} />
          </StyledLink>
          <StyledLink to="/rewards" $active={location.pathname === "/rewards" ? "true" : "false"} $darkMode={darkMode} $screenSize={screenSize}>
            <Gift size={screenSize.isSmall ? 16 : screenSize.isMobile ? 18 : 20} />
          </StyledLink>
          <StyledLink to="/admin" $active={location.pathname === "/admin" ? "true" : "false"} $darkMode={darkMode} $screenSize={screenSize}>
            <Shield size={screenSize.isSmall ? 16 : screenSize.isMobile ? 18 : 20} />
          </StyledLink>
          <StyledLink to="/activities" $active={location.pathname === "/activities" ? "true" : "false"} $darkMode={darkMode} $screenSize={screenSize}>
            <Activity size={screenSize.isSmall ? 16 : screenSize.isMobile ? 18 : 20} />
          </StyledLink>
          <StyledLink to="/log-activity" $active={location.pathname === "/log-activity" ? "true" : "false"} $darkMode={darkMode} $screenSize={screenSize}>
            <ClipboardList size={screenSize.isSmall ? 16 : screenSize.isMobile ? 18 : 20} />
          </StyledLink>
          <StyledLink $darkMode={darkMode} $screenSize={screenSize} onClick={() => setDarkMode(!darkMode)}>
            <IconWrapper>
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: darkMode ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {darkMode ? <Sun size={screenSize.isSmall ? 16 : screenSize.isMobile ? 18 : 20} /> : <Moon size={screenSize.isSmall ? 16 : screenSize.isMobile ? 18 : 20} />}
              </motion.div>
            </IconWrapper>
          </StyledLink>
        </NavLinks>
      </Nav>
    </>
  );
};

export default Navbar;

const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${({ $darkMode }) => ($darkMode ? "#121212" : "#f8f9fa")};
    color: ${({ $darkMode }) => ($darkMode ? "#ffffff" : "#333")};
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    overflow-x: hidden;
  }
`;

const Nav = styled.nav`
  background: ${({ $darkMode }) => ($darkMode ? "#222" : "#fff")};
  padding: ${({ $screenSize }) => ($screenSize.isSmall ? "6px 8px" : $screenSize.isMobile ? "8px 12px" : "10px 16px")};
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: ${({ $screenSize }) => ($screenSize.isSmall ? "5px" : $screenSize.isMobile ? "8px" : "15px")};
  left: 50%;
  transform: translateX(-50%);
  border-radius: 40px;
  box-shadow: ${({ $darkMode }) => ($darkMode ? "0px 4px 12px rgba(255, 255, 255, 0.15)" : "0px 4px 12px rgba(0, 0, 0, 0.15)")};
  width: ${({ $screenSize }) => ($screenSize.isSmall ? "auto" : "fit-content")};
  max-width: ${({ $screenSize }) => ($screenSize.isSmall ? "90%" : "95%")};
  min-width: ${({ $screenSize }) => ($screenSize.isSmall ? "180px" : "200px")};
  transition: all 0.3s ease-in-out;
  z-index: 1000;

  @media (max-width: 360px) {
    padding: 5px 6px;
    min-width: 160px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${({ $screenSize }) => ($screenSize.isSmall ? "6px" : $screenSize.isMobile ? "8px" : "12px")};
  justify-content: center;
  align-items: center;

  @media (max-width: 360px) {
    gap: 4px;
  }
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ $screenSize }) => ($screenSize.isSmall ? "8px" : $screenSize.isMobile ? "10px" : "12px")};
  border-radius: 50%;
  color: ${({ $active, $darkMode }) => ($active === "true" ? "#ff9f43" : $darkMode ? "#ffcc80" : "#444")};
  background: ${({ $darkMode }) => ($darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)")};
  transition: all 0.2s ease-in-out;
  cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};
  text-decoration: none;
  touch-action: manipulation;

  &:hover {
    color: #ffbe76;
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 480px) {
    padding: ${({ $screenSize }) => ($screenSize.isSmall ? "6px" : "8px")};
  }

  @media (max-width: 360px) {
    padding: 6px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;