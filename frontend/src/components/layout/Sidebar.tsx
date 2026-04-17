import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
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
  type LucideIcon
} from 'lucide-react'

interface MenuItem {
  path: string
  icon: LucideIcon
  label: string
  requiredRoles: string[]
}

interface SidebarProps {
  onLogout?: () => void
}

const menuItems: MenuItem[] = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', requiredRoles: ['ROLE_STAFF', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] },
  { path: '/admin/products', icon: Package, label: 'Sản phẩm', requiredRoles: ['ROLE_STAFF', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] },
  { path: '/admin/orders', icon: ShoppingCart, label: 'Đơn hàng', requiredRoles: ['ROLE_STAFF', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] },
  { path: '/admin/categories', icon: Tags, label: 'Danh mục', requiredRoles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] },
  { path: '/admin/analytics', icon: LayoutDashboard, label: 'Analytics', requiredRoles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] },
  { path: '/admin/users', icon: Users, label: 'Người dùng', requiredRoles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] },
  { path: '/admin/settings', icon: Settings, label: 'Cài đặt', requiredRoles: ['ROLE_SUPER_ADMIN'] },
]

const Sidebar = ({ onLogout }: SidebarProps) => {
  const { user } = useSelector((state: any) => state.auth)
  const location = useLocation()

  const filteredMenuItems = menuItems.filter(item => 
    item.requiredRoles.includes(user?.role)
  )

  const isActive = (path: string): boolean => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="w-64 bg-white dark:bg-dark-card border-r border-border dark:border-dark-border min-h-screen fixed left-0 top-0 transition-colors duration-300">
      {/* Logo */}
      <div className="p-6">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary-main rounded-xl flex items-center justify-center shadow-lg">
            <Store className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-text-primary dark:text-dark-text">Admin Panel</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-4">
        <div className="px-2 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Menu
        </div>
        <div className="space-y-1">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-primary-main text-white shadow-md'
                  : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-dark-bg dark:text-dark-text'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border dark:border-dark-border">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-gray-100 dark:hover:bg-dark-bg dark:text-dark-text rounded-xl transition-all duration-200 mb-2"
        >
          <Home className="h-5 w-5" />
          <span className="font-medium">Về trang chủ</span>
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 w-full"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
