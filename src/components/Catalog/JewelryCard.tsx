import React, { useState } from 'react';
import { Camera, Sparkles, Heart, Check, Eye, ShieldCheck, Gem } from 'lucide-react';
import { JewelryItem, MetalType, GemstoneType } from '../../types/jewelry';
import { METALS_CONFIG, GEMSTONES_CONFIG } from '../../data/jewelryData';

interface JewelryCardProps {
  item: JewelryItem;
  onTryOn: (item: JewelryItem) => void;
  onViewDetails: (item: JewelryItem) => void;
  onToggleWishlist: (item: JewelryItem) => void;
  isWishlisted: boolean;
  currency: 'VND' | 'USD';
}

export const JewelryCard: React.FC<JewelryCardProps> = ({
  item,
  onTryOn,
  onViewDetails,
  onToggleWishlist,
  isWishlisted,
  currency,
}) => {
  const [selectedMetal, setSelectedMetal] = useState<MetalType>(item.metal);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const metalConfig = METALS_CONFIG[selectedMetal] || METALS_CONFIG.platinum;
  const gemConfig = GEMSTONES_CONFIG[item.gemstone] || GEMSTONES_CONFIG.diamond;

  const displayPrice =
    currency === 'VND'
      ? `${item.price.toLocaleString('vi-VN')}₫`
      : `$${Math.round(item.price / 25400).toLocaleString('en-US')}`;

  const originalPrice = item.originalPrice
    ? currency === 'VND'
      ? `${item.originalPrice.toLocaleString('vi-VN')}₫`
      : `$${Math.round(item.originalPrice / 25400).toLocaleString('en-US')}`
    : null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-2xl bg-[#12131C] border border-[#D4AF37]/20 hover:border-[#D4AF37]/70 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/15"
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1">
          {item.isBestSeller && (
            <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-wider shadow-md">
              Bán Chạy Nhất
            </span>
          )}
          {item.carat && (
            <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[#E6CA65] border border-[#D4AF37]/40 text-[10px] font-mono">
              💎 {item.carat} Carat
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(item);
          }}
          className="pointer-events-auto p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-gray-300 hover:text-rose-400 hover:scale-110 transition-all"
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-300'}`}
          />
        </button>
      </div>

      {/* Visual Canvas / Dynamic Jewelry Graphic Stage */}
      <div
        onClick={() => onViewDetails(item)}
        className="relative h-64 bg-gradient-to-b from-[#171822] via-[#0E0F14] to-[#12131C] flex items-center justify-center cursor-pointer overflow-hidden p-6"
      >
        {/* Subtle radial spotlight glow */}
        <div
          className="absolute inset-0 opacity-40 group-hover:opacity-75 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${gemConfig.color}25 0%, transparent 70%)`,
          }}
        />

        {/* Jewelry Vector Representation (Simulated 3D Render) */}
        <div className="relative z-10 w-44 h-44 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-700 ease-out">
          {/* Dynamic SVG / Canvas Jewelry Asset */}
          <svg viewBox="-60 -60 120 120" className="w-full h-full drop-shadow-2xl">
            <defs>
              <linearGradient id={`metal-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={metalConfig.gradient[0]} />
                <stop offset="40%" stopColor={metalConfig.gradient[1]} />
                <stop offset="80%" stopColor={metalConfig.gradient[2]} />
                <stop offset="100%" stopColor={metalConfig.gradient[3]} />
              </linearGradient>

              <radialGradient id={`gem-${item.id}`} cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor={gemConfig.color} />
                <stop offset="100%" stopColor={gemConfig.secondaryColor} />
              </radialGradient>
            </defs>

            {/* Render Category Shapes */}
            {item.category === 'earrings' && (
              <g>
                <circle cx="-16" cy="-28" r="4.5" fill={`url(#metal-${item.id})`} />
                <circle cx="-16" cy="-28" r="2.2" fill="#FFF" />
                <line x1="-16" y1="-24" x2="-16" y2="-10" stroke={`url(#metal-${item.id})`} strokeWidth="2" />
                {/* Left Drop */}
                <path
                  d="M -16 -10 C -9 5, -9 18, -16 28 C -23 18, -23 5, -16 -10 Z"
                  fill={`url(#gem-${item.id})`}
                  stroke={`url(#metal-${item.id})`}
                  strokeWidth="1.5"
                />

                <circle cx="16" cy="-28" r="4.5" fill={`url(#metal-${item.id})`} />
                <circle cx="16" cy="-28" r="2.2" fill="#FFF" />
                <line x1="16" y1="-24" x2="16" y2="-10" stroke={`url(#metal-${item.id})`} strokeWidth="2" />
                {/* Right Drop */}
                <path
                  d="M 16 -10 C 23 5, 23 18, 16 28 C 9 18, 9 5, 16 -10 Z"
                  fill={`url(#gem-${item.id})`}
                  stroke={`url(#metal-${item.id})`}
                  strokeWidth="1.5"
                />
              </g>
            )}

            {item.category === 'necklaces' && (
              <g>
                <path
                  d="M -45 -35 Q 0 20, 45 -35"
                  fill="none"
                  stroke={`url(#metal-${item.id})`}
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <circle cx="0" cy="18" r="3.5" fill={`url(#metal-${item.id})`} />
                <circle cx="0" cy="27" r="14" fill={`url(#gem-${item.id})`} stroke={`url(#metal-${item.id})`} strokeWidth="2" />
                <polygon points="0,17 7,27 0,37 -7,27" fill="rgba(255,255,255,0.7)" />
              </g>
            )}

            {item.category === 'rings' && (
              <g>
                <ellipse cx="0" cy="8" rx="26" ry="15" fill="none" stroke={`url(#metal-${item.id})`} strokeWidth="6" />
                <polygon points="-9,0 -6,-16 6,-16 9,0" fill={`url(#metal-${item.id})`} />
                <circle cx="0" cy="-18" r="13" fill={`url(#gem-${item.id})`} stroke={`url(#metal-${item.id})`} strokeWidth="2" />
                <polygon points="0,-27 7,-18 0,-9 -7,-18" fill="rgba(255,255,255,0.8)" />
              </g>
            )}

            {item.category === 'tiaras' && (
              <g>
                <path d="M -45 10 Q 0 -5, 45 10" fill="none" stroke={`url(#metal-${item.id})`} strokeWidth="3.5" />
                <path d="M -30 10 Q -25 -20, -20 10" fill="none" stroke={`url(#metal-${item.id})`} strokeWidth="2" />
                <path d="M 0 10 Q 0 -35, 10 10" fill="none" stroke={`url(#metal-${item.id})`} strokeWidth="2.5" />
                <path d="M 20 10 Q 25 -20, 30 10" fill="none" stroke={`url(#metal-${item.id})`} strokeWidth="2" />
                <circle cx="0" cy="-35" r="4.5" fill={`url(#gem-${item.id})`} />
                <circle cx="-25" cy="-20" r="3.5" fill={`url(#gem-${item.id})`} />
                <circle cx="25" cy="-20" r="3.5" fill={`url(#gem-${item.id})`} />
              </g>
            )}

            {item.category === 'bracelets' && (
              <g>
                <ellipse cx="0" cy="0" rx="38" ry="18" fill="none" stroke={`url(#metal-${item.id})`} strokeWidth="7" />
                {[-30, -15, 0, 15, 30].map((cx, idx) => (
                  <circle key={idx} cx={cx} cy={Math.sin((cx / 38) * 1.5) * 16} r="2.8" fill="#FFF" />
                ))}
              </g>
            )}

            {item.category === 'watches' && (
              <g>
                <circle cx="0" cy="0" r="28" fill="#0B0C10" stroke={`url(#metal-${item.id})`} strokeWidth="6" />
                <circle cx="0" cy="0" r="2" fill="#FFF" />
                <line x1="0" y1="0" x2="0" y2="-14" stroke="#FFF" strokeWidth="2" />
                <line x1="0" y1="0" x2="10" y2="6" stroke="#FFF" strokeWidth="2" />
              </g>
            )}

            {item.category === 'eyewear' && (
              <g>
                <line x1="-12" y1="-5" x2="12" y2="-5" stroke={`url(#metal-${item.id})`} strokeWidth="3" />
                <ellipse cx="-24" cy="4" rx="18" ry="14" fill="#252A35" stroke={`url(#metal-${item.id})`} strokeWidth="2.5" />
                <ellipse cx="24" cy="4" rx="18" ry="14" fill="#252A35" stroke={`url(#metal-${item.id})`} strokeWidth="2.5" />
              </g>
            )}
          </svg>
        </div>

        {/* 360 & Quick View pill */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full border border-gray-700 text-[#E6CA65]">
            <Sparkles className="w-3 h-3" />
            <span>360° Lấp Lánh</span>
          </span>
          <span className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full border border-gray-700 text-gray-200">
            <Eye className="w-3 h-3" />
            <span>Chi Tiết</span>
          </span>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[10px] uppercase font-semibold tracking-widest text-[#D4AF37] block">
            {item.collection}
          </span>
          <h3
            onClick={() => onViewDetails(item)}
            className="font-serif font-bold text-sm text-white hover:text-[#E6CA65] transition-colors cursor-pointer line-clamp-1 mt-0.5"
          >
            {item.vietnameseName}
          </h3>
          <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{item.subtitle}</p>
        </div>

        {/* Metal Swatch Selector on Card */}
        <div className="flex items-center gap-1.5 pt-1">
          {(Object.keys(METALS_CONFIG) as MetalType[]).slice(0, 4).map((mKey) => {
            const m = METALS_CONFIG[mKey];
            const isSel = selectedMetal === mKey;
            return (
              <button
                key={mKey}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMetal(mKey);
                }}
                className={`w-4 h-4 rounded-full border transition-all ${
                  isSel ? 'ring-2 ring-[#D4AF37] scale-110 border-black' : 'border-white/20 opacity-70 hover:opacity-100'
                }`}
                style={{ background: m.hex }}
                title={m.vietnameseName}
              />
            );
          })}
        </div>

        {/* Pricing & Ratings */}
        <div className="flex items-baseline justify-between pt-1 border-t border-gray-800">
          <div>
            <span className="font-serif font-bold text-base text-[#FFF3C4] font-mono">{displayPrice}</span>
            {originalPrice && (
              <span className="text-[11px] text-gray-500 line-through ml-2 font-mono">{originalPrice}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#E6CA65]">
            <span>★</span>
            <span className="font-semibold">{item.rating}</span>
            <span className="text-gray-500">({item.reviewsCount})</span>
          </div>
        </div>

        {/* Main AR Try On Button */}
        <button
          onClick={() => onTryOn(item)}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E6CA65] via-[#D4AF37] to-[#B8860B] text-black font-semibold text-xs shadow-md shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Camera className="w-3.5 h-3.5 text-black fill-current" />
          <span>Đeo Thử Trên AR Ngay &rarr;</span>
        </button>
      </div>
    </div>
  );
};
