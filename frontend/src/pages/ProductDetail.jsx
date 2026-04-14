import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById, clearCurrentProduct } from '../store/slices/productsSlice'
import { addToCart } from '../store/slices/cartSlice'
import { Star, ShoppingCart, Plus, Minus, CheckCircle, Truck, Shield, Store, ChevronRight } from 'lucide-react'
import ReviewList from '../components/ReviewList'
import ReviewForm from '../components/ReviewForm'

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentProduct, isLoading } = useSelector((state) => state.products)
  const { user } = useSelector((state) => state.auth)
  const [selectedImage, setSelectedImage] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  
  const images = currentProduct?.images && currentProduct.images.length > 0 
    ? currentProduct.images 
    : [currentProduct?.imageUrl || 'https://via.placeholder.com/800x800?text=No+Image']

  useEffect(() => {
    dispatch(fetchProductById(id))
    return () => {
      dispatch(clearCurrentProduct())
    }
  }, [dispatch, id])

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0])
    }
  }, [currentProduct])

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: currentProduct.id,
        quantity,
      })
    )
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
        <div className="space-y-6">
          <div className="group relative aspect-square bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center p-8">
            <img
              src={selectedImage || images[0]}
              alt={currentProduct.name}
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
            />
            {currentProduct.discountPercentage > 0 && (
              <div className="absolute top-6 left-6 bg-red-500 text-white font-black px-4 py-2 rounded-2xl shadow-xl shadow-red-500/30">
                -{currentProduct.discountPercentage}%
              </div>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 px-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-white ${
                    (selectedImage || images[0]) === img 
                      ? 'border-primary-MAIN shadow-lg ring-2 ring-primary-100 scale-105' 
                      : 'border-gray-50 hover:border-primary-200'
                  }`}
                >
                  <img src={img} alt={`${currentProduct.name} ${idx + 1}`} className="w-full h-full object-contain rounded-xl" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-secondary-800 text-white rounded-lg text-[10px] font-black tracking-widest uppercase">
                {currentProduct.brand || 'CHÍNH HÃNG'}
              </span>
              {currentProduct.quantity > 0 && (
                <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold px-2 py-1 bg-emerald-50 rounded-lg">
                  <CheckCircle className="h-3 w-3" />
                  Còn hàng
                </span>
              )}
            </div>
            
            <h1 className="text-4xl font-black text-secondary-800 leading-tight tracking-tight">
              {currentProduct.name}
            </h1>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-100">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="text-amber-800 font-black text-lg">{currentProduct.rating?.toFixed(1) || '5.0'}</span>
                <span className="text-amber-400 font-medium">|</span>
                <span className="text-amber-800/60 font-bold text-sm">{currentProduct.reviewCount || 0} đánh giá</span>
              </div>
              <div className="h-4 w-[1px] bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Đã bán:</span>
                <span className="text-secondary-800 font-black tracking-tighter">{currentProduct.soldCount || 0}</span>
              </div>
            </div>
          </div>

          <div className="price-box bg-gradient-to-br from-[#fff5f0] to-[#ffe9e0] p-8 rounded-[32px] border border-orange-100/50 space-y-2 shadow-sm">
            <div className="flex items-center gap-4">
              <p className="text-5xl font-black text-[#ff4d00] tracking-tighter">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(currentProduct.price)}
              </p>
              {currentProduct.originalPrice > currentProduct.price && (
                <div className="bg-red-500 text-white text-xs font-black px-2 py-1 rounded-lg shadow-lg shadow-red-500/20">
                  -{currentProduct.discountPercentage}%
                </div>
              )}
            </div>
            {currentProduct.originalPrice > currentProduct.price && (
              <p className="text-gray-400 line-through font-medium text-lg ml-1">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(currentProduct.originalPrice)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-primary-MAIN transition-colors">
                <Shield className="h-6 w-6 text-primary-MAIN" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Bảo hành 12th</span>
             </div>
             <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-primary-MAIN transition-colors">
                <Truck className="h-6 w-6 text-primary-MAIN" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Giao nhanh 2h</span>
             </div>
             <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-primary-MAIN transition-colors">
                <CheckCircle className="h-6 w-6 text-primary-MAIN" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Chính hãng</span>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
            <div className="qty-box flex items-center bg-white p-1 rounded-full border border-gray-200 shadow-sm h-16 w-full sm:w-48 justify-between px-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                disabled={quantity <= 1}
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="text-xl font-black text-secondary-800">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(currentProduct.quantity, quantity + 1))}
                className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                disabled={quantity >= currentProduct.quantity}
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={currentProduct.quantity === 0}
              className="flex-1 w-full bg-gradient-to-r from-[#ff7a00] to-[#ff4d00] h-16 rounded-full flex items-center justify-center gap-4 text-white font-black text-lg shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale no-hover-scale"
            >
              <ShoppingCart className="h-6 w-6" />
              {currentProduct.quantity === 0 ? 'HẾT HÀNG' : 'THÊM VÀO GIỎ HÀNG'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-24 space-y-12">
        <div className="flex items-center justify-center gap-12 border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('description')}
            className={`pb-4 text-lg font-bold transition-all relative ${activeTab === 'description' ? 'text-secondary-800' : 'text-gray-400 hover:text-secondary-800'}`}
          >
            Mô tả sản phẩm
            {activeTab === 'description' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-MAIN rounded-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-lg font-bold transition-all relative ${activeTab === 'reviews' ? 'text-secondary-800' : 'text-gray-400 hover:text-secondary-800'}`}
          >
            Đánh giá ({currentProduct.reviewCount || 0})
            {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-MAIN rounded-full"></div>}
          </button>
        </div>

        <div className="max-w-[800px] mx-auto min-h-[400px]">
          {activeTab === 'description' ? (
            <div className="description text-lg text-gray-600 leading-loose space-y-6">
              <p>{currentProduct.description}</p>
            </div>
          ) : (
            <div className="space-y-12">
              {user && <ReviewForm productId={currentProduct.id} />}
              <ReviewList currentProduct={currentProduct} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

