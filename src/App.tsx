import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { ShopCatalog } from './components/ShopCatalog';
import { ARStudio } from './components/ARStudio';
import { InventoryManager } from './components/InventoryManager';
import { DeliveryScheduler } from './components/DeliveryScheduler';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';

const AppContent: React.FC = () => {
  const { activeTab, selectedProductDetail, setSelectedProductDetail } = useShop();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-amber-500 selection:text-zinc-950 flex flex-col">
      {/* Header Bar */}
      <Header onOpenCart={() => setIsCartOpen(true)} />

      {/* Main App Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'shop' && <ShopCatalog />}
        {activeTab === 'ar' && <ARStudio />}
        {activeTab === 'inventory' && <InventoryManager />}
        {(activeTab === 'delivery' || activeTab === 'order-tracking') && <DeliveryScheduler />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 text-zinc-500 py-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-zinc-300">FurniOutlet</span>
            <span>• Direct Factory Overstock & AR Room Visualizer</span>
          </div>

          <div className="flex items-center space-x-6 text-zinc-400">
            <span>Guaranteed Quality Inspection</span>
            <span>•</span>
            <span>White-Glove Assembly</span>
            <span>•</span>
            <span>15-Min Hold Reservation</span>
          </div>
        </div>
      </footer>

      {/* Product Specs Modal */}
      <ProductDetailModal
        item={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
      />

      {/* Reservation Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
