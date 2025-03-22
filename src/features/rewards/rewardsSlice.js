import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRewards = createAsyncThunk('rewards/fetchRewards', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://localhost:5000/rewards');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch rewards');
  }
});

const rewardsSlice = createSlice({
  name: 'rewards',
  initialState: { rewards: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRewards.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchRewards.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rewards = action.payload;
      })
      .addCase(fetchRewards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default rewardsSlice.reducer;
