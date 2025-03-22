import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import UserList from './features/users/UserList';
import RewardsList from './features/rewards/RewardsList';
import AdminDashboard from './features/admin/AdminDashboard';
import Login from './auth/Login';
import Home from './components/Home';
import NotFound from './components/NotFound';
import ActivityFeed from './features/activities/ActivityFeed';
import ActivityLog from './features/activities/ActivityLog';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/rewards" element={<RewardsList />} />
        <Route path="/activities" element={<ActivityFeed />} />
        <Route path="/log-activity" element={<ActivityLog />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
