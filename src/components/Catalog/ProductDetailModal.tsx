import React, { useState } from 'react';
import {
  X,
  Camera,
  Sparkles,
  ShieldCheck,
  Award,
  Gem,
  ShoppingBag,
  Heart,
  Ruler,
  Check,
  Rotate3d,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { JewelryItem, MetalType, GemstoneType } from '../../types/jewelry';
import { METALS_CONFIG, GEMSTONES_CONFIG } from '../../data/jewelryData';

interface ProductDetailModalProps {
  item: JewelryItem | null;
  onClose: () => void;
  onTryOn: (item: JewelryItem) => void;
  onAddToCart: (item: JewelryItem, metal: MetalType, gemstone: GemstoneType, customText?: string) => void;
  onToggleWishlist: (item: JewelryItem) => void;
  isWishlisted: boolean;
  currency: 'VND' | 'USD';
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  onClose,
  onTryOn,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  currency,
}) => {
  if (!item) return null;

  const [selectedMetal, setSelectedMetal] = useState<MetalType>(item.metal);
  const [selectedGemstone, setSelectedGemstone] = useState<GemstoneType>(item.gemstone);
  const [engravingText, setEngravingText] = useState<string>('');
  const [selectedRingSize, setSelectedRingSize] = useState<number>(12);
  const [activeTab, setActiveTab] = useState<'details' | '4c_gia' | 'reviews'>('details');

  const metalConfig = METALS_CONFIG[selectedMetal] || METALS_CONFIG.platinum;
  const gemConfig = GEMSTONES_CONFIG[selectedGemstone] || GEMSTONES_CONFIG.diamond;

  const displayPrice =
    currency === 'VND'
      ? `${item.price.toLocaleString('vi-VN')}₫`
      : `$${Math.round(item.price / 25400).toLocaleString('en-US')}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#12131C] border border-[#D4AF37]/40 rounded-3xl overflow-hidden shadow-2xl text-white flex flex-col my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-gray-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left Column: Visual Showcase Stage */}
          <div className="md:col-span-6 bg-gradient-to-b from-[#171822] via-[#0B0C10] to-[#171822] p-8 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-[#D4AF37]/20 relative">
            {/* Top GIA Badge */}
            <div className="w-full flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#E6CA65] text-xs font-mono">
                {item.giaCertificateNumber ? `GIA: ${item.giaCertificateNumber}` : 'GIA CERTIFIED'}
              </span>

              <button
                onClick={() => onToggleWishlist(item)}
                className="p-2 rounded-full bg-black/40 text-gray-300 hover:text-rose-400 border border-white/10"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Central 3D Vector Stage with dynamic glow */}
            <div className="relative w-64 h-64 my-6 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ background: gemConfig.color }}
              />

              <svg viewBox="-60 -60 120 120" className="w-56 h-56 drop-shadow-[0_20px_25px_rgba(212,175,55,0.25)]">
                <defs>
                  <linearGradient id={`detail-metal-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={metalConfig.gradient[0]} />
                    <stop offset="40%" stopColor={metalConfig.gradient[1]} />
                    <stop offset="80%" stopColor={metalConfig.gradient[2]} />
                    <stop offset="100%" stopColor={metalConfig.gradient[3]} />
                  </linearGradient>

                  <radialGradient id={`detail-gem-${item.id}`} cx="40%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="40%" stopColor={gemConfig.color} />
                    <stop offset="100%" stopColor={gemConfig.secondaryColor} />
                  </radialGradient>
                </defs>

                {/* Render Shape */}
                {item.category === 'rings' && (
                  <g>
                    <ellipse cx="0" cy="10" rx="32" ry="18" fill="none" stroke={`url(#detail-metal-${item.id})`} strokeWidth="7" />
                    <circle cx="0" cy="-22" r="16" fill={`url(#detail-gem-${item.id})`} stroke={`url(#detail-metal-${item.id})`} strokeWidth="2.5" />
                    <polygon points="0,-34 9,-22 0,-10 -9,-22" fill="rgba(255,255,255,0.85)" />
                  </g>
                )}

                {item.category === 'earrings' && (
                  <g>
                    <circle cx="-20" cy="-30" r="5" fill={`url(#detail-metal-${item.id})`} />
                    <path
                      d="M -20 -10 C -10 8, -10 22, -20 32 C -30 22, -30 8, -20 -10 Z"
                      fill={`url(#detail-gem-${item.id})`}
                      stroke={`url(#detail-metal-${item.id})`}
                      strokeWidth="2"
                    />
                    <circle cx="20" cy="-30" r="5" fill={`url(#detail-metal-${item.id})`} />
                    <path
                      d="M 20 -10 C 30 8, 30 22, 20 32 C 10 22, 10 8, 20 -10 Z"
                      fill={`url(#detail-gem-${item.id})`}
                      stroke={`url(#detail-metal-${item.id})`}
                      strokeWidth="2"
                    />
                  </g>
                )}

                {item.category === 'necklaces' && (
                  <g>
                    <path d="M -50 -40 Q 0 25, 50 -40" fill="none" stroke={`url(#detail-metal-${item.id})`} strokeWidth="3" />
                    <circle cx="0" cy="22" r="4" fill={`url(#detail-metal-${item.id})`} />
                    <circle cx="0" cy="34" r="16" fill={`url(#detail-gem-${item.id})`} stroke={`url(#detail-metal-${item.id})`} strokeWidth="2.5" />
                  </g>
                )}

                {item.category === 'tiaras' && (
                  <g>
                    <path d="M -50 15 Q 0 -5, 50 15" fill="none" stroke={`url(#detail-metal-${item.id})`} strokeWidth="4" />
                    <path d="M 0 15 Q 0 -40, 15 15" fill="none" stroke={`url(#detail-metal-${item.id})`} strokeWidth="3" />
                    <circle cx="0" cy="-40" r="5.5" fill={`url(#detail-gem-${item.id})`} />
                  </g>
                )}

                {['bracelets', 'watches', 'eyewear'].includes(item.category) && (
                  <g>
                    <ellipse cx="0" cy="0" rx="42" ry="22" fill="none" stroke={`url(#detail-metal-${item.id})`} strokeWidth="8" />
                    <circle cx="0" cy="-22" r="4" fill={`url(#detail-gem-${item.id})`} />
                  </g>
                )}
              </svg>
            </div>

            {/* Engraving Preview Text on piece */}
            {engravingText && (
              <div className="px-3 py-1 rounded-full bg-black/60 border border-[#D4AF37]/50 text-[11px] text-[#FFF3C4] font-serif italic text-center">
                Khắc laser: "{engravingText}"
              </div>
            )}

            {/* Quick 1-Click AR Action */}
            <button
              onClick={() => {
                onTryOn(item);
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E6CA65] via-[#D4AF37] to-[#B8860B] text-black font-bold text-sm shadow-xl shadow-[#D4AF37]/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Camera className="w-4 h-4 text-black fill-current" />
              <span>Đeo Thử Ngay Trong Phòng AR &rarr;</span>
            </button>
          </div>

          {/* Right Column: Information, Customizer & Add To Cart */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                  {item.collection}
                </span>
                <h2 className="font-serif font-bold text-2xl text-white mt-1">{item.vietnameseName}</h2>
                <p className="text-xs text-gray-400 mt-1">{item.description}</p>
              </div>

              {/* Price & Rating */}
              <div className="flex items-center justify-between py-2 border-y border-gray-800">
                <span className="font-serif font-bold text-2xl text-[#FFF3C4] font-mono">{displayPrice}</span>
                <div className="flex items-center gap-1.5 text-xs text-[#E6CA65]">
                  <span>★</span>
                  <span className="font-bold">{item.rating}</span>
                  <span className="text-gray-500">({item.reviewsCount} đánh giá xác thực)</span>
                </div>
              </div>

              {/* 1. Metal Customizer */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex justify-between">
                  <span>Chất liệu kim loại:</span>
                  <span className="text-[#E6CA65] font-normal">{metalConfig.vietnameseName}</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(METALS_CONFIG) as MetalType[]).map((mKey) => {
                    const m = METALS_CONFIG[mKey];
                    const isSel = selectedMetal === mKey;
                    return (
                      <button
                        key={mKey}
                        onClick={() => setSelectedMetal(mKey)}
                        className={`p-2.5 rounded-xl border text-left text-xs flex items-center gap-2 transition-all ${
                          isSel
                            ? 'bg-[#2A2315] border-[#D4AF37] text-[#FFF3C4]'
                            : 'bg-[#171822] border-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-black" style={{ background: m.hex }} />
                        <span className="truncate">{m.vietnameseName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Gemstone Customizer */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex justify-between">
                  <span>Đá quý & Kim cương:</span>
                  <span className="text-[#E6CA65] font-normal">{gemConfig.name}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(GEMSTONES_CONFIG) as GemstoneType[]).slice(0, 6).map((gKey) => {
                    const g = GEMSTONES_CONFIG[gKey];
                    const isSel = selectedGemstone === gKey;
                    return (
                      <button
                        key={gKey}
                        onClick={() => setSelectedGemstone(gKey)}
                        className={`p-2 rounded-xl border text-center text-xs transition-all ${
                          isSel
                            ? 'bg-[#2A2315] border-[#D4AF37] text-[#FFF3C4]'
                            : 'bg-[#171822] border-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full mx-auto mb-1 block" style={{ background: g.color }} />
                        <span className="truncate block text-[10px]">{g.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Laser Engraving Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex justify-between">
                  <span>Khắc Laser Miễn Phí (Tùy chọn):</span>
                  <span className="text-[10px] text-gray-400">{engravingText.length}/20 ký tự</span>
                </label>
                <input
                  type="text"
                  maxLength={20}
                  value={engravingText}
                  onChange={(e) => setEngravingText(e.target.value)}
                  placeholder="VD: Forever With You • 2026"
                  className="w-full bg-[#171822] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* 4C Diamond Certificate Specs */}
              {item.diamondCut && (
                <div className="p-3 rounded-xl bg-[#171822] border border-[#D4AF37]/30 text-xs space-y-1">
                  <div className="flex justify-between text-gray-300">
                    <span>Chuẩn 4C GIA:</span>
                    <span className="text-[#E6CA65] font-mono">
                      {item.carat}ct • {item.diamondColor} • {item.diamondClarity} • {item.diamondCut}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-gray-800 flex items-center gap-3">
              <button
                onClick={() => {
                  onAddToCart(item, selectedMetal, selectedGemstone, engravingText);
                  onClose();
                }}
                className="flex-1 py-3.5 rounded-xl bg-[#2B2313] hover:bg-[#382D18] border border-[#D4AF37] text-[#FFF3C4] font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span>Thêm Vào Giỏ Hàng</span>
              </button>

              <button
                onClick={() => {
                  onTryOn(item);
                  onClose();
                }}
                className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-semibold text-xs hover:opacity-90 flex items-center gap-1.5"
              >
                <Camera className="w-4 h-4 fill-current" />
                <span>Thử AR</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
