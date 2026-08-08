import React from 'react';
import { Camera, Sparkles, ShieldCheck, Gem, Play, CheckCircle2, ChevronRight, Wand2 } from 'lucide-react';
import { JewelryItem } from '../../types/jewelry';

interface HeroBannerProps {
  onOpenARStudio: () => void;
  onOpenAIStylist: () => void;
  onSelectQuickLook: (itemIds: string[]) => void;
  featuredItems: JewelryItem[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenARStudio,
  onOpenAIStylist,
  onSelectQuickLook,
  featuredItems,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0B0C10] via-[#12131C] to-[#0B0C10] text-white py-12 md:py-20 border-b border-[#D4AF37]/20">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#B8860B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Copy & AR CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#E6CA65] text-xs font-semibold uppercase tracking-widest shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-[#E6CA65] animate-pulse" />
              <span>Công Nghệ Thực Tế Ảo AR & AI Kim Hoàn 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
              Đeo Thử Trang Sức Xa Xỉ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF2BC] via-[#E6CA65] to-[#B38B29]">
                Trực Quan Thời Gian Thực
              </span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Trải nghiệm phòng thử đồ ảo <strong>L'AURORA AR Studio</strong> với độ chính xác cao.
              Ngắm nhìn hoa tai kim cương chuyển động theo cử động đầu, dây chuyền ôm sát xương quai xanh và nhẫn đính hôn lấp lánh trước khi ra quyết định mua sắm.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenARStudio}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#E6CA65] via-[#D4AF37] to-[#B8860B] text-black font-serif font-bold text-base shadow-xl shadow-[#D4AF37]/30 hover:scale-105 hover:shadow-2xl hover:shadow-[#D4AF37]/50 transition-all flex items-center justify-center gap-3 group"
              >
                <div className="w-7 h-7 rounded-full bg-black/15 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
                </div>
                <span>Bật Camera & Thử AR Ngay</span>
              </button>

              <button
                onClick={onOpenAIStylist}
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#1A1C28] hover:bg-[#252838] border border-[#D4AF37]/40 text-gray-200 hover:text-[#E6CA65] font-medium text-sm transition-all flex items-center justify-center gap-2.5 shadow-lg"
              >
                <Wand2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Trợ Lý AI Tư Vấn Gương Mặt</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-800/80 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>100% GIA Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>Physics Dangle AR 60FPS</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>Bảo hiểm vận chuyển VIP 100%</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive AR Preview Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-3xl p-1 bg-gradient-to-b from-[#E6CA65]/60 via-[#84620F]/30 to-[#12131C] shadow-2xl shadow-[#D4AF37]/15">
              <div className="relative rounded-[22px] overflow-hidden bg-[#12131C] aspect-[4/5] flex flex-col justify-between p-6">
                {/* Model Background Image */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=85"
                  alt="L'AURORA AR Model Try On"
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-black/30 to-transparent" />

                {/* Live AR Badges on top */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/40 text-[#E6CA65] text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>LIVE AR TRACKING</span>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-wider">
                    Model: Mai Linh
                  </span>
                </div>

                {/* Sparkling Jewelry Vector Indicators */}
                <div className="relative z-10 my-auto text-center space-y-4">
                  {/* Visual target points on ear & neck */}
                  <div className="relative h-44 w-full">
                    {/* Left ear sparkles */}
                    <div className="absolute left-[24%] top-[30%] animate-bounce flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#E6CA65]/30 border border-[#E6CA65] flex items-center justify-center animate-spin">
                        <Sparkles className="w-3.5 h-3.5 text-[#FFF4D0]" />
                      </div>
                      <span className="absolute left-8 whitespace-nowrap text-[10px] bg-black/80 px-2 py-0.5 rounded text-[#E6CA65] border border-[#D4AF37]/30">
                        Hoa tai giọt nước 2.5ct
                      </span>
                    </div>

                    {/* Neck pendant sparkles */}
                    <div className="absolute left-[48%] top-[68%] -translate-x-1/2 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#D4AF37]/40 border-2 border-[#FFF2BC] flex items-center justify-center shadow-lg shadow-[#D4AF37]/50">
                        <Gem className="w-4 h-4 text-white animate-pulse" />
                      </div>
                      <span className="absolute top-9 whitespace-nowrap text-[10px] bg-black/80 px-2 py-0.5 rounded text-[#FFF4D0] border border-[#D4AF37]/30">
                        Dây chuyền Aura 2.0ct
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Quick Look Launcher Card */}
                <div className="relative z-10 bg-black/80 backdrop-blur-md rounded-xl p-4 border border-[#D4AF37]/40">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-white">Set Hoàng Gia L'Aurore</h4>
                      <p className="text-xs text-[#E6CA65]">Hoa Tai Giọt Nước + Vòng Cổ Kim Cương</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-white">203.500.000₫</span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectQuickLook(['earring-aura-drop', 'necklace-solitaire-choker']);
                      onOpenARStudio();
                    }}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Đeo Thử Ngay Bộ Này Lên Bạn &rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
