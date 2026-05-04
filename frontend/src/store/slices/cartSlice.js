import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { cartAPI } from '../../api/cart'

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart')
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (item, { rejectWithValue }) => {
    try {
      const response = await cartAPI.addToCart(item)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart')
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, item }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.updateCartItem(itemId, item)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item')
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await cartAPI.removeFromCart(itemId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart')
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartAPI.clearCart()
      localStorage.removeItem('techstore_cart')
      return { cartItems: [], totalPrice: 0, totalItems: 0 }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart')
    }
  }
)

export const syncOfflineCart = createAsyncThunk(
  'cart/syncOffline',
  async (_, { getState, rejectWithValue }) => {
    const { cartItems } = getState().cart
    if (cartItems.length === 0) return null
    try {
      // Logic to sync local items to server if needed
      // For now, we assume the server is the source of truth when online
      const response = await cartAPI.getCart()
      return response.data
    } catch (error) {
      return rejectWithValue('Sync failed')
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: JSON.parse(localStorage.getItem('techstore_cart'))?.cartItems || [],
    totalPrice: JSON.parse(localStorage.getItem('techstore_cart'))?.totalPrice || 0,
    totalItems: JSON.parse(localStorage.getItem('techstore_cart'))?.totalItems || 0,
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
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false
        const data = action.payload.result
        if (data) {
          state.cartItems = data.cartItems || []
          state.totalPrice = data.totalPrice || 0
          state.totalItems = data.totalItems || 0
          persistCart(state)
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const data = action.payload.result
        if (data) {
          state.cartItems = data.cartItems || []
          state.totalPrice = data.totalPrice || 0
          state.totalItems = data.totalItems || 0
          persistCart(state)
        }
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const data = action.payload.result
        if (data) {
          state.cartItems = data.cartItems || []
          state.totalPrice = data.totalPrice || 0
          state.totalItems = data.totalItems || 0
          persistCart(state)
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const data = action.payload.result
        if (data) {
          state.cartItems = data.cartItems || []
          state.totalPrice = data.totalPrice || 0
          state.totalItems = data.totalItems || 0
          persistCart(state)
        }
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cartItems = []
        state.totalPrice = 0
        state.totalItems = 0
      })
      .addCase(syncOfflineCart.fulfilled, (state, action) => {
        if (action.payload?.result) {
            const data = action.payload.result
            state.cartItems = data.cartItems || []
            state.totalPrice = data.totalPrice || 0
            state.totalItems = data.totalItems || 0
            localStorage.setItem('techstore_cart', JSON.stringify({
                cartItems: state.cartItems,
                totalPrice: state.totalPrice,
                totalItems: state.totalItems
            }))
        }
      })
      .addMatcher(
        (action) => action.type === 'orders/reorder/fulfilled',
        (state, action) => {
          const data = action.payload.result?.cart
          if (data) {
            state.cartItems = data.cartItems || []
            state.totalPrice = data.totalPrice || 0
            state.totalItems = data.totalItems || 0
            persistCart(state)
          }
        }
      )
  },
})

// Persistence middleware helper
export const persistCart = (state) => {
    localStorage.setItem('techstore_cart', JSON.stringify({
        cartItems: state.cartItems,
        totalPrice: state.totalPrice,
        totalItems: state.totalItems
    }))
}

export const { clearError } = cartSlice.actions
export default cartSlice.reducer
