import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { DeliveryDetails, DeliveryTier, TimeSlot } from '../types';
import deliveryTruckImg from '../assets/images/delivery_truck_1784714152091.jpg';
import { 
  Truck, Calendar, Clock, MapPin, ShieldCheck, CheckCircle2, 
  PhoneCall, Navigation, AlertCircle, Sparkles, ChevronRight, User, PackageCheck
} from 'lucide-react';

export const DeliveryScheduler: React.FC = () => {
  const { activeOrder, orders, trackOrderById, setActiveTab } = useShop();

  const [searchTrackingInput, setSearchTrackingInput] = useState('');

  // Sample form state for standalone delivery booking preview
  const [zipCode, setZipCode] = useState('90210');
  const [address, setAddress] = useState('742 Evergreen Terrace');
  const [deliveryTier, setDeliveryTier] = useState<DeliveryTier>('whiteGlove');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>('12:00 PM - 04:00 PM');

  // Dates generator for next 7 days
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() + 86400000 * (i + 1));
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  const timeSlots: { slot: TimeSlot; capacity: string; isFull?: boolean }[] = [
    { slot: '08:00 AM - 12:00 PM', capacity: '2 slots left' },
    { slot: '12:00 PM - 04:00 PM', capacity: 'High Availability' },
    { slot: '04:00 PM - 08:00 PM', capacity: '1 slot left' }
  ];

  const handleSearchTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTrackingInput) return;
    trackOrderById(searchTrackingInput.trim());
  };

  return (
    <div className="space-y-8 pb-16 text-white">
      {/* Title Header */}
      <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>White-Glove Furniture Logistics</span>
          </div>
          <h1 className="text-3xl font-black font-display text-white">Seamless Delivery & Live Tracking</h1>
          <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
            Choose exact delivery time windows, opt for full assembly and packaging removal, and track driver arrival in real time.
          </p>
        </div>

        {/* Quick Tracking Search Box */}
        <form onSubmit={handleSearchTracking} className="w-full md:w-auto bg-zinc-800/90 p-2.5 rounded-2xl border border-zinc-700 flex items-center space-x-2 z-10">
          <input
            type="text"
            placeholder="Enter Order # (e.g. ORD-98214)..."
            value={searchTrackingInput}
            onChange={(e) => setSearchTrackingInput(e.target.value)}
            className="bg-transparent text-white px-3 py-1.5 text-xs focus:outline-none w-full md:w-56 font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition-colors shrink-0"
          >
            Track Order
          </button>
        </form>

        <img
          src={deliveryTruckImg}
          alt="Delivery Van"
          referrerPolicy="no-referrer"
          className="absolute right-0 top-0 w-1/3 h-full object-cover opacity-20 pointer-events-none hidden lg:block mask-radial"
        />
      </div>

      {/* Main Section: Live Active Order Tracker vs Delivery Schedule Booking Preview */}
      {activeOrder ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-black text-white font-mono">{activeOrder.id}</span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {activeOrder.status}
                </span>
              </div>
              <p className="text-zinc-400 text-xs mt-1">
                Placed on {new Date(activeOrder.createdAt).toLocaleDateString()} • Tracking: <span className="font-mono text-zinc-300">{activeOrder.trackingCode}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-zinc-400 block font-medium">Scheduled Delivery Date</span>
              <span className="text-base font-extrabold text-amber-400 font-mono">
                {activeOrder.deliveryDetails.date} ({activeOrder.deliveryDetails.timeSlot})
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Logistics Status</span>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {['Confirmed', 'Preparing', 'In Transit', 'Delivered'].map((step, idx) => {
                const stepOrder = ['Confirmed', 'Preparing', 'In Transit', 'Delivered'];
                const currentIdx = stepOrder.indexOf(activeOrder.status);
                const isPassed = idx <= currentIdx;

                return (
                  <div
                    key={step}
                    className={`p-3 rounded-2xl border transition-all ${
                      isPassed
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-zinc-800/40 border-zinc-800 text-zinc-600'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-zinc-900 mx-auto mb-1 flex items-center justify-center font-mono text-[10px] font-bold border border-current">
                      {idx + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Driver GPS Map & ETA Simulation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* GPS Visualizer Box (2 Cols) */}
            <div className="lg:col-span-2 relative bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden min-h-[320px] flex flex-col justify-between p-6 shadow-inner">
              {/* Map background grid simulation */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              {/* Map Route Animation Canvas Graphic */}
              <div className="relative z-10 flex-1 flex items-center justify-center">
                <div className="w-full max-w-md space-y-6">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center space-x-2 bg-zinc-900/90 p-2.5 rounded-xl border border-zinc-800">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-zinc-400 block text-[10px]">ORIGIN</span>
                        <span className="font-bold text-white">Outlet Warehouse A</span>
                      </div>
                    </div>

                    <div className="text-amber-400 animate-pulse flex items-center space-x-1 font-bold">
                      <Truck className="w-5 h-5" />
                      <span>------------------&gt;</span>
                    </div>

                    <div className="flex items-center space-x-2 bg-zinc-900/90 p-2.5 rounded-xl border border-zinc-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="text-zinc-400 block text-[10px]">DESTINATION</span>
                        <span className="font-bold text-white">{activeOrder.deliveryDetails.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Live ETA Card */}
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 p-5 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider block opacity-80">Estimated Driver Arrival</span>
                      <span className="text-3xl font-black font-mono">
                        {activeOrder.driverInfo.etaMinutes > 0 ? `${activeOrder.driverInfo.etaMinutes} Minutes` : 'Arrived at Address'}
                      </span>
                    </div>
                    <div className="w-12 h-12 bg-zinc-950 text-amber-400 rounded-xl flex items-center justify-center font-bold text-lg shadow-md">
                      <Navigation className="w-6 h-6 animate-spin" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-3 border-t border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
                <span>GPS Driver Location: Lat {activeOrder.driverInfo.currentLocation.lat}, Lng {activeOrder.driverInfo.currentLocation.lng}</span>
                <span className="text-emerald-400 font-semibold flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-ping" />
                  Live Stream Active
                </span>
              </div>
            </div>

            {/* Driver Contact & Order Items Summary (1 Col) */}
            <div className="space-y-4">
              {/* Driver Card */}
              <div className="bg-zinc-800/80 border border-zinc-700/80 p-5 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Assigned Driver</span>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-zinc-950 font-black text-lg flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{activeOrder.driverInfo.name}</h4>
                    <span className="text-xs text-amber-400 font-semibold">★ {activeOrder.driverInfo.rating} Rating</span>
                  </div>
                </div>

                <div className="text-xs space-y-1 pt-2 border-t border-zinc-700/60 text-zinc-300 font-mono">
                  <p>Vehicle: {activeOrder.driverInfo.vehiclePlate}</p>
                </div>

                <button 
                  onClick={() => alert(`Calling driver ${activeOrder.driverInfo.name} at ${activeOrder.driverInfo.phone}...`)}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs rounded-xl shadow transition-colors flex items-center justify-center space-x-2"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Driver ({activeOrder.driverInfo.phone})</span>
                </button>
              </div>

              {/* Items in Order */}
              <div className="bg-zinc-800/80 border border-zinc-700/80 p-5 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Delivery Cargo Items ({activeOrder.items.length})
                </span>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {activeOrder.items.map((i, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-xs border-b border-zinc-700/40 pb-2">
                      <img
                        src={i.product.image}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-white font-bold block truncate">{i.product.name}</span>
                        <span className="text-zinc-400 text-[10px]">{i.condition} • Qty: {i.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Standalone Booking Preview Form when no active order selected */
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl max-w-4xl mx-auto">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">White-Glove Delivery Calculator & Slot Picker</h2>
            <p className="text-zinc-400 text-xs">Test delivery coverage for your area and view real-time driver slot availability.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Standard Tier */}
            <div
              onClick={() => setDeliveryTier('standard')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                deliveryTier === 'standard'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                  : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-300'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase font-mono">Standard Threshold</span>
                <span className="text-base font-extrabold text-white font-mono">$49</span>
              </div>
              <p className="text-[11px] text-zinc-400">Front door or porch drop-off in original outlet packaging.</p>
            </div>

            {/* White Glove */}
            <div
              onClick={() => setDeliveryTier('whiteGlove')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                deliveryTier === 'whiteGlove'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                  : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-300'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase font-mono">White-Glove Assembly</span>
                <span className="text-base font-extrabold text-amber-400 font-mono">$89</span>
              </div>
              <p className="text-[11px] text-zinc-400">Room placement, full tool assembly, and packaging removal.</p>
            </div>

            {/* Express */}
            <div
              onClick={() => setDeliveryTier('express')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                deliveryTier === 'express'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                  : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-300'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase font-mono">Express Priority</span>
                <span className="text-base font-extrabold text-white font-mono">$119</span>
              </div>
              <p className="text-[11px] text-zinc-400">Next-day guaranteed dispatch with 2-hour driver window.</p>
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Select Delivery Date
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {availableDates.map((item) => (
                <button
                  key={item.dateStr}
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    selectedDate === item.dateStr
                      ? 'bg-amber-500 text-zinc-950 font-black shadow-lg scale-105'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <span className="text-[10px] uppercase block font-semibold">{item.dayName}</span>
                  <span className="text-lg font-mono font-bold block">{item.dayNum}</span>
                  <span className="text-[10px] block opacity-80">{item.month}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Picker */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Select Driver Time Window
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {timeSlots.map((ts) => (
                <button
                  key={ts.slot}
                  onClick={() => setSelectedSlot(ts.slot)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    selectedSlot === ts.slot
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-zinc-800 border-zinc-700/60 text-zinc-300 hover:bg-zinc-750'
                  }`}
                >
                  <div>
                    <span className="text-xs font-mono font-bold block">{ts.slot}</span>
                    <span className="text-[10px] text-zinc-400 block">{ts.capacity}</span>
                  </div>
                  <Clock className="w-4 h-4 text-amber-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
