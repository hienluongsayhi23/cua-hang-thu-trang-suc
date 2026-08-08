import React from 'react';
import { Sparkles, ShieldCheck, Award, Heart, PhoneCall, MapPin, Mail, Clock } from 'lucide-react';

interface FooterProps {
  onOpenARStudio: () => void;
  onOpenAIStylist: () => void;
  onOpenRingSizeFinder: () => void;
  onOpenVIPBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenARStudio,
  onOpenAIStylist,
  onOpenRingSizeFinder,
  onOpenVIPBooking,
}) => {
  return (
    <footer className="bg-[#0B0C10] border-t border-[#D4AF37]/30 text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top 4 Trust Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-gray-800 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#171822] border border-[#D4AF37]/40 text-[#E6CA65] flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-white">Công Nghệ AR 60FPS</h4>
              <p className="text-gray-400 mt-1">Đeo thử trang sức thời gian thực với độ chính xác cao trên webcam và ảnh chân dung.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#171822] border border-[#D4AF37]/40 text-[#E6CA65] flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-white">100% GIA Tự Nhiên</h4>
              <p className="text-gray-400 mt-1">Tất cả kim cương đều có mã số khắc laser cạnh GIA và kiểm định quốc tế.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#171822] border border-[#D4AF37]/40 text-[#E6CA65] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-white">Bảo Hành Trọn Đời</h4>
              <p className="text-gray-400 mt-1">Làm mới, si bóng bạch kim và chỉnh sửa size nhẫn hoàn toàn miễn phí trọn đời.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#171822] border border-[#D4AF37]/40 text-[#E6CA65] flex-shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-white">VIP Concierge 24/7</h4>
              <p className="text-gray-400 mt-1">Chuyên gia kim hoàn tư vấn riêng 1-on-1 tại lounge hoặc qua video 4K.</p>
            </div>
          </div>
        </div>

        {/* Brand Story & Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs text-gray-400">
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E6CA65] to-[#84620F] p-0.5">
                <div className="w-full h-full rounded-full bg-[#0B0C10] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#E6CA65]" />
                </div>
              </div>
              <span className="font-serif text-xl font-bold tracking-[0.2em] text-[#FFF4D0]">
                L'AURORA
              </span>
            </div>
            <p className="leading-relaxed">
              Thương hiệu trang sức Haute Joaillerie tiên phong ứng dụng công nghệ thực tế ảo AR và trí tuệ nhân tạo AI để mang đến trải nghiệm ngắm nhìn tuyệt tác kim hoàn chân thực nhất trước khi quyết định sở hữu.
            </p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h5 className="font-serif font-bold text-white uppercase tracking-wider text-xs">Trải Nghiệm AR</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenARStudio} className="hover:text-[#E6CA65] transition-colors">
                  Phòng Thử AR Webcam
                </button>
              </li>
              <li>
                <button onClick={onOpenAIStylist} className="hover:text-[#E6CA65] transition-colors">
                  Trợ Lý AI Stylist
                </button>
              </li>
              <li>
                <button onClick={onOpenRingSizeFinder} className="hover:text-[#E6CA65] transition-colors">
                  Thước Đo Size Nhẫn
                </button>
              </li>
              <li>
                <button onClick={onOpenVIPBooking} className="hover:text-[#E6CA65] transition-colors">
                  Đặt Lịch VIP Lounge
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h5 className="font-serif font-bold text-white uppercase tracking-wider text-xs">Boutique & Lounges</h5>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>Flagship: 88 Đồng Khởi, Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
              </p>
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>Boutique: Tràng Tiền Plaza, 24 Hai Bà Trưng, Hoàn Kiếm, Hà Nội</span>
              </p>
              <p className="flex items-center gap-1.5 text-[#E6CA65]">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Hotline VIP: 1800 8899 (Miễn phí)</span>
              </p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h5 className="font-serif font-bold text-white uppercase tracking-wider text-xs">Đăng Ký Nhận Đặc Quyền</h5>
            <p>Nhận ngay voucher ưu đãi 5,000,000₫ và thông tin bộ sưu tập phiên bản giới hạn.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email của quý khách"
                className="bg-[#171822] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] flex-1"
              />
              <button className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-semibold text-xs hover:bg-[#E6CA65]">
                Gửi
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-4">
          <p>© 2026 L'AURORA Haute Joaillerie & AR Atelier. Bản quyền thuộc về L'AURORA Vietnam.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-300">Chính Sách Bảo Mật</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-300">Cam Kết Kiểm Định GIA</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-300">Quy Định Đổi Trả</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
