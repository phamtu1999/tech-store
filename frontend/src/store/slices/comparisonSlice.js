import { createSlice } from '@reduxjs/toolkit'

const comparisonSlice = createSlice({
  name: 'comparison',
  initialState: {
    items: [], // Max 3 items
  },
  reducers: {
    addToCompare: (state, action) => {
      const product = action.payload
      if (state.items.find(i => i.id === product.id)) {
        return
      }
      if (state.items.length < 4) {
        state.items.push(product)
      }
    },
    removeFromCompare: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
    clearCompare: (state) => {
      state.items = []
    }
  }
})

export const { addToCompare, removeFromCompare, clearCompare } = comparisonSlice.actions
export default comparisonSlice.reducer
