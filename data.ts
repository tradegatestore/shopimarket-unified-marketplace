
import { Store, Product, Order, Customer } from './types';

export const MOCK_CUSTOMER: Customer = {
  id: 'c1',
  name: 'Alex Thompson',
  email: 'alex.thompson@email.com',
  phone: '+1 (555) 123-4567',
  address: '456 Oak Lane, Seattle, WA 98101',
  avatar: 'https://i.pravatar.cc/150?u=alex'
};

export const MOCK_STORES: Store[] = [
  {
    id: 's1',
    name: 'EcoWear Collective',
    logo: 'https://picsum.photos/seed/eco/200',
    banner: 'https://picsum.photos/seed/ecob/800/400',
    description: 'Sustainable fashion for the conscious consumer.',
    rating: 4.8,
    reviewsCount: 1240,
    category: 'Fashion',
    commissionRate: 10,
    status: 'Active',
    shopifyDomain: 'ecowear-store.myshopify.com'
  },
  {
    id: 's2',
    name: 'TechHaven',
    logo: 'https://picsum.photos/seed/tech/200',
    banner: 'https://picsum.photos/seed/techb/800/400',
    description: 'The latest gadgets and gear for tech enthusiasts.',
    rating: 4.5,
    reviewsCount: 850,
    category: 'Electronics',
    commissionRate: 8,
    status: 'Active',
    shopifyDomain: 'tech-haven-official.myshopify.com'
  },
  {
    id: 's3',
    name: 'Urban Kitchen',
    logo: 'https://picsum.photos/seed/kitchen/200',
    banner: 'https://picsum.photos/seed/kitchenb/800/400',
    description: 'Elevate your cooking with our premium kitchenware.',
    rating: 4.9,
    reviewsCount: 2100,
    category: 'Home & Living',
    commissionRate: 12,
    status: 'Active',
    shopifyDomain: 'urban-kitchen-co.myshopify.com'
  },
  {
    id: 's4',
    name: 'Glow Skincare',
    logo: 'https://picsum.photos/seed/glow/200',
    banner: 'https://picsum.photos/seed/glowb/800/400',
    description: 'Natural skincare products for a radiant you.',
    rating: 4.7,
    reviewsCount: 540,
    category: 'Beauty',
    commissionRate: 15,
    status: 'Active',
    shopifyDomain: 'glow-skin.myshopify.com'
  },
  {
    id: 's5',
    name: 'Pet Paradise',
    logo: 'https://picsum.photos/seed/pet/200',
    banner: 'https://picsum.photos/seed/petb/800/400',
    description: 'Everything your furry friends need and more.',
    rating: 4.6,
    reviewsCount: 920,
    category: 'Pets',
    commissionRate: 10,
    status: 'Pending',
    shopifyDomain: 'pet-paradise-global.myshopify.com'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    storeId: 's1',
    name: 'Organic Cotton T-Shirt',
    description: 'Soft, breathable organic cotton t-shirt in various colors. Ethically sourced and pre-shrunk for the perfect fit.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400',
    category: 'Fashion',
    stock: 50,
    rating: 4.5,
    isTrending: true
  },
  {
    id: 'p2',
    storeId: 's1',
    name: 'Recycled Denim Jeans',
    description: 'Classic fit jeans made from 100% recycled denim. Low environmental impact with maximum durability.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400',
    category: 'Fashion',
    stock: 25,
    rating: 4.2
  },
  {
    id: 'p3',
    storeId: 's2',
    name: 'Noise Cancelling Headphones',
    description: 'Premium wireless headphones with industry-leading ANC. Over-ear design with 40 hours of battery life.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
    category: 'Electronics',
    stock: 15,
    rating: 4.9,
    isTrending: true
  },
  {
    id: 'p4',
    storeId: 's2',
    name: 'Smart Watch Series X',
    description: 'The ultimate fitness and connectivity companion. GPS, heart rate monitor, and water resistant up to 50m.',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
    category: 'Electronics',
    stock: 10,
    rating: 4.8,
    isTrending: true
  },
  {
    id: 'p5',
    storeId: 's3',
    name: 'Cast Iron Dutch Oven',
    description: 'Durable cast iron dutch oven for all your cooking needs. Even heat distribution with an enamel finish.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1584990344321-27461ad500b7?auto=format&fit=crop&q=80&w=400',
    category: 'Home & Living',
    stock: 20,
    rating: 4.9
  },
  {
    id: 'p6',
    storeId: 's3',
    name: 'Professional Knife Set',
    description: '12-piece forged stainless steel knife set with block. Ergonomic handles for precision and safety.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&q=80&w=400',
    category: 'Home & Living',
    stock: 8,
    rating: 4.7
  },
  {
    id: 'p7',
    storeId: 's4',
    name: 'Hyaluronic Acid Serum',
    description: 'Deeply hydrating serum for all skin types. Restores moisture barrier and reduces fine lines.',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400',
    category: 'Beauty',
    stock: 100,
    rating: 4.8,
    isTrending: true
  },
  {
    id: 'p8',
    storeId: 's4',
    name: 'Mineral Sunscreen SPF 50',
    description: 'Non-greasy, reef-safe mineral sunscreen. Lightweight formula with broad spectrum protection.',
    price: 24.00,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400',
    category: 'Beauty',
    stock: 150,
    rating: 4.6
  },
  {
    id: 'p9',
    storeId: 's5',
    name: 'Orthopedic Dog Bed',
    description: 'Memory foam bed for maximum comfort and support. Removable cover for easy cleaning.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?auto=format&fit=crop&q=80&w=400',
    category: 'Pets',
    stock: 12,
    rating: 4.9,
    isTrending: true
  },
  {
    id: 'p10',
    storeId: 's5',
    name: 'Interactive Cat Toy',
    description: 'Keep your cat entertained for hours with this toy. Encourages exercise and mental stimulation.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
    category: 'Pets',
    stock: 45,
    rating: 4.4
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-5521',
    customerId: 'c1',
    customerName: 'Alex Thompson',
    items: [
      { ...MOCK_PRODUCTS[0], quantity: 2 },
      { ...MOCK_PRODUCTS[2], quantity: 1 }
    ],
    total: 359.97,
    status: 'Shipped',
    paymentMethod: 'Card',
    date: '2024-05-12',
    shippingAddress: '456 Oak Lane, Seattle, WA 98101',
    timeline: [
      { step: 'Order Placed', completed: true, date: 'May 12, 10:00 AM' },
      { step: 'Payment Confirmed', completed: true, date: 'May 12, 10:05 AM' },
      { step: 'Processing', completed: true, date: 'May 13, 09:00 AM' },
      { step: 'Shipped', completed: true, date: 'May 14, 02:00 PM' },
      { step: 'Delivered', completed: false }
    ]
  },
  {
    id: 'ORD-8829',
    customerId: 'c1',
    customerName: 'Alex Thompson',
    items: [
      { ...MOCK_PRODUCTS[6], quantity: 1 }
    ],
    total: 45.00,
    status: 'Delivered',
    paymentMethod: 'COD',
    date: '2024-05-10',
    shippingAddress: '456 Oak Lane, Seattle, WA 98101',
    timeline: [
      { step: 'Order Placed', completed: true, date: 'May 10, 08:30 AM' },
      { step: 'Payment Confirmed', completed: true, date: 'May 10, 08:35 AM' },
      { step: 'Processing', completed: true, date: 'May 10, 11:00 AM' },
      { step: 'Shipped', completed: true, date: 'May 11, 09:00 AM' },
      { step: 'Delivered', completed: true, date: 'May 11, 04:30 PM' }
    ]
  }
];
