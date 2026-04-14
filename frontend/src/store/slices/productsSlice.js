import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productsAPI } from '../../api/products'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getAll(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products')
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getById(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product')
    }
  }
)

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ keyword, params }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.search(keyword, params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search products')
    }
  }
)

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    currentProduct: null,
    totalPages: 0,
    currentPage: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        // Backend wraps in ApiResponse, so we need action.payload.data
        const pageData = action.payload.data
        state.products = pageData.content || []
        state.totalPages = pageData.totalPages || 0
        state.currentPage = pageData.number || 0
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false
        // Backend wraps in ApiResponse, product is in action.payload.data
        state.currentProduct = action.payload.data || action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        const pageData = action.payload.data
        state.products = pageData.content || []
        state.totalPages = pageData.totalPages || 0
        state.currentPage = pageData.number || 0
      })
  },
})

export const { clearError, clearCurrentProduct } = productsSlice.actions
export default productsSlice.reducer
