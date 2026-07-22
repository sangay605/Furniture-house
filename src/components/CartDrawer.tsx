import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { DeliveryTier, TimeSlot, DeliveryDetails } from '../types';
import { 
  X, ShoppingBag, Clock, Trash2, ArrowRight, Tag, ShieldCheck, 
  Truck, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    cart, removeFromCart, updateCartQuantity, clearCart, 
    holdTimeRemaining, applyPromoCode, appliedPromo, placeOrder, setActiveTab 
  } = useShop();

  const [step, setStep] = useState<'cart' | 'delivery'>('cart');
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ success: boolean; message: string } | null>(null);

  // Delivery Form State
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    zipCode: '90210',
    address: '742 Evergreen Terrace',
    apartment: 'Apt 4B',
    city: 'Beverly Hills',
    state: 'CA',
    deliveryTier: 'whiteGlove',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    timeSlot: '12:00 PM - 04:00 PM',
    floorLevel: 2,
    hasElevator: true,
    doorwayWidthInches: 36,
    deliveryNotes: 'Please ring doorbell upon arrival.'
  });

  if (!isOpen) return null;

  // Format hold timer (mm:ss)
  const minutes = Math.floor(holdTimeRemaining / 60);
  const seconds = holdTimeRemaining % 60;
  const timerFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.outletPrice * item.quantity, 0);
  const msrpTotal = cart.reduce((sum, item) => sum + item.product.msrp * item.quantity, 0);
  const msrpSavings = Math.max(0, msrpTotal - subtotal);

  const discountAmount = appliedPromo ? Math.round((subtotal * appliedPromo.discountPercent) / 100) : 0;
  const discountedSubtotal = subtotal - discountAmount;

  let deliveryFee = 49;
  if (deliveryDetails.deliveryTier === 'whiteGlove') deliveryFee = 89;
  if (deliveryDetails.deliveryTier === 'express') deliveryFee = 119;

  const tax = Math.round(discountedSubtotal * 0.08 * 100) / 100;
  const grandTotal = Math.round((discountedSubtotal + deliveryFee + tax) * 100) / 100;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage(res);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = placeOrder(deliveryDetails);
    onClose();
    setActiveTab('order-tracking');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-zinc-900 border-l border-zinc-800 text-white h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/90">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black font-display">Outlet Reservation Cart</h2>
            <span className="bg-amber-500/20 text-amber-300 text-xs font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
              {cart.reduce((s, i) => s + i.quantity, 0)} Items
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hold Countdown Timer Bar */}
        {cart.length > 0 && (
          <div className="bg-amber-950/80 border-b border-amber-600/40 text-amber-300 px-6 py-2.5 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Stock Hold Guarantee Active:</span>
            </div>
            <span className="font-mono font-bold text-amber-200 text-sm">{timerFormatted}</span>
          </div>
        )}

        {/* Step 1: Cart Items / Step 2: Delivery Details */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <ShoppingBag className="w-16 h-16 text-zinc-700 mx-auto" />
              <h3 className="text-lg font-bold text-zinc-300">Your Outlet Cart is Empty</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Explore our discounted floor models and overstock catalog to reserve 1-of-a-kind designer pieces.
              </p>
            </div>
          ) : step === 'cart' ? (
            <div className="space-y-6">
              {/* Cart Item List */}
              <div className="space-y-3">
                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="bg-zinc-800/80 border border-zinc-700/60 p-3.5 rounded-2xl flex items-center justify-between space-x-4 shadow-sm"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover border border-zinc-700"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-bold text-white line-clamp-1">{product.name}</h4>
                      <div className="flex items-center space-x-2 text-[11px] text-zinc-400">
                        <span className="text-amber-400 font-bold font-mono">${product.outletPrice}</span>
                        <span className="line-through text-zinc-500 font-mono">${product.msrp}</span>
                        <span className="text-xs font-semibold text-emerald-400">({product.condition})</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono block">Loc: {product.aisleLocation}</span>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2 bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-700 text-xs">
                        <button
                          onClick={() => updateCartQuantity(product.id, quantity - 1)}
                          className="text-zinc-400 hover:text-white font-bold"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-white px-1">{quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(product.id, quantity + 1)}
                          className="text-zinc-400 hover:text-white font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-zinc-500 hover:text-red-400 p-1 text-xs flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Promo Discount Code</span>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Try OUTLET15 or WHITEGLOVE..."
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 bg-zinc-800 text-white px-3.5 py-2 rounded-xl border border-zinc-700 text-xs uppercase font-mono focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold text-xs rounded-xl border border-zinc-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {promoMessage && (
                  <p className={`text-[11px] font-semibold ${promoMessage.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {promoMessage.message}
                  </p>
                )}
              </form>

              {/* Summary Breakdown */}
              <div className="bg-zinc-800/60 p-4 rounded-2xl border border-zinc-700/60 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>MSRP Original Retail</span>
                  <span className="line-through font-mono">${msrpTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Outlet Discount Savings</span>
                  <span className="font-mono">-${msrpSavings.toLocaleString()}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-amber-400 font-bold">
                    <span>Promo ({appliedPromo.code})</span>
                    <span className="font-mono">-${discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t border-zinc-700/60 pt-2 flex justify-between text-sm font-extrabold text-white">
                  <span>Reserved Subtotal</span>
                  <span className="text-amber-400 font-mono">${discountedSubtotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Step 2: Delivery & Checkout Form */
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-5 text-xs">
              <div className="space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  1. Shipping & Assembly Address
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Address..."
                    value={deliveryDetails.address}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
                    className="bg-zinc-800 text-white p-2.5 rounded-xl border border-zinc-700"
                  />
                  <input
                    type="text"
                    placeholder="Apt / Suite..."
                    value={deliveryDetails.apartment}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, apartment: e.target.value })}
                    className="bg-zinc-800 text-white p-2.5 rounded-xl border border-zinc-700"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="City..."
                    value={deliveryDetails.city}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, city: e.target.value })}
                    className="bg-zinc-800 text-white p-2.5 rounded-xl border border-zinc-700"
                  />
                  <input
                    type="text"
                    required
                    placeholder="State..."
                    value={deliveryDetails.state}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, state: e.target.value })}
                    className="bg-zinc-800 text-white p-2.5 rounded-xl border border-zinc-700"
                  />
                  <input
                    type="text"
                    required
                    placeholder="ZIP..."
                    value={deliveryDetails.zipCode}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, zipCode: e.target.value })}
                    className="bg-zinc-800 text-white p-2.5 rounded-xl border border-zinc-700 font-mono"
                  />
                </div>
              </div>

              {/* Delivery Tier Selector */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  2. Delivery Service Tier
                </span>
                <div className="space-y-2">
                  <label className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer ${
                    deliveryDetails.deliveryTier === 'whiteGlove'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="tier"
                        checked={deliveryDetails.deliveryTier === 'whiteGlove'}
                        onChange={() => setDeliveryDetails({ ...deliveryDetails, deliveryTier: 'whiteGlove' })}
                      />
                      <span>White-Glove Assembly & Packaging Haul ($89)</span>
                    </div>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </label>

                  <label className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer ${
                    deliveryDetails.deliveryTier === 'standard'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="tier"
                        checked={deliveryDetails.deliveryTier === 'standard'}
                        onChange={() => setDeliveryDetails({ ...deliveryDetails, deliveryTier: 'standard' })}
                      />
                      <span>Standard Front Door Drop-off ($49)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Doorway Access Checklist */}
              <div className="bg-zinc-800/80 p-3.5 rounded-2xl border border-zinc-700/60 space-y-2">
                <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
                  Entry Access Verification
                </span>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <label className="text-zinc-400 block mb-1">Doorway Width (Inches)</label>
                    <input
                      type="number"
                      value={deliveryDetails.doorwayWidthInches}
                      onChange={(e) => setDeliveryDetails({ ...deliveryDetails, doorwayWidthInches: Number(e.target.value) })}
                      className="w-full bg-zinc-900 text-white p-2 rounded-xl border border-zinc-700 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">Floor Level</label>
                    <input
                      type="number"
                      value={deliveryDetails.floorLevel}
                      onChange={(e) => setDeliveryDetails({ ...deliveryDetails, floorLevel: Number(e.target.value) })}
                      className="w-full bg-zinc-900 text-white p-2 rounded-xl border border-zinc-700 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Final Breakdown */}
              <div className="bg-zinc-800/90 p-4 rounded-2xl border border-zinc-700 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Items Reserved Subtotal</span>
                  <span>${discountedSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Delivery Service</span>
                  <span>${deliveryFee}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Est. Sales Tax (8%)</span>
                  <span>${tax}</span>
                </div>
                <div className="border-t border-zinc-700 pt-2 flex justify-between text-base font-extrabold text-white">
                  <span>Grand Total</span>
                  <span className="text-amber-400">${grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-zinc-800 bg-zinc-900/90 space-y-3">
            {step === 'cart' ? (
              <button
                onClick={() => setStep('delivery')}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm transition-all shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Proceed to Delivery & Schedule Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="w-1/3 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs"
                >
                  Back to Cart
                </button>

                <button
                  type="submit"
                  form="checkout-form"
                  className="w-2/3 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs transition-all shadow-lg"
                >
                  Place Outlet Order (${grandTotal.toLocaleString()})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
