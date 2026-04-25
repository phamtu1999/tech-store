import { X, Package, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react'

const OrderDetailModal = ({ isOpen, onClose, order, currencyFormatter, onReorder, onReview, onConfirmReceipt, navigate }) => {
  if (!isOpen || !order) return null

  const renderTimeline = (order) => {
    if (!order.timeline || order.timeline.length === 0) {
      // Fallback if no timeline data
      return <p className="text-center text-xs text-gray-400">Không có dữ liệu lịch sử.</p>;
    }

    // Sort timeline ascending by createdAt so the oldest is first
    const sortedTimeline = [...order.timeline].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return (
      <div className="relative border-l border-gray-200 ml-4 space-y-6 py-4">
        {sortedTimeline.map((history, idx) => {
          const isLast = idx === sortedTimeline.length - 1;
          const isCancelled = history.status === 'CANCELLED';
          
          let Icon = CheckCircle2;
          let iconColor = 'text-gray-400';
          let bgColor = 'bg-gray-100';

          if (isLast && !isCancelled) {
              iconColor = 'text-white';
              bgColor = 'bg-primary-600 shadow-lg shadow-primary-200';
          } else if (isCancelled) {
              Icon = AlertCircle;
              iconColor = 'text-white';
              bgColor = 'bg-red-500 shadow-lg shadow-red-200';
          } else {
              iconColor = 'text-primary-600';
              bgColor = 'bg-primary-50';
          }

          return (
            <div key={history.id} className="relative pl-6">
              <span className={`absolute -left-3.5 top-1 flex h-7 w-7 items-center justify-center rounded-full ${bgColor} ring-4 ring-white`}>
                <Icon className={`h-3 w-3 ${iconColor}`} />
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                <p className={`text-sm font-bold ${isLast ? 'text-gray-900' : 'text-gray-500'}`}>
                  {history.description}
                </p>
                <time className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  {new Date(history.createdAt).toLocaleString('vi-VN')}
                </time>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
       <div className="bg-white rounded-t-[2rem] sm:rounded-[3rem] w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
          <div className="p-5 sm:p-8 border-b border-gray-100 flex justify-between items-start sm:items-center bg-gray-50/50">
             <div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-widest">Chi tiết đơn hàng</h3>
                <p className="text-xs text-gray-400 font-bold uppercase mt-1">Mã: {order.orderNumber} • {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
             </div>
             <button onClick={onClose} className="p-3 hover:bg-gray-200 rounded-full transition-all">
                <X className="h-6 w-6 text-gray-500" />
             </button>
          </div>

          <div className="p-5 sm:p-8 overflow-y-auto space-y-6 sm:space-y-8">
             <div className="space-y-2">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái vận chuyển</p>
                {renderTimeline(order)}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
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
                            <p className="font-black text-xs text-gray-900">{currencyFormatter.format(item.priceAtPurchase * item.quantity)}</p>
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

          <div className="p-4 sm:p-8 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:gap-4">
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
