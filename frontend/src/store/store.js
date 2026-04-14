import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import productsReducer from './slices/productsSlice'
import ordersReducer from './slices/ordersSlice'
import reviewsReducer from './slices/reviewsSlice'
import wishlistReducer from './slices/wishlistSlice'
import notificationsReducer from './slices/notificationsSlice'
import analyticsReducer from './slices/analyticsSlice'
import livestreamReducer from './slices/livestreamSlice'
import recommendationsReducer from './slices/recommendationsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
    orders: ordersReducer,
    reviews: reviewsReducer,
    wishlist: wishlistReducer,
    notifications: notificationsReducer,
    analytics: analyticsReducer,
    livestream: livestreamReducer,
    recommendations: recommendationsReducer,
  },
})


