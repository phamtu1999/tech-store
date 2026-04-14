import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const AdminLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const location = useLocation()

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
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  const getPageTitle = (): string => {
    const path = location.pathname
    if (path === '/admin') return 'Dashboard'
    if (path.includes('/products')) return 'Sản phẩm'
    if (path.includes('/orders')) return 'Đơn hàng'
    if (path.includes('/categories')) return 'Danh mục'
    if (path.includes('/analytics')) return 'Analytics'
    if (path.includes('/users')) return 'Người dùng'
    if (path.includes('/settings')) return 'Cài đặt'
    return 'Dashboard'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <div className="flex">
        <Sidebar onLogout={handleLogout} />
        <main className="flex-1 ml-64">
          <Header
            title={getPageTitle()}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            username="Admin"
          />
          <div className="p-6 sm:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
