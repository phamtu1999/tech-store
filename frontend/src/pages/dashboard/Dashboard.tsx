import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import StatCard from '../../components/dashboard/StatCard'
import Table from '../../components/ui/Table'
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react'

interface Order {
  id: number
  orderNumber: string
  customer: string
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  createdAt: string
}

interface Stats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })

  const [recentOrders, setRecentOrders] = useState<Order[]>([])

  const orderColumns = [
    { key: 'orderNumber', label: 'Mã đơn hàng' },
    { key: 'customer', label: 'Khách hàng' },
    { 
      key: 'totalAmount', 
      label: 'Tổng tiền', 
      render: (value: number) => 
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
    },
    { 
      key: 'status', 
      label: 'Trạng thái', 
      render: (value: string) => {
        const statusMap = {
          PENDING: { text: 'Chờ xử lý', className: 'badge-warning' },
          CONFIRMED: { text: 'Đã xác nhận', className: 'badge-info' },
          SHIPPED: { text: 'Đang giao', className: 'badge-info' },
          DELIVERED: { text: 'Đã giao', className: 'badge-success' },
          CANCELLED: { text: 'Đã hủy', className: 'badge-error' },
        }
        const status = statusMap[value as keyof typeof statusMap] || statusMap.PENDING
        return <span className={`badge ${status.className}`}>{status.text}</span>
      }
    },
    { 
      key: 'createdAt', 
      label: 'Ngày tạo', 
      render: (value: string) => new Date(value).toLocaleDateString('vi-VN')
    },
  ]

  useEffect(() => {
    // Mock data - Trong thực tế sẽ gọi API
    setStats({
      totalProducts: 156,
      totalOrders: 1243,
      totalUsers: 892,
      totalRevenue: 456780000,
    })

    setRecentOrders([
      { id: 1, orderNumber: 'ORD20240113001', customer: 'Nguyễn Văn A', totalAmount: 2500000, status: 'DELIVERED', createdAt: '2024-01-13' },
      { id: 2, orderNumber: 'ORD20240113002', customer: 'Trần Thị B', totalAmount: 1800000, status: 'SHIPPED', createdAt: '2024-01-13' },
      { id: 3, orderNumber: 'ORD20240113003', customer: 'Lê Văn C', totalAmount: 5200000, status: 'PENDING', createdAt: '2024-01-12' },
      { id: 4, orderNumber: 'ORD20240112001', customer: 'Phạm Thị D', totalAmount: 950000, status: 'DELIVERED', createdAt: '2024-01-12' },
      { id: 5, orderNumber: 'ORD20240112002', customer: 'Hoàng Văn E', totalAmount: 3200000, status: 'CANCELLED', createdAt: '2024-01-12' },
    ])
  }, [])

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Tổng sản phẩm"
          value={stats.totalProducts}
          change={12}
          icon={Package}
          color="orange"
          index={0}
        />
        <StatCard
          title="Tổng đơn hàng"
          value={stats.totalOrders}
          change={8}
          icon={ShoppingCart}
          color="green"
          index={1}
        />
        <StatCard
          title="Người dùng"
          value={stats.totalUsers}
          change={15}
          icon={Users}
          color="blue"
          index={2}
        />
        <StatCard
          title="Doanh thu"
          value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue)}
          change={23}
          icon={DollarSign}
          color="purple"
          index={3}
        />
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text mb-4">Đơn hàng gần đây</h2>
        <Table
          columns={orderColumns}
          data={recentOrders}
        />
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="card">
          <h3 className="text-lg font-bold text-text-primary dark:text-dark-text mb-4">Đơn hàng theo trạng thái</h3>
          <div className="space-y-4">
            {[
              { label: 'Chờ xử lý', value: 45, percentage: 35, color: 'bg-warning-DEFAULT' },
              { label: 'Đang giao', value: 28, percentage: 22, color: 'bg-info-DEFAULT' },
              { label: 'Đã giao', value: 52, percentage: 40, color: 'bg-success-DEFAULT' },
              { label: 'Đã hủy', value: 5, percentage: 4, color: 'bg-error-DEFAULT' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-text-secondary">{item.label}</span>
                  <span className="font-bold text-text-primary dark:text-dark-text">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.8 + index * 0.1, ease: 'easeOut' }}
                    className={`${item.color} h-2 rounded-full`}
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-text-primary dark:text-dark-text mb-4">Sản phẩm bán chạy</h3>
          <div className="space-y-4">
            {[
              { name: 'iPhone 15 Pro Max', sold: 156, price: 32990000, emoji: '📱' },
              { name: 'MacBook Air M3', sold: 98, price: 28990000, emoji: '💻' },
              { name: 'Samsung Galaxy S24', sold: 87, price: 24990000, emoji: '📲' },
            ].map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors duration-200 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="h-12 w-12 bg-gray-200 dark:bg-dark-border rounded-xl flex items-center justify-center">
                  <span className="text-2xl">{product.emoji}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-primary dark:text-dark-text">{product.name}</p>
                  <p className="text-sm text-text-secondary">Đã bán: {product.sold}</p>
                </div>
                <p className="font-bold text-primary-main">
                  {new Intl.NumberFormat('vi-VN').format(product.price)}₫
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
