import { Wallet, Package, Check, CreditCard, Smartphone, Zap } from 'lucide-react'

const CheckoutPaymentMethods = ({ paymentMethod, onChange }) => {
  const methods = [
    { id: 'COD', label: 'THANH TOÁN KHI NHẬN HÀNG', subLabel: 'Thanh toán bằng tiền mặt khi giao hàng tận nơi', icon: Package },
    { id: 'VNPAY', label: 'VNPAY-QR / THẺ QUỐC TẾ', subLabel: 'Thanh toán an toàn qua cổng VNPAY', icon: CreditCard },
    { id: 'MOMO', label: 'VÍ ĐIỆN TỬ MOMO', subLabel: 'Sử dụng ví MoMo để thanh toán (Sắp ra mắt)', icon: Smartphone },
  ]

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-sm">
      <div className="flex items-center space-x-3 mb-6 sm:mb-8">
        <div className="w-10 h-10 bg-primary-50 rounded-2xl flex items-center justify-center">
          <Wallet className="w-5 h-5 text-primary-600" />
        </div>
        <div>
           <h2 className="text-xl font-black text-secondary-900 tracking-tight">PHƯƠNG THỨC <span className="text-primary-600">THANH TOÁN</span></h2>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Lựa chọn cách thức thanh toán phù hợp nhất</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {methods.map((method) => {
          const Icon = method.icon
          const isActive = paymentMethod === method.id
          const isDisabled = method.id === 'MOMO'
          
          return (
            <label 
               key={method.id} 
               className={`relative flex items-center p-5 border-2 rounded-3xl cursor-pointer transition-all duration-500 overflow-hidden ${
                  isActive 
                    ? 'border-primary-600 bg-primary-50/30' 
                    : 'border-transparent bg-white/40 hover:bg-white/60 hover:border-gray-200'
               } ${isDisabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={isActive}
                onChange={onChange}
                disabled={isDisabled}
                className="sr-only"
              />
              <div className="flex items-center flex-1 z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 transition-all duration-500 ${
                  isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 rotate-6' : 'bg-white text-gray-400'
                }`}>
                  <Icon className={`w-6 h-6`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-black uppercase tracking-wider ${isActive ? 'text-primary-900' : 'text-secondary-800'}`}>
                        {method.label}
                    </p>
                    {isActive && <div className="animate-pulse bg-primary-500 h-1.5 w-1.5 rounded-full"></div>}
                  </div>
                  <p className="text-[11px] text-gray-500 font-bold mt-1 uppercase tracking-tight">{method.subLabel}</p>
                </div>
              </div>

              {isActive && (
                <div className="bg-primary-600 text-white p-2 rounded-2xl shadow-lg animate-scale-up">
                  <Check className="w-4 h-4" />
                </div>
              )}

              {/* Background accent */}
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-primary-600/5 rounded-full transition-all duration-700 ${isActive ? 'scale-150 opacity-100' : 'scale-0 opacity-0'}`}></div>
            </label>
          )
        })}
      </div>
      
      <div className="mt-8 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
         <Zap className="w-5 h-5 text-blue-600 mt-0.5 fill-blue-600" />
         <div>
            <p className="text-[11px] font-black text-blue-900 uppercase tracking-widest leading-tight">Giao hàng siêu tốc</p>
            <p className="text-[10px] text-blue-700/70 font-bold mt-1 uppercase">Sản phẩm sẽ được giao trong vòng 24h-48h làm việc.</p>
         </div>
      </div>
    </div>
  )
}

export default CheckoutPaymentMethods
