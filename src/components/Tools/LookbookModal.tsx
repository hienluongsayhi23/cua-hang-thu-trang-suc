import React from 'react';
import { X, Camera, Download, Share2, ShoppingBag, Sparkles, Trash2 } from 'lucide-react';
import { LookbookSnapshot, JewelryItem } from '../../types/jewelry';

interface LookbookModalProps {
  snapshots: LookbookSnapshot[];
  onClose: () => void;
  onLaunchAR: () => void;
  onDeleteSnapshot: (id: string) => void;
  onAddToCart: (item: JewelryItem) => void;
  onTrySnapshotItems: (items: JewelryItem[]) => void;
}

export const LookbookModal: React.FC<LookbookModalProps> = ({
  snapshots,
  onClose,
  onLaunchAR,
  onDeleteSnapshot,
  onAddToCart,
  onTrySnapshotItems,
}) => {
  const downloadImage = (snapshot: LookbookSnapshot) => {
    const a = document.createElement('a');
    a.href = snapshot.imageDataUrl;
    a.download = `LAURORA_Look_${new Date(snapshot.timestamp).toISOString().slice(0, 10)}.jpg`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in text-white">
      <div className="relative w-full max-w-5xl bg-[#12131C] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/90 border border-white/20 text-gray-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
              Bộ Sưu Tập Của Riêng Bạn
            </span>
            <h2 className="font-serif font-bold text-2xl text-white">Bộ Sưu Tập Ảnh Thử AR (Lookbook)</h2>
          </div>

          <button
            onClick={() => {
              onLaunchAR();
              onClose();
            }}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-semibold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
          >
            <Camera className="w-4 h-4 fill-current" />
            <span>Mở Camera Thử Thêm Mẫu &rarr;</span>
          </button>
        </div>

        {/* Snapshots Grid */}
        {snapshots.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-[#0B0C10] rounded-2xl border border-dashed border-gray-800 p-8">
            <Camera className="w-12 h-12 text-[#D4AF37] mx-auto opacity-50 animate-pulse" />
            <h3 className="text-lg font-serif font-bold text-white">Chưa có bức ảnh nào trong Lookbook</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Hãy mở Phòng Thử AR, bật camera và bấm nút "Chụp & Lưu Bộ Sưu Tập" để lưu lại những khoảnh khắc lộng lẫy nhất!
            </p>
            <button
              onClick={() => {
                onLaunchAR();
                onClose();
              }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E6CA65] via-[#D4AF37] to-[#B8860B] text-black font-bold text-xs shadow-xl"
            >
              Bật Camera Chụp Ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {snapshots.map((snap) => (
              <div
                key={snap.id}
                className="group relative rounded-2xl bg-[#171822] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all overflow-hidden flex flex-col justify-between shadow-xl"
              >
                {/* Photo Thumbnail */}
                <div className="relative aspect-[4/5] overflow-hidden bg-black">
                  <img
                    src={snap.imageDataUrl}
                    alt="L'AURORA AR Fitting Snapshot"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={() => downloadImage(snap)}
                      className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:text-[#E6CA65]"
                      title="Tải ảnh về máy"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteSnapshot(snap.id)}
                      className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-gray-300 hover:text-rose-400"
                      title="Xóa ảnh"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Items Meta & Action */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#E6CA65] font-serif font-bold">
                      {new Date(snap.timestamp).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="text-gray-400 font-mono text-[11px]">{snap.modelName}</span>
                  </div>

                  <div className="text-xs text-gray-300 line-clamp-2">
                    {snap.items.map((i) => i.vietnameseName).join(' • ') || 'Trang sức kim cương L\'AURORA'}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                    <button
                      onClick={() => {
                        onTrySnapshotItems(snap.items);
                        onClose();
                      }}
                      className="flex-1 py-2 rounded-lg bg-[#252838] hover:bg-[#32364E] text-[#FFF3C4] border border-[#D4AF37]/30 text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Thử lại set này</span>
                    </button>

                    <button
                      onClick={() => {
                        snap.items.forEach((item) => onAddToCart(item));
                      }}
                      className="p-2 rounded-lg bg-[#D4AF37] text-black hover:bg-[#E6CA65] transition-colors"
                      title="Thêm cả bộ vào giỏ hàng"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
