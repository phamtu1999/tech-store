import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { reviewsAPI } from '../../api/reviews'

export const fetchReviewsByProduct = createAsyncThunk(
  'reviews/fetchByProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await reviewsAPI.getByProduct(productId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews')
    }
  }
)

export const createReview = createAsyncThunk(
  'reviews/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await reviewsAPI.create(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create review')
    }
  }
)

export const updateReview = createAsyncThunk(
  'reviews/update',
  async ({ reviewId, data }, { rejectWithValue }) => {
    try {
      const response = await reviewsAPI.update(reviewId, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review')
    }
  }
)

export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async (reviewId, { rejectWithValue }) => {
    try {
      await reviewsAPI.delete(reviewId)
      return reviewId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review')
    }
  }
)

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
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
      .addCase(fetchReviewsByProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchReviewsByProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.reviews = action.payload.result || []
      })
      .addCase(fetchReviewsByProduct.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(createReview.fulfilled, (state, action) => {
        if (action.payload?.result) {
          state.reviews.unshift(action.payload.result)
        }
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r.id !== action.payload)
      })
  },
})

export const { clearError } = reviewsSlice.actions
export default reviewsSlice.reducer
