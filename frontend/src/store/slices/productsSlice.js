import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productsAPI } from '../../api/products'
import { getApiErrorMessage } from '../../utils/apiError'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getAll(params)
      return response.data
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error))
    }
  }
)

export const fetchAdminProducts = createAsyncThunk(
  'products/fetchAdminProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getAdminAll(params)
      return response.data
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error))
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
      return rejectWithValue(getApiErrorMessage(error))
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
      return rejectWithValue(getApiErrorMessage(error))
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
        const pageData = action.payload?.result || {}
        state.products = pageData.content || []
        state.totalPages = pageData.totalPages || 0
        state.currentPage = pageData.number || 0
      })
      .addCase(fetchAdminProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.isLoading = false
        const pageData = action.payload?.result || {}
        state.products = pageData.content || []
        state.totalPages = pageData.totalPages || 0
        state.currentPage = pageData.number || 0
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
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
        state.currentProduct = action.payload?.result || null
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        const pageData = action.payload?.result || {}
        state.products = pageData.content || []
        state.totalPages = pageData.totalPages || 0
        state.currentPage = pageData.number || 0
      })
  },
})

export const { clearError, clearCurrentProduct } = productsSlice.actions
export default productsSlice.reducer
