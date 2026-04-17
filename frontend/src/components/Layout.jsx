import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Store, LayoutDashboard, Heart, Search, ChevronDown, Menu, X } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect, useRef } from 'react'
import { logout } from '../store/slices/authSlice'
import NotificationDropdown from './NotificationDropdown'
import CompareBar from './CompareBar'
import ThemeToggle from './ThemeToggle'
import { settingsAPI } from '../api/settings'
import { productsAPI } from '../api/products'
import { getProductImageSources, handleProductImageError } from '../utils/productImageFallback'
import ChatWidget from './chat/ChatWidget'

const Layout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { totalItems } = useSelector((state) => state.cart)
  const { totalItems: wishlistCount } = useSelector((state) => state.wishlist)
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_SUPER_ADMIN' || user?.role === 'ROLE_STAFF';
  const [searchQuery, setSearchQuery] = useState('')
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [storeSettings, setStoreSettings] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await settingsAPI.getSettings()
        setStoreSettings(response.data.result)
      } catch (error) {
        console.error('Failed to load store settings:', error)
      }
    }
    loadSettings()
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true)
        try {
          const response = await productsAPI.getAll({ 
            q: searchQuery, 
            limit: 6,
            active: true 
          })
          setSearchResults(response.data.result.content || [])
          setShowResults(true)
        } catch (error) {
          console.error('Search failed:', error)
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`)
      setShowResults(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault()
        searchRef.current?.querySelector('input')?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleSuggestionClick = (slug) => {
    navigate(`/products/${slug}`)
    setShowResults(false)
    setSearchQuery('')
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
      <header className="bg-white/90 backdrop-blur-2xl shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:bg-dark-bg/90 dark:border-dark-border">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-12 items-center h-20 gap-4">
            
            {/* Left: Logo & Explore */}
            <div className="col-span-3 flex items-center gap-8">
              <Link to="/" className="flex items-center space-x-3 group no-hover-scale shrink-0">
                {storeSettings?.logoUrl ? (
                  <img src={storeSettings.logoUrl} alt="Logo" className="h-10 max-w-[120px] rounded-xl object-contain bg-white shadow-sm border border-gray-100 p-1" />
                ) : (
                  <div className="bg-gradient-to-tr from-primary-MAIN to-primary-600 p-2 rounded-xl text-white shadow-lg shadow-primary-500/20 group-hover:rotate-6 transition-transform">
                    <Store className="h-6 w-6" />
                  </div>
                )}
                <span className="text-xl font-black tracking-tighter text-secondary-800 dark:text-white hidden lg:block">
                  {storeSettings?.storeName || 'TECHZONE'}
                </span>
              </Link>

              <Link to="/products" className="hidden xl:flex items-center gap-1.5 text-secondary-800 dark:text-gray-300 font-black text-[10px] uppercase tracking-[0.2em] hover:text-primary-MAIN transition-colors">
                 <span>Khám phá</span>
                 <ChevronDown className="h-3 w-3" />
              </Link>
            </div>

            {/* Center: Search (Unified & Wide) */}
            <div className="col-span-6 relative" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  placeholder="Hôm nay bạn muốn mua gì?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
                  className="w-full pl-14 pr-12 h-12 bg-gray-50 dark:bg-dark-card border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary-MAIN focus:bg-white dark:focus:bg-dark-bg transition-all duration-300 shadow-sm text-sm font-bold text-black dark:text-white placeholder:text-gray-400 placeholder:font-bold"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-MAIN transition-colors" />
                
                {searchQuery && (
                   <button 
                     type="button"
                     onClick={() => { setSearchQuery(''); setShowResults(false); }}
                     className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-gray-400"
                   >
                     <X className="h-4 w-4" />
                   </button>
                )}

                {/* Search Results Dropdown */}
                {showResults && (
                  <div className="absolute top-full left-0 right-0 mt-4 glass backdrop-blur-3xl rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-[0_30px_70px_rgba(0,0,0,0.15)] overflow-hidden animate-scale-up z-[60]">
                    <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
                      {isSearching ? (
                        <div className="p-16 text-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Đang tìm kiếm...</p>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="p-4 space-y-1">
                          <div className="px-5 py-3 flex justify-between items-center bg-gray-50 dark:bg-white/5 rounded-2xl mb-2">
                             <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Sản phẩm gợi ý</p>
                             <span className="text-[10px] text-gray-500 font-bold uppercase">Tìm thấy {searchResults.length} kêt quả</span>
                          </div>
                          {searchResults.map((product) => {
                            const { primary: imageUrl, fallback: fallbackImageUrl } = getProductImageSources(product)
                            return (
                              <button
                                key={product.id}
                                onClick={() => handleSuggestionClick(product.slug)}
                                className="w-full flex items-center gap-5 p-3 hover:bg-gray-50 dark:hover:bg-white/10 rounded-2xl transition-all group text-left"
                              >
                                <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 p-2 group-hover:scale-105 transition-transform duration-500">
                                  <img 
                                    src={imageUrl} 
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => handleProductImageError(e, fallbackImageUrl)}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-primary-MAIN transition-colors">
                                    {product.name}
                                  </h4>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="text-primary-MAIN font-black text-base tracking-tighter">
                                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.variants?.[0]?.price)}
                                    </span>
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="p-10 text-center">
                           <p className="text-gray-500 font-bold">Không tìm thấy sản phẩm phù hợp</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Right: Actions */}
            <div className="col-span-3 flex items-center justify-end gap-2">
               {/* Mode Toggle */}
               <div className="flex items-center bg-gray-50 dark:bg-dark-card p-1 rounded-full border border-gray-100 dark:border-dark-border">
                  <ThemeToggle />
               </div>

               {/* Cart & Wishlist Group */}
               <div className="flex items-center gap-1">
                  <Link 
                    to="/wishlist" 
                    className="p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all relative group"
                    title="Yêu thích"
                  >
                     <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                     {wishlistCount > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-dark-bg text-[8px] font-black text-white flex items-center justify-center">{wishlistCount}</span>}
                  </Link>
                  <Link 
                    to="/cart" 
                    className="p-2.5 text-gray-500 hover:text-primary-MAIN hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all relative group"
                    title="Giỏ hàng"
                  >
                     <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                     {totalItems > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary-MAIN rounded-full border-2 border-white dark:border-dark-bg text-[8px] font-black text-white flex items-center justify-center">{totalItems}</span>}
                  </Link>
               </div>

                {user ? (
                  <div className="flex items-center gap-3">
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="p-2.5 text-gray-400 hover:text-primary-MAIN transition-all hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl group relative"
                        title="Quản trị hệ thống"
                      >
                        <LayoutDashboard className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-MAIN rounded-full animate-pulse shadow-sm shadow-primary-500/50"></span>
                      </Link>
                    )}
                    <NotificationDropdown />
                    <Link to="/profile" className="flex items-center gap-2.5 bg-secondary-900 text-white pl-1.5 pr-4 py-1.5 rounded-full hover:bg-black transition-all shadow-lg shadow-black/10">
                       <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center font-black text-[10px]">
                          {(user.fullName || user.email)?.charAt(0).toUpperCase()}
                       </div>
                       <div className="hidden xl:block text-left">
                          <p className="text-[9px] font-black uppercase tracking-tighter leading-none">{user.fullName || 'User'}</p>
                          <p className="text-[7px] font-bold opacity-60 uppercase mt-0.5">
                            {user.role === 'ROLE_SUPER_ADMIN' ? 'Super Admin' : user.role === 'ROLE_ADMIN' ? 'Admin' : user.role === 'ROLE_STAFF' ? 'Staff' : 'Member'}
                          </p>
                       </div>
                    </Link>
                    <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                       <LogOut className="h-4 w-4" />
                    </button>
                 </div>
               ) : (
                 <Link to="/login" className="bg-secondary-900 text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-black/20">
                    Đăng nhập
                 </Link>
               )}
            </div>

          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-10 min-h-[calc(100vh-80px-300px)]">
        <Outlet />
        <CompareBar />
        <ChatWidget />
      </main>

      <footer className="bg-secondary-900 text-white mt-12">
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                {storeSettings?.logoUrl ? (
                  <img src={storeSettings.logoUrl} alt="Logo" className="h-10 rounded bg-white p-1" />
                ) : (
                   <div className="bg-primary-600 p-2 rounded-lg"><Store className="h-6 w-6" /></div>
                )}
                <span className="text-2xl font-black">{storeSettings?.storeName || 'TECHZONE'}</span>
              </div>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                Hệ thống bán lẻ thiết bị công nghệ hàng đầu, cam kết mang lại trải nghiệm mua sắm tuyệt vời và sản phẩm chính hãng 100%.
              </p>
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-widest mb-6 underline decoration-primary-MAIN decoration-4 underline-offset-8">Liên kết</h3>
              <ul className="space-y-4 text-gray-400 text-sm font-bold">
                 <li className="hover:text-white transition-colors cursor-pointer">Về chúng tôi</li>
                 <li className="hover:text-white transition-colors cursor-pointer">Chính sách bảo mật</li>
                 <li className="hover:text-white transition-colors cursor-pointer">Điều khoản dịch vụ</li>
                 <li className="hover:text-white transition-colors cursor-pointer">Tuyển dụng</li>
              </ul>
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-widest mb-6 underline decoration-primary-MAIN decoration-4 underline-offset-8">Hỗ trợ</h3>
              <ul className="space-y-3 text-gray-400 text-sm font-bold">
                 <li>Email: {storeSettings?.supportEmail || 'support@techstore.com'}</li>
                 <li>Hotline: {storeSettings?.hotlinePhone || '1900 xxxx'}</li>
                 <li className="mt-4">{storeSettings?.address}</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-12 pt-8 border-t border-white/5">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">&copy; 2024 TECHZONE PREMIUM STORE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
