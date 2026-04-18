import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById, clearCurrentProduct } from '../store/slices/productsSlice'
import { addToCart } from '../store/slices/cartSlice'
import { Star, ShoppingCart, Plus, Minus, CheckCircle, Truck, Shield, Store, ChevronRight, Gift, Zap, CreditCard, Award } from 'lucide-react'
import Toast from '../components/Toast'
import ReviewList from '../components/ReviewList'
import ReviewForm from '../components/ReviewForm'
import { addToRecentlyViewed } from '../components/RecentlyViewed'
import {
  getProductGalleryImages,
  getProductImageSources,
  handleProductImageError,
} from '../utils/productImageFallback'
import Product3DViewer from '../components/products/Product3DViewer'
import { Rotate3d } from 'lucide-react'

const ProductDetail = () => {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const { currentProduct, isLoading } = useSelector((state) => state.products)
  const { user } = useSelector((state) => state.auth)
  const [selectedImage, setSelectedImage] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [toast, setToast] = useState(null)
  const [show3D, setShow3D] = useState(false)
  
  const images = useMemo(
    () => (currentProduct ? getProductGalleryImages(currentProduct) : []),
    [currentProduct]
  )
  const { fallback: productImageFallback } = useMemo(
    () => getProductImageSources(currentProduct || {}),
    [currentProduct]
  )
  const currentVariant = currentProduct?.variants?.[0] || {}
  const price = currentVariant.price || 0
  const stockQuantity = currentVariant.stockQuantity || 0
  const brandName = currentProduct?.brand?.name || 'CHÍNH HÃNG'

  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch(fetchProductById(slug))
    return () => {
      dispatch(clearCurrentProduct())
    }
  }, [dispatch, slug])

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0])
    }
  }, [currentProduct, images])

  // Track recently viewed products
  useEffect(() => {
    if (currentProduct && currentProduct.id) {
      addToRecentlyViewed({
        id: currentProduct.id,
        name: currentProduct.name,
        slug: currentProduct.slug,
        imageUrls: images,
        variants: currentProduct.variants,
        rating: currentProduct.rating,
        reviewCount: currentProduct.reviewCount,
        soldCount: currentProduct.soldCount,
        discountPercentage: currentProduct.discountPercentage,
        isNew: currentProduct.isNew,
      })
    }
  }, [currentProduct, images])

  const handleAddToCart = () => {
    if (!currentVariant.id) return
    dispatch(
      addToCart({
        productId: currentProduct.id,
        variantId: currentVariant.id,
        quantity,
      })
    )
    setToast({ message: 'Đã thêm sản phẩm vào giỏ hàng thành công!', type: 'success' })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-MAIN"></div>
      </div>
    )
  }

  if (!currentProduct) {
    return (
      <div className="text-center py-40">
        <Store className="h-16 w-16 mx-auto text-gray-200 mb-4" />
        <h2 className="text-2xl font-bold text-gray-400">Không tìm thấy sản phẩm</h2>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
        <span className="hover:text-primary-MAIN cursor-pointer">Trang chủ</span>
        <ChevronRight className="h-3 w-3" />
        <span className="hover:text-primary-MAIN cursor-pointer">Sản phẩm</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-secondary-800 font-medium truncate">{currentProduct.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Image Gallery */}
        <div className="space-y-6 lg:sticky lg:top-32 h-fit">
          <div className="group relative aspect-square bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center p-4 transition-all hover:shadow-2xl">
            {show3D ? (
              <Product3DViewer type={
                currentProduct.category?.slug?.includes('laptop') ? 'laptop' : 
                (currentProduct.category?.slug?.includes('dong-ho') ? 'watch' : 'phone')
              } />
            ) : (
              <img
                src={selectedImage || images[0]}
                alt={currentProduct.name}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 p-8"
                onError={(e) => handleProductImageError(e, productImageFallback)}
              />
            )}
            <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
               {currentProduct.discountPercentage > 0 && (
                 <div className="bg-red-600 text-white font-black px-4 py-2 rounded-2xl shadow-xl shadow-red-500/30 animate-bounce">
                   GIẢM {currentProduct.discountPercentage}%
                 </div>
               )}
               <div className="bg-secondary-800/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-lg flex items-center gap-2">
                 <Award className="h-3 w-3 text-amber-400" />
                 SẢN PHẨM CAO CẤP
               </div>
            </div>

            {/* 3D Toggle Button */}
            <button 
              onClick={() => setShow3D(!show3D)}
              className={`absolute bottom-6 right-6 z-20 flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 ${show3D ? 'bg-primary-600 text-white glow-primary' : 'bg-white text-secondary-900 shadow-black/10'}`}
            >
              <Rotate3d className={`h-4 w-4 ${show3D ? 'animate-spin-slow' : ''}`} />
              {show3D ? 'Thoát 3D' : 'Xem 360°'}
            </button>
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-white ${
                    (selectedImage || images[0]) === img 
                      ? 'border-primary-MAIN shadow-lg ring-4 ring-primary-50 scale-105' 
                      : 'border-gray-100 hover:border-primary-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${currentProduct.name} ${idx + 1}`}
                    className="w-full h-full object-contain rounded-xl"
                    onError={(e) => handleProductImageError(e, productImageFallback)}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <span className="px-3 py-1 bg-secondary-900 text-white rounded-lg text-[10px] font-black tracking-widest uppercase">
                   {brandName}
                 </span>
                 {stockQuantity > 0 ? (
                   <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-black px-2.5 py-1 bg-emerald-50 rounded-lg uppercase tracking-wider">
                     <CheckCircle className="h-3 w-3" />
                     Còn hàng
                   </span>
                 ) : (
                   <span className="flex items-center gap-1 text-red-600 text-[10px] font-black px-2.5 py-1 bg-red-50 rounded-lg uppercase tracking-wider">
                     <X className="h-3 w-3" />
                     Hết hàng
                   </span>
                 )}
               </div>
               <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                  Mã SP: #TS-{currentProduct.id}
               </div>
            </div>
            
            <h1 className="text-4xl font-black text-secondary-900 leading-[1.1] tracking-tight">
              {currentProduct.name}
            </h1>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md">
                   <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                   <span className="text-amber-900 font-black">{currentProduct.rating?.toFixed(1) || '5.0'}</span>
                </div>
                <span className="text-gray-400 font-bold text-sm underline cursor-pointer hover:text-primary-600">
                   {currentProduct.reviewCount || 120} đánh giá
                </span>
              </div>
              <div className="h-4 w-[1px] bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-bold text-sm">Đã bán:</span>
                <span className="text-secondary-900 font-black pr-1 tracking-tighter text-lg">{currentProduct.soldCount || '1.2k+'}</span>
              </div>
              <div className="hidden lg:flex items-center gap-1 text-primary-600 animate-pulse">
                 <Zap className="h-4 w-4 fill-current" />
                 <span className="text-[10px] font-black uppercase tracking-wider">Sắp cháy hàng</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             {/* Variants Mockup */}
             <div className="space-y-3">
                <p className="text-xs font-black text-secondary-800 uppercase tracking-widest">Chọn dung lượng:</p>
                <div className="flex flex-wrap gap-3">
                   {['256GB', '512GB', '1TB'].map((v, i) => (
                      <button key={v} className={`px-6 py-3 rounded-xl font-bold text-sm border-2 transition-all ${i === 0 ? 'border-primary-MAIN bg-primary-50 text-primary-MAIN' : 'border-gray-100 hover:border-gray-300 text-gray-400'}`}>
                         {v}
                      </button>
                   ))}
                </div>
             </div>
             
             <div className="space-y-3">
                <p className="text-xs font-black text-secondary-800 uppercase tracking-widest">Chọn màu sắc:</p>
                <div className="flex flex-wrap gap-3">
                   {['Titan Tự Nhiên', 'Xanh Titan', 'Đen Titan'].map((v, i) => (
                      <button key={v} className={`px-5 py-2.5 rounded-xl font-bold text-[13px] border-2 transition-all flex items-center gap-2 ${i === 0 ? 'border-primary-MAIN bg-primary-50 text-primary-MAIN' : 'border-gray-100 hover:border-gray-300 text-gray-400'}`}>
                         <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-amber-700' : (i === 1 ? 'bg-blue-800' : 'bg-gray-800')}`}></div>
                         {v}
                      </button>
                   ))}
                </div>
             </div>
          </div>

          <div className="price-box bg-white p-2 rounded-[2rem] space-y-1">
            <div className="flex items-end gap-4">
              <p className="text-5xl font-black text-primary-MAIN tracking-tighter leading-none">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(price)}
              </p>
              {currentProduct.originalPrice > price ? (
                 <div className="flex flex-col mb-1">
                    <span className="text-gray-400 line-through font-bold text-lg opacity-60">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentProduct.originalPrice)}
                    </span>
                    <span className="text-red-600 font-black text-xs uppercase tracking-widest">
                       Tiết kiệm {Math.round(((currentProduct.originalPrice - price) / currentProduct.originalPrice) * 100)}%
                    </span>
                 </div>
              ) : (
                <div className="flex flex-col mb-1 text-gray-400 font-bold text-sm italic">Giá đã bao gồm VAT</div>
              )}
            </div>
          </div>

          {/* Offers Block - NEW */}
          <div className="bg-amber-50 rounded-3xl border-2 border-amber-100 p-6 space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-primary-600" />
                <h3 className="font-black text-amber-900 uppercase text-xs tracking-widest">Đặc quyền mua hàng</h3>
             </div>
             <div className="space-y-3">
                <div className="flex items-start gap-3">
                   <div className="bg-white p-1.5 rounded-lg shadow-sm mt-0.5"><Zap className="h-3 w-3 text-amber-600" /></div>
                   <p className="text-sm font-semibold text-amber-800">Tặng Voucher giảm 20% cho lần mua phụ kiện tiếp theo</p>
                </div>
                <div className="flex items-start gap-3">
                   <div className="bg-white p-1.5 rounded-lg shadow-sm mt-0.5"><CreditCard className="h-3 w-3 text-amber-600" /></div>
                   <p className="text-sm font-semibold text-amber-800">Giảm thêm 1.000.000đ khi thanh toán qua thẻ TPBank</p>
                </div>
                <div className="flex items-start gap-3">
                   <div className="bg-white p-1.5 rounded-lg shadow-sm mt-0.5"><Award className="h-3 w-3 text-amber-600" /></div>
                   <p className="text-sm font-semibold text-amber-800">Ưu đãi Thu cũ Đổi mới trợ giá lên đến 2.000.000đ</p>
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <div className="flex gap-4">
               <div className="qty-box flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100 h-[64px] w-40 justify-between px-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl hover:bg-gray-100 transition-colors text-secondary-800 shadow-sm disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-xl font-black text-secondary-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl hover:bg-gray-100 transition-colors text-secondary-800 shadow-sm disabled:opacity-30"
                    disabled={quantity >= stockQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
               </div>
               
               <button
                  onClick={handleAddToCart}
                  disabled={stockQuantity === 0}
                  className="flex-1 h-[64px] rounded-2xl flex items-center justify-center gap-3 border-2 border-primary-MAIN text-primary-MAIN font-black text-sm hover:bg-primary-50 transition-all uppercase tracking-widest no-hover-scale"
               >
                  <ShoppingCart className="h-5 w-5" />
                  Thêm vào giỏ
               </button>
            </div>

            <button
              onClick={() => {
                handleAddToCart()
                navigate('/checkout')
              }}
              disabled={stockQuantity === 0}
              className="w-full bg-primary-MAIN h-[72px] rounded-2xl flex flex-col items-center justify-center text-white shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale no-hover-scale"
            >
              <span className="font-black text-xl tracking-wide">MUA NGAY</span>
              <span className="text-[10px] font-bold opacity-80 uppercase">Giao hàng tận nơi hoặc Nhận tại cửa hàng</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-8 mt-4">
             <div className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-gray-50 shadow-sm">
                <Shield className="h-5 w-5 text-primary-MAIN" />
                <span className="text-[10px] font-black text-secondary-800 uppercase tracking-tight text-center">Bảo hành 12th</span>
             </div>
             <div className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Truck className="h-5 w-5 text-primary-MAIN" />
                <span className="text-[10px] font-black text-secondary-800 uppercase tracking-tight text-center">Giao nhanh 2h</span>
             </div>
             <div className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-gray-50 shadow-sm">
                <CheckCircle className="h-5 w-5 text-primary-MAIN" />
                <span className="text-[10px] font-black text-secondary-800 uppercase tracking-tight text-center">CHÍNH HÃNG 100%</span>
             </div>
          </div>
        </div>
        </div>

      {/* Tabs Section */}
      <div className="mt-24 space-y-12">
        <div className="flex items-center justify-center">
          <div className="bg-gray-100 p-1.5 rounded-2xl flex flex-wrap items-center gap-1">
            <button 
              onClick={() => setActiveTab('description')}
              className={`px-6 md:px-8 py-3 text-sm md:text-base font-black transition-all rounded-xl ${activeTab === 'description' ? 'bg-white text-secondary-900 shadow-sm' : 'text-gray-500 hover:text-secondary-900'}`}
            >
              Mô tả sản phẩm
            </button>
            <button 
              onClick={() => setActiveTab('specifications')}
              className={`px-6 md:px-8 py-3 text-sm md:text-base font-black transition-all rounded-xl ${activeTab === 'specifications' ? 'bg-white text-secondary-900 shadow-sm' : 'text-gray-500 hover:text-secondary-900'}`}
            >
              Thông số kỹ thuật
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`px-6 md:px-8 py-3 text-sm md:text-base font-black transition-all rounded-xl ${activeTab === 'reviews' ? 'bg-white text-secondary-900 shadow-sm' : 'text-gray-500 hover:text-secondary-900'}`}
            >
              Đánh giá ({currentProduct.reviewCount || 120})
            </button>
          </div>
        </div>

        <div className="max-w-[900px] mx-auto min-h-[400px]">
          {activeTab === 'description' && (
            <div className="description text-lg text-gray-700 leading-loose space-y-8 animate-fade-in">
              <div className="prose prose-orange max-w-none prose-p:font-medium">
                 {currentProduct.description}
              </div>
              <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 flex items-center justify-between">
                 <div>
                    <h4 className="font-black text-secondary-900 mb-1">Bạn cần tư vấn thêm?</h4>
                    <p className="text-sm text-gray-500 font-bold">Để lại số điện thoại, chúng tôi sẽ gọi lại ngay!</p>
                 </div>
                 <button className="bg-secondary-900 text-white px-8 py-3 rounded-full font-black text-sm hover:bg-black transition-all">GỌI CHO TÔI</button>
              </div>
            </div>
          )}
          {activeTab === 'specifications' && (
             <div className="animate-fade-in max-w-3xl mx-auto">
                <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                  <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                    <h3 className="text-xl font-black text-secondary-900 uppercase tracking-tight">Thông số chi tiết</h3>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{currentProduct.name}</div>
                  </div>
                  <table className="w-full text-sm">
                     <tbody>
                        {[
                           { icon: <Store className="h-4 w-4 text-gray-400" />, label: 'Thương hiệu', value: brandName },
                           { icon: <Zap className="h-4 w-4 text-gray-400" />, label: 'Dung lượng', value: '256GB' },
                           { icon: <Star className="h-4 w-4 text-gray-400" />, label: 'Màu sắc', value: 'Titan Tự Nhiên' },
                           { icon: <CheckCircle className="h-4 w-4 text-gray-400" />, label: 'Bản quốc tế', value: 'Có' },
                           { icon: <Shield className="h-4 w-4 text-gray-400" />, label: 'Bảo hành', value: '12 Tháng' },
                           { icon: <Award className="h-4 w-4 text-gray-400" />, label: 'Tình trạng', value: 'Mới 100%' }
                        ].map((item, idx) => (
                           <tr key={item.label} className="group hover:bg-gray-50/80 transition-colors border-b border-gray-50 last:border-0">
                              <td className="py-5 px-8 w-1/3">
                                 <div className="flex items-center gap-3">
                                   {item.icon}
                                   <span className="font-bold text-gray-500 border-b border-transparent group-hover:border-gray-300 transition-colors">{item.label}</span>
                                 </div>
                              </td>
                              <td className="py-5 px-8 font-black text-secondary-900">{item.value}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                </div>
             </div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-12 animate-fade-in">
              {user && <ReviewForm productId={currentProduct.id} />}
              <ReviewList productId={currentProduct.id} />
            </div>
          )}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default ProductDetail
