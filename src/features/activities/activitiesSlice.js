import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch activities from API
export const fetchActivities = createAsyncThunk(
  "activities/fetchActivities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/activities");
      if (!response.ok) throw new Error("Failed to fetch activities");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  list: [],
  loading: false,
  error: null,
};

// Create slice
const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    addActivity: (state, action) => {
      state.list.push(action.payload); // Add activity to Redux store
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions & reducer
export const { addActivity } = activitiesSlice.actions;
export default activitiesSlice.reducer;
