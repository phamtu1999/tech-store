import { Award, TrendingUp } from 'lucide-react'

const DashboardTopProducts = ({ products, isLoading }) => {
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)

  if (isLoading) {
    return <div className="bg-white dark:bg-dark-card p-6 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.05)] border animate-pulse h-96"></div>
  }

  return (
    <div className="bg-white dark:bg-dark-card p-6 rounded-[20px] border border-gray-100 dark:border-dark-border shadow-[0_8px_24px_rgba(0,0,0,0.05)] h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white">Top Sản Phẩm</h3>
          <p className="text-xs text-gray-500 font-medium">Bán chạy nhất 30 ngày qua</p>
        </div>
        <Award className="h-6 w-6 text-orange-500" />
      </div>

      <div className="space-y-6">
        {products.map((product, index) => (
          <div key={index} className="group cursor-default">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                  index === 0 ? 'bg-orange-100 text-orange-600' :
                  index === 1 ? 'bg-blue-100 text-blue-600' :
                  index === 2 ? 'bg-emerald-100 text-emerald-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  #{index + 1}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-orange-600 transition-colors line-clamp-1">{product.productName}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Đã bán: {product.totalSold} • {formatCurrency(product.totalRevenue)}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-gray-900">{product.contributionPercentage.toFixed(1)}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-100 dark:bg-dark-border h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-orange-500 h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110"
                style={{ width: `${product.contributionPercentage * 2}%` }} // Scale it slightly for visibility if low
              ></div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="py-20 text-center text-gray-400 text-sm font-medium">Chưa có dữ liệu sản phẩm</div>
        )}
      </div>

      <button className="w-full mt-8 py-3 border-2 border-gray-100 dark:border-dark-border rounded-2xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
        Xem báo cáo chi tiết
      </button>
    </div>
  )
}

export default DashboardTopProducts
