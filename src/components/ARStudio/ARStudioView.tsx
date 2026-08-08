import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  CameraOff,
  Sparkles,
  RefreshCw,
  Sliders,
  Layers,
  Download,
  Share2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Upload,
  User,
  Eye,
  EyeOff,
  Sun,
  Shield,
  ShoppingBag,
  Heart,
  Wand2,
  SplitSquareVertical,
  Check,
  RotateCcw,
  Sparkle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  JewelryItem,
  MetalType,
  GemstoneType,
  ModelPreset,
  ModelLandmarks,
  LookbookSnapshot,
  FaceShape,
  SkinTone,
} from '../../types/jewelry';
import {
  JEWELRY_CATALOG,
  PRESET_MODELS,
  METALS_CONFIG,
  GEMSTONES_CONFIG,
} from '../../data/jewelryData';
import { renderJewelryOnCanvas } from '../../utils/arRenderer';
import { ClientFaceAnalyzer } from '../../utils/faceDetector';

interface ARStudioViewProps {
  initialItem?: JewelryItem | null;
  activeItems: Record<string, JewelryItem>;
  setActiveItems: React.Dispatch<React.SetStateAction<Record<string, JewelryItem>>>;
  onAddToCart: (item: JewelryItem, metal: MetalType, gemstone: GemstoneType) => void;
  onSaveLookbook: (snapshot: LookbookSnapshot) => void;
  onOpenAIStylistWithContext: (context: any) => void;
  currency: 'VND' | 'USD';
  onClose?: () => void;
}

