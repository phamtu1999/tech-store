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
               <h1 className="text-4xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
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
                  <span className="text-white font-black text-sm">4.9/5 <span className="text-gray-500 font-bold ml-1">(1.2k+)</span></span>
               </div>
               <div className="h-4 w-[1px] bg-white/10"></div>
               <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest">
                  <Zap className="h-4 w-4 fill-current" />
                  SALE ĐANG DIỄN RA
               </div>
            </div>

            <div className="flex flex-wrap gap-5 pt-4">
              <Link to="/products" className="group relative bg-primary-MAIN text-white px-10 h-16 rounded-full font-black text-lg flex items-center gap-3 shadow-2xl shadow-primary-500/40 hover:scale-105 transition-all overflow-hidden no-hover-scale">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                MUA NGAY
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-6 border-t border-white/5 overflow-x-auto no-scrollbar pb-2">
               <div className="flex items-center gap-2 text-gray-400 whitespace-nowrap">
                  <ShieldCheck className="h-5 w-5 text-primary-MAIN" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Chính hãng</span>
               </div>
               <div className="flex items-center gap-2 text-gray-400 whitespace-nowrap">
                  <Zap className="h-5 w-5 text-primary-MAIN" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Giao nhanh</span>
               </div>
               <div className="flex items-center gap-2 text-gray-400 whitespace-nowrap">
                  <Award className="h-5 w-5 text-primary-MAIN" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Bảo hành</span>
               </div>
            </div>
          </div>
          
          {/* Hero Visual Area - Optimized for mobile/desktop */}
          <div className="relative min-h-[350px] md:min-h-[450px] lg:h-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary-MAIN/25 rounded-full blur-[100px] lg:blur-[150px] animate-pulse"></div>
            
            <div className="relative h-full flex items-center justify-center">
                <div className="absolute transform -translate-y-4 lg:-translate-y-8 animate-float">
                   <div className="relative group scale-75 md:scale-90 lg:scale-100">
                     <div className="absolute -inset-8 bg-gradient-to-tr from-primary-MAIN to-transparent rounded-[48px] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                     <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[64px] p-6 lg:p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-t-white/20 overflow-hidden">
                       <div className="absolute top-0 right-0 p-6 lg:p-8">
                          <div className="bg-red-600 text-white text-[8px] lg:text-[10px] font-black px-2 lg:px-3 py-1 lg:py-1.5 rounded-full shadow-lg">-10%</div>
                       </div>
                       <div className="text-7xl lg:text-9xl mb-6 lg:mb-8 transform -rotate-[15deg] group-hover:rotate-0 transition-all duration-1000 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] select-none">📱</div>
                       <div className="space-y-3 lg:space-y-4">
                         <div className="flex items-center gap-2">
                            <span className="h-1 lg:h-2 w-10 lg:w-12 bg-primary-MAIN rounded-full"></span>
                            <span className="text-primary-MAIN text-[10px] lg:text-xs font-black uppercase tracking-widest">Flash Sale</span>
                         </div>
                         <div className="font-black text-white text-2xl lg:text-4xl tracking-tighter truncate max-w-[200px] lg:max-w-none">iPhone 15 Pro Max</div>
                         <div className="space-y-0.5 lg:space-y-1">
                            <div className="text-gray-400 line-through font-bold text-xs lg:text-sm italic">29.990.000₫</div>
                            <div className="text-white font-black text-2xl lg:text-3xl tracking-tighter flex items-center gap-2">
                               24.990.000₫
                            </div>
                         </div>
                         <div className="pt-2 flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                               <div className="h-full bg-primary-MAIN w-2/3"></div>
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">Đã bán 86%</span>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>

                <div className="absolute -bottom-4 lg:-bottom-10 -right-4 lg:-right-10 transform animate-float-delayed scale-75 lg:scale-100 z-20">
                    <div className="bg-primary-MAIN rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-2xl shadow-primary-MAIN/30 border border-white/20 group hover:scale-110 transition-transform cursor-pointer">
                       <Zap className="h-6 lg:h-8 w-6 lg:w-8 text-white fill-white mb-2" />
                       <div className="text-white font-black text-xs lg:text-lg leading-tight uppercase font-black">Ưu đãi Hot</div>
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
