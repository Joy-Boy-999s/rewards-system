import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, fetchActivities, fetchAdminActions } from "./usersSlice";
import styled from "styled-components";
import { motion } from "framer-motion";

const UserList = () => {
  const dispatch = useDispatch();
  const { users, activities, adminActions, status, error } = useSelector((state) => state.users);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); // Filtering by role

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
      dispatch(fetchActivities());
      dispatch(fetchAdminActions());
    }
  }, [status, dispatch]);

  // Function to merge activities and admin actions into point history
  const getUserPointHistory = (userId) => {
    const userActivities = activities
      ?.filter((activity) => activity.userId === userId)
      .map((activity) => ({
        points: activity.points,
        type: activity.type,
        timestamp: activity.timestamp,
      }));

    const userAdminActions = adminActions
      ?.filter((action) => action.userId === userId && action.pointsChanged)
      .map((action) => ({
        points: action.pointsChanged,
        type: action.action,
        timestamp: action.timestamp,
      }));

    return [...(userActivities || []), ...(userAdminActions || [])].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  };

  // Apply search and role filtering
  const filteredUsers = users
    ? users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) &&
        (roleFilter ? user.role === roleFilter : true)
      )
    : [];

  return (
    <Container>
      <Content>
        {/* Left Section (Users List) */}
        <UsersSection>
          <h2>Users</h2>
          <SearchInput
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <RoleFilter>
            <label>Filter by Role:</label>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">All</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </RoleFilter>
          {status === "loading" && <Loading>Loading...</Loading>}
          {status === "failed" && <ErrorMessage>Error: {error}</ErrorMessage>}
          {filteredUsers.length > 0 ? (
            <UserGrid>
              {filteredUsers.map((user) => {
                const pointHistory = getUserPointHistory(user.id);
                return (
                  <UserCard key={user.id} whileHover={{ scale: 1.05 }}>
                    <h3>{user.name}</h3>
                    <p>Points: {user.points}</p>
                    <p>Role: {user.role}</p>
                    {pointHistory.length > 0 && (
                      <PointHistory>
                        <h4>Point History</h4>
                        <ul>
                          {pointHistory.map((entry, index) => (
                            <li key={index}>
                              {entry.points} points ({entry.type}) on{" "}
                              {new Date(entry.timestamp).toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      </PointHistory>
                    )}
                  </UserCard>
                );
              })}
            </UserGrid>
          ) : (
            <p>No users found.</p>
          )}
        </UsersSection>

        {/* Right Section (Leaderboard) */}
        <LeaderboardSection>
          <h2>Leaderboard</h2>
          <LeaderboardList>
            {[...users]
              .sort((a, b) => b.points - a.points)
              .slice(0, 5)
              .map((user, index) => (
                <LeaderboardItem key={user.id} rank={index + 1}>
                  <span>#{index + 1}</span> {user.name} - {user.points} points
                </LeaderboardItem>
              ))}
          </LeaderboardList>
        </LeaderboardSection>
      </Content>
    </Container>
  );
};

export default UserList;

const Container = styled.div`
  padding: 30px 20px;
  max-width: 1200px;
  margin: 80px auto 0;
`;

const Content = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const UsersSection = styled.div`
  flex: 2;
  text-align: center;
`;

const SearchInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const RoleFilter = styled.div`
  margin-bottom: 20px;

  select {
    padding: 8px;
    margin-left: 10px;
    font-size: 16px;
    border-radius: 5px;
  }
`;

const Loading = styled.p`
  color: #ffcc80;
  font-size: 18px;
  font-weight: 600;
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
  font-size: 16px;
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const UserCard = styled(motion.div)`
  background: ${({ theme }) => (theme === "dark" ? "#2a2a2a" : "#ffffff")};
  color: ${({ theme }) => (theme === "dark" ? "#ffffff" : "#333")};
  padding: 20px;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
`;

const PointHistory = styled.div`
  margin-top: 10px;
  padding: 10px;
  background: ${({ theme }) => (theme === "dark" ? "#1e1e1e" : "#f5f5f5")};
  border-radius: 8px;
`;

const LeaderboardSection = styled.div`
  flex: 1;
  text-align: center;
  background: ${({ theme }) => (theme === "dark" ? "#222" : "#f9f9f9")};
  padding: 20px;
  border-radius: 10px;
`;

const LeaderboardList = styled.ul`
  list-style: none;
  padding: 0;
`;

const LeaderboardItem = styled.li`
  background: ${({ rank }) =>
    rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : rank === 3 ? "#CD7F32" : "#ccc"};
  color: black;
  padding: 10px;
  border-radius: 5px;
  margin: 5px 0;
  font-weight: bold;
`;
