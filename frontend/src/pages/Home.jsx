import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../store/slices/productsSlice'
import { fetchPersonalizedRecommendations, fetchTrendingProducts } from '../store/slices/recommendationsSlice'
import { Smartphone, Laptop, Headphones, Watch, Tablet, LayoutGrid, ChevronRight } from 'lucide-react'
import { categoriesAPI } from '../api/categories'
import { productsAPI } from '../api/products'
import HeroBanner from '../components/home/HeroBanner'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const dispatch = useDispatch()
  const { products, isLoading } = useSelector((state) => state.products)
  const { user } = useSelector((state) => state.auth)
  const [categories, setCategories] = useState([])
  const [bestSellers, setBestSellers] = useState([])

  useEffect(() => {
    dispatch(fetchProducts({ page: 0, size: 12 }))
    dispatch(fetchTrendingProducts(8))
    
    // Fetch categories
    categoriesAPI.getAll().then(res => {
      setCategories((res.data?.result || []).filter(c => c.active).slice(0, 10))
    })

    // Fetch best sellers
    productsAPI.getAll({ page: 0, size: 8 }).then(res => {
      setBestSellers(res.data?.result?.content || [])
    })
  }, [dispatch])

  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'dien-thoai': return Smartphone
      case 'laptop': return Laptop
      case 'tablet': return Tablet
      case 'phu-kien': return Headphones
      case 'dong-ho': return Watch
      default: return LayoutGrid
    }
  }

  const getCategoryImage = (slug) => {
    const images = {
      'dien-thoai': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400',
      'laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400',
      'tablet': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400',
      'phu-kien': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
      'dong-ho': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
      'dien-tu': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=400'
    }
    return images[slug] || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=400'
  }

  return (
    <div className="space-y-16 pb-16 bg-[#F8F9FA]">
      {/* Hero Section - Bản Premium */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <HeroBanner />
      </div>

      {/* Categories Grid - High-end E-commerce Style */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Danh mục <span className="text-orange-500">nổi bật</span>
            </h2>
            <div className="h-1.5 w-20 bg-orange-500 rounded-full mt-2" />
          </div>
          <Link to="/products" className="group flex items-center gap-2 text-slate-500 font-bold hover:text-orange-500 transition-colors">
            Xem tất cả <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.slug)
            const catImg = cat.imageUrl || getCategoryImage(cat.slug)
            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group relative h-64 rounded-[2rem] overflow-hidden bg-slate-200 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-500"
              >
                {/* Background Image with Fallback Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
                <img 
                  src={catImg} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" 
                  onError={(e) => e.target.style.display = 'none'}
                />
                
                {/* Visual Hierarchy Tweak: Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/40 transition-all opacity-80 group-hover:opacity-100" />
                
                {/* Icon top-right (Apple style) */}
                <div className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white group-hover:bg-orange-500 group-hover:border-orange-400 group-hover:scale-110 transition-all duration-300">
                  <Icon className="h-4 w-4" />
                </div>

                {/* Title bottom-left (High-end layout) */}
                <div className="absolute bottom-6 left-6">
                  <span className="font-black text-white text-lg uppercase tracking-tighter leading-none block mb-1">
                    {cat.name}
                  </span>
                  <div className="h-1 w-0 bg-orange-500 rounded-full group-hover:w-full transition-all duration-500" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Best Sellers - Optimized Product Cards */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Sản phẩm <span className="text-orange-500">bán chạy</span></h2>
            <p className="text-slate-500 font-medium mt-1">Sự lựa chọn của hàng nghìn khách hàng</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map((product) => (
            <div key={product.id} className="hover:-translate-y-2 transition-transform duration-300">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Khuyến mãi - Banner phụ sạch sẽ */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-MAIN rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden group">
          <div className="relative z-10 max-w-xl">
            <span className="text-primary-100 font-bold tracking-widest uppercase text-sm">Chương trình đặc biệt</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6">Nâng cấp đời máy <br/> Trợ giá tới 2 triệu</h2>
            <button className="bg-white text-primary-MAIN px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-xl">
              Đăng ký ngay
            </button>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
             <div className="absolute inset-0 bg-gradient-to-l from-primary-MAIN to-transparent z-10" />
             <img 
               src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800" 
               alt="Promotion"
               className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
             />
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text">Dành cho bạn</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/products" className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-MAIN text-primary-MAIN font-bold rounded-xl hover:bg-primary-MAIN hover:text-white transition-all">
            Xem tất cả sản phẩm
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
