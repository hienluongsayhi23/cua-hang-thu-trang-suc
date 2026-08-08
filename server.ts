import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '20mb' }));

  // Initialize Gemini client lazily/safely
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: "L'AURORA AR Jewelry Atelier" });
  });

  // AI Jewelry Stylist Chat & Advice
  app.post('/api/gemini/stylist', async (req, res) => {
    try {
      const { message, history, context } = req.body;
      const ai = getGenAI();

      if (!ai) {
        // High quality fallback if API key is not yet set
        return res.json({
          reply: generateLocalStylistResponse(message, context),
          isFallback: true,
        });
      }

      const systemPrompt = `Bạn là Chuyên gia Cố vấn Trang sức & Nghệ nhân Kim hoàn Cao cấp tại "L'AURORA Haute Joaillerie & AR Atelier".
Bạn am hiểu sâu sắc về:
- Các loại trang sức: Hoa tai (dangle, hoop, stud), Dây chuyền & Vòng cổ (choker, princess, matinee), Nhẫn kim cương, Vương miện cô dâu, Vòng tay, Đồng hồ xa xỉ.
- Các kim loại quý: Vàng 18K (Vàng vàng, Vàng hồng Rose Gold, Vàng trắng White Gold), Bạch kim Platinum 950, Bạc Ý 925.
- Đá quý tự nhiên & Kim cương (tiêu chuẩn 4C: Carat, Cut, Color, Clarity), Ruby huyết bồ câu, Sapphire hoàng gia, Ngọc lục bảo Emerald, Ngọc trai South Sea.
- Nguyên tắc phối đồ theo khuôn mặt (Mặt trái xoan, Mặt tròn, Mặt vuông, Mặt trái tim, Mặt dài) và Tông da (Da ấm Warm, Da lạnh Cool, Da trung tính Neutral).
- Phong thủy Ngũ Hành (Kim, Mộc, Thủy, Hỏa, Thổ) tương sinh tương hợp màu sắc đá quý.
- Hướng dẫn khách hàng sử dụng tính năng thử đồ AR thực tế ảo trên camera để xem sản phẩm trực quan.

Quy tắc trả lời:
- Luôn giữ thái độ nhã nhặn, sang trọng, tinh tế, chuyên nghiệp và ấm áp.
- Đưa ra lời khuyên cụ thể, gợi ý kiểu dáng hoa tai, dây chuyền, nhẫn phù hợp và mời khách hàng nhấn nút "Thử AR ngay" trong ứng dụng.
- Định dạng câu trả lời rõ ràng với bullet point, gạch đầu dòng và biểu tượng trang sức tinh tế (✨, 💎, 💍, 👑). Trả lời bằng Tiếng Việt chuẩn mực.`;

      const contents: any[] = [];
      if (Array.isArray(history) && history.length > 0) {
        for (const item of history.slice(-6)) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          });
        }
      }

      let userPrompt = message || 'Hãy tư vấn cho tôi cách chọn trang sức phù hợp.';
      if (context) {
        userPrompt += `\n[Thông tin khách hàng: Khuôn mặt: ${context.faceShape || 'Chưa rõ'}, Tông da: ${context.skinTone || 'Chưa rõ'}, Dịp đeo: ${context.occasion || 'Tiệc sang trọng / Hàng ngày'}, Trang sức đang quan tâm: ${context.currentJewelry || 'Bộ sưu tập kim cương'}]`;
      }

      contents.push({
        role: 'user',
        parts: [{ text: userPrompt }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const replyText = response.text || 'Xin chào quý khách, L\'AURORA rất hân hạnh được đồng hành cùng bạn tìm kiếm tuyệt tác trang sức hoàn hảo.';
      res.json({ reply: replyText, isFallback: false });
    } catch (err: any) {
      console.error('Error in /api/gemini/stylist:', err);
      res.json({
        reply: generateLocalStylistResponse(req.body?.message, req.body?.context),
        isFallback: true,
      });
    }
  });

  // AI Face & Skin Tone Analysis for Jewelry Fitting
  app.post('/api/gemini/analyze-look', async (req, res) => {
    try {
      const { faceShape, skinTone, selectedItems } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          analysis: generateLocalFaceAnalysis(faceShape, skinTone, selectedItems),
          isFallback: true,
        });
      }

      const prompt = `Phân tích phong cách trang sức cho khách hàng có:
- Khuôn mặt: ${faceShape || 'Trái xoan (Oval)'}
- Tông da: ${skinTone || 'Trắng hồng / Tông lạnh (Cool)'}
- Các món trang sức đang thử trên AR: ${selectedItems?.join(', ') || 'Hoa tai kim cương Aura & Dây chuyền L\'Aurore'}

Hãy đưa ra đánh giá ngắn gọn (khoảng 3-4 đoạn ngắn với tiêu đề rõ ràng):
1. Đánh giá độ hòa hợp tỷ lệ gương mặt & kiểu dáng trang sức
2. Gợi ý chất liệu kim loại (Vàng vàng, Vàng hồng, Bạch kim) và đá quý tôn da nhất
3. Mẹo tạo điểm nhấn & phong cách phối trang phục phù hợp
4. Đánh giá điểm phong cách (trên thang 100 điểm) kèm lời khen tinh tế.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Bạn là Giám đốc Nghệ thuật & Chuyên gia Định hình Phong cách Trang sức Quốc tế tại L\'AURORA.',
          temperature: 0.7,
        },
      });

      res.json({
        analysis: response.text,
        isFallback: false,
      });
    } catch (err: any) {
      console.error('Error in /api/gemini/analyze-look:', err);
      res.json({
        analysis: generateLocalFaceAnalysis(req.body?.faceShape, req.body?.skinTone, req.body?.selectedItems),
        isFallback: true,
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`L'AURORA AR Jewelry Server running on http://localhost:${PORT}`);
  });
}

