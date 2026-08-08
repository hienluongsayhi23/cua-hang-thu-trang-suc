import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  User,
  Wand2,
  X,
  Gem,
  Crown,
  Heart,
  Flame,
  CheckCircle2,
  Camera,
  RefreshCw,
} from 'lucide-react';
import { JewelryItem } from '../../types/jewelry';
import { JEWELRY_CATALOG } from '../../data/jewelryData';

interface AIStylistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAndTryItem: (item: JewelryItem) => void;
  initialContext?: {
    faceShape?: string;
    skinTone?: string;
    currentJewelry?: string;
  };
}

interface Message {
  role: 'user' | 'model';
  text: string;
  suggestedItemIds?: string[];
  timestamp: number;
}

export const AIStylistDrawer: React.FC<AIStylistDrawerProps> = ({
  isOpen,
  onClose,
  onSelectAndTryItem,
  initialContext,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: `✨ **Xin chào quý khách! Tôi là Trợ Lý Cố Vấn Phong Cách Kim Hoàn L'AURORA.**\n\nTôi có thể giúp bạn:\n- 💎 Phân tích dáng mặt & tông da để chọn hoa tai, dây chuyền tôn dáng nhất.\n- 💍 Gợi ý nhẫn cầu hôn kim cương chuẩn GIA 4C.\n- 👑 Phối set trang sức cưới & dạ tiệc sang trọng.\n- 🔮 Chọn đá quý theo Ngũ Hành Phong Thủy (Kim, Mộc, Thủy, Hỏa, Thổ).\n\nBạn đang quan tâm đến dịp đeo trang sức nào hôm nay?`,
      suggestedItemIds: ['earring-aura-drop', 'necklace-solitaire-choker'],
      timestamp: Date.now(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const quickPrompts = [
    { label: '👰 Trang sức cô dâu', prompt: 'Tư vấn cho tôi trọn bộ trang sức cưới hoàng gia cho cô dâu.' },
    { label: '💍 Nhẫn cầu hôn 1-2ct', prompt: 'Gợi ý cho tôi mẫu nhẫn cầu hôn kim cương 1.8 Carat đẹp nhất.' },
    { label: '🔮 Phong thủy Ngũ Hành', prompt: 'Tôi muốn chọn đá quý phong thủy hợp mệnh đem lại may mắn tài lộc.' },
    { label: '✨ Phối layer dây chuyền', prompt: 'Làm thế nào để phối layer hoa tai giọt nước và dây chuyền xương quai xanh?' },
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isLoading) return;

    const newMsg: Message = {
      role: 'user',
      text: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/gemini/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          context: initialContext,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || 'Cảm ơn quý khách. L\'AURORA rất hân hạnh được tư vấn trang sức cho bạn.';

      // Extract matching item IDs
      const matchingIds: string[] = [];
      if (query.toLowerCase().includes('hoa tai') || query.toLowerCase().includes('cưới')) {
        matchingIds.push('earring-aura-drop', 'necklace-solitaire-choker', 'tiara-royale-crown');
      } else if (query.toLowerCase().includes('nhẫn')) {
        matchingIds.push('ring-solitaire-eternity', 'ring-emerald-halo');
      } else if (query.toLowerCase().includes('ruby') || query.toLowerCase().includes('hỏa')) {
        matchingIds.push('earring-ruby-chandelier', 'ring-ruby-passion');
      } else {
        matchingIds.push('necklace-solitaire-choker', 'earring-aura-drop');
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: replyText,
          suggestedItemIds: matchingIds,
          timestamp: Date.now(),
        },
      ]);
    } catch (err) {
      console.error('Stylist API error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: `✨ **Gợi ý từ Nghệ nhân L'AURORA:**\nVới dáng khuôn mặt và phong cách của bạn, chúng tôi đặc biệt gợi ý đôi **Hoa Tai Kim Cương Giọt Nước L'Aurore** kết hợp cùng **Dây Chuyền Mặt Đơn Aura 2.0ct**. Bộ đôi này tạo vẻ đẹp thanh tao, kéo dài đường nét cổ và bắt sáng rực rỡ dưới mọi góc độ!`,
          suggestedItemIds: ['earring-aura-drop', 'necklace-solitaire-choker'],
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#12131C] border-l border-[#D4AF37]/30 text-white flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#171822] via-[#2A2315] to-[#171822] border-b border-[#D4AF37]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E6CA65] to-[#84620F] p-0.5 shadow-lg">
              <div className="w-full h-full rounded-full bg-[#0B0C10] flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#E6CA65]" />
              </div>
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#FFF4D0]">Trợ Lý Cố Vấn Phong Cách AI</h3>
              <p className="text-[11px] text-[#C5A059]">Gemini 3.6 Flash • Tư vấn chuyên sâu 24/7</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 text-gray-400 hover:text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-[#171822] border-b border-gray-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              className="px-3 py-1.5 rounded-full text-xs bg-[#242738] hover:bg-[#32364E] text-[#FFF3C4] border border-[#D4AF37]/30 whitespace-nowrap transition-colors flex-shrink-0 flex items-center gap-1"
            >
              <span>{qp.label}</span>
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-800">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}
            >
              <div
                className={`max-w-[90%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-medium rounded-tr-none shadow-md'
                    : 'bg-[#1A1C28] border border-[#D4AF37]/30 text-gray-200 rounded-tl-none shadow-lg'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Suggested Product Cards attached to message */}
                {msg.suggestedItemIds && msg.suggestedItemIds.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-700/60 space-y-2">
                    <p className="text-[11px] font-bold text-[#E6CA65] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Sản phẩm khuyên thử ngay:</span>
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.suggestedItemIds.map((itemId) => {
                        const item = JEWELRY_CATALOG.find((j) => j.id === itemId);
                        if (!item) return null;
                        return (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-xl bg-black/40 border border-gray-700 flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-white truncate">{item.vietnameseName}</p>
                              <p className="text-[11px] text-[#E6CA65] font-mono">
                                {item.price.toLocaleString('vi-VN')}₫
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                onSelectAndTryItem(item);
                                onClose();
                              }}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-semibold text-xs hover:opacity-90 flex items-center gap-1 whitespace-nowrap shadow-sm"
                            >
                              <Camera className="w-3 h-3" />
                              <span>Thử AR</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-gray-500 font-mono px-1">
                {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#E6CA65] p-3 rounded-2xl bg-[#1A1C28] border border-[#D4AF37]/30 max-w-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
              <span>Chuyên gia kim hoàn đang phân tích...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#171822] border-t border-[#D4AF37]/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi (VD: Mặt tròn nên đeo hoa tai gì?)"
              className="flex-1 bg-[#0B0C10] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
