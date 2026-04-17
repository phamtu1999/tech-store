import { AlertCircle, Zap, TrendingUp, TrendingDown, Info, Activity } from 'lucide-react'

const DashboardInsights = ({ stats, isLoading }) => {
  if (isLoading) return <div className="bg-white p-6 rounded-[20px] border animate-pulse h-64 shadow-[0_8px_24px_rgba(0,0,0,0.05)]"></div>

  const insights = []

  // Revenue Insight
  const revGrowth = stats.revenueGrowth || 0;
  if (revGrowth > 0) {
    insights.push({
      type: 'success', icon: TrendingUp, title: 'Tăng trưởng Doanh thu',
      desc: `↑ Doanh thu của bạn đã tăng ${revGrowth.toFixed(1)}% so với hôm qua. Các chiến dịch đang hiệu quả!`,
      color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400'
    })
  } else if (revGrowth < 0) {
    insights.push({
      type: 'warning', icon: TrendingDown, title: 'Cảnh báo Doanh thu',
      desc: `↓ Doanh thu giảm ${Math.abs(revGrowth).toFixed(1)}% so với hôm qua. Hãy xem lại chiến dịch quảng cáo.`,
      color: 'text-rose-700 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-400'
    })
  }

  // Order Insight
  const orderGrowth = stats.orderGrowth || 0;
  if (orderGrowth > 0) {
    insights.push({
      type: 'success', icon: TrendingUp, title: 'Tăng trưởng Đơn hàng',
      desc: `↑ Số lượng đơn hàng tăng ${orderGrowth.toFixed(1)}% so với hôm qua. Tuyệt vời!`,
      color: 'text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
    })
  } else if (orderGrowth < 0) {
     insights.push({
      type: 'warning', icon: TrendingDown, title: 'Cảnh báo Đơn hàng',
      desc: `↓ Số lượng đơn hàng giảm ${Math.abs(orderGrowth).toFixed(1)}% so với hôm qua.`,
      color: 'text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400'
    })
  }

  // High Cancellation insight
  if (stats.cancellationRate > 15) {
    insights.push({
      type: 'critical',
      icon: AlertCircle,
      title: 'Tỷ lệ hủy đơn cao',
      desc: `Hiện đang ở mức ${stats.cancellationRate.toFixed(1)}%. Cần kiểm tra lại chất lượng hoặc quy trình xác nhận.`,
      color: 'text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-400'
    })
  }

  // Default if list is empty
  if (insights.length === 0) {
    insights.push({
        type: 'neutral',
        icon: Info,
        title: 'Hoạt động ổn định',
        desc: 'Chỉ số không có nhiều biến động so với hôm qua. Có thể cân nhắc thêm Flash Sale!',
        color: 'text-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-300'
    })
  }

  return (
    <div className="bg-white dark:bg-dark-card p-6 rounded-[20px] border border-gray-100 dark:border-dark-border shadow-[0_8px_24px_rgba(0,0,0,0.05)] h-full">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Zap className="h-5 w-5 text-orange-500 fill-orange-500" />
        AI Insights
      </h3>
      
      <div className="space-y-4">
        {insights.slice(0, 4).map((insight, i) => {
          const Icon = insight.icon
          return (
            <div key={i} className={`p-4 rounded-xl ${insight.color} flex gap-4 transition-transform duration-300 hover:scale-[1.02] cursor-default`}>
              <div className="pt-0.5"><Icon className="h-5 w-5" /></div>
              <div>
                <p className="font-bold text-sm tracking-tight">{insight.title}</p>
                <p className="text-xs font-medium opacity-90 mt-1 leading-relaxed">{insight.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DashboardInsights
