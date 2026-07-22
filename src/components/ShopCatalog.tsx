import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { FurnitureItem, RoomCategory, ItemCondition } from '../types';
import { 
  Search, SlidersHorizontal, Sparkles, ShoppingBag, Eye, Tag, AlertCircle, 
  MapPin, Check, ArrowUpDown, Filter, Zap, Ruler, ShieldCheck
} from 'lucide-react';

export const ShopCatalog: React.FC = () => {
  const { catalog, addToCart, setSelectedProductDetail, launchArWithItem } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'discount' | 'price-asc' | 'price-desc' | 'rating'>('discount');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [maxWidthInches, setMaxWidthInches] = useState<number>(120);

  const categories: string[] = ['All', 'Living Room', 'Bedroom', 'Dining', 'Office', 'Outdoor', 'Clearance'];
  const conditions: string[] = ['All', 'Brand New', 'Open Box', 'Floor Model', 'Scratch & Dent'];

  // Filter & Sort Logic
  const filteredCatalog = useMemo(() => {
    return catalog
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.materials.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory =
          selectedCategory === 'All' || item.category === selectedCategory;

        const matchesCondition =
          selectedCondition === 'All' || item.condition === selectedCondition;

        const matchesStock = !inStockOnly || item.stockCount > 0;
        const matchesPrice = item.outletPrice <= maxPrice;
        const matchesWidth = item.dimensions.widthInches <= maxWidthInches;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesCondition &&
          matchesStock &&
          matchesPrice &&
          matchesWidth
        );
      })
      .sort((a, b) => {
        if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
        if (sortBy === 'price-asc') return a.outletPrice - b.outletPrice;
        if (sortBy === 'price-desc') return b.outletPrice - a.outletPrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [catalog, searchQuery, selectedCategory, selectedCondition, sortBy, inStockOnly, maxPrice, maxWidthInches]);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Outlet Showcase Header */}
      <section className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-10 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/10 via-amber-500/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Direct Overstock & Floor Model Warehouse</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-display leading-tight text-zinc-100">
            Designer Furniture at <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Outlet Clearance</span> Prices
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Browse verified floor models, overstock returns, and open-box designer inventory with up to 65% MSRP savings. Test every piece in real-time inside your home using our interactive AR Room Visualizer.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-zinc-800/80 p-3 rounded-xl border border-zinc-700/60">
              <span className="text-xs text-zinc-400 block font-medium">Average Savings</span>
              <span className="text-xl font-extrabold text-amber-400 font-mono">45% - 65% OFF</span>
            </div>

            <div className="bg-zinc-800/80 p-3 rounded-xl border border-zinc-700/60">
              <span className="text-xs text-zinc-400 block font-medium">Warehouse Holding</span>
              <span className="text-xl font-extrabold text-white font-mono">15-Min Timer</span>
            </div>

            <div className="bg-zinc-800/80 p-3 rounded-xl border border-zinc-700/60">
              <span className="text-xs text-zinc-400 block font-medium">AR Fitting</span>
              <span className="text-xl font-extrabold text-amber-400 font-mono">Live 3D & Cam</span>
            </div>

            <div className="bg-zinc-800/80 p-3 rounded-xl border border-zinc-700/60">
              <span className="text-xs text-zinc-400 block font-medium">Delivery Slot</span>
              <span className="text-xl font-extrabold text-white font-mono">White-Glove</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Toolbar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-5 shadow-lg">
        {/* Search bar and Primary Controls */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search sectionals, marble tables, walnut desks, SKU or material..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800/90 text-white pl-10 pr-4 py-2.5 rounded-xl border border-zinc-700 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Selector */}
            <div className="relative flex items-center bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200">
              <ArrowUpDown className="w-3.5 h-3.5 mr-2 text-amber-400" />
              <span className="text-zinc-400 mr-2 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="discount" className="bg-zinc-900 text-white">Biggest Discount %</option>
                <option value="price-asc" className="bg-zinc-900 text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-zinc-900 text-white">Price: High to Low</option>
                <option value="rating" className="bg-zinc-900 text-white">Top Customer Rating</option>
              </select>
            </div>

            {/* In-Stock Toggle */}
            <label className="flex items-center space-x-2 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-300 cursor-pointer hover:bg-zinc-750 transition-colors">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500 bg-zinc-900 border-zinc-600"
              />
              <span className="font-semibold">In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mr-1">Room:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Condition Filter & Max Width Slider */}
        <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mr-1">Condition:</span>
            {conditions.map((cond) => (
              <button
                key={cond}
                onClick={() => setSelectedCondition(cond)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedCondition === cond
                    ? 'bg-zinc-100 text-zinc-950 font-bold'
                    : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 border border-zinc-700/40'
                }`}
              >
                {cond}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-6 text-xs text-zinc-400">
            {/* Max Width Filter Slider */}
            <div className="flex items-center space-x-2">
              <Ruler className="w-3.5 h-3.5 text-amber-400" />
              <span>Max Width: <strong className="text-white font-mono">{maxWidthInches}"</strong></span>
              <input
                type="range"
                min={30}
                max={130}
                step={5}
                value={maxWidthInches}
                onChange={(e) => setMaxWidthInches(Number(e.target.value))}
                className="w-24 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Max Price Slider */}
            <div className="flex items-center space-x-2">
              <span>Max Price: <strong className="text-white font-mono">${maxPrice}</strong></span>
              <input
                type="range"
                min={200}
                max={3000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredCatalog.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">No Outlet Items Found</h3>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">
            We couldn't find any furniture matching your exact search or dimensional filters. Try adjusting your category or max width slider.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedCondition('All');
              setMaxWidthInches(120);
              setMaxPrice(3000);
            }}
            className="px-4 py-2 bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCatalog.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300 flex flex-col group shadow-lg"
            >
              {/* Product Image Container */}
              <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden cursor-pointer" onClick={() => setSelectedProductDetail(item)}>
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-md shadow-md uppercase tracking-wide">
                    -{item.discountPercent}% OFF
                  </span>
                  
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border backdrop-blur-md shadow-sm ${
                    item.condition === 'Brand New' 
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      : item.condition === 'Open Box'
                      ? 'bg-blue-950/80 text-blue-300 border-blue-500/40'
                      : item.condition === 'Floor Model'
                      ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                      : 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                  }`}>
                    {item.condition}
                  </span>
                </div>

                {/* Quick AR Launch Overlay Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    launchArWithItem(item);
                  }}
                  className="absolute bottom-3 right-3 bg-zinc-950/90 hover:bg-amber-500 hover:text-zinc-950 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-500/40 backdrop-blur-md transition-all flex items-center space-x-1.5 shadow-lg"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Try in AR</span>
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>SKU: {item.sku}</span>
                    <span className="flex items-center text-amber-400">
                      ★ {item.rating} <span className="text-zinc-500 ml-1">({item.reviewsCount})</span>
                    </span>
                  </div>

                  <h3 
                    onClick={() => setSelectedProductDetail(item)}
                    className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer"
                  >
                    {item.name}
                  </h3>

                  <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Dimensions & Warehouse Aisle */}
                <div className="bg-zinc-800/60 p-2.5 rounded-xl border border-zinc-800 space-y-1 text-[11px] text-zinc-300">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-zinc-400">
                      <Ruler className="w-3 h-3 mr-1 text-amber-400" />
                      Dimensions:
                    </span>
                    <span className="font-mono text-zinc-200 font-semibold">
                      {item.dimensions.widthInches}" W × {item.dimensions.depthInches}" D × {item.dimensions.heightInches}" H
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-zinc-400">
                      <MapPin className="w-3 h-3 mr-1 text-amber-400" />
                      Location:
                    </span>
                    <span className="font-mono text-amber-300 font-medium">
                      {item.aisleLocation}
                    </span>
                  </div>
                </div>

                {/* Stock Meter & Price Bar */}
                <div className="space-y-3 pt-2 border-t border-zinc-800">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-black text-amber-400 font-mono">
                          ${item.outletPrice}
                        </span>
                        <span className="text-xs text-zinc-500 line-through font-mono">
                          MSRP ${item.msrp}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold block">
                        Save ${(item.msrp - item.outletPrice).toLocaleString()} instantly
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`text-[11px] font-bold block ${
                        item.stockCount <= 2 ? 'text-amber-400 animate-pulse' : 'text-zinc-400'
                      }`}>
                        {item.stockCount > 0 ? `${item.stockCount} in stock` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedProductDetail(item)}
                      className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Condition Details</span>
                    </button>

                    <button
                      onClick={() => addToCart(item, 1)}
                      disabled={item.stockCount <= 0}
                      className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 text-xs font-extrabold transition-all shadow-md flex items-center justify-center space-x-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Reserve Item</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
