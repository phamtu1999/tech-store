import { Package } from 'lucide-react'

const OrderList = ({ orders, statusStyles, statusLabels, currencyFormatter, onViewDetail, onCancelOrder, onReorder, onConfirmReceipt }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {orders.map(order => (
        <div key={order.id} className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group">
           <div className="p-4 sm:p-6 bg-gray-50/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-50">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Package className="h-5 w-5 text-primary-500" />
                 </div>
                 <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Đơn hàng</p>
                    <h3 className="font-black text-gray-900">{order.orderNumber}</h3>
                 </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusStyles[order.status]}`}>
                {statusLabels[order.status]}
              </span>
           </div>

           <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
             {order.items?.map(item => (
               <div key={item.id} className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-2xl transition-all">
                  <img src={item.imageUrl} className="h-20 w-20 rounded-2xl object-cover border border-gray-100" alt={item.variantName} />
                  <div className="flex-1 min-w-0">
                     <p className="font-bold text-sm text-gray-900 line-clamp-1">{item.variantName}</p>
                     <p className="text-xs text-gray-400">Số lượng: x{item.quantity}</p>
                  </div>
                  <p className="font-black text-sm text-gray-900">{currencyFormatter.format(item.priceAtPurchase * item.quantity)}</p>
               </div>
             ))}
           </div>

           <div className="p-4 sm:p-6 bg-gray-50/30 border-t border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-left">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng tiền thanh toán</p>
                 <p className="text-2xl font-black text-orange-600">{currencyFormatter.format(order.totalAmount)}</p>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                 <button 
                    onClick={() => onViewDetail(order.id)}
                    className="px-6 py-3 rounded-2xl border-2 border-gray-100 text-xs font-black text-gray-600 hover:bg-white hover:border-primary-500 transition-all uppercase"
                 >
                    Xem chi tiết
                 </button>
                 {order.status === 'PENDING' && (
                    <button 
                        onClick={() => onCancelOrder(order.id)}
                        className="px-6 py-3 rounded-2xl text-xs font-black text-red-500 hover:bg-red-50 transition-all uppercase"
                    >
                        Hủy đơn
                    </button>
                 )}
                 {order.status === 'SHIPPING' && (
                    <button 
                        onClick={() => onConfirmReceipt(order.id)}
                        className="px-6 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-black shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all uppercase"
                    >
                        Đã nhận hàng
                    </button>
                 )}
                 {(order.status === 'DELIVERED' || order.status === 'REVIEWED' || order.status === 'CANCELLED') && (
                    <button 
                        onClick={() => onReorder(order.id)}
                        className="px-6 py-3 rounded-2xl bg-primary-600 text-white text-xs font-black shadow-lg shadow-orange-100 hover:bg-primary-700 transition-all uppercase"
                    >
                        Mua lại
                    </button>
                 )}
              </div>
           </div>
        </div>
      ))}
    </div>
  )
}

export default OrderList
