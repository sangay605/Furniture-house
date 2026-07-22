import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Sparkles, Box, Truck, Clock, ShieldCheck, Tag } from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  const { activeTab, setActiveTab, cart, holdTimeRemaining } = useShop();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Format hold timer (mm:ss)
  const minutes = Math.floor(holdTimeRemaining / 60);
  const seconds = holdTimeRemaining % 60;
  const timerFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <header className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 text-white shadow-xl">
      {/* Top Banner Alert */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-zinc-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between shadow-inner">
        <div className="flex items-center space-x-2 mx-auto sm:mx-0">
          <Tag className="w-3.5 h-3.5" />
          <span>OUTLET CLEARANCE EVENT: Up to 65% OFF MSRP + Extra 15% off with code <strong className="bg-zinc-950 text-amber-400 px-1.5 py-0.5 rounded font-mono">OUTLET15</strong></span>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-[11px] font-medium text-zinc-900">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-950" />
            <span>Guaranteed Authentic & Inspected</span>
          </span>
          <span>|</span>
          <span className="flex items-center space-x-1">
            <Truck className="w-3.5 h-3.5 text-zinc-950" />
            <span>White-Glove Assembly Available</span>
          </span>
        </div>
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('shop')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-zinc-900 rounded-[10px] flex items-center justify-center text-amber-400">
                <Box className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-white font-display">Furni</span>
                <span className="text-xl font-black tracking-tight text-amber-400">Outlet</span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border border-amber-500/30">
                  AR Studio
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 -mt-1 tracking-wide font-medium">Direct Factory & Overstock Warehouse</p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-zinc-800/60 p-1 rounded-xl border border-zinc-700/50">
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'shop'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-700/50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Outlet Shop</span>
            </button>

            <button
              onClick={() => setActiveTab('ar')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'ar'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-700/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-300" />
              <span>AR Room Preview</span>
              <span className="bg-amber-400/20 text-amber-300 text-[9px] px-1 py-0.2 rounded font-mono">3D</span>
            </button>

            <button
              onClick={() => setActiveTab('delivery')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'delivery' || activeTab === 'order-tracking'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-700/50'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Delivery Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'inventory'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Inventory Admin</span>
            </button>
          </nav>

          {/* Right Section: Reservation Timer & Cart */}
          <div className="flex items-center space-x-3">
            {/* Active Hold Countdown Badge */}
            {cart.length > 0 && (
              <div className="hidden sm:flex items-center space-x-1.5 bg-amber-950/80 border border-amber-600/40 text-amber-300 text-xs px-2.5 py-1 rounded-lg font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-[11px] font-semibold">Hold: {timerFormatted}</span>
              </div>
            )}

            {/* Cart Trigger Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-lg transition-all active:scale-95 flex items-center space-x-2"
              title="Open Reservation Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-extrabold uppercase tracking-wide">Cart</span>
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[11px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-zinc-900 shadow-md animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav Tabs Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-zinc-800 text-xs">
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex flex-col items-center py-1 px-2 rounded ${
              activeTab === 'shop' ? 'text-amber-400 font-bold' : 'text-zinc-400'
            }`}
          >
            <ShoppingBag className="w-4 h-4 mb-0.5" />
            <span>Shop</span>
          </button>

          <button
            onClick={() => setActiveTab('ar')}
            className={`flex flex-col items-center py-1 px-2 rounded ${
              activeTab === 'ar' ? 'text-amber-400 font-bold' : 'text-zinc-400'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5" />
            <span>AR Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('delivery')}
            className={`flex flex-col items-center py-1 px-2 rounded ${
              activeTab === 'delivery' || activeTab === 'order-tracking' ? 'text-amber-400 font-bold' : 'text-zinc-400'
            }`}
          >
            <Truck className="w-4 h-4 mb-0.5" />
            <span>Delivery</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex flex-col items-center py-1 px-2 rounded ${
              activeTab === 'inventory' ? 'text-amber-400 font-bold' : 'text-zinc-400'
            }`}
          >
            <Box className="w-4 h-4 mb-0.5" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
