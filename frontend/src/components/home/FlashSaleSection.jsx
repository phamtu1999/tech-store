import { Link } from 'react-router-dom'
import { Clock, ArrowRight } from 'lucide-react'
import ProductCard from '../ProductCard'

const FlashSaleSection = ({ timeLeft, products }) => {
  return (
    <section className="animate-slide-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-12 h-[2px] bg-red-500"></span>
            <span className="text-red-500 font-black text-xs uppercase tracking-widest">Ưu đãi giới hạn</span>
          </div>
          <h2 className="text-4xl font-black text-secondary-800 dark:text-white tracking-tight flex items-center gap-3">
            GIỜ VÀNG <span className="text-primary-MAIN">CHỐT DEAL</span>
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 px-4 py-2 rounded-2xl border border-red-100 dark:border-red-500/20 ml-4 shadow-lg shadow-red-500/5">
              <Clock className="h-5 w-5 animate-pulse" />
              <span className="font-black text-lg">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </h2>
        </div>
        <Link to="/products" className="group flex items-center gap-2 text-secondary-800 dark:text-gray-400 font-bold hover:text-primary-MAIN transition-all">
          Xem tất cả deal
          <div className="bg-gray-100 dark:bg-white/5 p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-primary-500/20 transition-colors">
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products?.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default FlashSaleSection
