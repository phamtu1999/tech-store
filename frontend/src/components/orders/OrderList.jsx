import { Package } from 'lucide-react'

const OrderList = ({ orders, statusStyles, statusLabels, currencyFormatter, onViewDetail, onCancelOrder, onReorder, onConfirmReceipt }) => {
  return (
    <div className="space-y-6 sm:space-y-8">
       {orders.map(order => (
        <div key={order.id} className="bg-white rounded-3xl sm:rounded-[2rem] border-2 border-gray-100 shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden group mb-8">
           {/* HEADER */}
           <div className="p-4 sm:p-5 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b-2 border-gray-100">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                    <Package className="h-6 w-6 text-primary-600" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Mã đơn hàng</p>
                    <h3 className="font-black text-gray-900 text-sm sm:text-base tracking-tight">{order.orderNumber}</h3>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${statusStyles[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
              </div>
           </div>

           {/* ITEMS */}
           <div className="p-4 sm:p-6 bg-white space-y-4">
              {order.items?.map((item, index) => (
                <div key={item.id || index} className="flex items-center gap-4 p-4 rounded-[1.5rem] hover:bg-gray-50 transition-all border border-gray-100 shadow-sm group/item">
                   <div className="h-20 w-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 group-hover/item:border-primary-200 transition-colors">
                     <img src={item.imageUrl} className="h-full w-full object-contain" alt={item.variantName} />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="font-black text-sm text-gray-900 line-clamp-2 leading-snug group-hover/item:text-primary-600 transition-colors">{item.productName || item.variantName}</p>
                      <div className="flex items-center gap-3 mt-2">
                         <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded-lg">Số lượng: <span className="text-primary-600">x{item.quantity}</span></p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Đơn giá: {currencyFormatter.format(item.priceAtPurchase)}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="font-black text-base text-gray-900">{currencyFormatter.format(item.priceAtPurchase * item.quantity)}</p>
                   </div>
                </div>
              ))}
           </div>

           {/* FOOTER */}
           <div className="p-4 sm:p-6 bg-gray-50 border-t-2 border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <div className="text-left">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tổng thanh toán</p>
                  <p className="text-2xl font-black text-primary-600 tracking-tighter">{currencyFormatter.format(order.totalAmount)}</p>
               </div>
               <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button 
                     onClick={() => onViewDetail(order.id)}
                     className="flex-1 sm:flex-none px-6 py-3 rounded-2xl border-2 border-gray-200 bg-white text-[10px] font-black text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-all uppercase tracking-widest shadow-sm"
                  >
                     Chi tiết
                  </button>
                  {order.status === 'PENDING' && (
                     <button 
                         onClick={() => onCancelOrder(order.id)}
                         className="flex-1 sm:flex-none px-6 py-3 rounded-2xl text-[10px] font-black text-red-500 hover:bg-red-50 transition-all uppercase tracking-widest"
                     >
                         Hủy đơn
                     </button>
                  )}
                  {order.status === 'SHIPPING' && (
                     <button 
                         onClick={() => onConfirmReceipt(order.id)}
                         className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-emerald-600 text-white text-[10px] font-black shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all uppercase tracking-widest"
                     >
                         Đã nhận
                     </button>
                  )}
                  {(order.status === 'DELIVERED' || order.status === 'REVIEWED' || order.status === 'CANCELLED') && (
                     <button 
                         onClick={() => onReorder(order.id)}
                         className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-primary-600 text-white text-[10px] font-black shadow-lg shadow-orange-100 hover:bg-primary-700 transition-all uppercase tracking-widest"
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
