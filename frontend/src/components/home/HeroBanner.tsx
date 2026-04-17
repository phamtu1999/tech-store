import React from 'react';
import { ShoppingBag, ArrowRight, Zap, Sparkles } from 'lucide-react';
import './HeroBanner.css';

const HeroBanner: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#010828] rounded-[2.5rem] my-8 group">
      {/* 1. Nền vũ trụ - Asset 3D vừa tạo */}
      {/* 1. Nền vũ trụ - Asset 3D vừa tạo */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/banners/liquid_glass_space_banner.png" 
          alt="Cosmic NFT Background" 
          className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
        />
        {/* Lớp phủ vệt sáng (Ambient Glow) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#010828]/80 via-transparent to-[#6FFF00]/5" />
      </div>

      {/* Decorative Background Text */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="bg-typography text-[20rem] sm:text-[30rem] font-black leading-none uppercase tracking-tighter">
          TECHZONE
        </span>
      </div>

      {/* 2. Film Grain Texture Overlay - Tạo cảm giác "High-end" */}
      <div className="absolute inset-0 z-[5] opacity-[0.02] pointer-events-none noise-bg" />

      {/* 3. Nội dung chính - Phân tầng logic */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8 sm:px-16 py-20 lg:py-32">
        
        {/* Trái: Thông điệp chính - Ưu tiên Sản phẩm */}
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-2">
            <span className="font-condiment text-[1.8rem] text-[#6FFF00] block mb-[-1rem] ml-2 animate-float">
              Siêu phẩm flaghip 2024
            </span>
            <h1 className="font-anton text-[6rem] sm:text-[8rem] leading-[0.85] text-white tracking-tighter uppercase font-black">
              IPHONE 15<br/>
              <span className="text-white">PRO MAX</span>
            </h1>
          </div>
          
          <p className="max-w-md text-gray-300 font-bold text-sm tracking-widest uppercase leading-relaxed opacity-60">
            Khung viền Titanium cấp độ hàng không. Chip A17 Pro mạnh mẽ nhất. 
            Hệ thống Camera chuẩn điện ảnh.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <button className="btn-primary-glow text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3">
              MUA NGAY <ShoppingBag className="h-4 w-4" />
            </button>
            <button className="group/btn relative px-8 py-5 text-white font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 overflow-hidden">
              <span className="relative z-10">So sánh sản phẩm</span>
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-2 transition-transform" />
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#6FFF00] group-hover/btn:w-full transition-all duration-300" />
            </button>
          </div>
        </div>

        {/* Phải: Liquid Glass UI & Specs Card */}
        <div className="relative">
          {/* Card Kính lỏng (Liquid Glass Card) - Tập trung vào Giá & Ưu đãi */}
          <div className="liquid-glass relative z-20 p-8 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col gap-8 animate-slide-up">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6FFF00] animate-pulse" />
                  <p className="text-[10px] font-black text-[#6FFF00] uppercase tracking-[0.2em]">Đang sẵn hàng</p>
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Titanium Edition</h3>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="space-y-6">
              {/* PRICE SECTION - BIG & CLEAR */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Giá ưu đãi</span>
                  <span className="text-xs font-black text-red-500 uppercase">Giảm 2.000.000đ</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-white tracking-tighter">32.990.000đ</span>
                  <span className="text-sm font-bold text-white/30 line-through">34.990k</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Bộ nhớ</p>
                  <p className="text-sm font-black text-white">256GB NVMe</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Trả góp</p>
                  <p className="text-sm font-black text-[#6FFF00]">0% Lãi suất</p>
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2">
              <Sparkles className="h-3 w-3" /> Xem thêm cấu hình
            </button>
          </div>

          {/* Subtle Glow behind the card */}
          <div className="absolute inset-0 bg-[#6FFF00]/10 blur-[120px] rounded-full z-10" />
        </div>

      </div>

      {/* Lớp bóng đổ phía dưới Banner */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/80 to-transparent z-[1]" />
    </section>
  );
};

export default HeroBanner;
