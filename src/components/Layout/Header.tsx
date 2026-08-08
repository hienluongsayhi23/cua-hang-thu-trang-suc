import React from 'react';
import {
  Sparkles,
  Camera,
  ShoppingBag,
  Heart,
  Bot,
  Compass,
  Ruler,
  PhoneCall,
  Search,
  BookOpen,
} from 'lucide-react';
import { JewelryCategory } from '../../types/jewelry';

interface HeaderProps {
  activeTab: 'catalog' | 'ar_studio' | 'lookbook';
  setActiveTab: (tab: 'catalog' | 'ar_studio' | 'lookbook') => void;
  onOpenARStudio: (categoryId?: JewelryCategory) => void;
  onOpenAIStylist: () => void;
  onOpenRingSizeFinder: () => void;
  onOpenVIPBooking: () => void;
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currency: 'VND' | 'USD';
  setCurrency: (c: 'VND' | 'USD') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenARStudio,
  onOpenAIStylist,
  onOpenRingSizeFinder,
  onOpenVIPBooking,
  cartCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  searchQuery,
  setSearchQuery,
  currency,
  setCurrency,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0C10]/95 backdrop-blur-md border-b border-[#D4AF37]/20 text-white transition-all shadow-xl">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-gradient-to-r from-[#171822] via-[#2A2315] to-[#171822] py-1.5 px-4 text-center text-xs text-[#E6CA65] border-b border-[#D4AF37]/15 flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-4 text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Phòng thử AR Trực Tiếp 24/7
          </span>
          <span>•</span>
          <span>100% Kim Cương Tự Nhiên Chuẩn GIA Quốc Tế</span>
        </div>

        <div className="mx-auto md:mx-0 flex items-center gap-2 font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" style={{ animationDuration: '6s' }} />
          <span>Trải nghiệm đeo thử trang sức ảo chân thực bằng công nghệ AR thời gian thực</span>
          <button
            onClick={() => onOpenARStudio()}
            className="ml-2 underline font-semibold text-white hover:text-[#D4AF37] transition-colors"
          >
            Thử ngay &rarr;
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-3 text-xs">
          <button
            onClick={() => setCurrency(currency === 'VND' ? 'USD' : 'VND')}
            className="px-2 py-0.5 rounded bg-black/40 border border-[#D4AF37]/30 text-[#E6CA65] hover:bg-[#D4AF37]/20 transition-all font-mono"
          >
            {currency} (Đổi)
          </button>
          <button
            onClick={onOpenVIPBooking}
            className="flex items-center gap-1 text-gray-300 hover:text-[#E6CA65] transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-[#D4AF37]" />
            Đặt lịch VIP Lounge
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('catalog')}
          className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#E6CA65] via-[#C5A059] to-[#84620F] p-0.5 shadow-lg shadow-[#D4AF37]/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-[#0B0C10] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#E6CA65] group-hover:rotate-12 transition-transform duration-500" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFF4D0] via-[#E6CA65] to-[#B38B29]">
              L'AURORA
            </span>
            <span className="text-[9px] uppercase tracking-[0.35em] text-[#C5A059] -mt-1 font-sans font-semibold">
              Haute Joaillerie &bull; AR Atelier
            </span>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm hoa tai kim cương, dây chuyền, nhẫn cưới, vương miện..."
              className="w-full bg-[#171822]/80 border border-[#D4AF37]/25 rounded-full pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Action Controls & Navigation Pills */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Main Action: Open AR Studio */}
          <button
            onClick={() => {
              setActiveTab('ar_studio');
              onOpenARStudio();
            }}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-300 shadow-lg ${
              activeTab === 'ar_studio'
                ? 'bg-gradient-to-r from-[#E6CA65] to-[#B8860B] text-black font-semibold shadow-[#D4AF37]/30 scale-105'
                : 'bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 hover:from-[#D4AF37]/30 hover:to-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FFF3C4]'
            }`}
          >
            <Camera className="w-4 h-4 text-[#D4AF37] fill-current" />
            <span className="hidden sm:inline">Phòng Thử AR</span>
            <span className="sm:hidden">Thử AR</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          </button>

          {/* AI Stylist Assistant Button */}
          <button
            onClick={onOpenAIStylist}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#1E202C] hover:bg-[#282B3B] border border-[#D4AF37]/30 text-xs sm:text-sm text-gray-200 hover:text-[#E6CA65] transition-colors"
            title="Trợ lý AI tư vấn phong cách & phong thủy"
          >
            <Bot className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden md:inline">AI Stylist</span>
          </button>

          {/* Ring Size Tool */}
          <button
            onClick={onOpenRingSizeFinder}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#1E202C] hover:bg-[#282B3B] border border-gray-700 hover:border-[#D4AF37]/40 text-xs text-gray-300 hover:text-[#E6CA65] transition-colors"
            title="Công cụ đo size nhẫn chuẩn xác"
          >
            <Ruler className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Đo Size</span>
          </button>

          {/* Lookbook Gallery */}
          <button
            onClick={() => setActiveTab('lookbook')}
            className={`p-2.5 rounded-full border transition-colors relative ${
              activeTab === 'lookbook'
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#E6CA65]'
                : 'bg-[#171822] border-gray-700 text-gray-300 hover:text-white hover:border-[#D4AF37]/40'
            }`}
            title="Bộ sưu tập ảnh đã thử"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Wishlist */}
          <button
            onClick={onOpenWishlist}
            className="p-2.5 rounded-full bg-[#171822] border border-gray-700 hover:border-[#D4AF37]/40 text-gray-300 hover:text-rose-400 transition-colors relative"
            title="Danh sách yêu thích"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-[#2B2313] to-[#1E190E] border border-[#D4AF37]/50 text-white hover:border-[#D4AF37] transition-all shadow-md"
            title="Giỏ hàng trang sức"
          >
            <ShoppingBag className="w-4 h-4 text-[#E6CA65]" />
            <span className="text-xs font-semibold text-[#FFF3C4] font-mono">{cartCount}</span>
          </button>
        </div>
      </div>

      {/* Sub Category Quick Navigation */}
      <div className="bg-[#12131C] border-t border-gray-800/80 px-4 py-2 overflow-x-auto scrollbar-none flex items-center justify-center space-x-6 text-xs text-gray-300">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`hover:text-[#E6CA65] transition-colors whitespace-nowrap ${
            activeTab === 'catalog' ? 'text-[#E6CA65] font-semibold border-b border-[#E6CA65] pb-0.5' : ''
          }`}
        >
          Tất Cả Tuyệt Tác
        </button>
        <button
          onClick={() => {
            setActiveTab('catalog');
            onOpenARStudio('earrings');
          }}
          className="hover:text-[#E6CA65] transition-colors whitespace-nowrap flex items-center gap-1"
        >
          <span>💎 Hoa Tai & Khuyên Tai</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('catalog');
            onOpenARStudio('necklaces');
          }}
          className="hover:text-[#E6CA65] transition-colors whitespace-nowrap flex items-center gap-1"
        >
          <span>📿 Dây Chuyền & Vòng Cổ</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('catalog');
            onOpenARStudio('rings');
          }}
          className="hover:text-[#E6CA65] transition-colors whitespace-nowrap flex items-center gap-1"
        >
          <span>💍 Nhẫn Cầu Hôn & Kim Cương</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('catalog');
            onOpenARStudio('tiaras');
          }}
          className="hover:text-[#E6CA65] transition-colors whitespace-nowrap flex items-center gap-1"
        >
          <span>👑 Vương Miện Cô Dâu</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('catalog');
            onOpenARStudio('bracelets');
          }}
          className="hover:text-[#E6CA65] transition-colors whitespace-nowrap flex items-center gap-1"
        >
          <span>✨ Vòng Tay & Lắc Tennis</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('catalog');
            onOpenARStudio('watches');
          }}
          className="hover:text-[#E6CA65] transition-colors whitespace-nowrap flex items-center gap-1"
        >
          <span>⌚ Đồng Hồ Xa Xỉ</span>
        </button>
      </div>
    </header>
  );
};
