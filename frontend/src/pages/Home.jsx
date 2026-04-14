import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../store/slices/productsSlice'
import { fetchPersonalizedRecommendations, fetchTrendingProducts } from '../store/slices/recommendationsSlice'
import ProductCard from '../components/ProductCard'
import { ShoppingCart, ArrowRight, Clock, Smartphone, Laptop, Headphones, Watch, Tablet } from 'lucide-react'

const Home = () => {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.products)
  const { personalized, trending } = useSelector((state) => state.recommendations)
  const { user } = useSelector((state) => state.auth)
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 0 })

  useEffect(() => {
    const loadHomeData = async () => {
      // Fetch core products first
      dispatch(fetchProducts({ page: 0, size: 8 }))
      dispatch(fetchTrendingProducts(5))
      
      // Delay personalized fetch slightly to spread load
      if (user) {
        setTimeout(() => {
          dispatch(fetchPersonalizedRecommendations(4))
        }, 500)
      }
    }
    loadHomeData()
  }, [dispatch, user])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const { hours, minutes, seconds } = prev
        if (seconds > 0) return { ...prev, seconds: seconds - 1 }
        if (minutes > 0) return { ...prev, minutes: minutes - 1, seconds: 59 }
        if (hours > 0) return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const categories = [
    { name: 'Điện thoại', icon: Smartphone, path: '/products?category=phone', color: 'bg-blue-500' },
    { name: 'Laptop', icon: Laptop, path: '/products?category=laptop', color: 'bg-purple-500' },
    { name: 'Tablet', icon: Tablet, path: '/products?category=tablet', color: 'bg-green-500' },
    { name: 'Phụ kiện', icon: Headphones, path: '/products?category=accessory', color: 'bg-orange-500' },
    { name: 'Đồng hồ', icon: Watch, path: '/products?category=watch', color: 'bg-pink-500' },
  ]

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[32px] animate-fade-in group">
        <div className="absolute inset-0 bg-[#0f172a]">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-MAIN/20 to-transparent"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-MAIN/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative px-8 md:px-16 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-widest">
                <span className="flex h-2 w-2 rounded-full bg-primary-MAIN animate-ping"></span>
                Thế hệ công nghệ mới 2024
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
                Nâng tầm <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-MAIN to-orange-400">Trải nghiệm</span>
              </h1>
              <p className="text-lg text-gray-400 max-w-md leading-relaxed">
                Khám phá bộ sưu tập thiết bị thông minh hàng đầu với hiệu năng vượt trội và thiết kế thời thượng.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="bg-primary-MAIN text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/25 flex items-center gap-2 group/btn"
                >
                  Mua sắm ngay
                  <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/products"
                  className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  Xem ưu đãi
                </Link>
              </div>
            </div>
            
            <div className="relative h-[400px] hidden md:block">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-MAIN/20 rounded-full blur-[100px]"></div>
              <div className="relative grid grid-cols-2 gap-4 h-full">
                 <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 self-start transform -rotate-6 hover:rotate-0 transition-all duration-500">
                    <div className="text-5xl mb-4">📱</div>
                    <div className="font-bold text-white text-xl">iPhone 15 Pro</div>
                    <div className="text-primary-MAIN font-bold">Từ 28.9tr</div>
                 </div>
                 <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 self-end transform rotate-6 hover:rotate-0 transition-all duration-500">
                    <div className="text-5xl mb-4">💻</div>
                    <div className="font-bold text-white text-xl">MacBook M3</div>
                    <div className="text-primary-MAIN font-bold">Từ 32.5tr</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="animate-slide-in-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-12 h-[2px] bg-red-500"></span>
              <span className="text-red-500 font-black text-xs uppercase tracking-widest">Ưu đãi giới hạn</span>
            </div>
            <h2 className="text-4xl font-black text-secondary-800 tracking-tight flex items-center gap-3">
              GIỜ VÀNG <span className="text-primary-MAIN">CHỐT DEAL</span>
              <div className="flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-2xl border border-red-100 ml-4">
                <Clock className="h-5 w-5 animate-pulse" />
                <span className="font-black text-lg">
                  {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </h2>
          </div>
          <Link to="/products" className="group flex items-center gap-2 text-secondary-800 font-bold hover:text-primary-MAIN transition-all">
            Xem tất cả deal
            <div className="bg-gray-100 p-2 rounded-full group-hover:bg-primary-50 transition-colors">
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products?.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-8 animate-slide-in-up">
        <h2 className="text-2xl font-bold text-secondary-800 mb-4">Danh mục sản phẩm</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="card group cursor-pointer"
            >
              <div className="flex flex-col items-center p-4">
                <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-primary-MAIN transition-colors">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="mb-8 animate-slide-in-up">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-secondary-800 to-secondary-900 p-8 text-white">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">🎉 Ưu đãi đặc biệt</h3>
            <p className="text-gray-300 mb-4">
              Giảm thêm 10% cho đơn hàng trên 2 triệu đồng
            </p>
            <button className="bg-primary-MAIN text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-600 transition-colors">
              Nhận mã giảm giá
            </button>
          </div>
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-8xl opacity-10">
            🎁
          </div>
        </div>
      </section>

      {/* Banner Ads Section */}
      <section className="mb-8 animate-slide-in-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/products?category=accessory" className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white hover:shadow-lg transition-shadow">
            <div className="relative z-10">
              <div className="text-4xl mb-2">🎧</div>
              <h3 className="text-xl font-bold mb-2">Tai nghe giảm 30%</h3>
              <p className="text-blue-100">Săn deal ngay hôm nay</p>
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-6xl opacity-20">
              🎧
            </div>
          </Link>
          <Link to="/products?category=watch" className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-green-600 p-6 text-white hover:shadow-lg transition-shadow">
            <div className="relative z-10">
              <div className="text-4xl mb-2">⌚</div>
              <h3 className="text-xl font-bold mb-2">Smartwatch mới</h3>
              <p className="text-green-100">Công nghệ đeo tay hiện đại</p>
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-6xl opacity-20">
              ⌚
            </div>
          </Link>
        </div>
      </section>

      {/* Recommendations Section */}
      {user && personalized.length > 0 && (
        <section className="mb-8 animate-slide-in-up">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold text-secondary-800">✨ Gợi ý dành cho bạn</h2>
            <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-bold">AI</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {personalized.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="mb-8 animate-slide-in-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-secondary-800">Sản phẩm nổi bật</h2>
          <Link to="/products" className="text-primary-MAIN hover:text-primary-600 flex items-center font-medium">
            Xem tất cả
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
            : products?.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-in-up">
        <div className="card text-center hover:-translate-y-1 transition-transform duration-300">
          <div className="text-primary-MAIN mb-2 text-4xl">🚚</div>
          <h3 className="font-bold mb-2 text-secondary-800">Giao hàng nhanh</h3>
          <p className="text-gray-600 text-sm">
            Miễn phí giao hàng cho đơn hàng trên 500k
          </p>
        </div>
        <div className="card text-center hover:-translate-y-1 transition-transform duration-300">
          <div className="text-primary-MAIN mb-2 text-4xl">💳</div>
          <h3 className="font-bold mb-2 text-secondary-800">Thanh toán an toàn</h3>
          <p className="text-gray-600 text-sm">
            Hỗ trợ nhiều phương thức thanh toán
          </p>
        </div>
        <div className="card text-center hover:-translate-y-1 transition-transform duration-300">
          <div className="text-primary-MAIN mb-2 text-4xl">🔒</div>
          <h3 className="font-bold mb-2 text-secondary-800">Bảo hành chính hãng</h3>
          <p className="text-gray-600 text-sm">
            Sản phẩm chính hãng 100%, bảo hành 12 tháng
          </p>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="mb-8 animate-slide-in-up">
        <h2 className="text-2xl font-bold text-secondary-800 mb-4">⭐ Đánh giá khách hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400">
                <span>⭐⭐⭐⭐⭐</span>
              </div>
            </div>
            <p className="text-gray-700 mb-3">
              "Sản phẩm rất tốt! Giao hàng nhanh, đóng gói cẩn thận. Sẽ tiếp tục ủng hộ shop."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-MAIN rounded-full flex items-center justify-center text-white font-bold mr-3">
                T
              </div>
              <div>
                <p className="font-medium text-gray-900">Trần Tuấn</p>
                <p className="text-sm text-gray-500">Mua iPhone 15 Pro</p>
              </div>
            </div>
          </div>
          <div className="card hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400">
                <span>⭐⭐⭐⭐⭐</span>
              </div>
            </div>
            <p className="text-gray-700 mb-3">
              "Laptop chạy rất mượt, giá hợp lý so với thị trường. Dịch vụ chăm sóc khách hàng tận tâm."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                N
              </div>
              <div>
                <p className="font-medium text-gray-900">Nguyễn Mai</p>
                <p className="text-sm text-gray-500">Mua MacBook Air</p>
              </div>
            </div>
          </div>
          <div className="card hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400">
                <span>⭐⭐⭐⭐⭐</span>
              </div>
            </div>
            <p className="text-gray-700 mb-3">
              "Tai nghe chất lượng âm thanh tuyệt vời. Đóng gói đẹp, giao hàng đúng hẹn."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                L
              </div>
              <div>
                <p className="font-medium text-gray-900">Lê Minh</p>
                <p className="text-sm text-gray-500">Mua Sony WH-1000XM5</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
