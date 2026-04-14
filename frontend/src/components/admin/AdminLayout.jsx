import { Link, Outlet, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Tags, 
  Users, 
  Settings,
  LogOut,
  Store,
  Home,
  Moon,
  Sun
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { useState, useEffect } from 'react'

const AdminLayout = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark')
  }

  const handleLogout = () => {
    dispatch(logout())
    window.location.href = '/login'
  }

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Sản phẩm' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Đơn hàng' },
    { path: '/admin/categories', icon: Tags, label: 'Danh mục' },
    { path: '/admin/analytics', icon: LayoutDashboard, label: 'Analytics' },
    { path: '/admin/users', icon: Users, label: 'Người dùng' },
    { path: '/admin/settings', icon: Settings, label: 'Cài đặt' },
  ]

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-dark-card border-r border-border dark:border-dark-border min-h-screen fixed left-0 top-0 transition-colors duration-300">
          <div className="p-6">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary-MAIN rounded-xl flex items-center justify-center shadow-lg">
                <Store className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-text-primary dark:text-dark-text">Admin Panel</span>
            </Link>
          </div>

          <nav className="mt-4 px-4">
            <div className="px-2 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Menu
            </div>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary-MAIN text-white shadow-md'
                      : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-dark-bg dark:text-dark-text'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border dark:border-dark-border">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-gray-100 dark:hover:bg-dark-bg dark:text-dark-text rounded-xl transition-all duration-200 mb-2"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Về trang chủ</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 w-full"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64">
          {/* Top Header */}
          <header className="bg-white dark:bg-dark-card border-b border-border dark:border-dark-border sticky top-0 z-10 transition-colors duration-300">
            <div className="px-6 sm:px-8 py-4 flex justify-between items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-dark-text">
                {menuItems.find((item) => isActive(item.path))?.label || 'Dashboard'}
              </h1>
              <div className="flex items-center gap-4">
                {/* Dark mode toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors duration-200"
                  title={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5 text-text-primary dark:text-dark-text" />
                  ) : (
                    <Moon className="h-5 w-5 text-text-primary dark:text-dark-text" />
                  )}
                </button>
                
                {/* User info */}
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-text-primary dark:text-dark-text">{user?.username || 'Admin'}</p>
                    <p className="text-xs text-text-secondary">Administrator</p>
                  </div>
                  <div className="h-10 w-10 bg-primary-MAIN rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-6 sm:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
