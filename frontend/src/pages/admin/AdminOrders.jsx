import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrders } from '../../store/slices/ordersSlice'
import { ordersAPI } from '../../api/orders'
import AdminTable from '../../components/admin/AdminTable'
import { Search, Filter } from 'lucide-react'

const AdminOrders = () => {
  const dispatch = useDispatch()
  const { orders, isLoading } = useSelector((state) => state.orders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    dispatch(fetchAllOrders({ page: 0, size: 100 }))
  }, [dispatch])

  const orderColumns = [
    { key: 'orderNumber', label: 'Mã đơn hàng' },
    { key: 'recipientName', label: 'Khách hàng' },
    { key: 'recipientPhone', label: 'SĐT' },
    { key: 'totalAmount', label: 'Tổng tiền', render: (value) => 
      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
    },
    { key: 'status', label: 'Trạng thái', render: (value) => (
      <select
        value={value}
        onChange={(e) => handleStatusChange(e.target.value)}
        className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
          value === 'DELIVERED' ? 'bg-green-100 text-green-800' :
          value === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
          value === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
          value === 'SHIPPED' ? 'bg-indigo-100 text-indigo-800' :
          value === 'CANCELLED' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}
      >
        <option value="PENDING">Chờ xử lý</option>
        <option value="CONFIRMED">Đã xác nhận</option>
        <option value="PROCESSING">Đang xử lý</option>
        <option value="SHIPPED">Đang giao</option>
        <option value="DELIVERED">Đã giao</option>
        <option value="CANCELLED">Đã hủy</option>
        <option value="REFUNDED">Đã hoàn tiền</option>
      </select>
    )},
    { key: 'createdAt', label: 'Ngày tạo', render: (value) => 
      new Date(value).toLocaleDateString('vi-VN')
    },
  ]

  const handleStatusChange = async (newStatus) => {
    // Trong thực tế sẽ gọi API để cập nhật trạng thái
    console.log('Update status to:', newStatus)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      dispatch(fetchAllOrders({ page: 0, size: 100 }))
    }
  }

  const filteredOrders = orders.filter(order => {
    if (statusFilter && order.status !== statusFilter) return false
    if (searchTerm && !order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.recipientName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-80"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Tìm kiếm
            </button>
          </form>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-48"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="PROCESSING">Đang xử lý</option>
            <option value="SHIPPED">Đang giao</option>
            <option value="DELIVERED">Đã giao</option>
            <option value="CANCELLED">Đã hủy</option>
            <option value="REFUNDED">Đã hoàn tiền</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <AdminTable
          columns={orderColumns}
          data={filteredOrders}
        />
      )}

      {/* Order Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-600">Chờ xử lý</p>
          <p className="text-2xl font-bold text-yellow-600">
            {filteredOrders.filter(o => o.status === 'PENDING').length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Đang giao</p>
          <p className="text-2xl font-bold text-blue-600">
            {filteredOrders.filter(o => o.status === 'SHIPPED').length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Đã giao</p>
          <p className="text-2xl font-bold text-green-600">
            {filteredOrders.filter(o => o.status === 'DELIVERED').length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Đã hủy</p>
          <p className="text-2xl font-bold text-red-600">
            {filteredOrders.filter(o => o.status === 'CANCELLED').length}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminOrders
