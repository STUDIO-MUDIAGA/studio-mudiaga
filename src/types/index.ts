export interface Shortlet {
  id: string;
  title: string;
  location: string;
  city: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  guests: number;
  amenities: string[];
  host: {
    name: string;
    avatar: string;
    superhost: boolean;
  };
  available: boolean;
  tags: string[];
}

export interface FurnitureItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  material: string;
  colors: string[];
  inStock: boolean;
  featured: boolean;
  tags: string[];
}

export interface BookingDates {
  checkIn: Date | null;
  checkOut: Date | null;
}

export interface CartItem {
  product: FurnitureItem;
  quantity: number;
  selectedColor: string;
}
