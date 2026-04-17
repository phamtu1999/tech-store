import { ShoppingCart, ShieldCheck, Truck, RefreshCw, Gift, Copy, Check, ArrowRight } from 'lucide-react'
import { useState } from 'react'

const HomeFeatures = () => {
  const [copiedCode, setCopiedCode] = useState(false)
  const promoCode = 'TECH2024'

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const features = [
    { icon: <Truck className="h-8 w-8" />, title: 'Giao hàng 2h', desc: 'Miễn phí cho đơn hàng từ 500k', color: 'text-blue-500 bg-blue-50' },
    { icon: <ShieldCheck className="h-8 w-8" />, title: 'Bảo hành tận tâm', desc: 'Lỗi 1 đổi 1 trong vòng 30 ngày', color: 'text-emerald-500 bg-emerald-50' },
    { icon: <RefreshCw className="h-8 w-8" />, title: 'Thu cũ đổi mới', desc: 'Hỗ trợ lên đời với giá cực tốt', color: 'text-orange-500 bg-orange-50' },
    { icon: <ShoppingCart className="h-8 w-8" />, title: 'Thanh toán linh hoạt', desc: 'Hỗ trợ trả góp 0% qua thẻ tín dụng', color: 'text-purple-500 bg-purple-50' }
  ]

  return (
    <div className="space-y-6 animate-slide-in-up">
      {/* Main Promo Banner with Countdown */}
      <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-orange-500 rounded-[3rem] p-8 md:p-12 overflow-hidden group hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        {/* Floating Gift Icon */}
        <div className="absolute top-8 right-8 md:top-12 md:right-12 text-white/20 group-hover:text-white/40 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
          <Gift className="h-24 w-24 md:h-32 md:w-32" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <span className="flex h-2 w-2 rounded-full bg-white animate-pulse"></span>
              <span className="text-white text-xs font-black uppercase tracking-wider">Flash Sale Hôm Nay</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter text-center md:text-left">
              ƯU ĐÃI ĐẶC BIỆT
            </h3>
            <p className="text-white/90 text-lg md:text-xl font-bold mb-6 text-center md:text-left">
              Giảm ngay <span className="text-3xl font-black text-yellow-300">20%</span> cho đơn hàng đầu tiên
            </p>
            
            {/* Promo Code */}
            <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[1.25rem] px-6 py-3.5 flex items-center gap-4 shadow-inner">
                <span className="text-white/70 text-[10px] font-black uppercase tracking-widest">Mã:</span>
                <span className="text-white text-2xl font-black tracking-[0.2em]">{promoCode}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="bg-white text-primary-600 h-[60px] px-8 rounded-[1.25rem] font-black text-sm hover:bg-yellow-300 hover:text-black hover:scale-105 transition-all shadow-xl flex items-center gap-3"
              >
                {copiedCode ? (
                  <><Check className="h-5 w-5" /> Đã lưu!</>
                ) : (
                  <><Copy className="h-5 w-5" /> Sao chép</>
                )}
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
            <button className="bg-white text-primary-600 px-10 py-5 rounded-[1.5rem] font-black text-xl hover:bg-yellow-300 hover:text-black transition-all shadow-2xl hover:shadow-yellow-400/20 hover:scale-105 flex items-center gap-3 group/btn no-hover-scale">
              LẤY MÃ NGAY
              <ShoppingCart className="h-6 w-6 group-hover/btn:rotate-12 transition-transform" />
            </button>
            <p className="text-white/80 text-[10px] font-black uppercase tracking-widest">
              ⏰ Còn lại: <span className="text-yellow-300">2 giờ 30 phút</span>
            </p>
          </div>
        </div>
      </div>

      {/* Two Promo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Headphones Card */}
        <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-[2.5rem] p-8 md:p-10 overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 cursor-pointer hover:-translate-y-2">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-4">
              <span className="text-white text-xs font-black uppercase tracking-wider">Mới về</span>
            </div>
            <h4 className="text-3xl font-black text-white mb-2 tracking-tight">
              Tai Nghe<br />Premium
            </h4>
            <p className="text-white/90 text-sm font-semibold mb-6">
              Âm thanh Hi-Res, chống ồn chủ động
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-xs line-through mb-1">5.990.000đ</p>
                <p className="text-yellow-300 text-2xl font-black">4.490.000đ</p>
              </div>
              <div className="text-6xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                🎧
              </div>
            </div>
            <button className="mt-6 w-full bg-white text-blue-600 py-3 rounded-xl font-black text-sm hover:bg-yellow-300 hover:text-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group/btn">
              Xem ngay
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Smartwatch Card */}
        <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-[2.5rem] p-8 md:p-10 overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 cursor-pointer hover:-translate-y-2">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-4">
              <span className="text-white text-xs font-black uppercase tracking-wider">Hot Deal</span>
            </div>
            <h4 className="text-3xl font-black text-white mb-2 tracking-tight">
              Đồng Hồ<br />Thông Minh
            </h4>
            <p className="text-white/90 text-sm font-semibold mb-6">
              Theo dõi sức khỏe 24/7, pin 7 ngày
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-xs line-through mb-1">8.990.000đ</p>
                <p className="text-yellow-300 text-2xl font-black">6.990.000đ</p>
              </div>
              <div className="text-6xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                ⌚
              </div>
            </div>
            <button className="mt-6 w-full bg-white text-purple-600 py-3 rounded-xl font-black text-sm hover:bg-yellow-300 hover:text-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group/btn">
              Xem ngay
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
            <div className={`${f.color} w-16 h-16 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
              {f.icon}
            </div>
            <h3 className="font-black mb-2 text-secondary-800 tracking-tight">{f.title}</h3>
            <p className="text-gray-400 text-xs font-bold leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomeFeatures
