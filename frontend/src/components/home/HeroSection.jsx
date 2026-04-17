import { Link } from 'react-router-dom'
import { ArrowRight, Star, ShieldCheck, Zap, Award, Sparkles } from 'lucide-react'

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden rounded-[40px] animate-fade-in group shadow-2xl">
      <div className="absolute inset-0 bg-[#020617]">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-primary-MAIN/30 to-transparent"></div>
        <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-primary-MAIN/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="relative px-8 md:px-20 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary-MAIN/10 backdrop-blur-xl border border-primary-MAIN/20 px-4 py-2 rounded-full text-primary-MAIN text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary-MAIN/5">
              <Sparkles className="h-3 w-3 animate-pulse" />
              Công nghệ đỉnh cao · Edition 2024
            </div>
            
            <div className="space-y-4">
               <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                 Hiệu năng <br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-MAIN via-orange-500 to-red-600">VƯỢT TRỘI.</span>
               </h1>
               <p className="text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed font-bold">
                 Sở hữu ngay iPhone 15 Pro Max với giá ưu đãi nhất. Đỉnh cao hiệu năng, thiết kế Titanium tinh tế.
               </p>
            </div>

            <div className="flex items-center gap-6 py-2">
               <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                     {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <span className="text-white font-black text-sm">4.9/5 <span className="text-gray-500 font-bold ml-1">(1.2k+ đánh giá)</span></span>
               </div>
               <div className="h-4 w-[1px] bg-white/10"></div>
               <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest">
                  <Zap className="h-4 w-4 fill-current" />
                  Đang giảm giá mạnh
               </div>
            </div>

            <div className="flex flex-wrap gap-5 pt-4">
              <Link to="/products" className="group relative bg-primary-MAIN text-white px-10 h-16 rounded-full font-black text-lg flex items-center gap-3 shadow-2xl shadow-primary-500/40 hover:scale-105 transition-all overflow-hidden no-hover-scale">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                MUA NGAY
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/products" className="bg-white/5 backdrop-blur-md border-2 border-white/10 text-white px-10 h-16 rounded-full font-black text-lg hover:bg-white/10 hover:border-white/40 transition-all flex items-center justify-center min-w-[200px] no-hover-scale">
                XEM SẢN PHẨM
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-6 border-t border-white/5">
               <div className="flex items-center gap-2 text-gray-400">
                  <ShieldCheck className="h-5 w-5 text-primary-MAIN" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Chính hãng 100%</span>
               </div>
               <div className="flex items-center gap-2 text-gray-400">
                  <Zap className="h-5 w-5 text-primary-MAIN" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Giao nhanh 2h</span>
               </div>
               <div className="flex items-center gap-2 text-gray-400">
                  <Award className="h-5 w-5 text-primary-MAIN" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Bảo hành 12th</span>
               </div>
            </div>
          </div>
          
          <div className="relative min-h-[400px] md:h-full hidden lg:block">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-MAIN/25 rounded-full blur-[150px] animate-pulse"></div>
            
            <div className="relative h-full flex items-center justify-center">
               {/* Main Hero Product Placeholder/Graphic */}
                <div className="absolute transform -translate-y-8 animate-float">
                   <div className="relative group">
                     <div className="absolute -inset-8 bg-gradient-to-tr from-primary-MAIN to-transparent rounded-[48px] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                     <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[64px] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-t-white/20 overflow-hidden">
                       <div className="absolute top-0 right-0 p-8">
                          <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">-10%</div>
                       </div>
                       <div className="text-9xl mb-8 transform -rotate-[15deg] group-hover:rotate-0 transition-all duration-1000 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]">📱</div>
                       <div className="space-y-4">
                         <div className="flex items-center gap-2">
                            <span className="h-2 w-12 bg-primary-MAIN rounded-full"></span>
                            <span className="text-primary-MAIN text-xs font-black uppercase tracking-widest">Flash Sale</span>
                         </div>
                         <div className="font-black text-white text-4xl tracking-tighter">iPhone 15 Pro Max</div>
                         <div className="space-y-1">
                            <div className="text-gray-400 line-through font-bold text-sm">29.990.000₫</div>
                            <div className="text-white font-black text-3xl tracking-tighter flex items-center gap-2">
                               24.990.000₫
                               <div className="text-secondary-800 bg-primary-MAIN text-[9px] px-2 py-1 rounded-md">HOT DEAL</div>
                            </div>
                         </div>
                         <div className="pt-2 flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                               <div className="h-full bg-primary-MAIN w-2/3"></div>
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold">Đã bán 86/100</span>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>

                {/* Floating Micro-Card */}
                <div className="absolute -bottom-10 -right-10 transform animate-float-delayed">
                    <div className="bg-primary-MAIN rounded-3xl p-6 shadow-2xl shadow-primary-MAIN/30 border border-white/20 group hover:scale-110 transition-transform cursor-pointer">
                       <Zap className="h-8 w-8 text-white fill-white mb-2" />
                       <div className="text-white font-black text-lg leading-tight">Trả góp 0%<br />Duyệt 5 phút</div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
