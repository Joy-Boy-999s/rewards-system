import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("http://localhost:5000/users");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch users");
  }
});

// Fetch activities
export const fetchActivities = createAsyncThunk("users/fetchActivities", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("http://localhost:5000/activities");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch activities");
  }
});

// Fetch admin actions
export const fetchAdminActions = createAsyncThunk("users/fetchAdminActions", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("http://localhost:5000/adminActions");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch admin actions");
  }
});

// Create users slice
const usersSlice = createSlice({
  name: "users",
  initialState: { users: [], activities: [], adminActions: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.status = "loading"; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.activities = action.payload;
      })
      .addCase(fetchAdminActions.fulfilled, (state, action) => {
        state.adminActions = action.payload;
      });
  },
});

export default usersSlice.reducer;
