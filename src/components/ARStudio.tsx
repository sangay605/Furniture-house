import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { FurnitureItem, PlacedARItem } from '../types';
import { ROOM_PRESETS } from '../data/mockRooms';
import { 
  Sparkles, Camera, Image as ImageIcon, RotateCw, Move, Maximize2, 
  Trash2, Plus, ShoppingBag, Sun, Sliders, Check, Download, Layers, Ruler, Eye, RefreshCw
} from 'lucide-react';

export const ARStudio: React.FC = () => {
  const { catalog, placedArItems, setPlacedArItems, addToCart, selectedArItem } = useShop();

  // Mode: Preset Room vs Live Camera Feed
  const [useCameraFeed, setUseCameraFeed] = useState<boolean>(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(ROOM_PRESETS[0].id);
  const [selectedPlacedId, setSelectedPlacedId] = useState<string | null>(
    placedArItems[0]?.id || null
  );

  // Room Lighting Adjustments
  const [roomLighting, setRoomLighting] = useState<number>(100); // brightness
  const [roomWarmth, setRoomWarmth] = useState<number>(100); // sepia/hue
  const [shadowOpacity, setShadowOpacity] = useState<number>(40);

  // Camera video ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  // Stage container ref for drag calculation
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Initialize camera if requested
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useCameraFeed) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }
          setIsCameraActive(true);
          setCameraError(null);
        })
        .catch((err) => {
          console.warn('Camera access error:', err);
          setCameraError('Camera access unavailable or declined. Reverting to preset 3D room canvas.');
          setUseCameraFeed(false);
          setIsCameraActive(false);
        });
    } else {
      setIsCameraActive(false);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useCameraFeed]);

  // Keep selected item valid
  useEffect(() => {
    if (placedArItems.length > 0 && !selectedPlacedId) {
      setSelectedPlacedId(placedArItems[placedArItems.length - 1].id);
    }
  }, [placedArItems]);

  const activeRoom = ROOM_PRESETS.find((r) => r.id === selectedRoomId) || ROOM_PRESETS[0];

  const activePlacedItem = placedArItems.find((p) => p.id === selectedPlacedId);

  // Add new item to AR space
  const handleAddItemToRoom = (product: FurnitureItem) => {
    const newItem: PlacedARItem = {
      id: `placed-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      itemId: product.id,
      product,
      x: 45 + Math.random() * 10,
      y: 55 + Math.random() * 10,
      rotation: 0,
      scale: 1,
      elevation: 0,
      color: product.colorOptions[0] || 'Default',
      showDimensions: true
    };
    setPlacedArItems((prev) => [...prev, newItem]);
    setSelectedPlacedId(newItem.id);
  };

  // Remove item from room
  const handleRemovePlacedItem = (id: string) => {
    setPlacedArItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedPlacedId === id) {
      setSelectedPlacedId(null);
    }
  };

  // Update attributes of placed item
  const updatePlacedItem = (id: string, updates: Partial<PlacedARItem>) => {
    setPlacedArItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Canvas Drag Handling
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedPlacedId(id);
    setIsDragging(true);
  };

  const handleStagePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !selectedPlacedId || !stageRef.current) return;

    const rect = stageRef.current.getBoundingClientRect();
    const xPercent = Math.max(10, Math.min(90, ((e.clientX - rect.left) / rect.width) * 100));
    const yPercent = Math.max(10, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));

    updatePlacedItem(selectedPlacedId, { x: xPercent, y: yPercent });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Add all items in AR room to Cart
  const handleAddAllArToCart = () => {
    placedArItems.forEach((placed) => {
      addToCart(placed.product, 1);
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Studio Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h1 className="text-2xl font-black font-display">Augmented Reality Room Studio</h1>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Drag, rotate, scale, and preview outlet furniture directly inside your room or preset 3D canvases.
          </p>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-zinc-800 p-1 rounded-2xl border border-zinc-700/60 text-xs">
            <button
              onClick={() => setUseCameraFeed(false)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
                !useCameraFeed ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Room Canvas</span>
            </button>

            <button
              onClick={() => setUseCameraFeed(true)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
                useCameraFeed ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Live Camera</span>
            </button>
          </div>

          {placedArItems.length > 0 && (
            <button
              onClick={handleAddAllArToCart}
              className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Room Set to Cart ({placedArItems.length})</span>
            </button>
          )}
        </div>
      </div>

      {cameraError && (
        <div className="bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs p-3.5 rounded-2xl flex items-center space-x-2">
          <span>⚠️ {cameraError}</span>
        </div>
      )}

      {/* Main AR Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left / Center AR Stage Canvas (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div
            ref={stageRef}
            onPointerMove={handleStagePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="relative w-full aspect-[16/9] min-h-[380px] bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl select-none touch-none"
            style={{
              filter: `brightness(${roomLighting}%) sepia(${(roomWarmth - 100) / 2}%)`
            }}
          >
            {/* Background Layer */}
            {useCameraFeed && isCameraActive ? (
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={activeRoom.imageUrl}
                alt={activeRoom.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-500"
              />
            )}

            {/* Grid Floor Overlay Guide */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Render Placed AR Furniture Items */}
            {placedArItems.map((placed) => {
              const isSelected = placed.id === selectedPlacedId;
              const product = placed.product;

              return (
                <div
                  key={placed.id}
                  onPointerDown={(e) => handlePointerDown(placed.id, e)}
                  style={{
                    left: `${placed.x}%`,
                    top: `${placed.y - placed.elevation}%`,
                    transform: `translate(-50%, -50%) rotate(${placed.rotation}deg) scale(${placed.scale})`,
                    zIndex: Math.round(placed.y)
                  }}
                  className={`absolute cursor-grab active:cursor-grabbing transition-transform duration-75 group ${
                    isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-950 rounded-xl' : ''
                  }`}
                >
                  {/* Shadow Projection underneath */}
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-4 bg-black rounded-full blur-md pointer-events-none"
                    style={{ opacity: shadowOpacity / 100 }}
                  />

                  {/* Item Image */}
                  <div className="relative pointer-events-none max-w-[180px] sm:max-w-[240px]">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-contain drop-shadow-2xl"
                    />

                    {/* Dimension Guidelines Overlay */}
                    {placed.showDimensions && isSelected && (
                      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-zinc-950/90 border border-amber-500/60 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg flex items-center space-x-1 pointer-events-none">
                        <Ruler className="w-3 h-3 text-amber-400" />
                        <span>{product.dimensions.widthInches}" W × {product.dimensions.depthInches}" D</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Empty Canvas Instructions */}
            {placedArItems.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-zinc-950/40 backdrop-blur-xs">
                <Sparkles className="w-12 h-12 text-amber-400 mb-3 animate-pulse" />
                <h3 className="text-xl font-bold text-white">AR Room Space Ready</h3>
                <p className="text-zinc-300 text-xs max-w-sm mt-1">
                  Select any furniture item from the sidebar or catalog to drop into your room preview.
                </p>
              </div>
            )}
          </div>

          {/* Preset Room Background Selector Bar */}
          {!useCameraFeed && (
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Select 3D Room Preset Scene
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ROOM_PRESETS.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`p-2 rounded-xl border text-left transition-all flex items-center space-x-3 ${
                      selectedRoomId === room.id
                        ? 'bg-amber-500/20 border-amber-500 text-white'
                        : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    <img
                      src={room.imageUrl}
                      alt={room.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold block truncate">{room.name}</span>
                      <span className="text-[10px] text-zinc-400 block">{room.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Item Transformation Controls Bar */}
          {activePlacedItem && (
            <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-5 rounded-2xl space-y-4 shadow-lg text-white">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wide">
                    Controls: <strong className="text-amber-400">{activePlacedItem.product.name}</strong>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      updatePlacedItem(activePlacedItem.id, {
                        showDimensions: !activePlacedItem.showDimensions
                      })
                    }
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors flex items-center space-x-1 ${
                      activePlacedItem.showDimensions
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Dimensions</span>
                  </button>

                  <button
                    onClick={() => handleRemovePlacedItem(activePlacedItem.id)}
                    className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg border border-red-800/60 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Rotation */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-zinc-400 font-medium">
                    <span className="flex items-center">
                      <RotateCw className="w-3 h-3 mr-1 text-amber-400" /> Rotation
                    </span>
                    <span className="font-mono text-white">{activePlacedItem.rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={activePlacedItem.rotation}
                    onChange={(e) =>
                      updatePlacedItem(activePlacedItem.id, { rotation: Number(e.target.value) })
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Scale */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-zinc-400 font-medium">
                    <span className="flex items-center">
                      <Maximize2 className="w-3 h-3 mr-1 text-amber-400" /> Size Scale
                    </span>
                    <span className="font-mono text-white">{activePlacedItem.scale.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={2.0}
                    step={0.05}
                    value={activePlacedItem.scale}
                    onChange={(e) =>
                      updatePlacedItem(activePlacedItem.id, { scale: Number(e.target.value) })
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Elevation */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-zinc-400 font-medium">
                    <span className="flex items-center">
                      <Move className="w-3 h-3 mr-1 text-amber-400" /> Height Offset
                    </span>
                    <span className="font-mono text-white">{activePlacedItem.elevation}px</span>
                  </div>
                  <input
                    type="range"
                    min={-20}
                    max={50}
                    value={activePlacedItem.elevation}
                    onChange={(e) =>
                      updatePlacedItem(activePlacedItem.id, { elevation: Number(e.target.value) })
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Catalog Picker & Room Item List (1 Col) */}
        <div className="space-y-6">
          {/* Quick Add Catalog Selector */}
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-4 text-white shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center">
                <Plus className="w-4 h-4 mr-1" />
                Add Outlet Items
              </span>
              <span className="text-[10px] text-zinc-400">{catalog.length} available</span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {catalog.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-800/80 p-3 rounded-2xl border border-zinc-700/60 hover:border-amber-500/60 transition-all flex items-center justify-between space-x-3 group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex items-center space-x-2 text-[10px] text-zinc-400">
                      <span className="text-amber-400 font-mono font-bold">${item.outletPrice}</span>
                      <span>•</span>
                      <span>{item.dimensions.widthInches}" W</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddItemToRoom(item)}
                    className="p-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl font-bold transition-all shadow-md active:scale-95"
                    title="Drop in AR space"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Placed Items Layers Manager */}
          {placedArItems.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-3 text-white shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block border-b border-zinc-800 pb-2">
                Room Layout Layers ({placedArItems.length})
              </span>

              <div className="space-y-2">
                {placedArItems.map((placed) => (
                  <div
                    key={placed.id}
                    onClick={() => setSelectedPlacedId(placed.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      selectedPlacedId === placed.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300 hover:bg-zinc-750'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="truncate">{placed.product.name}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePlacedItem(placed.id);
                      }}
                      className="text-zinc-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
