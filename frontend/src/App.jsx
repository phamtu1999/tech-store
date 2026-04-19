import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import AdminLayout from './components/admin/AdminLayout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Wishlist from './pages/Wishlist'
import Notifications from './pages/Notifications'
import Login from './pages/Login'
import Register from './pages/Register'
import Compare from './pages/Compare'
import Livestream from './pages/Livestream'
import LivestreamDetail from './pages/LivestreamDetail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCategories from './pages/admin/AdminCategories'
import Analytics from './pages/admin/Analytics'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCoupons from './pages/admin/AdminCoupons'
import AdminSettings from './pages/admin/AdminSettings'
import AdminInventory from './pages/admin/AdminInventory'
import AdminLivestreams from './pages/admin/AdminLivestreams'
import AdminLogs from './pages/admin/AdminLogs'
import Profile from './pages/Profile'
import OrbisNft from './pages/OrbisNft'
import PaymentResult from './pages/PaymentResult'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { syncOfflineCart } from './store/slices/cartSlice'

function App() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_SUPER_ADMIN' || user?.role === 'ROLE_STAFF'

  useEffect(() => {
    const handleOnline = () => {
      console.log('App is online. Syncing cart...')
      dispatch(syncOfflineCart())
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [dispatch])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="orbis-nft" element={<OrbisNft />} />
        <Route path="products" element={<Products />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="orders" element={<Orders />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="livestream" element={<Livestream />} />
        <Route path="livestream/:id" element={<LivestreamDetail />} />
        <Route path="profile" element={<Profile />} />
        <Route path="payment-result" element={<PaymentResult />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="compare" element={<Compare />} />
        <Route path=":slug" element={<ProductDetail />} />
      </Route>
      
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route path="/admin" element={isAdmin ? <AdminLayout /> : <Navigate to="/" replace />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/:slug/edit" element={<AdminProductForm />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="livestreams" element={<AdminLivestreams />} />
        <Route path="logs" element={<AdminLogs />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
