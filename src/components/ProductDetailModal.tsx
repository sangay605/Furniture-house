import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { FurnitureItem } from '../types';
import { 
  X, Sparkles, ShoppingBag, ShieldCheck, MapPin, Ruler, CheckCircle2, 
  AlertTriangle, Star, Tag, Truck
} from 'lucide-react';

interface ProductDetailModalProps {
  item: FurnitureItem | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ item, onClose }) => {
  const { addToCart, launchArWithItem } = useShop();

  if (!item) return null;

  const [activeImage, setActiveImage] = useState<string>(item.image);
  const [selectedColor, setSelectedColor] = useState<string>(item.colorOptions[0] || 'Default');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl my-8 text-white max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/90 sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-2.5 py-1 rounded-lg uppercase font-mono">
              Outlet Item #{item.sku}
            </span>
            <span className="text-zinc-400 text-xs font-medium">Verified Inventory</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery Column */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800">
                <img
                  src={activeImage}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-md shadow-md uppercase">
                  -{item.discountPercent}% OFF MSRP
                </span>
              </div>

              {/* Thumbnails */}
              <div className="flex items-center space-x-3 overflow-x-auto pb-1">
                {item.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImage === imgUrl ? 'border-amber-500 scale-105' : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>

              {/* Aisle Location Banner */}
              <div className="bg-zinc-800/80 p-4 rounded-2xl border border-zinc-700/60 space-y-2">
                <div className="flex items-center text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <MapPin className="w-4 h-4 mr-1.5" />
                  <span>Physical Warehouse Location</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300 font-mono font-semibold">{item.aisleLocation}</span>
                  <span className="text-emerald-400 text-xs font-bold flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Inspected & Tagged
                  </span>
                </div>
              </div>
            </div>

            {/* Info Column */}
            <div className="space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">{item.category}</span>
                  <div className="flex items-center text-xs text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 mr-1" />
                    <span>{item.rating}</span>
                    <span className="text-zinc-500 ml-1">({item.reviewsCount} customer ratings)</span>
                  </div>
                </div>

                <h2 className="text-2xl font-black text-white font-display leading-tight">{item.name}</h2>

                {/* Condition Box */}
                <div className="bg-amber-950/40 border border-amber-600/40 p-3.5 rounded-2xl space-y-1">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300 uppercase">
                      Condition Report: {item.condition}
                    </span>
                  </div>
                  <p className="text-xs text-amber-100/90 leading-relaxed">
                    {item.conditionNote || 'Item has passed 12-point quality inspection by our outlet technicians.'}
                  </p>
                </div>

                {/* Price Box */}
                <div className="bg-zinc-800/90 p-4 rounded-2xl border border-zinc-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-400 block font-medium">Outlet Price</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black text-amber-400 font-mono">${item.outletPrice}</span>
                      <span className="text-sm text-zinc-500 line-through font-mono">MSRP ${item.msrp}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 block">
                      Save ${(item.msrp - item.outletPrice).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">15-Min Cart Reserve</span>
                  </div>
                </div>

                {/* Dimensions Specifications */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                    Product Floor Dimensions & Weight
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-zinc-800 p-2.5 rounded-xl border border-zinc-700/60">
                      <span className="text-zinc-500 block text-[10px]">WIDTH</span>
                      <strong className="text-white font-mono">{item.dimensions.widthInches} in</strong>
                    </div>
                    <div className="bg-zinc-800 p-2.5 rounded-xl border border-zinc-700/60">
                      <span className="text-zinc-500 block text-[10px]">DEPTH</span>
                      <strong className="text-white font-mono">{item.dimensions.depthInches} in</strong>
                    </div>
                    <div className="bg-zinc-800 p-2.5 rounded-xl border border-zinc-700/60">
                      <span className="text-zinc-500 block text-[10px]">HEIGHT</span>
                      <strong className="text-white font-mono">{item.dimensions.heightInches} in</strong>
                    </div>
                    <div className="bg-zinc-800 p-2.5 rounded-xl border border-zinc-700/60">
                      <span className="text-zinc-500 block text-[10px]">WEIGHT</span>
                      <strong className="text-white font-mono">{item.dimensions.weightLbs} lbs</strong>
                    </div>
                  </div>
                </div>

                {/* Color Variants */}
                {item.colorOptions.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                      Finish / Upholstery
                    </span>
                    <div className="flex items-center space-x-2">
                      {item.colorOptions.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            selectedColor === color
                              ? 'bg-amber-500 text-zinc-950 font-bold'
                              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-1 pt-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Description</span>
                  <p className="text-zinc-300 text-xs leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <button
                  onClick={() => {
                    launchArWithItem(item);
                    onClose();
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Preview in AR Room Visualizer (3D / Camera)</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      addToCart(item, 1);
                      onClose();
                    }}
                    disabled={item.stockCount <= 0}
                    className="py-3 rounded-2xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Reserve & Add to Cart</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
