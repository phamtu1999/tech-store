import { Package, Truck, Check, ShieldCheck, Zap } from 'lucide-react'

const CheckoutCartSummary = ({ cartItems, totalPrice, onSubmit, couponCode, onCouponChange }) => {
  const currencyFormatter = (amount) => new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)

  const shippingFee = totalPrice >= 2000000 ? 0 : 30000

  return (
    <div className="glass border border-white/40 rounded-[2.5rem] p-8 sticky top-28 shadow-premium animate-fade-in overflow-hidden relative group">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-600/5 rounded-full blur-3xl group-hover:bg-primary-600/10 transition-colors duration-700"></div>
      
      <h2 className="text-xl font-black text-secondary-900 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
          <Package className="w-5 h-5 text-white" />
        </div>
        TÓM TẮT <span className="text-primary-600">ĐƠN HÀNG</span>
      </h2>

      <div className="space-y-4 mb-8">
        {/* Promo Code Section */}
        <div className="bg-white/40 p-5 rounded-3xl border border-white/60 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Mã giảm giá (Voucher)</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="NHẬP MÃ TẠI ĐÂY"
              className="flex-1 bg-white/50 border-2 border-gray-100 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest focus:border-primary-500 outline-none transition-all placeholder:text-gray-300"
              value={couponCode}
              onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
            />
            <div className="p-3 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center">
              <Zap className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="bg-white/40 p-5 rounded-3xl border border-white/60">
           <div className="space-y-4">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                   <Package className="w-4 h-4" />
                   Sản phẩm ({cartItems.length})
                </span>
                <span className="text-sm font-black text-secondary-900">{currencyFormatter(totalPrice)}</span>
              </div>
              
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                   <Truck className="w-4 h-4" />
                   Vận chuyển
                </span>
                <span className={`text-sm font-black ${shippingFee === 0 ? 'text-green-600' : 'text-secondary-900'}`}>
                   {shippingFee === 0 ? 'MIỄN PHÍ' : currencyFormatter(shippingFee)}
                </span>
              </div>
           </div>
           
           {shippingFee === 0 && (
              <div className="mt-4 pt-4 border-t border-white/40">
                 <div className="flex items-center gap-2 text-green-600 animate-pulse-soft">
                    <Zap className="w-4 h-4 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Bạn đã được miễn phí vận chuyển!</span>
                 </div>
              </div>
           )}
        </div>

        <div className="px-5">
           <div className="flex justify-between items-end">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Tổng tiền thanh toán</span>
              <div className="text-right">
                 <p className="text-3xl font-black text-secondary-900 tracking-tighter">
                   {currencyFormatter(totalPrice + shippingFee)}
                 </p>
                 <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Đã bao gồm thuế GTGT (nếu có)</p>
              </div>
           </div>
        </div>
      </div>

      <button 
        onClick={onSubmit}
        className="w-full bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-black py-5 px-8 rounded-3xl shadow-xl shadow-primary-600/20 hover:shadow-primary-600/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group/btn uppercase tracking-widest text-xs"
      >
        <span>Đặt hàng ngay</span>
        <Check className="w-5 h-5 group-hover/btn:scale-125 transition-transform" />
      </button>

      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-gray-400">
           <ShieldCheck className="w-4 h-4 text-green-500" />
           <p className="text-[10px] font-black uppercase tracking-tighter">Thanh toán an toàn & Bảo mật 100%</p>
        </div>
        <div className="flex gap-4 opacity-30 grayscale saturate-0">
           <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-2" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/0/07/VNPAY_logo.svg" alt="VNPAY" className="h-3" />
        </div>
      </div>
    </div>
  )
}

export default CheckoutCartSummary