function generateLocalStylistResponse(message: string = '', context: any = {}): string {
  const msgLower = message.toLowerCase();

  if (msgLower.includes('cưới') || msgLower.includes('cô dâu') || msgLower.includes('wedding')) {
    return `👰 **Tư Vấn Trang Sức Cưới Hoàng Gia Cho Cô Dâu:**
- **Hoa tai:** Nên chọn hoa tai dáng dài giọt nước đính ngọc trai biển South Sea hoặc kim cương giác cắt Brilliant Cut để tạo vẻ thanh thoát khi búi tóc cô dâu.
- **Vòng cổ:** Vòng cổ đính kim cương kiểu Choker hoặc Princess ôm trọn xương quai xanh, làm nổi bật đường cúp ngực của váy cưới.
- **Vương miện:** Tiara 'L'Aurore Royale' nạm kim cương tinh khiết sẽ biến bạn thành nàng công chúa trong ngày trọng đại.
✨ *Hãy mở phòng thử AR trực tiếp trên camera để ngắm nhìn trọn bộ trang sức cưới ngay bây giờ!*`;
  }

  if (msgLower.includes('mệnh') || msgLower.includes('phong thủy') || msgLower.includes('hợp')) {
    return `🔮 **Tư Vấn Đá Quý Phong Thủy Ngũ Hành:**
- **Mệnh Kim:** Rất hợp với Kim cương trắng, Thạch anh vàng, Ngọc trai trắng kết hợp chất liệu Vàng trắng hoặc Bạch kim Platinum.
- **Mệnh Mộc:** Hòa hợp với Ngọc lục bảo Emerald, Sapphire xanh thẳm, cẩm thạch xanh ngọc bích.
- **Mệnh Thủy:** Đón tài lộc cùng Sapphire xanh hoàng gia, Kim cương đen, Aquamarine.
- **Mệnh Hỏa:** Thăng hoa rực rỡ cùng Ruby đỏ huyết bồ câu, Garnet, đá Amethyst tím nồng nàn trên nền Vàng hồng 18K.
- **Mệnh Thổ:** Đắc tài thịnh vượng cùng Ruby đỏ, Thạch anh vàng Citrine, Vàng 18K truyền thống.
✨ *Bạn có thể bấm vào bộ lọc 'Phong Thủy' để xem các sản phẩm tương hợp!*`;
  }

  if (msgLower.includes('nhẫn') || msgLower.includes('cầu hôn') || msgLower.includes('size')) {
    return `💍 **Tư Vấn Nhẫn Cầu Hôn & Đo Size Nhẫn:**
- **Kiểu dáng kinh điển:** Nhẫn Solitaire kim cương 1-2 Carat giác cắt tròn Round Brilliant 8 Trái tim & 8 Mũi tên (Hearts & Arrows) tôn vinh tình yêu vĩnh cửu.
- **Chất liệu:** Vàng trắng 18K hoặc Bạch kim Platinum 950 giữ đá chắc chắn và không bao giờ phai màu.
- **Thước đo size nhẫn:** L'AURORA đã tích hợp công cụ 'Đo size nhẫn tương tác' ngay trên màn hình bằng thẻ chuẩn quốc tế để bạn chọn size chuẩn xác 100%.
✨ *Nhấn nút 'Thử AR trên bàn tay' để ngắm trọn nét lấp lánh của chiếc nhẫn!*`;
  }

  return `✨ **Chào mừng bạn đến với L'AURORA Haute Joaillerie & AR Atelier!**
Tôi là Trợ lý Cố vấn Phong cách Kim hoàn AI. Tôi có thể hỗ trợ bạn:
1. 💎 **Tư vấn chọn trang sức theo khuôn mặt & tông da:** Chọn hoa tai, dây chuyền tôn lên nét đẹp tự nhiên.
2. 💍 **Gợi ý nhẫn cầu hôn & quà tặng kỷ niệm ý nghĩa.**
3. 👑 **Phối trọn bộ trang sức cưới & dạ tiệc sang trọng.**
4. 🔮 **Chọn đá quý phong thủy Ngũ Hành mang lại may mắn và tài lộc.**

Hãy bật camera hoặc chọn người mẫu ảo trong **Phòng Thử Đồ AR** để trải nghiệm đeo thử trang sức chân thực tức thì!`;
}

