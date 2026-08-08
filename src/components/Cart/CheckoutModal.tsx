import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  CheckCircle2,
  Lock,
  Copy,
  Sparkles,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem } from '../../types/jewelry';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: () => void;
  currency: 'VND' | 'USD';
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderComplete,
  currency,
}) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'card' | 'vip_concierge'>('vietqr');
  const [fullName, setFullName] = useState('Nguyễn Hoàng Lan');
  const [phone, setPhone] = useState('0912 345 678');
  const [address, setAddress] = useState('Toà nhà Landmark 81, 720A Điện Biên Phủ, P. 22, Bình Thạnh, TP. HCM');
  const [deliveryNote, setDeliveryNote] = useState('Vui lòng gọi trước khi giao 30 phút, giao kèm hộp nhung đỏ.');
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const subtotal = items.reduce((acc, i) => acc + i.item.price * i.quantity, 0);
  const orderId = `LAU-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#FFF3C4', '#F6E05E', '#C5A059'],
    });
    setTimeout(() => {
      onOrderComplete();
    }, 4000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in text-white">
      <div className="relative w-full max-w-2xl bg-[#12131C] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/80 border border-white/20 text-gray-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          /* Order Confirmation Screen */
          <div className="py-8 text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E6CA65] to-[#84620F] p-0.5 mx-auto shadow-2xl">
              <div className="w-full h-full rounded-full bg-[#0B0C10] flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#E6CA65]" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                Giao Dịch Kim Hoàn Thành Công
              </span>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                Cảm Ơn Quý Khách Đã Lựa Chọn L'AURORA
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
                Mã đơn hàng: <strong className="text-[#E6CA65] font-mono">{orderId}</strong>. Chuyên viên bảo mật kim
                hoàn sẽ liên hệ xác nhận và tiến hành đóng gói tiêu chuẩn GIA ngay.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#171822] border border-[#D4AF37]/30 text-xs text-left space-y-2 max-w-md mx-auto">
              <div className="flex justify-between text-gray-400">
                <span>Người nhận:</span>
                <span className="text-white font-medium">{fullName}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Số điện thoại:</span>
                <span className="text-white font-mono">{phone}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tổng giá trị:</span>
                <span className="text-[#E6CA65] font-mono font-bold">{subtotal.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#E6CA65] via-[#D4AF37] to-[#B8860B] text-black font-serif font-bold text-sm shadow-xl"
            >
              Hoàn Tất & Tiếp Tục Trải Nghiệm AR
            </button>
          </div>
        ) : (
          /* Main Checkout Form */
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            <div className="border-b border-gray-800 pb-4">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                Bảo Mật Tiêu Chuẩn Quốc Tế
              </span>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-white mt-1">
                Thanh Toán Đơn Hàng Trang Sức
              </h3>
            </div>

            {/* 1. Customer Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-serif font-bold text-[#E6CA65] uppercase tracking-wider">
                1. Thông Tin Nhận Hàng VIP
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Họ và tên quý khách"
                  className="bg-[#171822] border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Số điện thoại liên hệ"
                  className="bg-[#171822] border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Địa chỉ giao hàng chi tiết"
                className="w-full bg-[#171822] border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
              <input
                type="text"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                placeholder="Ghi chú thêm cho nhân viên bảo mật giao hàng"
                className="w-full bg-[#171822] border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* 2. Payment Method Selector */}
            <div className="space-y-3 pt-3 border-t border-gray-800">
              <h4 className="text-xs font-serif font-bold text-[#E6CA65] uppercase tracking-wider">
                2. Phương Thức Thanh Toán
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('vietqr')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    paymentMethod === 'vietqr'
                      ? 'bg-[#2A2315] border-[#D4AF37] text-[#FFF3C4]'
                      : 'bg-[#171822] border-gray-800 text-gray-400'
                  }`}
                >
                  <QrCode className="w-5 h-5 mx-auto mb-1 text-[#D4AF37]" />
                  <span className="text-[11px] font-semibold block">VietQR Pro</span>
                  <span className="text-[9px] text-gray-400 block">Quét mã tức thì</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-[#2A2315] border-[#D4AF37] text-[#FFF3C4]'
                      : 'bg-[#171822] border-gray-800 text-gray-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#D4AF37]" />
                  <span className="text-[11px] font-semibold block">Thẻ Quốc Tế</span>
                  <span className="text-[9px] text-gray-400 block">Visa / Master / JCB</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('vip_concierge')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    paymentMethod === 'vip_concierge'
                      ? 'bg-[#2A2315] border-[#D4AF37] text-[#FFF3C4]'
                      : 'bg-[#171822] border-gray-800 text-gray-400'
                  }`}
                >
                  <Truck className="w-5 h-5 mx-auto mb-1 text-[#D4AF37]" />
                  <span className="text-[11px] font-semibold block">VIP Concierge</span>
                  <span className="text-[9px] text-gray-400 block">Thanh toán tại nhà</span>
                </button>
              </div>

              {/* VietQR Dynamic Display */}
              {paymentMethod === 'vietqr' && (
                <div className="p-4 rounded-2xl bg-black/60 border border-[#D4AF37]/40 flex flex-col sm:flex-row items-center gap-4">
                  {/* Visual QR Code Generator */}
                  <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center flex-shrink-0">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=LAURORA_${orderId}_${subtotal}`}
                      alt="VietQR Payment Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="text-xs space-y-1.5 flex-1">
                    <p className="font-bold text-[#E6CA65]">Ngân hàng Thương Mại Cổ Phần Ngoại Thương (Vietcombank)</p>
                    <p className="text-gray-300">
                      Số TK: <strong className="text-white font-mono">9988 8866 2026</strong> (Chủ TK: L'AURORA ATELIER)
                    </p>
                    <p className="text-gray-300">
                      Số tiền: <strong className="text-[#FFF3C4] font-mono">{subtotal.toLocaleString('vi-VN')}₫</strong>
                    </p>
                    <p className="text-gray-400 text-[11px]">Nội dung: {orderId}</p>

                    <button
                      type="button"
                      onClick={() => handleCopy(`998888662026`)}
                      className="text-[11px] text-[#E6CA65] flex items-center gap-1 hover:underline pt-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? 'Đã sao chép số tài khoản!' : 'Sao chép số tài khoản'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Total & Submit Button */}
            <div className="pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-gray-400 block">Tổng thanh toán đơn hàng:</span>
                <span className="font-serif text-2xl font-bold text-[#E6CA65] font-mono">
                  {subtotal.toLocaleString('vi-VN')}₫
                </span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#E6CA65] via-[#D4AF37] to-[#B8860B] text-black font-serif font-bold text-sm shadow-xl shadow-[#D4AF37]/30 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-black" />
                <span>Xác Nhận & Đặt Hàng Ngay</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
