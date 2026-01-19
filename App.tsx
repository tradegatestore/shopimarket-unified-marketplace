
import React, { useState } from 'react';
import { ViewMode, CartItem, Product, Order, Store } from './types';
import CustomerView from './views/CustomerView';
import SellerView from './views/SellerView';
import AdminView from './views/AdminView';
import { MOCK_STORES, MOCK_PRODUCTS, MOCK_ORDERS, MOCK_CUSTOMER } from './data';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('CUSTOMER');
  const [stores, setStores] = useState<Store[]>(MOCK_STORES);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Cart Handlers
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const placeOrder = (details: { address: string, paymentMethod: 'COD' | 'Card', customerName: string }) => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 5.00; // Flat mock shipping
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: MOCK_CUSTOMER.id,
      customerName: details.customerName,
      items: [...cart],
      total: subtotal + shipping,
      status: 'Processing',
      paymentMethod: details.paymentMethod,
      date: new Date().toISOString().split('T')[0],
      shippingAddress: details.address,
      timeline: [
        { step: 'Order Placed', completed: true, date: new Date().toLocaleString() },
        { step: 'Payment Confirmed', completed: true, date: new Date().toLocaleString() },
        { step: 'Processing', completed: false },
        { step: 'Shipped', completed: false },
        { step: 'Delivered', completed: false }
      ]
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
  };

  // Admin Handlers
  const updateStoreStatus = (id: string, status: Store['status']) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const updateCommission = (id: string, rate: number) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, commissionRate: rate } : s));
  };

  // Seller Handlers
  const updateInventory = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Dev Mode Switcher */}
      <div className="bg-indigo-900 text-white px-4 py-2 flex justify-between items-center text-[10px] font-black tracking-widest uppercase">
        <span>Dev Mode Controls</span>
        <div className="flex gap-4">
          <button onClick={() => setViewMode('CUSTOMER')} className={viewMode === 'CUSTOMER' ? 'text-white' : 'text-indigo-400'}>Customer App</button>
          <button onClick={() => setViewMode('SELLER')} className={viewMode === 'SELLER' ? 'text-white' : 'text-indigo-400'}>Seller Panel</button>
          <button onClick={() => setViewMode('ADMIN')} className={viewMode === 'ADMIN' ? 'text-white' : 'text-indigo-400'}>Admin Platform</button>
        </div>
      </div>

      <main className="flex-1 overflow-auto bg-slate-50">
        {viewMode === 'CUSTOMER' && (
          <CustomerView 
            stores={stores} 
            products={products} 
            cart={cart}
            orders={orders}
            customer={MOCK_CUSTOMER}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onPlaceOrder={placeOrder}
          />
        )}
        {viewMode === 'SELLER' && (
          <SellerView 
            store={stores[0]} 
            products={products.filter(p => p.storeId === stores[0].id)} 
            orders={orders.filter(o => o.items.some(i => i.storeId === stores[0].id))}
            onUpdateInventory={updateInventory}
          />
        )}
        {viewMode === 'ADMIN' && (
          <AdminView 
            stores={stores} 
            orders={orders} 
            products={products}
            onUpdateStatus={updateStoreStatus}
            onUpdateCommission={updateCommission}
          />
        )}
      </main>
    </div>
  );
};

export default App;