function generateLocalFaceAnalysis(faceShape: string, skinTone: string, selectedItems: string[] = []): string {
  return `✨ **BÁO CÁO PHÂN TÍCH PHONG CÁCH TỪ L'AURORA ATELIER**

🌟 **1. Độ hòa hợp với dáng khuôn mặt (${faceShape || 'Trái xoan'}):**
Khuôn mặt của quý khách có tỷ lệ vô cùng thanh tú và cân đối. Kiểu dáng trang sức đang thử tạo điểm nhấn mềm mại, tôn vinh đường nét xương quai hàm và làm bừng sáng góc nghiêng khuôn mặt.

💎 **2. Tương phản sắc tố da (${skinTone || 'Trắng hồng / Tông lạnh'}):**
Sắc tố da của bạn phản chiếu ánh sáng tuyệt vời với chất liệu Vàng trắng Platinum 950 và Vàng hồng 18K. Kim cương nước D/E kết hợp cùng đá quý sắc nét như Sapphire hoặc Ruby sẽ làm nổi bật làn da rạng ngời.

👑 **3. Gợi ý phối set hoàn hảo:**
- Kết hợp thêm sợi dây chuyền dáng mảnh chữ V để tạo sự liên kết với đôi hoa tai.
- Giữ kiểu tóc vén nhẹ một bên tai để khoe trọn độ rơi và hiệu ứng bắt sáng kim hoàn.

⭐️ **Đánh giá phong cách:** **98/100 Điểm** - Phong thái quý phái, đẳng cấp và thu hút mọi ánh nhìn!`;
}

startServer();
