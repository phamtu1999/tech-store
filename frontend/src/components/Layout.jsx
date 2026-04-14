import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Store, LayoutDashboard, Heart, Search, ChevronDown, Menu, X } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { logout } from '../store/slices/authSlice'
import NotificationDropdown from './NotificationDropdown'

const Layout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { totalItems } = useSelector((state) => state.cart)
  const { totalItems: wishlistCount } = useSelector((state) => state.wishlist)
  const isAdmin = user?.roles?.some(role => {
    const r = typeof role === 'string' ? role : (role.name || role.authority || role.role || "");
    return r === 'ROLE_ADMIN' || r === 'ADMIN';
  });
  
  // Debug roles - xóa sau khi chạy được
  console.log("Current User Roles:", user?.roles);
  const [searchQuery, setSearchQuery] = useState('')
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`)
    }
  }

  const categories = [
    { name: 'Điện thoại', icon: '📱', path: '/products?category=phone' },
    { name: 'Laptop', icon: '💻', path: '/products?category=laptop' },
    { name: 'Tablet', icon: '📲', path: '/products?category=tablet' },
    { name: 'Phụ kiện', icon: '🎧', path: '/products?category=accessory' },
    { name: 'Đồng hồ', icon: '⌚', path: '/products?category=watch' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600 no-hover-scale"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link to="/" className="flex items-center space-x-2 group no-hover-scale">
                <div className="bg-gradient-to-tr from-primary-MAIN to-primary-600 p-2 rounded-xl shadow-lg shadow-primary-500/20 group-hover:rotate-12 transition-transform duration-300">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tight text-secondary-800">
                  TECH<span className="text-primary-MAIN">ZONE</span>
                </span>
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-12">
              <form onSubmit={handleSearch} className="relative w-full group">
                <input
                  type="text"
                  placeholder="Bạn đang tìm kiếm sản phẩm gì?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-MAIN/20 focus:border-primary-MAIN focus:bg-white transition-all duration-300 shadow-sm group-hover:shadow-md"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-primary-MAIN transition-colors" />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-MAIN text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30 no-hover-scale">
                  Tìm
                </button>
              </form>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link to="/products" className="text-gray-600 font-semibold hover:text-primary-MAIN transition-colors">
                Khám phá
              </Link>

              <div className="flex items-center space-x-4 border-l border-gray-100 pl-6">
                <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-all group">
                  <Heart className="h-6 w-6 group-hover:fill-current" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-MAIN hover:bg-primary-50 rounded-full transition-all group">
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 bg-primary-MAIN text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {user ? (
                  <div className="flex items-center space-x-4">
                    <NotificationDropdown />
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="bg-secondary-800 text-white px-4 py-2 rounded-full hover:bg-secondary-900 transition-all flex items-center space-x-2 font-semibold text-sm shadow-lg shadow-secondary-800/20"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                      title="Đăng xuất"
                    >
                      <LogOut className="h-6 w-6" />
                    </button>
                    <Link to="/orders" className="flex items-center space-x-2 no-hover-scale">
                      <div className="w-10 h-10 ring-2 ring-primary-MAIN/20 p-0.5 rounded-full overflow-hidden hover:ring-primary-MAIN transition-all">
                        <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link to="/login" className="text-gray-600 font-semibold hover:text-primary-MAIN transition-colors px-4 py-2 rounded-full">
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="bg-gradient-to-r from-[#ff7a00] to-[#ff4d00] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300"
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Header Icons */}
            <div className="flex items-center space-x-2 lg:hidden">
              <Link to="/cart" className="relative p-2 text-gray-600">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-primary-MAIN text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-6 border-t border-gray-100 animate-fade-in">
              <form onSubmit={handleSearch} className="relative w-full mb-6">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-MAIN focus:bg-white transition-all"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </form>
              <div className="space-y-2">
                <Link to="/products" className="block px-4 py-3 text-secondary-800 font-semibold hover:bg-gray-50 rounded-2xl">
                  Tất cả sản phẩm
                </Link>
                <div className="px-4 py-3">
                  <p className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-3">Danh mục</p>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        to={category.path}
                        className="flex items-center space-x-3 px-4 py-3 bg-gray-50 hover:bg-primary-50 hover:text-primary-MAIN rounded-2xl transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="text-xl">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                {user ? (
                  <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="flex items-center space-x-3 px-4 py-3 bg-secondary-800 text-white rounded-2xl shadow-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LayoutDashboard size={20} />
                        <span className="font-bold">Trang quản trị</span>
                      </Link>
                    )}
                    <Link to="/orders" className="block px-4 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-2xl">
                      Đơn hàng của tôi
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-500 font-medium hover:bg-red-50 rounded-2xl"
                    >
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 grid grid-cols-2 gap-3 px-4">
                    <Link to="/login" className="flex items-center justify-center py-3 border border-gray-200 rounded-2xl font-bold">
                      Đăng nhập
                    </Link>
                    <Link to="/register" className="flex items-center justify-center py-3 bg-primary-MAIN text-white rounded-2xl font-bold">
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-80px-300px)]">
        <Outlet />
      </main>

      <footer className="bg-secondary-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Store className="h-6 w-6" />
                <span className="text-lg font-bold">Tech Store</span>
              </div>
              <p className="text-gray-400 text-sm">
                Cửa hàng công nghệ uy tín với các sản phẩm chất lượng cao và giá cả cạnh tranh.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Liên hệ</h3>
              <p className="text-gray-400 text-sm">Email: support@techstore.com</p>
              <p className="text-gray-400 text-sm">Hotline: 1900 xxxx</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Chính sách</h3>
              <p className="text-gray-400 text-sm mb-2">Chính sách bảo hành</p>
              <p className="text-gray-400 text-sm mb-2">Chính sách đổi trả</p>
              <p className="text-gray-400 text-sm">Chính sách giao hàng</p>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm">&copy; 2024 Tech Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
