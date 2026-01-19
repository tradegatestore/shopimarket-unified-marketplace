
export type ViewMode = 'CUSTOMER' | 'SELLER' | 'ADMIN';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  banner: string;
  description: string;
  rating: number;
  reviewsCount: number;
  category: string;
  commissionRate: number;
  status: 'Active' | 'Pending' | 'Suspended';
  shopifyDomain: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  isTrending?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderStatus {
  step: string;
  completed: boolean;
  date?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  timeline: OrderStatus[];
  shippingAddress: string;
  paymentMethod: 'COD' | 'Card';
}

export interface PlatformStats {
  totalGMV: number;
  platformRevenue: number;
  activeSellers: number;
  totalOrders: number;
  totalCustomers: number;
}
