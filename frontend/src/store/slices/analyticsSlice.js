import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { analyticsAPI } from '../../api/analytics'

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetch',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await analyticsAPI.getAnalytics(startDate, endDate)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics')
    }
  }
)

export const fetchDashboardAnalytics = createAsyncThunk(
  'analytics/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsAPI.getDashboardAnalytics()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard analytics')
    }
  }
)

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    data: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = analyticsSlice.actions
export default analyticsSlice.reducer
