import React from 'react';
import { Mail, Twitter, Github, ChevronRight } from 'lucide-react';

const OrbisNft: React.FC = () => {
  const socialIcons = [
    { icon: Mail, label: 'Email' },
    { icon: Twitter, label: 'Facebook' },
    { icon: Github, label: 'Hotline' },
  ];

  const nftCollection = [
    { 
      url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4',
      score: '8.7/10'
    },
    { 
      url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4',
      score: '9/10'
    },
    { 
      url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4',
      score: '8.2/10'
    }
  ];

  return (
    <div className="bg-orbis-bg min-h-screen text-orbis-cream selection:bg-orbis-neon/30 overflow-x-hidden">
      {/* Texture Overlay */}
      <div className="texture-overlay" />

      {/* SECTION 1: HERO */}
      <section className="relative h-screen w-full flex flex-col items-center rounded-b-[32px] overflow-hidden">
        {/* Background Video */}
        <video 
          autoPlay loop muted playsInline 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4" type="video/mp4" />
        </video>

        {/* Header Content */}
        <div className="relative z-20 w-full max-w-[1831px] mx-auto px-4 sm:px-8 py-8 flex justify-between items-center">
          {/* Logo */}
          <div className="font-grotesk text-base uppercase tracking-widest text-orbis-neon">
            Tech Store.V2
          </div>

          {/* Navigation Bar */}
          <nav className="hidden lg:block liquid-glass rounded-[28px] px-[52px] py-[24px]">
            <ul className="flex items-center gap-10">
              {['Tầm nhìn', 'Sản phẩm', 'Giá trị', 'Cộng đồng', 'Liên hệ'].map((item) => (
                <li key={item}>
                  <a href="#" className="font-grotesk text-[13px] uppercase tracking-wider hover:text-orbis-neon transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="w-20 hidden lg:block" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 w-full max-w-[1831px] mx-auto flex-1 flex flex-col justify-center px-4 sm:px-8 lg:pl-32">
          <div className="relative max-w-[780px]">
            <h1 className="font-grotesk text-[40px] sm:text-[60px] md:text-[75px] lg:text-[90px] uppercase leading-[1.05] md:leading-[1] tracking-tighter">
              Kiến tạo tương lai<br/>
              vượt mọi giới hạn công nghệ
            </h1>
            {/* Cursive Accent */}
            <span className="absolute -right-4 md:right-0 top-0 lg:top-4 font-condiment text-[24px] md:text-[48px] text-orbis-neon -rotate-1 opacity-90 mix-blend-exclusion normal-case">
              Since 2024
            </span>
          </div>
          
          <div className="mt-8 flex lg:hidden gap-4 pb-12">
            {socialIcons.map((soc, i) => (
              <button key={i} className="liquid-glass w-14 h-14 rounded-[1rem] flex items-center justify-center hover:bg-white/10 transition-colors">
                <soc.icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>

        {/* Social Icons (Desktop) */}
        <div className="hidden lg:flex absolute top-32 right-8 flex-col gap-4 z-20">
          {socialIcons.map((soc, i) => (
            <button key={i} className="liquid-glass w-14 h-14 rounded-[1rem] flex items-center justify-center hover:bg-white/10 transition-colors">
              <soc.icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 2: ABOUT / INTRO */}
      <section className="relative min-h-[50vh] lg:h-screen w-full flex items-center bg-orbis-bg py-16 md:py-24 overflow-hidden">
        <video 
          autoPlay loop muted playsInline 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-80"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 w-full max-w-[1831px] mx-auto px-4 sm:px-8 flex flex-col justify-between h-full">
          {/* Top Row */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 lg:gap-32">
            <div className="relative inline-block">
              <h2 className="font-grotesk text-[32px] md:text-[60px] uppercase leading-none tracking-tighter">
                Xin chào!<br/>
                Chúng tôi là Tech Store
              </h2>
              <span className="absolute -bottom-4 right-0 lg:-right-8 font-condiment text-[36px] md:text-[68px] text-orbis-neon mix-blend-exclusion normal-case -rotate-2">
                Tech Store
              </span>
            </div>
            <p className="font-mono text-sm md:text-base uppercase tracking-widest max-w-[266px] leading-relaxed">
              Một điểm đến cho mọi nhu cầu công nghệ cao cấp. Chúng tôi không chỉ bán thiết bị, chúng tôi mang tới những giải pháp thay đổi cuộc sống.
            </p>
          </div>

          {/* Bottom Row - Decorative text */}
          <div className="hidden md:flex justify-between items-end mt-32">
             <div className="space-y-4 max-w-[300px]">
                <p className="font-mono text-xs uppercase opacity-10 text-orbis-cream">
                  Đổi mới không ngừng. Sáng tạo không giới hạn. Cam kết chất lượng cao nhất cho mỗi trải nghiệm khách hàng.
                </p>
                <p className="font-mono text-xs uppercase opacity-10 text-orbis-cream font-bold">
                  Công nghệ là chìa khóa. Con người là trung tâm. Tương lai nằm trong tay bạn.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CORE VALUES GRID */}
      <section className="relative w-full bg-orbis-bg py-24 md:py-32">
        <div className="relative z-10 w-full max-w-[1831px] mx-auto px-4 sm:px-8">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 md:mb-32 gap-10">
            <h2 className="font-grotesk text-[32px] md:text-[60px] uppercase leading-[1.1] tracking-tighter">
              Hệ sinh thái <br/>
              <span className="ml-12 md:ml-32 flex items-center gap-4">
                <span className="font-condiment normal-case text-orbis-neon">Giá trị</span> cốt lõi
              </span>
            </h2>

            {/* See All Button */}
            <div className="relative group cursor-pointer pb-2">
              <div className="flex items-center gap-4">
                 <span className="font-grotesk text-[32px] md:text-[60px] leading-none uppercase tracking-tighter">XEM</span>
                 <div className="flex flex-col -mb-1">
                    <span className="font-grotesk text-[20px] md:text-[36px] leading-none uppercase tracking-tighter">CÁC</span>
                    <span className="font-grotesk text-[20px] md:text-[36px] leading-none uppercase tracking-tighter">DỊCH VỤ</span>
                 </div>
              </div>
              <div className="h-[6px] md:h-[10px] bg-orbis-neon w-full mt-2 group-hover:h-[12px] transition-all duration-300" />
            </div>
          </div>

          {/* Value Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'CHẤT LƯỢNG PRO', url: nftCollection[0].url, score: 'Cam kết / Chính hãng' },
              { title: 'DỊCH VỤ 5 SAO', url: nftCollection[1].url, score: 'Hỗ trợ / 24/7' },
              { title: 'TRẢI NGHIỆM DUY NHẤT', url: nftCollection[2].url, score: 'Cá nhân / Tối ưu' }
            ].map((nft, i) => (
              <div key={i} className="liquid-glass rounded-[32px] p-[18px] group hover:bg-white/10 transition-all duration-500 cursor-pointer">
                <div className="relative w-full pb-[100%] rounded-[24px] overflow-hidden">
                  <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                    <source src={nft.url} type="video/mp4" />
                  </video>
                </div>
                {/* Info Bar */}
                <div className="mt-4 liquid-glass rounded-[20px] px-5 py-4 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono uppercase text-orbis-cream/70 tracking-widest">{nft.score}</span>
                    <span className="text-base font-grotesk uppercase tracking-tighter mt-0.5">{nft.title}</span>
                  </div>
                  <button className="h-12 w-12 rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform duration-300">
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CTA / FINAL */}
      <section className="relative w-full overflow-hidden">
        {/* Native Aspect Ratio Video */}
        <video 
          autoPlay loop muted playsInline 
          className="w-full h-auto block min-h-[300px]"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4" type="video/mp4" />
        </video>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex items-center">
           <div className="w-full max-w-[1831px] mx-auto px-4 sm:px-8 text-right lg:pr-[20%] lg:pl-[15%]">
              <div className="relative inline-block text-right">
                <span className="absolute -top-12 lg:-top-24 left-0 font-condiment text-[24px] lg:text-[68px] text-orbis-neon mix-blend-exclusion normal-case -rotate-3">
                  Cùng khám phá
                </span>
                <div className="space-y-4 md:space-y-8">
                   <h2 className="font-grotesk text-[16px] md:text-[60px] uppercase leading-none tracking-tighter mb-4 lg:mb-12">
                    GIA NHẬP.
                   </h2>
                   <div className="font-grotesk text-[16px] md:text-[60px] uppercase leading-tight tracking-tighter space-y-1 md:space-y-2">
                    <p>KHÁM PHÁ TIỀM NĂNG.</p>
                    <p>ĐỊNH NGHĨA TƯƠNG LAI.</p>
                    <p>TRẢI NGHIỆM KHÁC BIỆT.</p>
                   </div>
                </div>
              </div>
           </div>
        </div>

        {/* Bottom-left Social Container */}
        <div className="absolute left-[8%] bottom-[12%] lg:bottom-[20%] z-20">
          <div className="liquid-glass rounded-[0.5rem] lg:rounded-[1.25rem] flex flex-col w-[14vw] sm:w-[14.375rem] md:w-[10.78125rem] lg:w-[16.77rem]">
            {socialIcons.map((soc, i) => (
              <button 
                key={i} 
                className={`flex items-center justify-between px-4 lg:px-8 h-[7vw] sm:h-[6rem] md:h-[4rem] lg:h-[7rem] hover:bg-white/5 transition-colors ${i !== socialIcons.length - 1 ? 'border-b border-white/10' : ''}`}
              >
                <soc.icon className="w-4 h-4 md:w-6 md:h-6" />
                <span className="hidden md:block font-grotesk text-xs lg:text-sm tracking-widest uppercase">{soc.label}</span>
                <ChevronRight className="w-4 h-4 text-orbis-neon" />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrbisNft;
