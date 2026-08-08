import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Sparkles, Gift, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { CartItem } from '../../types/jewelry';
import { METALS_CONFIG, GEMSTONES_CONFIG } from '../../data/jewelryData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  currency: 'VND' | 'USD';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  currency,
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [selectedGiftBox, setSelectedGiftBox] = useState<'velvet' | 'lacquer' | 'classic'>('velvet');

  const subtotal = items.reduce((acc, i) => acc + i.item.price * i.quantity, 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const total = subtotal - discountAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const code = promoCode.trim().toUpperCase();
    if (code === 'LAURORA2026' || code === 'VIP10') {
      setDiscountPercent(10);
      setPromoApplied(true);
    } else if (code === 'DIAMOND5' || code === 'AR5') {
      setDiscountPercent(5);
      setPromoApplied(true);
    } else {
      setPromoError('Mã ưu đãi không hợp lệ hoặc đã hết hạn.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in text-white">
      <div className="w-full max-w-md bg-[#12131C] border-l border-[#D4AF37]/30 flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#171822] via-[#2A2315] to-[#171822] border-b border-[#D4AF37]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E6CA65] to-[#84620F] p-0.5">
              <div className="w-full h-full rounded-full bg-[#0B0C10] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#E6CA65]" />
              </div>
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#FFF4D0]">Giỏ Hàng Trang Sức Xa Xỉ</h3>
              <p className="text-[11px] text-[#C5A059]">{items.length} tuyệt tác được chọn</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 text-gray-400 hover:text-white hover:bg-black/80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-800">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-[#D4AF37] mx-auto opacity-50" />
              <h4 className="text-base font-serif font-bold text-white">Giỏ hàng của bạn đang trống</h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Hãy khám phá bộ sưu tập và chọn những tuyệt tác kim cương yêu thích để thử AR và mua sắm!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((cartItem) => {
                const metal = METALS_CONFIG[cartItem.selectedMetal] || METALS_CONFIG.platinum;
                const gem = GEMSTONES_CONFIG[cartItem.selectedGemstone] || GEMSTONES_CONFIG.diamond;
                const itemTotal = cartItem.item.price * cartItem.quantity;

                return (
                  <div
                    key={cartItem.id}
                    className="p-3.5 rounded-2xl bg-[#171822] border border-gray-800 hover:border-[#D4AF37]/40 transition-all flex items-center gap-3.5"
                  >
                    <div className="w-14 h-14 rounded-xl bg-black/50 border border-gray-700 flex items-center justify-center flex-shrink-0 p-2">
                      <span className="text-xl">💎</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-serif font-bold text-white truncate">
                        {cartItem.item.vietnameseName}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {metal.vietnameseName} • {gem.name.split(' ')[0]}
                        {cartItem.ringSize && ` • Size ${cartItem.ringSize}`}
                      </p>
                      {cartItem.engravingText && (
                        <p className="text-[10px] text-[#E6CA65] italic">Khắc: "{cartItem.engravingText}"</p>
                      )}
                      <p className="text-xs font-mono font-bold text-[#FFF3C4] mt-1">
                        {itemTotal.toLocaleString('vi-VN')}₫
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={() => onRemoveItem(cartItem.id)}
                        className="text-gray-500 hover:text-rose-400 p-1"
                        title="Xóa khỏi giỏ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5 bg-black/60 rounded-lg px-2 py-0.5 border border-gray-800 text-xs">
                        <button
                          onClick={() => onUpdateQuantity(cartItem.id, -1)}
                          className="text-gray-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="font-mono text-white px-1">{cartItem.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(cartItem.id, 1)}
                          className="text-gray-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Free Luxury Gift Box Selector */}
              <div className="p-3.5 rounded-2xl bg-[#171822] border border-[#D4AF37]/30 space-y-2 mt-4">
                <label className="text-xs font-serif font-bold text-[#E6CA65] flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Hộp Quà Cao Cấp Tặng Kèm (Miễn Phí):</span>
                </label>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setSelectedGiftBox('velvet')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      selectedGiftBox === 'velvet'
                        ? 'bg-[#2A2315] border-[#D4AF37] text-[#FFF3C4]'
                        : 'bg-black/40 border-gray-800 text-gray-400'
                    }`}
                  >
                    Hộp Nhung Đỏ Hoàng Gia
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGiftBox('lacquer')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      selectedGiftBox === 'lacquer'
                        ? 'bg-[#2A2315] border-[#D4AF37] text-[#FFF3C4]'
                        : 'bg-black/40 border-gray-800 text-gray-400'
                    }`}
                  >
                    Hộp Gỗ Sơn Mài Dát Vàng
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGiftBox('classic')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      selectedGiftBox === 'classic'
                        ? 'bg-[#2A2315] border-[#D4AF37] text-[#FFF3C4]'
                        : 'bg-black/40 border-gray-800 text-gray-400'
                    }`}
                  >
                    Hộp Da Khóa Nam Châm
                  </button>
                </div>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Nhập mã voucher (VD: LAURORA2026)"
                    className="flex-1 bg-[#171822] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#242738] hover:bg-[#32364E] text-[#FFF3C4] border border-[#D4AF37]/30 text-xs font-semibold"
                  >
                    Áp dụng
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Đã áp dụng ưu đãi VIP giảm {discountPercent}%!</span>
                  </p>
                )}
                {promoError && <p className="text-[11px] text-rose-400">{promoError}</p>}
              </form>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#171822] border-t border-[#D4AF37]/30 space-y-3">
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="font-mono text-white">{subtotal.toLocaleString('vi-VN')}₫</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Ưu đãi VIP ({discountPercent}%):</span>
                  <span className="font-mono">-{discountAmount.toLocaleString('vi-VN')}₫</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Hộp quà & Giấy chứng nhận GIA:</span>
                <span className="text-[#E6CA65]">Miễn phí</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-gray-800">
                <span className="font-serif">Tổng thanh toán:</span>
                <span className="font-serif text-lg text-[#E6CA65] font-mono">
                  {total.toLocaleString('vi-VN')}₫
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onCheckout();
                onClose();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#E6CA65] via-[#D4AF37] to-[#B8860B] text-black font-serif font-bold text-sm shadow-xl shadow-[#D4AF37]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <span>Tiến Hành Đặt Mua & Thanh Toán</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
