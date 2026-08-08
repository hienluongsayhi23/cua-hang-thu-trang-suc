import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { HeroBanner } from './components/Layout/HeroBanner';
import { ARStudioView } from './components/ARStudio/ARStudioView';
import { JewelryCatalogView } from './components/Catalog/JewelryCatalogView';
import { ProductDetailModal } from './components/Catalog/ProductDetailModal';
import { AIStylistDrawer } from './components/AIAssistant/AIStylistDrawer';
import { RingSizeFinderModal } from './components/Tools/RingSizeFinderModal';
import { LookbookModal } from './components/Tools/LookbookModal';
import { CartDrawer } from './components/Cart/CartDrawer';
import { CheckoutModal } from './components/Cart/CheckoutModal';
import { VIPBookingModal } from './components/VIPBooking/VIPBookingModal';
import { Footer } from './components/Layout/Footer';
import {
  JewelryItem,
  JewelryCategory,
  CartItem,
  LookbookSnapshot,
  MetalType,
  GemstoneType,
} from './types/jewelry';
import { JEWELRY_CATALOG } from './data/jewelryData';

export default function App() {
  // Main Tab Navigation: 'catalog' | 'ar_studio' | 'lookbook'
  const [activeTab, setActiveTab] = useState<'catalog' | 'ar_studio' | 'lookbook'>('catalog');

  // Currently Selected Category in Catalog (or triggered from header)
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<JewelryCategory | 'all'>('all');

  // Active items currently on the AR Avatar / Webcam
  const [activeARItems, setActiveARItems] = useState<Record<string, JewelryItem>>({
    'earring-aura-drop': JEWELRY_CATALOG[0],
    'necklace-solitaire-choker': JEWELRY_CATALOG[1],
  });

  // Modals & Drawers state
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<JewelryItem | null>(null);
  const [isAIStylistOpen, setIsAIStylistOpen] = useState<boolean>(false);
  const [isRingSizeFinderOpen, setIsRingSizeFinderOpen] = useState<boolean>(false);
  const [isLookbookOpen, setIsLookbookOpen] = useState<boolean>(false);
  const [isVIPBookingOpen, setIsVIPBookingOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // User Data: Wishlist, Cart & Lookbook Snapshots
  const [wishlist, setWishlist] = useState<string[]>(['earring-aura-drop', 'necklace-solitaire-choker', 'ring-solitaire-eternity']);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      item: JEWELRY_CATALOG[0],
      selectedMetal: 'platinum',
      selectedGemstone: 'diamond',
      quantity: 1,
    },
  ]);

  const [lookbookSnapshots, setLookbookSnapshots] = useState<LookbookSnapshot[]>([]);

  // Search & Global Settings
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currency, setCurrency] = useState<'VND' | 'USD'>('VND');
  const [aiStylistContext, setAiStylistContext] = useState<any>(null);

  // Handlers
  const handleOpenARStudio = (categoryId?: JewelryCategory) => {
    setActiveTab('ar_studio');
    if (categoryId) {
      const match = JEWELRY_CATALOG.find((item) => item.category === categoryId);
      if (match) {
        setActiveARItems((prev) => ({
          ...prev,
          [match.id]: match,
        }));
      }
    }
  };

  const handleTryOnSingleItem = (item: JewelryItem) => {
    setActiveARItems((prev) => ({
      ...prev,
      [item.id]: item,
    }));
    setActiveTab('ar_studio');
  };

  const handleSelectQuickLook = (itemIds: string[]) => {
    const newItems: Record<string, JewelryItem> = {};
    itemIds.forEach((id) => {
      const item = JEWELRY_CATALOG.find((j) => j.id === id);
      if (item) newItems[item.id] = item;
    });
    setActiveARItems(newItems);
    setActiveTab('ar_studio');
  };

  const handleToggleWishlist = (item: JewelryItem) => {
    setWishlist((prev) =>
      prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
    );
  };

  const handleAddToCart = (
    item: JewelryItem,
    metal: MetalType = 'platinum',
    gemstone: GemstoneType = 'diamond',
    engravingText?: string,
    ringSize?: number
  ) => {
    const existingIndex = cartItems.findIndex(
      (c) =>
        c.item.id === item.id &&
        c.selectedMetal === metal &&
        c.selectedGemstone === gemstone &&
        c.engravingText === engravingText
    );

    if (existingIndex > -1) {
      setCartItems((prev) => {
        const copy = [...prev];
        copy[existingIndex].quantity += 1;
        return copy;
      });
    } else {
      const newCartItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random()}`,
        item,
        selectedMetal: metal,
        selectedGemstone: gemstone,
        quantity: 1,
        engravingText,
        ringSize,
      };
      setCartItems((prev) => [newCartItem, ...prev]);
    }
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSaveLookbookSnapshot = (snapshot: LookbookSnapshot) => {
    setLookbookSnapshots((prev) => [snapshot, ...prev]);
  };

  const handleDeleteSnapshot = (id: string) => {
    setLookbookSnapshots((prev) => prev.filter((s) => s.id !== id));
  };

  const handleOpenAIWithContext = (context: any) => {
    setAiStylistContext(context);
    setIsAIStylistOpen(true);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0B0C10] text-gray-100 flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Global Luxury Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenARStudio={handleOpenARStudio}
        onOpenAIStylist={() => setIsAIStylistOpen(true)}
        onOpenRingSizeFinder={() => setIsRingSizeFinderOpen(true)}
        onOpenVIPBooking={() => setIsVIPBookingOpen(true)}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => {
          setSearchQuery('');
          setActiveTab('catalog');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currency={currency}
        setCurrency={setCurrency}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === 'catalog' && (
          <div>
            {/* Hero Editorial Banner */}
            <HeroBanner
              onOpenARStudio={() => setActiveTab('ar_studio')}
              onOpenAIStylist={() => setIsAIStylistOpen(true)}
              onSelectQuickLook={handleSelectQuickLook}
              featuredItems={JEWELRY_CATALOG.filter((i) => i.featured)}
            />

            {/* Catalog Grid View with Advanced Filters */}
            <JewelryCatalogView
              onTryOnItem={handleTryOnSingleItem}
              onViewDetails={(item) => setSelectedItemForDetail(item)}
              onToggleWishlist={handleToggleWishlist}
              wishlist={wishlist}
              searchQuery={searchQuery}
              currency={currency}
              selectedCategoryFilter={selectedCatalogCategory}
            />
          </div>
        )}

        {activeTab === 'ar_studio' && (
          <ARStudioView
            activeItems={activeARItems}
            setActiveItems={setActiveARItems}
            onAddToCart={handleAddToCart}
            onSaveLookbook={handleSaveLookbookSnapshot}
            onOpenAIStylistWithContext={handleOpenAIWithContext}
            currency={currency}
            onClose={() => setActiveTab('catalog')}
          />
        )}

        {activeTab === 'lookbook' && (
          <div className="py-8">
            <LookbookModal
              snapshots={lookbookSnapshots}
              onClose={() => setActiveTab('catalog')}
              onLaunchAR={() => setActiveTab('ar_studio')}
              onDeleteSnapshot={handleDeleteSnapshot}
              onAddToCart={(item) => handleAddToCart(item)}
              onTrySnapshotItems={(items) => {
                const newItems: Record<string, JewelryItem> = {};
                items.forEach((i) => (newItems[i.id] = i));
                setActiveARItems(newItems);
                setActiveTab('ar_studio');
              }}
            />
          </div>
        )}
      </main>

      {/* Modals & Slide-overs */}
      <ProductDetailModal
        item={selectedItemForDetail}
        onClose={() => setSelectedItemForDetail(null)}
        onTryOn={handleTryOnSingleItem}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedItemForDetail ? wishlist.includes(selectedItemForDetail.id) : false}
        currency={currency}
      />

      <AIStylistDrawer
        isOpen={isAIStylistOpen}
        onClose={() => setIsAIStylistOpen(false)}
        onSelectAndTryItem={handleTryOnSingleItem}
        initialContext={aiStylistContext}
      />

      <RingSizeFinderModal
        isOpen={isRingSizeFinderOpen}
        onClose={() => setIsRingSizeFinderOpen(false)}
      />

      <VIPBookingModal
        isOpen={isVIPBookingOpen}
        onClose={() => setIsVIPBookingOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => setIsCheckoutOpen(true)}
        currency={currency}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderComplete={() => {
          setCartItems([]);
          setIsCheckoutOpen(false);
        }}
        currency={currency}
      />

      {/* Luxury Footer */}
      <Footer
        onOpenARStudio={() => setActiveTab('ar_studio')}
        onOpenAIStylist={() => setIsAIStylistOpen(true)}
        onOpenRingSizeFinder={() => setIsRingSizeFinderOpen(true)}
        onOpenVIPBooking={() => setIsVIPBookingOpen(true)}
      />
    </div>
  );
}
