import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, PhoneCall, Sparkles, CheckCircle2, GlassWater } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VIPBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VIPBookingModal: React.FC<VIPBookingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [bookingType, setBookingType] = useState<'boutique' | 'video'>('boutique');
  const [selectedBoutique, setSelectedBoutique] = useState('hcm');
  const [guestName, setGuestName] = useState('Trần Minh Anh');
  const [guestPhone, setGuestPhone] = useState('0987 654 321');
  const [bookingDate, setBookingDate] = useState('2026-08-15');
  const [bookingTime, setBookingTime] = useState('14:30');
  const [hospitality, setHospitality] = useState('champagne');
  const [isBooked, setIsBooked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#FFF3C4', '#F6E05E'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in text-white">
      <div className="relative w-full max-w-xl bg-[#12131C] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/80 border border-white/20 text-gray-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {isBooked ? (
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E6CA65] to-[#84620F] p-0.5 mx-auto">
              <div className="w-full h-full rounded-full bg-[#0B0C10] flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#E6CA65]" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                Lịch Hẹn VIP Đã Được Xác Nhận
              </span>
              <h3 className="font-serif font-bold text-2xl text-white">
                Chào Đón Quý Khách Tại L'AURORA Lounge
              </h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto">
                Chuyên gia kim hoàn cao cấp sẽ liên hệ quý khách qua số <strong className="text-[#E6CA65]">{guestPhone}</strong> để chuẩn bị sẵn các mẫu trang sức bạn đã thử trên AR.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#171822] border border-[#D4AF37]/30 text-xs text-left space-y-1.5 max-w-sm mx-auto">
              <p className="text-gray-400">
                Thời gian: <strong className="text-white">{bookingDate} vào lúc {bookingTime}</strong>
              </p>
              <p className="text-gray-400">
                Địa điểm:{' '}
                <strong className="text-white">
                  {selectedBoutique === 'hcm' ? 'Flagship Đồng Khởi, Q.1, TP. HCM' : 'Boutique Tràng Tiền Plaza, Hà Nội'}
                </strong>
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#E6CA65] via-[#D4AF37] to-[#B8860B] text-black font-bold text-xs shadow-xl"
            >
              Hoàn Tất & Tiếp Tục Thử AR
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="border-b border-gray-800 pb-3">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                Đặc Quyền Khách Hàng VIP
              </span>
              <h3 className="font-serif font-bold text-xl text-white mt-1">
                Đặt Lịch Hẹn Thử Trang Sức Trực Tiếp & Cố Vấn Kim Hoàn
              </h3>
            </div>

            {/* Type Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBookingType('boutique')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  bookingType === 'boutique'
                    ? 'bg-[#2A2315] border-[#D4AF37] text-[#FFF3C4]'
                    : 'bg-[#171822] border-gray-800 text-gray-400'
                }`}
              >
                <MapPin className="w-4 h-4 mx-auto mb-1 text-[#D4AF37]" />
                <span className="text-xs font-semibold block">Trải Nghiệm Tại Lounge</span>
                <span className="text-[10px] text-gray-400 block">TP. HCM & Hà Nội</span>
              </button>

              <button
                type="button"
                onClick={() => setBookingType('video')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  bookingType === 'video'
                    ? 'bg-[#2A2315] border-[#D4AF37] text-[#FFF3C4]'
                    : 'bg-[#171822] border-gray-800 text-gray-400'
                }`}
              >
                <PhoneCall className="w-4 h-4 mx-auto mb-1 text-[#D4AF37]" />
                <span className="text-xs font-semibold block">Video Call 1-1 Chuyên Gia</span>
                <span className="text-[10px] text-gray-400 block">Kính lúp macro 4K trực tiếp</span>
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Họ và tên của quý khách"
                  className="bg-[#171822] border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="Số điện thoại"
                  className="bg-[#171822] border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="bg-[#171822] border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="time"
                  required
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="bg-[#171822] border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Hospitality */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-gray-400 flex items-center gap-1">
                  <GlassWater className="w-3 h-3 text-[#D4AF37]" />
                  <span>Trà & Thức uống chào đón quý khách tại phòng VIP:</span>
                </label>
                <select
                  value={hospitality}
                  onChange={(e) => setHospitality(e.target.value)}
                  className="w-full bg-[#171822] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="champagne">Champagne Dom Pérignon & Macaron Pháp</option>
                  <option value="tea">Trà Thượng Hạng Thiết Quan Âm & Bánh Yến Mạch</option>
                  <option value="coffee">Cà Phê Espresso Ý & Socola Bỉ</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E6CA65] via-[#D4AF37] to-[#B8860B] text-black font-serif font-bold text-xs shadow-xl shadow-[#D4AF37]/20 hover:scale-[1.02] transition-all"
            >
              Xác Nhận Lịch Hẹn VIP Tại L'AURORA
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
