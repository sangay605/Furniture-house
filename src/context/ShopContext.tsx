import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FurnitureItem, CartItem, Order, DeliveryDetails, PlacedARItem, InventoryLogEntry, ItemCondition } from '../types';
import { INITIAL_CATALOG } from '../data/mockFurniture';

interface ShopContextType {
  catalog: FurnitureItem[];
  cart: CartItem[];
  holdTimeRemaining: number; // in seconds
  activeTab: string;
  selectedArItem: FurnitureItem | null;
  placedArItems: PlacedARItem[];
  selectedProductDetail: FurnitureItem | null;
  orders: Order[];
  activeOrder: Order | null;
  inventoryLogs: InventoryLogEntry[];
  appliedPromo: { code: string; discountPercent: number; description: string } | null;
  
  // Actions
  setActiveTab: (tab: string) => void;
  addToCart: (product: FurnitureItem, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (deliveryDetails: DeliveryDetails) => Order;
  updateStock: (productId: string, newStock: number, note?: string, type?: InventoryLogEntry['type']) => void;
  addProduct: (product: Omit<FurnitureItem, 'id'>) => FurnitureItem;
  editProduct: (product: FurnitureItem) => void;
  deleteProduct: (productId: string) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  setSelectedArItem: (item: FurnitureItem | null) => void;
  setPlacedArItems: React.Dispatch<React.SetStateAction<PlacedARItem[]>>;
  setSelectedProductDetail: (item: FurnitureItem | null) => void;
  trackOrderById: (orderId: string) => void;
  launchArWithItem: (item: FurnitureItem) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const HOLD_DURATION_SECONDS = 15 * 60; // 15 minutes hold timer for outlet reservation

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Catalog State
  const [catalog, setCatalog] = useState<FurnitureItem[]>(() => {
    try {
      const saved = localStorage.getItem('furni_outlet_catalog');
      return saved ? JSON.parse(saved) : INITIAL_CATALOG;
    } catch {
      return INITIAL_CATALOG;
    }
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('furni_outlet_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Hold Timer State
  const [holdTimeRemaining, setHoldTimeRemaining] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('furni_outlet_hold_timer');
      return saved ? Number(saved) : HOLD_DURATION_SECONDS;
    } catch {
      return HOLD_DURATION_SECONDS;
    }
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('shop');

  // AR State
  const [selectedArItem, setSelectedArItem] = useState<FurnitureItem | null>(null);
  const [placedArItems, setPlacedArItems] = useState<PlacedARItem[]>([]);

  // Product Detail Modal
  const [selectedProductDetail, setSelectedProductDetail] = useState<FurnitureItem | null>(null);

  // Promo Code State
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number; description: string } | null>(null);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('furni_outlet_orders');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default initial mock order for immediate delivery tracking demo!
    return [
      {
        id: 'ORD-98214',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        items: [
          { product: INITIAL_CATALOG[0], quantity: 1, condition: 'Open Box' }
        ],
        subtotal: 1299,
        msrpSavings: 1200,
        discountAmount: 0,
        deliveryFee: 89,
        tax: 103.92,
        total: 1491.92,
        deliveryDetails: {
          zipCode: '90210',
          address: '742 Evergreen Terrace',
          city: 'Beverly Hills',
          state: 'CA',
          deliveryTier: 'whiteGlove',
          date: new Date().toISOString().split('T')[0],
          timeSlot: '12:00 PM - 04:00 PM',
          floorLevel: 2,
          hasElevator: true,
          doorwayWidthInches: 36,
          deliveryNotes: 'Please ring bell upon arrival.'
        },
        status: 'In Transit',
        driverInfo: {
          name: 'Marcus Vance',
          phone: '(555) 319-8802',
          vehiclePlate: '6XYZ889 - White Glove Logistics Van',
          rating: 4.9,
          etaMinutes: 14,
          currentLocation: { lat: 34.0736, lng: -118.4004 }
        },
        trackingCode: 'TRK-OUTLET-98214'
      }
    ];
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(orders[0] || null);

  // Inventory Activity Logs
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLogEntry[]>([
    {
      id: 'log-101',
      timestamp: new Date(Date.now() - 86400000).toLocaleString(),
      itemId: 'furni-101',
      itemName: 'Malibu Velvet Modular 3-Piece Sectional',
      type: 'Restock',
      quantityChange: 3,
      newStock: 3,
      note: 'Floor model return intake from Downtown Showroom',
      user: 'Warehouse Admin'
    },
    {
      id: 'log-102',
      timestamp: new Date(Date.now() - 43200000).toLocaleString(),
      itemId: 'furni-103',
      itemName: 'Eames-Style Italian Leather Lounge Accent Chair',
      type: 'Restock',
      quantityChange: 6,
      newStock: 6,
      note: 'Overstock arrival batch #402',
      user: 'Logistics Supervisor'
    }
  ]);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('furni_outlet_catalog', JSON.stringify(catalog));
    } catch {}
  }, [catalog]);

  useEffect(() => {
    try {
      localStorage.setItem('furni_outlet_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('furni_outlet_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  // Hold Timer Effect
  useEffect(() => {
    if (cart.length === 0) {
      setHoldTimeRemaining(HOLD_DURATION_SECONDS);
      return;
    }

    const interval = setInterval(() => {
      setHoldTimeRemaining((prev) => {
        if (prev <= 1) {
          // Timer expired - notify & reset
          return HOLD_DURATION_SECONDS;
        }
        const updated = prev - 1;
        try {
          localStorage.setItem('furni_outlet_hold_timer', String(updated));
        } catch {}
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cart.length]);

  // Simulated Driver ETA countdown timer for In Transit active order
  useEffect(() => {
    if (!activeOrder || activeOrder.status !== 'In Transit') return;

    const interval = setInterval(() => {
      setActiveOrder((prevOrder) => {
        if (!prevOrder) return null;
        if (prevOrder.driverInfo.etaMinutes <= 1) {
          return {
            ...prevOrder,
            status: 'Delivered',
            driverInfo: {
              ...prevOrder.driverInfo,
              etaMinutes: 0
            }
          };
        }
        return {
          ...prevOrder,
          driverInfo: {
            ...prevOrder.driverInfo,
            etaMinutes: prevOrder.driverInfo.etaMinutes - 1
          }
        };
      });
    }, 20000); // adjust down for smooth simulation

    return () => clearInterval(interval);
  }, [activeOrder?.status]);

  // Cart actions
  const addToCart = (product: FurnitureItem, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const copy = [...prev];
        const newQty = Math.min(copy[existingIndex].quantity + quantity, product.stockCount);
        copy[existingIndex] = {
          ...copy[existingIndex],
          quantity: newQty,
          reservedUntil: Date.now() + HOLD_DURATION_SECONDS * 1000
        };
        return copy;
      } else {
        return [
          ...prev,
          {
            product,
            quantity: Math.min(quantity, product.stockCount),
            reservedUntil: Date.now() + HOLD_DURATION_SECONDS * 1000
          }
        ];
      }
    });
    // Reset timer on new add
    setHoldTimeRemaining(HOLD_DURATION_SECONDS);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stockCount) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setHoldTimeRemaining(HOLD_DURATION_SECONDS);
  };

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'OUTLET15') {
      setAppliedPromo({
        code: 'OUTLET15',
        discountPercent: 15,
        description: 'Outlet Clearance Extra 15% Off'
      });
      return { success: true, message: 'Code OUTLET15 applied! 15% extra discount added.' };
    } else if (cleanCode === 'WHITEGLOVE') {
      setAppliedPromo({
        code: 'WHITEGLOVE',
        discountPercent: 10,
        description: 'White Glove Promotion - 10% Off Total'
      });
      return { success: true, message: 'Code WHITEGLOVE applied! 10% off total order.' };
    } else if (cleanCode === 'CLEARANCE20') {
      setAppliedPromo({
        code: 'CLEARANCE20',
        discountPercent: 20,
        description: 'Super Outlet Flash Deal 20% Off'
      });
      return { success: true, message: 'Code CLEARANCE20 applied! 20% flash discount added.' };
    } else {
      return { success: false, message: 'Invalid promo code. Try "OUTLET15" or "WHITEGLOVE".' };
    }
  };

  // Stock & Catalog actions
  const updateStock = (
    productId: string,
    newStock: number,
    note = 'Manual stock update',
    type: InventoryLogEntry['type'] = 'Adjustment'
  ) => {
    setCatalog((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const change = newStock - item.stockCount;
          // Log change
          const logEntry: InventoryLogEntry = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            itemId: item.id,
            itemName: item.name,
            type,
            quantityChange: change,
            newStock,
            note,
            user: 'Staff Member'
          };
          setInventoryLogs((logs) => [logEntry, ...logs]);

          return { ...item, stockCount: Math.max(0, newStock) };
        }
        return item;
      })
    );
  };

  const addProduct = (productData: Omit<FurnitureItem, 'id'>) => {
    const newId = `furni-${Date.now().toString().slice(-4)}`;
    const newItem: FurnitureItem = { ...productData, id: newId };
    setCatalog((prev) => [newItem, ...prev]);

    // Log creation
    const logEntry: InventoryLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      itemId: newId,
      itemName: newItem.name,
      type: 'Restock',
      quantityChange: newItem.stockCount,
      newStock: newItem.stockCount,
      note: 'New outlet inventory item created',
      user: 'Store Manager'
    };
    setInventoryLogs((logs) => [logEntry, ...logs]);

    return newItem;
  };

  const editProduct = (product: FurnitureItem) => {
    setCatalog((prev) => prev.map((item) => (item.id === product.id ? product : item)));
  };

  const deleteProduct = (productId: string) => {
    const item = catalog.find((i) => i.id === productId);
    setCatalog((prev) => prev.filter((i) => i.id !== productId));
    if (item) {
      const logEntry: InventoryLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        itemId: productId,
        itemName: item.name,
        type: 'Adjustment',
        quantityChange: -item.stockCount,
        newStock: 0,
        note: 'Product item removed from outlet catalog',
        user: 'Store Manager'
      };
      setInventoryLogs((logs) => [logEntry, ...logs]);
    }
  };

  // Order Placement
  const placeOrder = (deliveryDetails: DeliveryDetails): Order => {
    const subtotal = cart.reduce((sum, c) => sum + c.product.outletPrice * c.quantity, 0);
    const msrpTotal = cart.reduce((sum, c) => sum + c.product.msrp * c.quantity, 0);
    const msrpSavings = Math.max(0, msrpTotal - subtotal);

    const discountAmount = appliedPromo ? Math.round((subtotal * appliedPromo.discountPercent) / 100) : 0;
    const discountedSubtotal = subtotal - discountAmount;

    let deliveryFee = 49;
    if (deliveryDetails.deliveryTier === 'whiteGlove') deliveryFee = 89;
    if (deliveryDetails.deliveryTier === 'express') deliveryFee = 119;

    const tax = Math.round(discountedSubtotal * 0.08 * 100) / 100;
    const total = Math.round((discountedSubtotal + deliveryFee + tax) * 100) / 100;

    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      items: cart.map((c) => ({ product: c.product, quantity: c.quantity, condition: c.product.condition })),
      subtotal,
      msrpSavings,
      discountAmount,
      deliveryFee,
      tax,
      total,
      deliveryDetails,
      status: 'Confirmed',
      driverInfo: {
        name: 'Carlos Rivera',
        phone: '(555) 821-4402',
        vehiclePlate: '7ABC109 - Express White-Glove Van',
        rating: 4.95,
        etaMinutes: 35,
        currentLocation: { lat: 34.0522, lng: -118.2437 }
      },
      trackingCode: `TRK-OUTLET-${Math.floor(10000 + Math.random() * 90000)}`
    };

    // Deduct stock
    cart.forEach((c) => {
      updateStock(
        c.product.id,
        Math.max(0, c.product.stockCount - c.quantity),
        `Order ${newOrder.id} customer checkout`,
        'Sale'
      );
    });

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();

    return newOrder;
  };

  const trackOrderById = (orderId: string) => {
    const found = orders.find((o) => o.id === orderId || o.trackingCode === orderId);
    if (found) {
      setActiveOrder(found);
      setActiveTab('order-tracking');
    }
  };

  const launchArWithItem = (item: FurnitureItem) => {
    setSelectedArItem(item);
    // Add default item to canvas if not already there
    setPlacedArItems((prev) => [
      ...prev,
      {
        id: `placed-${Date.now()}`,
        itemId: item.id,
        product: item,
        x: 50,
        y: 60,
        rotation: 0,
        scale: 1,
        elevation: 0,
        color: item.colorOptions[0] || 'Default',
        showDimensions: true
      }
    ]);
    setActiveTab('ar');
  };

  return (
    <ShopContext.Provider
      value={{
        catalog,
        cart,
        holdTimeRemaining,
        activeTab,
        selectedArItem,
        placedArItems,
        selectedProductDetail,
        orders,
        activeOrder,
        inventoryLogs,
        appliedPromo,
        setActiveTab,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        updateStock,
        addProduct,
        editProduct,
        deleteProduct,
        applyPromoCode,
        setSelectedArItem,
        setPlacedArItems,
        setSelectedProductDetail,
        trackOrderById,
        launchArWithItem
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