export const ARStudioView: React.FC<ARStudioViewProps> = ({
  initialItem,
  activeItems,
  setActiveItems,
  onAddToCart,
  onSaveLookbook,
  onOpenAIStylistWithContext,
  currency,
  onClose,
}) => {
  // Mode: 'camera' | 'preset_models' | 'upload_photo'
  const [sourceMode, setSourceMode] = useState<'camera' | 'preset_models' | 'upload_photo'>('preset_models');
  const [selectedModelId, setSelectedModelId] = useState<string>('model-mai-linh');
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);

  // Camera State
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState<boolean>(true);

  // Customization & Physics Overrides
  const [selectedMetal, setSelectedMetal] = useState<MetalType>('platinum');
  const [selectedGemstone, setSelectedGemstone] = useState<GemstoneType>('diamond');
  const [sparkleEnabled, setSparkleEnabled] = useState<boolean>(true);
  const [lightAngle, setLightAngle] = useState<number>(45);
  const [shadowDepth, setShadowDepth] = useState<number>(0.65);
  const [showWireframe, setShowWireframe] = useState<boolean>(false);

  // Manual Adjustments per active item
  const [manualScale, setManualScale] = useState<number>(1.0);
  const [manualOffsetY, setManualOffsetY] = useState<number>(0);
  const [manualOffsetX, setManualOffsetX] = useState<number>(0);
  const [manualRotation, setManualRotation] = useState<number>(0);

  // Split Screen Comparison
  const [isSplitCompare, setIsSplitCompare] = useState<boolean>(false);
  const [splitPos, setSplitPos] = useState<number>(50); // 0-100%

  // Snapshot countdown
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flashEffect, setFlashEffect] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Detected Face Stats
  const [detectedSkinTone, setDetectedSkinTone] = useState<SkinTone>('neutral');
  const [detectedFaceShape, setDetectedFaceShape] = useState<FaceShape>('oval');
  const [headTilt, setHeadTilt] = useState<number>(0);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const faceAnalyzer = useRef(new ClientFaceAnalyzer());
  const uploadedImageRef = useRef<HTMLImageElement | null>(null);
  const presetImageRef = useRef<HTMLImageElement | null>(null);

  // Get current preset model
  const currentModel = PRESET_MODELS.find((m) => m.id === selectedModelId) || PRESET_MODELS[0];

  // Set initial item if passed
  useEffect(() => {
    if (initialItem && !activeItems[initialItem.id]) {
      setActiveItems((prev) => ({
        ...prev,
        [initialItem.id]: initialItem,
      }));
      setSelectedMetal(initialItem.metal);
      setSelectedGemstone(initialItem.gemstone);
    }
  }, [initialItem]);

  // Load preset model image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentModel.image;
    img.onload = () => {
      presetImageRef.current = img;
    };
  }, [selectedModelId]);

  // Start / Stop Camera Stream
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
        setSourceMode('camera');
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Không thể mở camera. Vui lòng cấp quyền hoặc sử dụng Người Mẫu Ảo bên dưới.');
      setSourceMode('preset_models');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (sourceMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [sourceMode, isFrontCamera]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedPhotoUrl(url);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        uploadedImageRef.current = img;
        setSourceMode('upload_photo');
        showToast('Ảnh của bạn đã được tải lên thành công! Đang tự động định vị...');
      };
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Main AR Render Loop
  const renderARFrame = useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // 1. Draw Background Source (Camera or Preset Model or Uploaded Photo)
      let currentLandmarks: ModelLandmarks = currentModel.landmarks;

      if (sourceMode === 'camera' && videoRef.current && videoRef.current.readyState >= 2) {
        ctx.save();
        if (isFrontCamera) {
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        ctx.restore();

        // Detect live landmarks & skin tone
        const detection = faceAnalyzer.current.analyzeFrame(videoRef.current, width, height);
        if (detection.detected) {
          currentLandmarks = detection.landmarks;
          setDetectedSkinTone(detection.skinTone);
          setHeadTilt(detection.headTiltAngle);
        }
      } else if (sourceMode === 'upload_photo' && uploadedImageRef.current) {
        ctx.drawImage(uploadedImageRef.current, 0, 0, width, height);
        const detection = faceAnalyzer.current.analyzeFrame(uploadedImageRef.current, width, height);
        if (detection.detected) {
          currentLandmarks = detection.landmarks;
          setDetectedSkinTone(detection.skinTone);
        }
      } else if (presetImageRef.current) {
        ctx.drawImage(presetImageRef.current, 0, 0, width, height);
        currentLandmarks = currentModel.landmarks;
        setDetectedSkinTone(currentModel.skinTone);
        setDetectedFaceShape(currentModel.faceShape);
      } else {
        // Fallback backdrop gradient
        ctx.fillStyle = '#171822';
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Draw Wireframe if enabled
      if (showWireframe) {
        ctx.save();
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.fillStyle = '#E6CA65';

        const scaleX = width / 1000;
        const scaleY = height / 1000;

        // Ear anchors
        ctx.beginPath();
        ctx.arc(currentLandmarks.leftEar.x * scaleX, currentLandmarks.leftEar.y * scaleY, 6, 0, Math.PI * 2);
        ctx.arc(currentLandmarks.rightEar.x * scaleX, currentLandmarks.rightEar.y * scaleY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Neck anchor
        ctx.beginPath();
        ctx.arc(currentLandmarks.neck.x * scaleX, currentLandmarks.neck.y * scaleY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Forehead anchor
        ctx.beginPath();
        ctx.arc(currentLandmarks.forehead.x * scaleX, currentLandmarks.forehead.y * scaleY, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 3. Render Active Jewelry Overlay with Physics & Shimmers
      const activeItemList: JewelryItem[] = Object.values(activeItems) as JewelryItem[];

      // Handle split comparison if active
      if (isSplitCompare) {
        const splitPixel = (splitPos / 100) * width;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, splitPixel, height);
        ctx.clip();
      }

      const metalOverrides: Record<string, MetalType> = {};
      const gemstoneOverrides: Record<string, GemstoneType> = {};
      const adjustments: Record<string, any> = {};

      for (const item of activeItemList) {
        metalOverrides[item.id] = selectedMetal;
        gemstoneOverrides[item.id] = selectedGemstone;
        adjustments[item.id] = {
          scale: manualScale,
          x: manualOffsetX,
          y: manualOffsetY,
          rotation: manualRotation,
        };
      }

      renderJewelryOnCanvas(ctx, {
        activeItems: activeItemList,
        metalOverrides,
        gemstoneOverrides,
        manualAdjustments: adjustments,
        landmarks: currentLandmarks,
        canvasWidth: width,
        canvasHeight: height,
        time,
        sparkleEnabled,
        lightAngle,
        shadowDepth,
        earringPhysics: {
          angleLeft: headTilt * 0.75,
          angleRight: headTilt * 0.75,
        },
      });

      if (isSplitCompare) {
        ctx.restore();
        // Draw split divider line
        const splitPixel = (splitPos / 100) * width;
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(splitPixel, 0);
        ctx.lineTo(splitPixel, height);
        ctx.stroke();

        // Split badge
        ctx.fillStyle = '#0B0C10';
        ctx.fillRect(splitPixel - 35, height / 2 - 14, 70, 28);
        ctx.strokeStyle = '#D4AF37';
        ctx.strokeRect(splitPixel - 35, height / 2 - 14, 70, 28);
        ctx.fillStyle = '#FFF3C4';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SO SÁNH', splitPixel, height / 2 + 4);
      }

      // Schedule next frame
      animationFrameId.current = requestAnimationFrame(renderARFrame);
    },
    [
      sourceMode,
      selectedModelId,
      activeItems,
      selectedMetal,
      selectedGemstone,
      manualScale,
      manualOffsetX,
      manualOffsetY,
      manualRotation,
      sparkleEnabled,
      lightAngle,
      shadowDepth,
      showWireframe,
      isSplitCompare,
      splitPos,
      isFrontCamera,
      headTilt,
      currentModel,
    ]
  );

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(renderARFrame);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [renderARFrame]);

  // Take High-Res Snapshot with Watermark & Celebration
  const takeSnapshot = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          captureCanvasImage();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const captureCanvasImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Trigger visual flash
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 300);

    // Create high-res export canvas with luxury branding
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 1200;
    exportCanvas.height = 1400;
    const expCtx = exportCanvas.getContext('2d');
    if (!expCtx) return;

    // Draw main image
    expCtx.drawImage(canvas, 0, 0, 1200, 1200);

    // Draw luxury footer branding banner
    expCtx.fillStyle = '#0B0C10';
    expCtx.fillRect(0, 1200, 1200, 200);

    expCtx.strokeStyle = '#D4AF37';
    expCtx.lineWidth = 2;
    expCtx.beginPath();
    expCtx.moveTo(0, 1200);
    expCtx.lineTo(1200, 1200);
    expCtx.stroke();

    // Brand text
    expCtx.fillStyle = '#E6CA65';
    expCtx.font = 'bold 28px "Playfair Display", serif';
    expCtx.fillText("L'AURORA HAUTE JOAILLERIE & AR ATELIER", 50, 1260);

    expCtx.fillStyle = '#A0AEC0';
    expCtx.font = '16px sans-serif';
    const itemNames = (Object.values(activeItems) as JewelryItem[])
      .map((i) => i.vietnameseName)
      .join(' • ');
    expCtx.fillText(`Trang sức đang thử: ${itemNames || 'Tuyệt tác Kim Cương'}`, 50, 1295);
    expCtx.fillText(
      `Chất liệu: ${METALS_CONFIG[selectedMetal]?.vietnameseName} | Đá quý: ${GEMSTONES_CONFIG[selectedGemstone]?.vietnameseName}`,
      50,
      1325
    );
    expCtx.fillText(`Ngày thử AR: ${new Date().toLocaleDateString('vi-VN')} | 100% GIA Certified`, 50, 1355);

    // Save lookbook snapshot
    const dataUrl = exportCanvas.toDataURL('image/jpeg', 0.95);
    const snapshot: LookbookSnapshot = {
      id: `look-${Date.now()}`,
      timestamp: Date.now(),
      imageDataUrl: dataUrl,
      items: Object.values(activeItems),
      modelName: sourceMode === 'camera' ? 'Camera Của Bạn' : currentModel.name,
      aiRating: 98,
      metals: { current: selectedMetal },
      gemstones: { current: selectedGemstone },
    };

    onSaveLookbook(snapshot);

    // Trigger celebratory confetti
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#FFF3C4', '#F6E05E', '#C5A059'],
    });

    showToast('✨ Đã chụp và lưu ảnh vào Bộ Sưu Tập Lookbook của bạn!');
  };

  // Toggle item in active stack
  const toggleItem = (item: JewelryItem) => {
    setActiveItems((prev) => {
      const copy = { ...prev };
      if (copy[item.id]) {
        delete copy[item.id];
      } else {
        copy[item.id] = item;
      }
      return copy;
    });
  };

  // Remove single active item
  const removeItem = (id: string) => {
    setActiveItems((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // Reset all adjustments
  const resetAdjustments = () => {
    setManualScale(1.0);
    setManualOffsetX(0);
    setManualOffsetY(0);
    setManualRotation(0);
    setLightAngle(45);
    setShadowDepth(0.65);
    showToast('Đã đặt lại vị trí & góc ánh sáng mặc định!');
  };

  const activeItemList: JewelryItem[] = Object.values(activeItems) as JewelryItem[];
  const totalPrice = activeItemList.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="relative min-h-[85vh] bg-[#0B0C10] text-white flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-[#1A1C28]/95 border border-[#D4AF37] text-[#FFF3C4] shadow-2xl text-sm font-medium flex items-center gap-2.5 backdrop-blur-md animate-bounce">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Visual Flash Effect */}
      {flashEffect && <div className="fixed inset-0 bg-white z-50 pointer-events-none transition-opacity duration-300" />}

      {/* AR Studio Control Header */}
      <div className="bg-[#12131C] border-b border-[#D4AF37]/20 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Source Mode Selectors */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSourceMode('preset_models')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
              sourceMode === 'preset_models'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-md'
                : 'bg-[#1A1C28] text-gray-300 hover:text-white border border-gray-700'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Người Mẫu Ảo (6 Mẫu)</span>
          </button>

          <button
            onClick={() => setSourceMode('camera')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
              sourceMode === 'camera'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-md'
                : 'bg-[#1A1C28] text-gray-300 hover:text-white border border-gray-700'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Bật Webcam Trực Tiếp</span>
            {cameraActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
          </button>

          <label className="cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#1A1C28] hover:bg-[#252838] border border-gray-700 text-gray-300 hover:text-[#E6CA65] flex items-center gap-2 transition-all">
            <Upload className="w-3.5 h-3.5" />
            <span>Tải Ảnh Của Bạn</span>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
        </div>

        {/* Quick Toggles: Split View, Wireframe, AI Stylist */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSplitCompare(!isSplitCompare)}
            className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              isSplitCompare
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#FFF3C4]'
                : 'bg-[#171822] border-gray-700 text-gray-300 hover:border-gray-500'
            }`}
            title="So sánh Trước & Sau khi đeo trang sức"
          >
            <SplitSquareVertical className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{isSplitCompare ? 'Tắt So Sánh' : 'So Sánh Trước/Sau'}</span>
          </button>

          <button
            onClick={() => setShowWireframe(!showWireframe)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              showWireframe
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#FFF3C4]'
                : 'bg-[#171822] border-gray-700 text-gray-300 hover:border-gray-500'
            }`}
            title="Hiển thị điểm định vị gương mặt AI"
          >
            {showWireframe ? <Eye className="w-4 h-4 text-[#D4AF37]" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            onClick={() =>
              onOpenAIStylistWithContext({
                faceShape: detectedFaceShape,
                skinTone: detectedSkinTone,
                currentJewelry: activeItemList.map((i) => i.name).join(', '),
              })
            }
            className="px-3 py-1.5 rounded-lg bg-[#242738] hover:bg-[#31354A] border border-[#D4AF37]/40 text-xs font-semibold text-[#E6CA65] flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>AI Đánh Giá Set Đồ</span>
          </button>
        </div>
      </div>

      {/* Main AR Studio Viewport & Sidebar Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* CENTER / LEFT: The Live AR Fitting Canvas Screen */}
        <div className="lg:col-span-8 relative bg-black flex items-center justify-center p-2 sm:p-4 min-h-[500px]">
          {/* Hidden Video Feed for Stream Processing */}
          <video ref={videoRef} className="hidden" playsInline muted autoPlay />

          {/* Main AR Overlay Canvas */}
          <div className="relative max-w-full max-h-[75vh] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37]/30 bg-[#12131C]">
            <canvas ref={canvasRef} width={1000} height={1250} className="w-full h-full object-contain" />

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-40">
                <span className="text-8xl font-serif font-bold text-[#E6CA65] animate-ping">{countdown}</span>
                <span className="text-sm text-gray-200 mt-4 tracking-widest uppercase">Hãy giữ nụ cười rạng rỡ...</span>
              </div>
            )}

            {/* Split screen range slider if active */}
            {isSplitCompare && (
              <input
                type="range"
                min={0}
                max={100}
                value={splitPos}
                onChange={(e) => setSplitPos(Number(e.target.value))}
                className="absolute inset-x-4 bottom-16 z-30 opacity-70 hover:opacity-100 accent-[#D4AF37] cursor-ew-resize"
              />
            )}

            {/* Camera Switcher Pill on canvas */}
            {sourceMode === 'camera' && (
              <button
                onClick={() => setIsFrontCamera(!isFrontCamera)}
                className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs text-white hover:bg-black/80 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Đổi Camera</span>
              </button>
            )}

            {/* Snapshot Trigger Floating Bar */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3 z-20">
              <button
                onClick={takeSnapshot}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E6CA65] via-[#D4AF37] to-[#B8860B] text-black font-serif font-bold text-sm shadow-xl shadow-black/60 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
              >
                <Camera className="w-4 h-4 text-black fill-current" />
                <span>Chụp & Lưu Bộ Sưu Tập</span>
              </button>

              <button
                onClick={() => setSparkleEnabled(!sparkleEnabled)}
                className={`p-3 rounded-full border transition-all ${
                  sparkleEnabled
                    ? 'bg-[#E6CA65] text-black border-[#E6CA65]'
                    : 'bg-black/60 text-white border-white/30 hover:border-white'
                }`}
                title="Bật/tắt tia sáng kim cương lấp lánh"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Model Switcher Thumbnails underneath if in preset mode */}
          {sourceMode === 'preset_models' && (
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-center gap-2 overflow-x-auto py-1 z-10">
              {PRESET_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModelId(model.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all flex-shrink-0 ${
                    selectedModelId === model.id
                      ? 'bg-[#D4AF37] text-black font-bold shadow-lg scale-105'
                      : 'bg-black/70 backdrop-blur-md text-gray-300 hover:text-white border border-gray-700'
                  }`}
                >
                  <img src={model.avatar} alt={model.name} className="w-5 h-5 rounded-full object-cover" />
                  <span>{model.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR: Customizer, Metal, Gemstone, Layer Stacking & Sizing */}
        <div className="lg:col-span-4 bg-[#12131C] border-l border-[#D4AF37]/20 p-5 overflow-y-auto space-y-6 max-h-[85vh] scrollbar-thin scrollbar-thumb-gray-800">
          {/* Active Items Stacking Layer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-serif font-bold text-[#E6CA65] uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Trang Sức Đang Đeo ({activeItemList.length})</span>
              </h3>
              {activeItemList.length > 0 && (
                <button
                  onClick={() => setActiveItems({})}
                  className="text-xs text-gray-400 hover:text-rose-400 transition-colors"
                >
                  Gỡ tất cả
                </button>
              )}
            </div>

            {activeItemList.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-gray-700 rounded-xl p-4 text-xs text-gray-400">
                <Sparkles className="w-6 h-6 text-[#D4AF37] mx-auto mb-2 opacity-60" />
                <p>Chưa có món trang sức nào được chọn.</p>
                <p className="text-[11px] text-gray-500 mt-1">Chọn từ danh mục bên dưới để đeo thử tức thì!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeItemList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#1A1C28] border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-all"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-xs font-bold text-white truncate">{item.vietnameseName}</p>
                      <p className="text-[11px] text-[#E6CA65] font-mono">
                        {item.price.toLocaleString('vi-VN')}₫
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onAddToCart(item, selectedMetal, selectedGemstone)}
                        className="px-2.5 py-1 rounded bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#E6CA65] transition-colors"
                        title="Thêm món này vào giỏ hàng"
                      >
                        + Giỏ
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-rose-400 p-1 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                {/* Total & Checkout */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#241F14] to-[#171822] border border-[#D4AF37]/40 flex items-center justify-between mt-3">
                  <div>
                    <span className="text-[11px] text-gray-300 block">Tổng trọn bộ ({activeItemList.length} món):</span>
                    <span className="text-sm font-bold font-mono text-[#E6CA65]">
                      {Number(totalPrice).toLocaleString()}₫
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      activeItemList.forEach((item) => onAddToCart(item, selectedMetal, selectedGemstone));
                      showToast('✨ Đã thêm trọn bộ trang sức vào giỏ hàng!');
                    }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-semibold text-xs shadow-md hover:opacity-90 transition-opacity flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Mua Cả Bộ</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 1. Metal Switcher */}
          <div className="space-y-3 pt-3 border-t border-gray-800">
            <label className="text-xs font-serif font-bold text-[#E6CA65] uppercase tracking-wider flex items-center justify-between">
              <span>Chất Liệu Kim Loại Quý</span>
              <span className="text-[10px] text-gray-400 font-sans normal-case">
                {METALS_CONFIG[selectedMetal]?.vietnameseName}
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(METALS_CONFIG) as MetalType[]).map((mKey) => {
                const metal = METALS_CONFIG[mKey];
                const isSelected = selectedMetal === mKey;
                return (
                  <button
                    key={mKey}
                    onClick={() => setSelectedMetal(mKey)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-[#2A2315] border-[#D4AF37] shadow-md shadow-[#D4AF37]/15 text-[#FFF3C4]'
                        : 'bg-[#171822] border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/40 flex-shrink-0"
                      style={{ background: metal.hex }}
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold truncate leading-tight">{metal.vietnameseName}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Gemstone Switcher */}
          <div className="space-y-3 pt-3 border-t border-gray-800">
            <label className="text-xs font-serif font-bold text-[#E6CA65] uppercase tracking-wider flex items-center justify-between">
              <span>Đá Quý & Kim Cương</span>
              <span className="text-[10px] text-gray-400 font-sans normal-case">
                {GEMSTONES_CONFIG[selectedGemstone]?.name}
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(GEMSTONES_CONFIG) as GemstoneType[]).map((gKey) => {
                const gem = GEMSTONES_CONFIG[gKey];
                const isSelected = selectedGemstone === gKey;
                return (
                  <button
                    key={gKey}
                    onClick={() => setSelectedGemstone(gKey)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-[#2A2315] border-[#D4AF37] shadow-md text-[#FFF3C4]'
                        : 'bg-[#171822] border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full mb-1 border border-white/30"
                      style={{ background: gem.color }}
                    />
                    <span className="text-[10px] font-medium truncate w-full">{gem.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Precision Sliders (Scale, Offset X/Y, Rotation) */}
          <div className="space-y-3 pt-3 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-serif font-bold text-[#E6CA65] uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Vi Chỉnh Kích Thước & Vị Trí</span>
              </label>
              <button
                onClick={resetAdjustments}
                className="text-[11px] text-gray-400 hover:text-[#E6CA65] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Mặc định</span>
              </button>
            </div>

            {/* Scale Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>Kích thước trang sức:</span>
                <span className="font-mono text-[#E6CA65]">{Math.round(manualScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.4"
                step="0.02"
                value={manualScale}
                onChange={(e) => setManualScale(Number(e.target.value))}
                className="w-full accent-[#D4AF37] bg-gray-800 rounded-lg h-1.5 cursor-pointer"
              />
            </div>

            {/* Vertical Y Offset */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>Vị trí nâng/hạ (Y):</span>
                <span className="font-mono text-[#E6CA65]">{manualOffsetY}px</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="1"
                value={manualOffsetY}
                onChange={(e) => setManualOffsetY(Number(e.target.value))}
                className="w-full accent-[#D4AF37] bg-gray-800 rounded-lg h-1.5 cursor-pointer"
              />
            </div>

            {/* Horizontal X Offset */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>Độ rộng 2 bên tai/cổ (X):</span>
                <span className="font-mono text-[#E6CA65]">{manualOffsetX}px</span>
              </div>
              <input
                type="range"
                min="-25"
                max="25"
                step="1"
                value={manualOffsetX}
                onChange={(e) => setManualOffsetX(Number(e.target.value))}
                className="w-full accent-[#D4AF37] bg-gray-800 rounded-lg h-1.5 cursor-pointer"
              />
            </div>
          </div>

          {/* 4. Quick Catalog Drawer to Add More Items */}
          <div className="space-y-3 pt-3 border-t border-gray-800">
            <h4 className="text-xs font-serif font-bold text-[#E6CA65] uppercase tracking-wider">
              Chọn Món Trang Sức Khác Để Đeo Thử
            </h4>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {JEWELRY_CATALOG.slice(0, 10).map((item) => {
                const isSelected = !!activeItems[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-[#2A2315] border-[#D4AF37] text-[#FFF3C4]'
                        : 'bg-[#171822] border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                    }`}
                  >
                    <p className="text-[11px] font-bold truncate">{item.vietnameseName}</p>
                    <p className="text-[10px] text-[#E6CA65] font-mono mt-0.5">
                      {item.price.toLocaleString('vi-VN')}₫
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
