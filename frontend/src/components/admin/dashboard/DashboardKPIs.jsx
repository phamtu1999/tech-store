import { DollarSign, ShoppingCart, Users, TrendingUp, TrendingDown, CreditCard, Activity, AlertTriangle } from 'lucide-react'

const DashboardKPIs = ({ data, isLoading, userRole }) => {
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  const isFinanceVisible = userRole === 'ROLE_ADMIN' || userRole === 'ROLE_SUPER_ADMIN'

  const kpis = isFinanceVisible ? [
    {
      title: "Doanh thu hôm nay",
      value: formatCurrency(data.todayRevenue || 0),
      growth: data.revenueGrowth,
      icon: DollarSign,
      color: "bg-emerald-500",
      context: "so với hôm qua"
    },
    {
      title: "Đơn hàng hôm nay",
      value: `${data.todayOrders || 0} đơn`,
      growth: data.orderGrowth,
      icon: ShoppingCart,
      color: "bg-orange-500",
      context: "so với hôm qua"
    },
    {
      title: "Tỷ lệ chuyển đổi",
      value: `${((data.totalCustomers > 0 ? ((data.todayOrders || 0) / data.totalCustomers) : 0) * 100).toFixed(1)}%`,
      label: "Tỷ lệ mua hàng",
      icon: Activity,
      color: "bg-blue-500",
    },
    {
      title: "Giá trị đơn (AOV)",
      value: formatCurrency(data.averageOrderValue || 0),
      label: "Trung bình đơn",
      icon: Activity,
      color: "bg-purple-500",
    }
  ] : [
    {
      title: "Đơn hàng hôm nay",
      value: `${data.todayOrders || 0} đơn`,
      growth: data.orderGrowth,
      icon: ShoppingCart,
      color: "bg-orange-500",
      context: "so với hôm qua"
    },
    {
      title: "Tổng số khách hàng",
      value: `${data.totalCustomers || 0} người`,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Sắp hết hàng",
      value: `${data.lowStockProducts?.length || 0} sản phẩm`,
      icon: AlertTriangle,
      color: "bg-rose-500",
      label: "Cần nhập kho"
    },
    {
      title: "Tỷ lệ hủy đơn",
      value: `${(data.cancellationRate || 0).toFixed(1)}%`,
      icon: TrendingDown,
      color: "bg-purple-500",
    }
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border animate-pulse h-32"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        const isPositive = kpi.growth >= 0
        
        return (
          <div key={index} className="bg-white dark:bg-dark-card p-5 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-300 group overflow-hidden relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`${kpi.color} p-3 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="h-6 w-6" />
              </div>
              {kpi.growth !== undefined && (
                <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                  isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(kpi.growth).toFixed(1)}%
                </div>
              )}
            </div>
            
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{kpi.title}</p>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">{kpi.value}</h3>
              {kpi.context && (
                <p className="text-[10px] text-gray-400 font-medium mt-1">{kpi.context}</p>
              )}
              {kpi.label && (
                <p className="text-[10px] text-gray-400 font-medium mt-1">{kpi.label}</p>
              )}
            </div>
            
            {/* Background pattern */}
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Icon className="h-24 w-24" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DashboardKPIs
