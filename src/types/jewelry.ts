export type JewelryCategory =
  | 'earrings'
  | 'necklaces'
  | 'rings'
  | 'bracelets'
  | 'tiaras'
  | 'eyewear'
  | 'watches';

export type MetalType =
  | 'yellow_gold'
  | 'rose_gold'
  | 'platinum'
  | 'silver'
  | 'black_titanium';

export type GemstoneType =
  | 'diamond'
  | 'ruby'
  | 'sapphire'
  | 'emerald'
  | 'pearl'
  | 'amethyst'
  | 'moissanite';

export type FaceShape = 'oval' | 'round' | 'heart' | 'square' | 'oblong';
export type SkinTone = 'warm' | 'cool' | 'neutral' | 'all';
export type FengShuiElement = 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho';

export interface ARAnchorData {
  anchor: 'ears' | 'neck' | 'forehead' | 'eyes' | 'finger' | 'wrist';
  scale: number;
  offsetX: number;
  offsetY: number;
  earSpacingScale?: number;
  neckCurve?: number;
  hasDanglePhysics?: boolean;
  dangleLength?: number;
  sparklePoints: { x: number; y: number; delay: number }[];
  renderType:
    | 'dangle_earring'
    | 'hoop_earring'
    | 'stud_earring'
    | 'chandelier_earring'
    | 'pendant_necklace'
    | 'choker_necklace'
    | 'layered_necklace'
    | 'solitaire_ring'
    | 'halo_ring'
    | 'tennis_bracelet'
    | 'luxury_watch'
    | 'bridal_tiara'
    | 'crown'
    | 'sunglasses';
  gemColor?: string;
  metalColor?: string;
  layerIndex: number;
}

export interface JewelryItem {
  id: string;
  name: string;
  vietnameseName: string;
  subtitle: string;
  category: JewelryCategory;
  collection: string;
  collectionId: string;
  price: number; // in VND
  originalPrice?: number;
  description: string;
  details: string[];
  metal: MetalType;
  gemstone: GemstoneType;
  carat?: number;
  cutGrade?: string;
  clarity?: string;
  colorGrade?: string;
  certificate?: string;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  suitableFaceShapes: FaceShape[];
  suitableSkinTones: SkinTone[];
  fengShuiElement: FengShuiElement[];
  tags: string[];
  arData: ARAnchorData;
}

export interface ModelLandmarks {
  leftEar: { x: number; y: number };
  rightEar: { x: number; y: number };
  neck: { x: number; y: number };
  chest: { x: number; y: number };
  forehead: { x: number; y: number };
  nose: { x: number; y: number };
  leftEye: { x: number; y: number };
  rightEye: { x: number; y: number };
  jawTip: { x: number; y: number };
  leftWrist?: { x: number; y: number };
  rightWrist?: { x: number; y: number };
  ringFinger?: { x: number; y: number };
}

export interface ModelPreset {
  id: string;
  name: string;
  title: string;
  gender: 'female' | 'male';
  faceShape: FaceShape;
  faceShapeLabel: string;
  skinTone: SkinTone;
  skinToneLabel: string;
  avatar: string;
  image: string;
  landmarks: ModelLandmarks;
  suggestedItems: string[];
}

export interface LookbookSnapshot {
  id: string;
  timestamp: number;
  imageDataUrl: string;
  items: JewelryItem[];
  modelName: string;
  aiRating?: number;
  notes?: string;
  metals: Record<string, MetalType>;
  gemstones: Record<string, GemstoneType>;
}

export interface CartItem {
  id: string;
  item: JewelryItem;
  quantity: number;
  selectedMetal: MetalType;
  selectedGemstone: GemstoneType;
  selectedRingSize?: string;
  ringSize?: number;
  engravingText?: string;
  engravingFont?: string;
  giftPackaging?: boolean;
}

export interface VIPAppointment {
  fullName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  type: 'boutique_lounge' | 'video_gemologist';
  location: string;
  interestedCategories: JewelryCategory[];
  budgetRange: string;
  notes?: string;
}
