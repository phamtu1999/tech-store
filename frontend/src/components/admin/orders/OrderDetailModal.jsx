import { X, CheckCircle, Truck, Package, XCircle } from 'lucide-react'

const OrderDetailModal = ({ 
  order, 
  onClose, 
  onStatusChange, 
  onCancel, 
  isUpdating,
  getStatusLabel,
  getStatusIcon
}) => {
  if (!order) return null

  const formatFullCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-card rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white dark:bg-dark-card border-b dark:border-dark-border px-8 py-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Chi tiết đơn <span className="text-primary-600">{order.orderNumber}</span>
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
              Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-8">
          {/* Status & Actions Section */}
          <div className="flex flex-wrap gap-6 items-center justify-between bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Trạng thái hiện tại</p>
              <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider ${
                order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                order.status === 'SHIPPING' ? 'bg-indigo-100 text-indigo-700' :
                order.status === 'REVIEWED' ? 'bg-orange-100 text-orange-700' :
                order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {getStatusIcon(order.status)}
                {getStatusLabel(order.status)}
              </span>
            </div>

            {/* Transition Actions */}
            {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
              <div className="flex flex-wrap gap-2">
                {order.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => onStatusChange(order.id, order.status, 'CONFIRMED')}
                      disabled={isUpdating}
                      className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary-500/20"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Xác nhận đơn
                    </button>
                    <button
                      onClick={() => onCancel(order)}
                      disabled={isUpdating}
                      className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      Hủy đơn
                    </button>
                  </>
                )}
                {order.status === 'CONFIRMED' && (
                  <>
                    <button
                      onClick={() => onStatusChange(order.id, order.status, 'SHIPPING')}
                      disabled={isUpdating}
                      className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary-500/20"
                    >
                      <Truck className="w-4 h-4" />
                      Ghi vận đơn
                    </button>
                    <button
                      onClick={() => onCancel(order)}
                      disabled={isUpdating}
                      className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      Hủy đơn
                    </button>
                  </>
                )}
                {order.status === 'SHIPPING' && (
                  <>
                    <button
                      onClick={() => onStatusChange(order.id, order.status, 'DELIVERED')}
                      disabled={isUpdating}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-green-500/20"
                    >
                      <Package className="w-4 h-4" />
                      Giao hàng thành công
                    </button>
                    <button
                      onClick={() => onCancel(order)}
                      disabled={isUpdating}
                      className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      Hủy đơn
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Info Grids */}
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary-600 border-b border-gray-100 dark:border-dark-border pb-2">Thông tin khách hàng</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[10px] font-black uppercase text-gray-400">Họ tên</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{order.receiverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] font-black uppercase text-gray-400">Số điện thoại</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{order.receiverPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] font-black uppercase text-gray-400">Email</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{order.receiverEmail || '---'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary-600 border-b border-gray-100 dark:border-dark-border pb-2">Vận chuyển & Ghi chú</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Địa chỉ giao hàng</span>
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-relaxed">{order.shippingAddress}</p>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Ghi chú từ khách</span>
                  <p className="text-sm font-bold text-gray-500 italic">"{order.note || 'Không có ghi chú'}"</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Items List */}
          <div className="space-y-4">
             <h3 className="text-sm font-black uppercase tracking-widest text-primary-600 border-b border-gray-100 dark:border-dark-border pb-2">Sản phẩm trong đơn</h3>
             <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex gap-6 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all group">
                    <img
                      src={item.imageUrl || '/placeholder.png'}
                      alt={item.productName}
                      className="w-24 h-24 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-base font-black text-gray-900 dark:text-white">{item.productName}</p>
                      {item.variantName && (
                        <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mt-1">Phân loại: {item.variantName}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] font-black uppercase text-gray-400">Số lượng: {item.quantity}</span>
                        <span className="text-[10px] font-black uppercase text-gray-400">|</span>
                        <span className="text-sm font-bold text-zinc-900 dark:text-gray-200">Đơn giá: {formatFullCurrency(item.priceAtPurchase)}</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-center">
                      <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Thành tiền</p>
                      <p className="text-lg font-black text-primary-600">
                        {formatFullCurrency(item.priceAtPurchase * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Payment Summary */}
          <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-dark-border">
             <div className="w-full md:w-80 space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase text-gray-400">Tổng tiền hàng</span>
                   <span className="text-sm font-bold text-gray-900 dark:text-white">{formatFullCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-green-600">
                   <span className="text-[10px] font-black uppercase">Phí vận chuyển</span>
                   <span className="text-sm font-bold">+{formatFullCurrency(order.shippingFee || 0)}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-y border-gray-100 dark:border-dark-border">
                   <span className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">Tổng thanh toán</span>
                   <span className="text-2xl font-black text-primary-600">
                     {formatFullCurrency(order.totalAmount + (order.shippingFee || 0))}
                   </span>
                </div>
                <div className="flex justify-between items-center bg-zinc-900 dark:bg-white p-4 rounded-xl text-white dark:text-zinc-900 shadow-xl shadow-zinc-900/10">
                   <span className="text-[10px] font-black uppercase tracking-widest">Thanh toán</span>
                   <span className="text-sm font-black">{order.paymentMethod === 'COD' ? 'Khi nhận hàng' : 'Qua VNPay'}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailModal
