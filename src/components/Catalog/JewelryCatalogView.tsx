import React, { useState, useMemo } from 'react';
import { Sparkles, SlidersHorizontal, Filter, Layers, Gem, Flame } from 'lucide-react';
import { JewelryItem, JewelryCategory, MetalType, GemstoneType, FaceShape, FengShuiElement } from '../../types/jewelry';
import { JEWELRY_CATALOG, COLLECTIONS, FENG_SHUI_ELEMENTS } from '../../data/jewelryData';
import { JewelryCard } from './JewelryCard';

interface JewelryCatalogViewProps {
  onTryOnItem: (item: JewelryItem) => void;
  onViewDetails: (item: JewelryItem) => void;
  onToggleWishlist: (item: JewelryItem) => void;
  wishlist: string[];
  searchQuery: string;
  currency: 'VND' | 'USD';
  selectedCategoryFilter?: JewelryCategory | 'all';
}

export const JewelryCatalogView: React.FC<JewelryCatalogViewProps> = ({
  onTryOnItem,
  onViewDetails,
  onToggleWishlist,
  wishlist,
  searchQuery,
  currency,
  selectedCategoryFilter = 'all',
}) => {
  const [category, setCategory] = useState<JewelryCategory | 'all'>(selectedCategoryFilter);
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedMetal, setSelectedMetal] = useState<MetalType | 'all'>('all');
  const [selectedGemstone, setSelectedGemstone] = useState<GemstoneType | 'all'>('all');
  const [selectedFaceShape, setSelectedFaceShape] = useState<FaceShape | 'all'>('all');
  const [selectedFengShui, setSelectedFengShui] = useState<FengShuiElement | 'all'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(350000000);

  // Sync category if passed from parent
  React.useEffect(() => {
    if (selectedCategoryFilter) {
      setCategory(selectedCategoryFilter);
    }
  }, [selectedCategoryFilter]);

  // Categories list with counts
  const categoriesList: { id: JewelryCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'Tất Cả Tuyệt Tác', icon: '✨' },
    { id: 'earrings', label: 'Hoa Tai & Khuyên', icon: '💎' },
    { id: 'necklaces', label: 'Dây Chuyền & Vòng Cổ', icon: '📿' },
    { id: 'rings', label: 'Nhẫn Cầu Hôn & Kim Cương', icon: '💍' },
    { id: 'tiaras', label: 'Vương Miện Cô Dâu', icon: '👑' },
    { id: 'bracelets', label: 'Vòng Tay & Lắc Tennis', icon: '✨' },
    { id: 'watches', label: 'Đồng Hồ Xa Xỉ', icon: '⌚' },
    { id: 'eyewear', label: 'Kính Mắt & Trang Sức', icon: '🕶️' },
  ];

  // Filtered & Sorted Jewelry List
  const filteredItems = useMemo(() => {
    return JEWELRY_CATALOG.filter((item) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          item.vietnameseName.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Category
      if (category !== 'all' && item.category !== category) return false;

      // Collection
      if (selectedCollection !== 'all' && item.collectionId !== selectedCollection) return false;

      // Metal
      if (selectedMetal !== 'all' && item.metal !== selectedMetal) return false;

      // Gemstone
      if (selectedGemstone !== 'all' && item.gemstone !== selectedGemstone) return false;

      // Face Shape
      if (selectedFaceShape !== 'all' && !item.suitableFaceShapes.includes(selectedFaceShape)) return false;

      // Feng Shui
      if (selectedFengShui !== 'all' && !item.fengShuiElement.includes(selectedFengShui)) return false;

      // Price
      if (item.price > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [
    searchQuery,
    category,
    selectedCollection,
    selectedMetal,
    selectedGemstone,
    selectedFaceShape,
    selectedFengShui,
    sortBy,
    maxPrice,
  ]);

  const resetFilters = () => {
    setCategory('all');
    setSelectedCollection('all');
    setSelectedMetal('all');
    setSelectedGemstone('all');
    setSelectedFaceShape('all');
    setSelectedFengShui('all');
    setMaxPrice(350000000);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {categoriesList.map((cat) => {
          const isSelected = category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#E6CA65] via-[#D4AF37] to-[#B8860B] text-black shadow-lg shadow-[#D4AF37]/20 scale-105'
                  : 'bg-[#171822] text-gray-300 hover:text-white hover:border-[#D4AF37]/40 border border-gray-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Box */}
      <div className="bg-[#12131C] border border-[#D4AF37]/25 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#E6CA65] uppercase tracking-wider">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Bộ Lọc Thông Minh & Phong Thủy Ngũ Hành</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-mono">
              Hiển thị: <strong className="text-[#FFF3C4]">{filteredItems.length}</strong> tuyệt tác
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-gray-400 hover:text-[#E6CA65] transition-colors underline"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Collection */}
          <div className="space-y-1">
            <label className="text-[11px] text-gray-400">Bộ Sưu Tập</label>
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="w-full bg-[#1A1C28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">Tất cả bộ sưu tập</option>
              {COLLECTIONS.filter((c) => c.id !== 'all').map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Metal */}
          <div className="space-y-1">
            <label className="text-[11px] text-gray-400">Kim Loại Quý</label>
            <select
              value={selectedMetal}
              onChange={(e) => setSelectedMetal(e.target.value as any)}
              className="w-full bg-[#1A1C28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">Tất cả kim loại</option>
              <option value="platinum">Bạch Kim Platinum 950</option>
              <option value="yellow_gold">Vàng Vàng 18K</option>
              <option value="rose_gold">Vàng Hồng 18K</option>
              <option value="silver">Bạc Ý 925</option>
            </select>
          </div>

          {/* Gemstone */}
          <div className="space-y-1">
            <label className="text-[11px] text-gray-400">Đá Quý & Kim Cương</label>
            <select
              value={selectedGemstone}
              onChange={(e) => setSelectedGemstone(e.target.value as any)}
              className="w-full bg-[#1A1C28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">Tất cả loại đá</option>
              <option value="diamond">Kim Cương Tự Nhiên (Nước D)</option>
              <option value="ruby">Ruby Huyết Bồ Câu</option>
              <option value="sapphire">Sapphire Hoàng Gia</option>
              <option value="emerald">Ngọc Lục Bảo Colombia</option>
              <option value="pearl">Ngọc Trai South Sea</option>
              <option value="moissanite">Moissanite Tinh Cầu</option>
            </select>
          </div>

          {/* Face Shape Filter */}
          <div className="space-y-1">
            <label className="text-[11px] text-gray-400">Hợp Dáng Khuôn Mặt</label>
            <select
              value={selectedFaceShape}
              onChange={(e) => setSelectedFaceShape(e.target.value as any)}
              className="w-full bg-[#1A1C28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">Tất cả dáng mặt</option>
              <option value="oval">Mặt Trái Xoan (Oval)</option>
              <option value="round">Mặt Tròn (Round)</option>
              <option value="heart">Mặt Trái Tim (Heart)</option>
              <option value="square">Mặt Vuông (Square)</option>
              <option value="oblong">Mặt Thon Dài (Oblong)</option>
            </select>
          </div>

          {/* Feng Shui Element */}
          <div className="space-y-1">
            <label className="text-[11px] text-gray-400">Mệnh Ngũ Hành</label>
            <select
              value={selectedFengShui}
              onChange={(e) => setSelectedFengShui(e.target.value as any)}
              className="w-full bg-[#1A1C28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">Tất cả bản mệnh</option>
              <option value="kim">Mệnh Kim (Bạch Kim & Kim Cương)</option>
              <option value="moc">Mệnh Mộc (Ngọc Lục Bảo)</option>
              <option value="thuy">Mệnh Thủy (Sapphire Xanh)</option>
              <option value="hoa">Mệnh Hỏa (Ruby Huyết Đỏ)</option>
              <option value="tho">Mệnh Thổ (Thạch Anh & Vàng 18K)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="space-y-1">
            <label className="text-[11px] text-gray-400">Sắp Xếp</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#1A1C28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="featured">Nổi bật nhất</option>
              <option value="price_asc">Giá: Thấp đến Cao</option>
              <option value="price_desc">Giá: Cao đến Thấp</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid of Jewelry Cards */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-[#12131C] rounded-2xl border border-gray-800 p-8">
          <Sparkles className="w-12 h-12 text-[#D4AF37] mx-auto opacity-50" />
          <h3 className="text-lg font-serif font-bold text-white">Không tìm thấy sản phẩm phù hợp</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Hãy thử nới lỏng bộ lọc hoặc tìm kiếm theo từ khóa khác như "hoa tai", "kim cương", "sapphire".
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-semibold text-xs"
          >
            Xem Tất Cả Sản Phẩm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <JewelryCard
              key={item.id}
              item={item}
              onTryOn={onTryOnItem}
              onViewDetails={onViewDetails}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlist.includes(item.id)}
              currency={currency}
            />
          ))}
        </div>
      )}
    </div>
  );
};
