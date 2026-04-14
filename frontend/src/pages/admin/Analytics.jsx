import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardAnalytics } from '../../store/slices/analyticsSlice'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package } from 'lucide-react'


const Analytics = () => {
  const dispatch = useDispatch()
  const { data, isLoading } = useSelector((state) => state.analytics)
  const [dateRange, setDateRange] = useState('30') // days

  useEffect(() => {
    dispatch(fetchDashboardAnalytics())
  }, [dispatch])

  const handleDateRangeChange = async (days) => {
    setDateRange(days)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(days))
    // In real implementation, would call fetchAnalytics with dates
  }

  if (isLoading || !data) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }

  const formatNumber = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <select
          value={dateRange}
          onChange={(e) => handleDateRangeChange(e.target.value)}
          className="input w-40"
        >
          <option value="7">7 ngày</option>
          <option value="30">30 ngày</option>
          <option value="90">90 ngày</option>
          <option value="365">1 năm</option>
        </select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(data.totalRevenue)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(data.totalOrders)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sản phẩm đã bán</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(data.totalProductsSold)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng người dùng</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(data.totalUsers)}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Chart */}
        <div className="card">
          <h3 className="text-lg font-bold mb-4">Doanh thu theo ngày</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(val) => new Date(val).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(val) => `${val / 1000000}M`}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('vi-VN')}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#4f46e5' }}
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="card">
          <h3 className="text-lg font-bold mb-4">Phân bố trạng thái đơn hàng</h3>
          <div className="space-y-3">
            {data.orderStatusCounts?.map((status) => (
              <div key={status.status}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">{status.status}</span>
                  <span className="text-sm font-medium">{formatNumber(status.count)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{
                      width: `${(status.count / data.totalOrders) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4">Top sản phẩm bán chạy</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Sản phẩm</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Đã bán</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {data.topProducts?.map((product, index) => (
                <tr key={product.productId} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                        {index + 1}
                      </span>
                      <span className="text-sm">{product.productName}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 text-sm">{formatNumber(product.quantitySold)}</td>
                  <td className="text-right py-3 px-4 text-sm font-medium">{formatCurrency(product.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Sales */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4">Doanh thu theo danh mục</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.categorySales?.map((category) => (
            <div key={category.categoryId} className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900">{category.categoryName}</p>
              <p className="text-lg font-bold text-primary-600 mt-1">{formatCurrency(category.revenue)}</p>
              <p className="text-xs text-gray-500 mt-1">{formatNumber(category.quantitySold)} đã bán</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex justify-end space-x-4">
        <button className="btn btn-secondary flex items-center">
          <TrendingDown className="h-4 w-4 mr-2" />
          Export CSV
        </button>
        <button className="btn btn-primary flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Export PDF
        </button>
      </div>
    </div>
  )
}

export default Analytics
