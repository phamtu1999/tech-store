import { X, Package, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react'

const OrderDetailModal = ({ isOpen, onClose, order, currencyFormatter, onReorder, onReview, onConfirmReceipt, navigate }) => {
  if (!isOpen || !order) return null

  const renderTimeline = (status) => {
    const steps = [
      { id: 'PENDING', label: 'Đặt hàng', icon: Clock },
      { id: 'CONFIRMED', label: 'Xác nhận', icon: CheckCircle2 },
      { id: 'SHIPPING', label: 'Đang giao', icon: Truck },
      { id: 'DELIVERED', label: 'Đã giao', icon: Package },
    ]
    
    if (status === 'CANCELLED') {
        return (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-bold uppercase">Đơn hàng này đã bị hủy</span>
            </div>
        )
    }

    const currentIdx = steps.findIndex(s => s.id === status)

    return (
      <div className="flex items-center justify-between w-full max-w-lg mx-auto py-6">
        {steps.map((step, idx) => {
          const Icon = step.icon
          const isActive = idx <= currentIdx
          return (
            <div key={step.id} className="flex flex-col items-center relative flex-1">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center z-10 ${isActive ? 'bg-primary-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={`text-[10px] mt-2 font-bold uppercase tracking-tighter ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                {step.label}
              </span>
              {idx < steps.length - 1 && (
                <div className={`absolute top-5 left-[50%] w-full h-0.5 ${idx < currentIdx ? 'bg-primary-600' : 'bg-gray-100'}`} />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
       <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
             <div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-widest">Chi tiết đơn hàng</h3>
                <p className="text-xs text-gray-400 font-bold uppercase mt-1">Mã: {order.orderNumber} • {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
             </div>
             <button onClick={onClose} className="p-3 hover:bg-gray-200 rounded-full transition-all">
                <X className="h-6 w-6 text-gray-500" />
             </button>
          </div>

          <div className="p-8 overflow-y-auto space-y-8">
             <div className="space-y-2">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái vận chuyển</p>
                {renderTimeline(order.status)}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Người nhận</h4>
                   <div className="bg-gray-50 p-4 rounded-3xl space-y-1">
                      <p className="font-black text-gray-900 uppercase text-xs">{order.receiverName}</p>
                      <p className="text-xs text-gray-500 font-bold">{order.receiverPhone}</p>
                      <p className="text-xs text-gray-400 italic line-clamp-2">{order.shippingAddress}</p>
                   </div>
                </div>
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thanh toán</h4>
                   <div className="bg-orange-50 p-4 rounded-3xl text-right">
                      <p className="text-[10px] font-black text-orange-400 uppercase mb-1">Tổng cộng</p>
                      <p className="text-xl font-black text-orange-600">{currencyFormatter.format(order.totalAmount)}</p>
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sản phẩm</h4>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-[2rem] overflow-hidden">
                  {order.items?.map(item => (
                      <div key={item.id} className="p-4 flex items-center gap-4 bg-white hover:bg-gray-50 transition-all">
                         <img src={item.imageUrl} className="h-12 w-12 rounded-xl object-cover cursor-pointer" onClick={() => navigate(`/product/${item.productId}`)} alt={item.variantName} />
                         <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs text-gray-900 line-clamp-1">{item.variantName}</p>
                            <p className="text-[10px] text-gray-400 font-bold">SL: x{item.quantity}</p>
                         </div>
                         <div className="text-right">
                            <p className="font-black text-xs text-gray-900">{currencyFormatter.format(item.priceAtPurchase)}</p>
                            {(order.status === 'DELIVERED' || order.status === 'REVIEWED') && (
                                <button 
                                  onClick={() => onReview(item)}
                                  className="text-[9px] font-black text-primary-600 uppercase hover:underline mt-1"
                                >
                                  Đánh giá ngay
                                </button>
                            )}
                         </div>
                      </div>
                  ))}
                </div>
             </div>
          </div>

          <div className="p-8 border-t border-gray-100 flex gap-4">
             <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-600 text-xs font-black uppercase hover:bg-gray-200 transition-all">
                Đóng
             </button>
             {order.status === 'SHIPPING' && (
                  <button onClick={() => { onConfirmReceipt(order.id); onClose(); }} className="flex-[2] py-4 rounded-2xl bg-emerald-600 text-white text-xs font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all uppercase">
                      Xác nhận đã nhận hàng
                  </button>
             )}
             {(order.status === 'DELIVERED' || order.status === 'REVIEWED' || order.status === 'CANCELLED') && (
                  <button onClick={() => onReorder(order.id)} className="flex-[2] py-4 rounded-2xl bg-primary-600 text-white text-xs font-black shadow-xl shadow-orange-100 hover:bg-primary-700 transition-all uppercase">
                      Mua lại đơn này
                  </button>
             )}
          </div>
       </div>
    </div>
  )
}

export default OrderDetailModal
