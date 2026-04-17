import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  PieChart, Pie, Cell, Legend, Label, BarChart, Bar
} from 'recharts'
import { useState } from 'react'

const DashboardCharts = ({ revenueHistory, statusDistribution, isLoading, userRole }) => {
  const isFinanceVisible = userRole === 'ROLE_ADMIN' || userRole === 'ROLE_SUPER_ADMIN'
  const [activeIndex, setActiveIndex] = useState(null);

  const COLORS = {
    DELIVERED: '#10b981', // Emerald 500
    CONFIRMED: '#3b82f6',  // Blue 500
    SHIPPED: '#8b5cf6',    // Violet 500
    SHIPPING: '#6366f1',   // Indigo 500
    PENDING: '#f97316',   // Orange 500 - Matches Orders
    REVIEWED: '#eab308',   // Yellow 500
    CANCELLED: '#ef4444',  // Red 500
  }

  const statusMap = {
    DELIVERED: 'Đã giao',
    PENDING: 'Chờ xử lý',
    CANCELLED: 'Đã hủy',
    CONFIRMED: 'Xác nhận',
    SHIPPED: 'Đang giao',
    SHIPPING: 'Đang chuyển',
    REVIEWED: 'Đã đánh giá'
  }

  const priority = ['DELIVERED', 'CONFIRMED', 'SHIPPED', 'SHIPPING', 'PENDING', 'REVIEWED', 'CANCELLED'];

  const pieData = Object.entries(statusDistribution || {})
    .sort((a, b) => priority.indexOf(a[0]) - priority.indexOf(b[0]))
    .map(([key, value]) => ({
      name: statusMap[key] || key,
      value: value,
      color: COLORS[key] || '#94a3b8'
    }))

  const totalOrders = pieData.reduce((acc, curr) => acc + curr.value, 0)

  const formatCurrency = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  }

  const formatFullCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const sortedHistory = [...(revenueHistory || [])].sort((a, b) => new Date(a.date) - new Date(b.date));

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-4">
          <p className="font-bold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {entry.name}: <span className="font-bold text-gray-900 dark:text-white">
                  {entry.name === 'Doanh thu' ? formatFullCurrency(entry.value) : entry.value}
                </span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-dark-card p-6 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.05)] border border-gray-100 animate-pulse h-64"></div>
            <div className="bg-white dark:bg-dark-card p-6 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.05)] border border-gray-100 animate-pulse h-64"></div>
        </div>
        <div className="bg-white dark:bg-dark-card p-6 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.05)] border border-gray-100 animate-pulse h-96"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Split Charts Section */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {isFinanceVisible && (
            <div className="bg-white dark:bg-dark-card p-6 rounded-[20px] border border-gray-100 dark:border-dark-border shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Doanh thu</h3>
                        <p className="text-xs text-gray-500 font-medium">30 ngày gần nhất</p>
                    </div>
                </div>
                
                <div className="h-64 w-full pr-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sortedHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="date" 
                                tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                                tickFormatter={(val) => val.split('-').slice(1).reverse().join('/')}
                                tickLine={false} axisLine={false} dy={10}
                            />
                            <YAxis 
                                tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} 
                                tickFormatter={formatCurrency} 
                                tickLine={false} axisLine={false} 
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area 
                                type="monotone" dataKey="revenue" name="Doanh thu" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" 
                                animationDuration={1000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )}

        {/* Orders Bar Chart */}
        <div className="bg-white dark:bg-dark-card p-6 rounded-[20px] border border-gray-100 dark:border-dark-border shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Số lượng đơn hàng</h3>
                    <p className="text-xs text-gray-500 font-medium">30 ngày gần nhất</p>
                </div>
            </div>
            
            <div className="h-64 w-full pr-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sortedHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                            tickFormatter={(val) => val.split('-').slice(1).reverse().join('/')}
                            tickLine={false} axisLine={false} dy={10}
                        />
                        <YAxis 
                            tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} 
                            tickLine={false} axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{fill: '#f1f5f9', opacity: 0.4}}/>
                        <Bar 
                            dataKey="orders" name="Số đơn" fill="#f97316" radius={[4, 4, 0, 0]} barSize={20}
                            animationDuration={1000}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

      </div>

      {/* Distribution Pie Chart */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-[20px] border border-gray-100 dark:border-dark-border shadow-[0_8px_24px_rgba(0,0,0,0.05)] flex flex-col h-full">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Trạng thái đơn hàng</h3>
        <p className="text-xs text-gray-500 font-medium mb-6">Tỷ lệ phân bổ đơn hàng</p>
        
        <div className="h-64 w-full relative flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                animationDuration={1000}
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    opacity={activeIndex === index || activeIndex === null ? 1 : 0.3}
                    className="transition-opacity duration-300 outline-none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-white leading-none">{totalOrders}</span>
            <span className="text-xs text-gray-500 font-medium mt-1 uppercase">Đơn hàng</span>
          </div>
        </div>

        {/* Custom Legend attached securely */}
        <div className="mt-8 flex-1 flex flex-col justify-center space-y-3">
          {pieData.map((item, i) => (
            <div 
                key={i} 
                className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                    activeIndex === i ? 'bg-gray-50 dark:bg-dark-bg scale-[1.02]' : 'hover:bg-gray-50 dark:hover:bg-dark-bg'
                }`}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}</span>
                <span className="text-xs font-medium text-gray-400">({((item.value / totalOrders) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardCharts
