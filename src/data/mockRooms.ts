import roomMockupImage from '../assets/images/ar_room_mockup_1784714139405.jpg';

export interface RoomPreset {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
}

export const ROOM_PRESETS: RoomPreset[] = [
  {
    id: 'room-generated-living',
    name: 'Sunlit Oak Living Room',
    category: 'Living Room',
    imageUrl: roomMockupImage,
    description: 'Bright airy space with light oak floors and clean off-white walls.'
  },
  {
    id: 'room-modern-loft',
    name: 'Industrial Brick Loft Studio',
    category: 'Living Room',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    description: 'Exposed brick accents with dark walnut flooring.'
  },
  {
    id: 'room-minimal-bedroom',
    name: 'Minimalist Neutral Bedroom',
    category: 'Bedroom',
    imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
    description: 'Spacious soft beige bedroom with neutral wall paint.'
  },
  {
    id: 'room-contemporary-patio',
    name: 'Architectural Sun Deck & Terrace',
    category: 'Outdoor',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    description: 'Outdoor stone patio with lush green surroundings.'
  }
];
