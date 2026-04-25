import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../store/slices/productsSlice'
import { fetchPersonalizedRecommendations, fetchTrendingProducts } from '../store/slices/recommendationsSlice'
import { Smartphone, Laptop, Headphones, Watch, Tablet, LayoutGrid, ChevronRight, Zap } from 'lucide-react'
import { categoriesAPI } from '../api/categories'
import { productsAPI } from '../api/products'
import HeroBanner from '../components/home/HeroBanner'
import ProductCard from '../components/ProductCard'
import { getProductImageSources, handleProductImageError, DEFAULT_PRODUCT_PLACEHOLDER } from '../utils/productImageFallback'

const Home = () => {
  const dispatch = useDispatch()
  const { products, isLoading } = useSelector((state) => state.products)
  const { user } = useSelector((state) => state.auth)
  const [categories, setCategories] = useState([])
  const [bestSellers, setBestSellers] = useState([])

  useEffect(() => {
    dispatch(fetchProducts({ page: 0, size: 12 }))
    dispatch(fetchTrendingProducts(8))
    
    // Fetch categories with fallback
    categoriesAPI.getAll().then(res => {
      const apiCats = (res.data?.result || []).filter(c => c.active)
      if (apiCats.length > 0) {
        setCategories(apiCats.slice(0, 10))
      } else {
        // Fallback hardcoded categories if API is empty
        setCategories([
          { id: 'f1', name: 'Điện thoại', slug: 'dien-thoai', active: true },
          { id: 'f2', name: 'Laptop', slug: 'laptop', active: true },
          { id: 'f3', name: 'Máy tính bảng', slug: 'tablet', active: true },
          { id: 'f4', name: 'Phụ kiện', slug: 'phu-kien', active: true },
          { id: 'f5', name: 'Đồng hồ', slug: 'dong-ho', active: true },
          { id: 'f6', name: 'Điện tử', slug: 'dien-tu', active: true },
        ])
      }
    }).catch(() => {
      // Fallback on error
      setCategories([
        { id: 'f1', name: 'Điện thoại', slug: 'dien-thoai', active: true },
        { id: 'f2', name: 'Laptop', slug: 'laptop', active: true },
        { id: 'f3', name: 'Máy tính bảng', slug: 'tablet', active: true },
        { id: 'f4', name: 'Phụ kiện', slug: 'phu-kien', active: true },
        { id: 'f5', name: 'Đồng hồ', slug: 'dong-ho', active: true },
        { id: 'f6', name: 'Điện tử', slug: 'dien-tu', active: true },
      ])
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
    <div className="space-y-10 sm:space-y-16 pb-12 sm:pb-16 bg-[#F8F9FA] dark:bg-dark-bg transition-colors duration-500">
      {/* Hero Section - Bản Premium */}
      <div className="max-w-[1440px] mx-auto px-0 sm:px-4 lg:px-8">
        <HeroBanner />
      </div>

      {/* Categories Grid - High-end E-commerce Style */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-10 gap-3">
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Danh mục <span className="text-primary-MAIN">nổi bật</span>
            </h2>
            <div className="h-1.5 w-12 bg-primary-MAIN rounded-full mt-3" />
          </div>
          <Link to="/products" className="group flex items-center gap-2 text-slate-500 dark:text-dark-textSecondary font-bold hover:text-primary-MAIN transition-colors">
            Xem tất cả <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-6 lg:gap-8">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.slug)
            const catImg = cat.imageUrl || getCategoryImage(cat.slug)
            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group relative h-44 sm:h-72 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden bg-slate-200 dark:bg-dark-card shadow-lg hover:shadow-primary-500/10 hover:scale-[1.03] hover:ring-2 hover:ring-primary-500 transition-all duration-500"
              >
                {/* Background Image with Fallback Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 dark:from-dark-card dark:to-dark-bg" />
                <img 
                  src={catImg} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" 
                  onError={(e) => e.target.style.display = 'none'}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent dark:from-dark-bg/95 dark:via-transparent transition-all duration-500" />
                
                <div className="absolute top-5 right-5 flex flex-col items-end">
                   <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white group-hover:bg-primary-500 group-hover:border-primary-400 group-hover:scale-110 transition-all duration-300">
                     <Icon className="h-5 w-5" />
                   </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                  <span className="font-black text-white text-xl uppercase tracking-wider leading-none block mb-2 drop-shadow-lg">
                    {cat.name}
                  </span>
                  <div className="h-1 w-0 bg-primary-500 rounded-full group-hover:w-16 transition-all duration-500" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Flash Sale - Bản Premium với Countdown */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-dark-card rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-primary-500/5 border border-gray-100 dark:border-white/5 relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            <div className="text-center lg:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-full text-xs font-black uppercase tracking-widest animate-bounce">
                <Zap className="h-4 w-4 fill-current" />
                Sự kiện đang diễn ra
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                FLASH <span className="text-primary-600 italic">SALE</span>
              </h2>
              <p className="text-slate-500 dark:text-dark-textSecondary font-bold uppercase tracking-widest text-sm">Kết thúc sau:</p>
              
              {/* Countdown Timer */}
              <div className="flex gap-4 justify-center lg:justify-start">
                <div className="flex flex-col items-center">
                   <div className="w-16 h-16 bg-slate-900 dark:bg-dark-border text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl">02</div>
                   <span className="text-[10px] font-black text-gray-400 mt-2 uppercase">Giờ</span>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white pt-3">:</div>
                <div className="flex flex-col items-center">
                   <div className="w-16 h-16 bg-slate-900 dark:bg-dark-border text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl">45</div>
                   <span className="text-[10px] font-black text-gray-400 mt-2 uppercase">Phút</span>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white pt-3">:</div>
                <div className="flex flex-col items-center">
                   <div className="w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl animate-pulse">12</div>
                   <span className="text-[10px] font-black text-gray-400 mt-2 uppercase">Giây</span>
                </div>
              </div>
            </div>

            {/* Flash Sale Products - Mini Slider or Grid */}
            <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(bestSellers.slice(0, 2)).map(product => {
                  const price = product.price || product.variants?.[0]?.price || 0;
                  const { primary: imageUrl } = getProductImageSources(product);
                  return (
                    <Link 
                      key={product.id} 
                      to={`/${product.slug}`}
                      className="bg-gray-50 dark:bg-white/5 rounded-[2.5rem] p-6 flex gap-6 items-center hover:bg-white dark:hover:bg-white/10 transition-all border border-transparent hover:border-primary-500 shadow-sm hover:shadow-xl group min-w-0"
                    >
                       <div className="w-24 h-24 lg:w-32 lg:h-32 flex-shrink-0 relative bg-white dark:bg-dark-bg rounded-2xl overflow-hidden p-2 border border-gray-100 dark:border-white/5">
                          <img 
                            src={imageUrl || DEFAULT_PRODUCT_PLACEHOLDER} 
                            alt={product.name} 
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                            onError={(e) => handleProductImageError(e)}
                          />
                          <div className="absolute top-2 left-2 bg-primary-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                             -35%
                          </div>
                       </div>
                       <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h3 className="font-black text-sm lg:text-base text-slate-900 dark:text-white line-clamp-2 leading-tight mb-2 group-hover:text-primary-600 transition-colors">
                             {product.name}
                          </h3>
                          <div className="flex flex-col gap-0.5">
                             <span className="text-xl font-black text-primary-600 tracking-tighter">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price * 0.65)}
                             </span>
                             <span className="text-xs text-gray-400 line-through font-bold opacity-60">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                             </span>
                          </div>
                       </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers - Optimized Product Cards */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Sản phẩm <span className="text-primary-MAIN">bán chạy</span></h2>
            <p className="text-slate-500 dark:text-dark-textSecondary font-medium mt-1">Sự lựa chọn của hàng nghìn khách hàng</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {bestSellers.map((product) => (
            <div key={product.id} className="hover:-translate-y-2 transition-transform duration-300">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Khuyến mãi - Banner phụ sạch sẽ */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-MAIN rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden group shadow-2xl shadow-primary-MAIN/20">
          <div className="relative z-10 max-w-xl">
            <span className="text-primary-100 font-bold tracking-widest uppercase text-sm">Chương trình đặc biệt</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 leading-none">Nâng cấp đời máy <br/> Trợ giá tới 2 triệu</h2>
            <button className="bg-white text-primary-MAIN px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-xl text-xs uppercase tracking-widest">
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
          <h2 className="text-2xl font-bold text-text-primary dark:text-white">Dành cho bạn</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
