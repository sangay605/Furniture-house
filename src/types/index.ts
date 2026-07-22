export type ItemCondition = 'Brand New' | 'Open Box' | 'Floor Model' | 'Scratch & Dent';

export type RoomCategory = 'Living Room' | 'Bedroom' | 'Dining' | 'Office' | 'Outdoor' | 'Clearance';

export interface ProductDimensions {
  widthInches: number;
  depthInches: number;
  heightInches: number;
  weightLbs: number;
}

export interface FurnitureItem {
  id: string;
  name: string;
  sku: string;
  category: RoomCategory;
  msrp: number;
  outletPrice: number;
  discountPercent: number;
  condition: ItemCondition;
  conditionNote?: string;
  stockCount: number;
  aisleLocation: string; // e.g., "Aisle B-04 / Rack 2"
  dimensions: ProductDimensions;
  image: string;
  gallery: string[];
  description: string;
  colorOptions: string[];
  materials: string[];
  arModelType: 'sofa' | 'chair' | 'table' | 'bed' | 'lamp' | 'rug' | 'cabinet' | 'desk';
  rating: number;
  reviewsCount: number;
  isHotDeal?: boolean;
  featured?: boolean;
}

export interface PlacedARItem {
  id: string; // unique instance id on canvas
  itemId: string;
  product: FurnitureItem;
  x: number; // percentage or px position on canvas
  y: number;
  rotation: number; // 0 to 360 deg
  scale: number; // 0.5 to 2.0
  elevation: number; // 0 to 100 for wall or height
  color: string;
  showDimensions: boolean;
}

export type TimeSlot = '08:00 AM - 12:00 PM' | '12:00 PM - 04:00 PM' | '04:00 PM - 08:00 PM';

export type DeliveryTier = 'standard' | 'whiteGlove' | 'express';

export interface DeliveryDetails {
  zipCode: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  deliveryTier: DeliveryTier;
  date: string; // YYYY-MM-DD
  timeSlot: TimeSlot;
  floorLevel: number;
  hasElevator: boolean;
  doorwayWidthInches: number;
  deliveryNotes?: string;
}

export interface DriverInfo {
  name: string;
  phone: string;
  vehiclePlate: string;
  rating: number;
  etaMinutes: number;
  currentLocation: { lat: number; lng: number };
}

export interface Order {
  id: string;
  createdAt: string;
  items: { product: FurnitureItem; quantity: number; condition: ItemCondition }[];
  subtotal: number;
  msrpSavings: number;
  discountAmount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  deliveryDetails: DeliveryDetails;
  status: 'Confirmed' | 'Preparing' | 'Dispatched' | 'In Transit' | 'Delivered';
  driverInfo: DriverInfo;
  trackingCode: string;
}

export interface CartItem {
  product: FurnitureItem;
  quantity: number;
  reservedUntil: number; // timestamp in ms
}

export interface InventoryLogEntry {
  id: string;
  timestamp: string;
  itemId: string;
  itemName: string;
  type: 'Restock' | 'Sale' | 'Adjustment' | 'Damage' | 'Relocation';
  quantityChange: number;
  newStock: number;
  note: string;
  user: string;
}
