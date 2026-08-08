import React, { useState } from 'react';
import { X, Ruler, CreditCard, Sparkles, Check, HelpCircle } from 'lucide-react';

interface RingSizeFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize?: (sizeVN: number) => void;
}

export const RingSizeFinderModal: React.FC<RingSizeFinderModalProps> = ({
  isOpen,
  onClose,
  onSelectSize,
}) => {
  if (!isOpen) return null;

  // Diameter in mm (range: 14.0mm to 22.5mm)
  const [diameterMm, setDiameterMm] = useState<number>(16.5); // Standard size 12 VN (~16.5mm)
  const [calibrationScale, setCalibrationScale] = useState<number>(1.0); // 1px ratio

  // Conversion table lookup
  const circumferenceMm = (diameterMm * Math.PI).toFixed(1);
  const sizeVN = Math.round((diameterMm - 14.0) * 2 + 7);
  const sizeUS = ((diameterMm - 11.5) / 0.83).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in text-white">
      <div className="relative w-full max-w-lg bg-[#12131C] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/80 border border-white/20 text-gray-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E6CA65] to-[#84620F] p-0.5">
            <div className="w-full h-full rounded-full bg-[#0B0C10] flex items-center justify-center">
              <Ruler className="w-5 h-5 text-[#E6CA65]" />
            </div>
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-white">Thước Đo Size Nhẫn Trực Tuyến</h3>
            <p className="text-xs text-[#C5A059]">Đặt chiếc nhẫn của bạn lên vòng tròn trên màn hình</p>
          </div>
        </div>

        {/* Step Guide */}
        <div className="p-3.5 rounded-xl bg-[#171822] border border-gray-800 text-xs text-gray-300 space-y-1">
          <p className="font-semibold text-[#E6CA65] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cách đo chuẩn xác 100%:</span>
          </p>
          <p>
            1. Lấy một chiếc nhẫn bạn đang đeo vừa vặn nhất. <br />
            2. Đặt nhẫn nằm lọt lòng vào vòng tròn phát sáng bên dưới. <br />
            3. Kéo thanh trượt sao cho mép ngoài của vòng tròn vừa khít với mép TRONG của nhẫn.
          </p>
        </div>

        {/* Interactive Ring Circle Stage */}
        <div className="h-60 bg-[#0B0C10] rounded-2xl border border-[#D4AF37]/30 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Circular Target */}
          <div
            className="rounded-full border-2 border-[#E6CA65] shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center transition-all duration-75 relative"
            style={{
              width: `${diameterMm * 9.5 * calibrationScale}px`,
              height: `${diameterMm * 9.5 * calibrationScale}px`,
            }}
          >
            <div className="absolute inset-2 rounded-full border border-dashed border-[#D4AF37]/50" />
            <div className="text-center">
              <span className="text-xs font-mono font-bold text-[#FFF3C4] block">{diameterMm.toFixed(1)} mm</span>
              <span className="text-[10px] text-[#E6CA65] font-serif uppercase">Size VN {sizeVN}</span>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-300">
            <span>Đường kính lòng trong:</span>
            <span className="font-mono text-[#E6CA65] font-bold">{diameterMm.toFixed(1)} mm</span>
          </div>
          <input
            type="range"
            min="14.0"
            max="22.5"
            step="0.1"
            value={diameterMm}
            onChange={(e) => setDiameterMm(Number(e.target.value))}
            className="w-full accent-[#D4AF37] bg-gray-800 rounded-lg h-2 cursor-pointer"
          />
        </div>

        {/* Results Summary Box */}
        <div className="grid grid-cols-3 gap-2 p-3.5 rounded-xl bg-[#171822] border border-[#D4AF37]/30 text-center">
          <div>
            <span className="text-[10px] text-gray-400 uppercase block">Size Việt Nam</span>
            <span className="text-base font-serif font-bold text-[#E6CA65]">Số {sizeVN}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase block">Size Quốc Tế (US)</span>
            <span className="text-base font-serif font-bold text-white">Size {sizeUS}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase block">Chu vi ngón tay</span>
            <span className="text-base font-mono font-bold text-white">{circumferenceMm} mm</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            if (onSelectSize) onSelectSize(sizeVN);
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E6CA65] via-[#D4AF37] to-[#B8860B] text-black font-serif font-bold text-sm shadow-xl shadow-[#D4AF37]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>Lưu Size {sizeVN} (VN) Cho Nhẫn Của Tôi</span>
        </button>
      </div>
    </div>
  );
};
