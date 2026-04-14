import { useEffect, useState } from 'react'
import StatCard from '../../components/admin/StatCard'
import AdminTable from '../../components/admin/AdminTable'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  DollarSign
} from 'lucide-react'
import { analyticsAPI } from '../../api/analytics'
import { ordersAPI } from '../../api/orders'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })

  const [recentOrders, setRecentOrders] = useState([])

  const orderColumns = [
    { key: 'orderNumber', label: 'Mã đơn hàng' },
    { key: 'customer', label: 'Khách hàng' },
    { key: 'totalAmount', label: 'Tổng tiền', render: (value) => 
      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
    },
    { key: 'status', label: 'Trạng thái', render: (value) => (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        value === 'DELIVERED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
        value === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
        value === 'CANCELLED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      }`}>
        {value === 'PENDING' ? 'Chờ xử lý' :
         value === 'CONFIRMED' ? 'Đã xác nhận' :
         value === 'SHIPPED' ? 'Đang giao' :
         value === 'DELIVERED' ? 'Đã giao' :
         value === 'CANCELLED' ? 'Đã hủy' : value}
      </span>
    )},
    { key: 'createdAt', label: 'Ngày tạo', render: (value) => 
      new Date(value).toLocaleDateString('vi-VN')
    },
  ]

  const [isLoading, setIsLoading] = useState(true)

  // Fetch real data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const [analyticsRes, ordersRes] = await Promise.all([
          analyticsAPI.getDashboardStats(),
          ordersAPI.getAllOrders({ page: 0, size: 5 })
        ])

        const analytics = analyticsRes.data
        const orders = ordersRes.data.data

        setStats({
          totalProducts: analytics.totalProductsSold || 0,
          totalOrders: analytics.totalOrders || 0,
          totalUsers: analytics.totalUsers || 0,
          totalRevenue: analytics.totalRevenue || 0,
          orderStatusCounts: analytics.orderStatusCounts || [],
          topProducts: analytics.topProducts || []
        })

        setRecentOrders(orders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customer: order.recipientName,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt
        })))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-MAIN"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng sản phẩm"
          value={stats.totalProducts}
          change={12}
          icon={Package}
          color="orange"
        />
        <StatCard
          title="Tổng đơn hàng"
          value={stats.totalOrders}
          change={8}
          icon={ShoppingCart}
          color="green"
        />
        <StatCard
          title="Người dùng"
          value={stats.totalUsers}
          change={15}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Doanh thu"
          value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue)}
          change={23}
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text mb-4">Đơn hàng gần đây</h2>
        <AdminTable
          columns={orderColumns}
          data={recentOrders}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-text-primary dark:text-dark-text mb-4">Đơn hàng theo trạng thái</h3>
          <div className="space-y-4">
            {stats.orderStatusCounts?.length > 0 ? (
              stats.orderStatusCounts.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-text-secondary">
                      {item.status === 'PENDING' ? 'Chờ xử lý' :
                       item.status === 'CONFIRMED' ? 'Đã xác nhận' :
                       item.status === 'SHIPPED' ? 'Đang giao' :
                       item.status === 'DELIVERED' ? 'Đã giao' :
                       item.status === 'CANCELLED' ? 'Đã hủy' : item.status}
                    </span>
                    <span className="font-bold text-text-primary dark:text-dark-text">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        item.status === 'DELIVERED' ? 'bg-green-500' :
                        item.status === 'PENDING' ? 'bg-yellow-500' :
                        item.status === 'CANCELLED' ? 'bg-red-500' : 'bg-blue-500'
                      }`} 
                      style={{ width: `${Math.min(100, (item.count / (stats.totalOrders || 1)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
                <p className="text-sm text-text-secondary text-center py-4">Chưa có dữ liệu đơn hàng</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-text-primary dark:text-dark-text mb-4">Sản phẩm bán chạy</h3>
          <div className="space-y-4">
            {stats.topProducts?.length > 0 ? (
              stats.topProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors duration-200">
                  <div className="h-12 w-12 bg-gray-200 dark:bg-dark-border rounded-xl flex items-center justify-center">
                    <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📦'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text-primary dark:text-dark-text">{product.productName}</p>
                    <p className="text-sm text-text-secondary">Đã bán: {product.quantitySold}</p>
                  </div>
                  <p className="font-bold text-primary-MAIN">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.revenue)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-secondary text-center py-4">Chưa có dữ liệu sản phẩm</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
