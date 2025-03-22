import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styled, { ThemeProvider } from "styled-components";
import axios from "axios";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Light & Dark Theme
const lightTheme = {
  textColor: "#1e293b",
  buttonBg: "#2563eb",
  buttonTextColor: "#fff",
  buttonHover: "#1e40af",
  cardBg: "#f8fafc",
  tableHeader: "#e2e8f0",
  tableRowHover: "#f1f5f9",
  iconColor: "#475569",
  iconHover: "#2563eb",
};

const darkTheme = {
  textColor: "#e2e8f0",
  buttonBg: "#4f46e5",
  buttonTextColor: "#fff",
  buttonHover: "#4338ca",
  cardBg: "#1e293b",
  tableHeader: "#374151",
  tableRowHover: "#2d3748",
  iconColor: "#94a3b8",
  iconHover: "#60a5fa",
};

const AdminDashboard = ({ darkMode }) => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editEntry, setEditEntry] = useState({});
  const [newEntry, setNewEntry] = useState({});
  
  const API_BASE_URL = "http://localhost:5000";

  // Fetch data when section changes
  useEffect(() => {
    if (selectedSection) {
      fetchData(selectedSection);
    }
  }, [selectedSection]);

  // CRUD Operations

  // READ: Fetch all entities
  const fetchData = async (section) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${section}`);
      setData(response.data);
      toast.success(`${section} loaded successfully!`);
    } catch (error) {
      toast.error(`Failed to fetch ${section}`);
      console.error(`Error fetching ${section}:`, error);
    }
  };

  // CREATE: Add new entity
  const handleAdd = async () => {
    if (Object.keys(newEntry).length === 0) {
      toast.error("Please fill in at least one field!");
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/${selectedSection}`, newEntry);
      setData([...data, response.data]);
      setNewEntry({});
      toast.success("Entry added successfully!");
    } catch (error) {
      toast.error("Failed to add entry.");
      console.error("Error adding entry:", error);
    }
  };

  // UPDATE: Edit existing entity
  const handleEdit = async (id) => {
    if (Object.keys(editEntry).length === 0) {
      toast.error("Please make some changes before saving!");
      return;
    }
    try {
      const response = await axios.put(`${API_BASE_URL}/${selectedSection}/${id}`, editEntry);
      const updatedData = data.map(item => 
        item.id === id ? { ...item, ...response.data } : item
      );
      setData(updatedData);
      setEditingId(null);
      setEditEntry({});
      toast.success("Entry updated successfully!");
    } catch (error) {
      toast.error("Failed to update entry.");
      console.error("Error updating entry:", error);
    }
  };

  // DELETE: Remove entity
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/${selectedSection}/${id}`);
      setData(data.filter(item => item.id !== id));
      toast.success("Entry deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete entry.");
      console.error("Error deleting entry:", error);
    }
  };

  // Start editing an entry
  const startEditing = (item) => {
    setEditingId(item.id);
    setEditEntry({ ...item });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditEntry({});
  };

  // Render table with CRUD operations
  const renderTable = () => (
    <TableContainer>
      <table>
        <thead>
          <tr>
            {data.length > 0 &&
              Object.keys(data[0]).map((key) => (
                <th key={key}>{key.toUpperCase()}</th>
              ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <motion.tr
              key={item.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {Object.keys(item).map((key) => (
                <td key={key}>
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editEntry[key] || ""}
                      onChange={(e) =>
                        setEditEntry({ ...editEntry, [key]: e.target.value })
                      }
                    />
                  ) : (
                    item[key]
                  )}
                </td>
              ))}
              <td>
                {editingId === item.id ? (
                  <>
                    <IconButton onClick={() => handleEdit(item.id)}>
                      ✅ Save
                    </IconButton>
                    <IconButton onClick={cancelEditing}>
                      ❌ Cancel
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton onClick={() => startEditing(item)}>
                      <EditOutlined />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(item.id)}>
                      <DeleteOutlined />
                    </IconButton>
                  </>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {/* Add New Entry Form */}
      <AddRowContainer>
        {data.length > 0 &&
          Object.keys(data[0]).map((key) => (
            <input
              key={key}
              type="text"
              placeholder={`Enter ${key}`}
              value={newEntry[key] || ""}
              onChange={(e) =>
                setNewEntry({ ...newEntry, [key]: e.target.value })
              }
            />
          ))}
        <AddButton onClick={handleAdd}>
          <PlusOutlined /> Add
        </AddButton>
      </AddRowContainer>
    </TableContainer>
  );

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <Title>Admin Dashboard</Title>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <ButtonContainer>
            <button onClick={() => setSelectedSection("users")}>
              Manage Users
            </button>
            <button onClick={() => setSelectedSection("rewards")}>
              Manage Rewards
            </button>
            <button onClick={() => setSelectedSection("activities")}>
              Manage Activities
            </button>
          </ButtonContainer>
        </motion.div>
        {selectedSection && renderTable()}
      </Container>
    </ThemeProvider>
  );
};

// Styled Components
const Container = styled.div`
  padding: 20px;
  margin-top: 70px;
  color: ${(props) => props.theme.textColor};
  min-height: calc(100vh - 70px);
`;

const Title = styled.h2`
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 15px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
  button {
    padding: 12px 20px;
    border-radius: 8px;
    border: none;
    background: ${(props) => props.theme.buttonBg};
    color: ${(props) => props.theme.buttonTextColor};
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 16px;
    &:hover {
      background: ${(props) => props.theme.buttonHover};
      transform: translateY(-2px);
    }
  }
`;

const TableContainer = styled.div`
  margin-top: 20px;
  border-radius: 12px;
  overflow: hidden;
  background: ${(props) => props.theme.cardBg};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    text-align: center;
    padding: 12px;
    border-bottom: 1px solid ${(props) => props.theme.textColor}20;
  }
  th {
    background: ${(props) => props.theme.tableHeader};
    font-weight: 600;
  }
  tbody tr:hover {
    background: ${(props) => props.theme.tableRowHover};
  }
  input {
    width: 100%;
    padding: 6px;
    border: 1px solid ${(props) => props.theme.textColor}40;
    border-radius: 4px;
    background: ${(props) => props.theme.cardBg};
    color: ${(props) => props.theme.textColor};
  }
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: ${(props) => props.theme.iconColor};
  transition: all 0.3s ease;
  margin: 0 5px;
  padding: 5px;
  &:hover {
    color: ${(props) => props.theme.iconHover};
    transform: scale(1.1);
  }
`;

const AddRowContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 15px;
  flex-wrap: wrap;
  background: ${(props) => props.theme.tableHeader}50;
`;

const AddButton = styled(IconButton)`
  font-size: 20px;
  background: ${(props) => props.theme.buttonBg};
  color: ${(props) => props.theme.buttonTextColor};
  padding: 8px 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 5px;
  &:hover {
    background: ${(props) => props.theme.buttonHover};
    color: ${(props) => props.theme.buttonTextColor};
  }
`;

export default AdminDashboard;