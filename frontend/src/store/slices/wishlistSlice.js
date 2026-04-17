import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { wishlistAPI } from '../../api/wishlist'

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.getWishlist()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist')
    }
  }
)

export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.addToWishlist(productId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist')
    }
  }
)

export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (productId, { rejectWithValue }) => {
    try {
      await wishlistAPI.removeFromWishlist(productId)
      return productId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist')
    }
  }
)

export const clearWishlist = createAsyncThunk(
  'wishlist/clear',
  async (_, { rejectWithValue }) => {
    try {
      await wishlistAPI.clearWishlist()
      return []
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear wishlist')
    }
  }
)

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: JSON.parse(localStorage.getItem('techstore_wishlist')) || [],
    totalItems: JSON.parse(localStorage.getItem('techstore_wishlist'))?.length || 0,
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
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.result || []
        state.totalItems = state.items.length
        localStorage.setItem('techstore_wishlist', JSON.stringify(state.items))
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload.result)
        state.totalItems = state.items.length
        localStorage.setItem('techstore_wishlist', JSON.stringify(state.items))
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.productId !== action.payload)
        state.totalItems = state.items.length
        localStorage.setItem('techstore_wishlist', JSON.stringify(state.items))
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = []
        state.totalItems = 0
        localStorage.removeItem('techstore_wishlist')
      })
  },
})

export const { clearError } = wishlistSlice.actions
export default wishlistSlice.reducer
