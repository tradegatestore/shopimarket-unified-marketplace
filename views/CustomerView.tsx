
import React, { useState, useMemo } from 'react';
import { Store, Product, CartItem, Order, Customer } from '../types';

interface CustomerViewProps {
  stores: Store[];
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  customer: Customer;
  onAddToCart: (p: Product, qty: number) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onPlaceOrder: (details: { address: string, paymentMethod: 'COD' | 'Card', customerName: string }) => void;
}

type Tab = 'HOME' | 'STORES' | 'CART' | 'ORDERS' | 'ACCOUNT';
type SubPage = 'DEFAULT' | 'STORE_DETAIL' | 'PRODUCT_DETAIL' | 'CHECKOUT' | 'ORDER_CONFIRMATION' | 'ORDER_DETAIL';

const CustomerView: React.FC<CustomerViewProps> = ({ 
  stores, products, cart, orders, customer, onAddToCart, onRemoveFromCart, onUpdateQuantity, onPlaceOrder 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('HOME');
  const [subPage, setSubPage] = useState<SubPage>('DEFAULT');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkoutData, setCheckoutData] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    paymentMethod: 'Card' as 'COD' | 'Card'
  });

  const cartSubtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);
  const shippingCost = cart.length > 0 ? 5.00 : 0;
  const cartTotal = cartSubtotal + shippingCost;

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  // View Navigation Helpers
  const openProduct = (p: Product) => { setSelectedProduct(p); setSubPage('PRODUCT_DETAIL'); };
  const openStore = (s: Store) => { setSelectedStore(s); setSubPage('STORE_DETAIL'); };
  const openOrder = (o: Order) => { setSelectedOrder(o); setSubPage('ORDER_DETAIL'); };
  const goHome = () => { setSubPage('DEFAULT'); setActiveTab('HOME'); };

  const handlePlaceOrder = () => {
    onPlaceOrder({
      address: checkoutData.address,
      paymentMethod: checkoutData.paymentMethod,
      customerName: checkoutData.name
    });
    setSubPage('ORDER_CONFIRMATION');
  };

  // Shared Components
  // Fix: Explicitly define ProductCard as a React.FC to handle reserved props like 'key' correctly in TypeScript when rendered in lists
  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div onClick={() => openProduct(product)} className="bg-white rounded-3xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group border border-slate-100">
      <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-3 relative">
        <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToCart(product, 1); }}
          className="absolute bottom-3 right-3 bg-indigo-600 text-white p-3 rounded-2xl shadow-xl hover:bg-indigo-700 transition-colors"
        >
          <i className="fas fa-plus text-xs"></i>
        </button>
      </div>
      <h4 className="font-bold text-slate-800 line-clamp-1 mb-1">{product.name}</h4>
      <div className="flex justify-between items-center">
        <span className="font-black text-indigo-600 text-lg">${product.price}</span>
        <div className="flex items-center text-[10px] text-amber-500 font-bold">
          <i className="fas fa-star mr-1"></i> {product.rating}
        </div>
      </div>
    </div>
  );

  const SectionHeader = ({ title, onSeeAll }: { title: string, onSeeAll?: () => void }) => (
    <div className="flex justify-between items-end mb-4 px-1">
      <h3 className="font-black text-xl text-slate-800 tracking-tight">{title}</h3>
      {onSeeAll && <button onClick={onSeeAll} className="text-indigo-600 text-sm font-bold uppercase tracking-widest text-[10px]">See All</button>}
    </div>
  );

  // Pages
  const renderHome = () => (
    <div className="p-4 pb-24 space-y-8 max-w-2xl mx-auto">
      <div className="relative">
        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input 
          type="text" 
          placeholder="Search items, categories..."
          className="w-full pl-12 pr-4 py-4 bg-white border-0 rounded-3xl shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {!searchQuery && (
        <>
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
            <div className="relative z-10 max-w-[60%]">
              <span className="bg-indigo-400 text-[10px] font-black tracking-[0.2em] uppercase py-1 px-3 rounded-full mb-4 inline-block">Flash Sale</span>
              <h2 className="text-3xl font-black mb-4 leading-tight">Up to 40% OFF Summer Wear</h2>
              <button onClick={() => setActiveTab('STORES')} className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-sm">Shop Collection</button>
            </div>
            <i className="fas fa-shopping-bag absolute -bottom-10 -right-10 text-[12rem] text-indigo-500 opacity-20"></i>
          </div>

          <section>
            <SectionHeader title="Featured Stores" onSeeAll={() => setActiveTab('STORES')} />
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {stores.map(store => (
                <div key={store.id} onClick={() => openStore(store)} className="flex-shrink-0 w-28 text-center cursor-pointer group">
                  <div className="w-20 h-20 rounded-[2rem] bg-white shadow-sm border border-slate-100 flex items-center justify-center p-2 mx-auto mb-2 group-hover:border-indigo-500 transition-all">
                    <img src={store.logo} className="w-full h-full object-contain rounded-xl" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 truncate block">{store.name}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <section>
        <SectionHeader title={searchQuery ? "Search Results" : "Trending Now"} />
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );

  const renderStoreDetail = () => selectedStore && (
    <div className="pb-24">
      <div className="relative h-60">
        <img src={selectedStore.banner} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <button onClick={() => setSubPage('DEFAULT')} className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white w-10 h-10 rounded-2xl flex items-center justify-center"><i className="fas fa-chevron-left"></i></button>
      </div>
      <div className="px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 text-center mb-8">
          <img src={selectedStore.logo} className="w-24 h-24 rounded-3xl mx-auto -mt-16 mb-4 border-4 border-white shadow-lg bg-white p-2" />
          <h2 className="text-2xl font-black text-slate-800">{selectedStore.name}</h2>
          <p className="text-slate-500 text-sm mt-2 mb-4 leading-relaxed">{selectedStore.description}</p>
          <div className="flex justify-center gap-6 border-t border-slate-50 pt-4">
            <div className="text-center">
              <span className="block font-black text-slate-800">{selectedStore.rating} <i className="fas fa-star text-amber-500 text-xs"></i></span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Rating</span>
            </div>
            <div className="text-center border-x border-slate-100 px-6">
              <span className="block font-black text-slate-800">{selectedStore.reviewsCount}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Reviews</span>
            </div>
            <div className="text-center">
              <span className="block font-black text-slate-800">{selectedStore.category}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Type</span>
            </div>
          </div>
        </div>
        <SectionHeader title="Store Inventory" />
        <div className="grid grid-cols-2 gap-4">
          {products.filter(p => p.storeId === selectedStore.id).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );

  const renderProductDetail = () => selectedProduct && (
    <div className="pb-24 bg-white min-h-full">
      <div className="relative aspect-square">
        <img src={selectedProduct.image} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button onClick={() => setSubPage('DEFAULT')} className="bg-black/20 backdrop-blur-md text-white w-10 h-10 rounded-2xl flex items-center justify-center"><i className="fas fa-chevron-left"></i></button>
          <button className="bg-black/20 backdrop-blur-md text-white w-10 h-10 rounded-2xl flex items-center justify-center"><i className="fas fa-share-alt"></i></button>
        </div>
      </div>
      <div className="p-8 rounded-t-[3rem] -mt-12 bg-white relative">
        <div className="flex justify-between items-start mb-6">
          <div className="max-w-[70%]">
            <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">{selectedProduct.name}</h2>
            <div onClick={() => openStore(stores.find(s => s.id === selectedProduct.storeId)!)} className="flex items-center gap-2 cursor-pointer group">
              <img src={stores.find(s => s.id === selectedProduct.storeId)?.logo} className="w-6 h-6 rounded-md" />
              <span className="text-sm font-bold text-indigo-600 group-hover:underline">{stores.find(s => s.id === selectedProduct.storeId)?.name}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-indigo-600">${selectedProduct.price}</span>
            <span className="block text-[10px] text-slate-400 font-bold uppercase mt-1">Free Shipping</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3">Description</h4>
            <p className="text-slate-600 leading-relaxed">{selectedProduct.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${selectedProduct.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              <span className="text-xs font-bold text-slate-500">{selectedProduct.stock > 0 ? `In Stock (${selectedProduct.stock})` : 'Out of Stock'}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 flex items-center gap-2">
              <i className="fas fa-star text-amber-500 text-xs"></i>
              <span className="text-xs font-bold text-slate-500">{selectedProduct.rating} (120 Ratings)</span>
            </div>
          </div>
        </div>

        <div className="fixed bottom-24 left-6 right-6 flex gap-4">
          <button 
            onClick={() => { onAddToCart(selectedProduct, 1); setActiveTab('CART'); setSubPage('DEFAULT'); }}
            className="flex-1 bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <i className="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  const renderCart = () => (
    <div className="p-4 pb-24 max-w-2xl mx-auto">
      <SectionHeader title="Your Shopping Cart" />
      {cart.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 text-3xl">
             <i className="fas fa-shopping-basket"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-800">Your basket is empty</h3>
          <p className="text-slate-400 mt-2 mb-8">Ready to fill it with sustainable goodies?</p>
          <button onClick={goHome} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100">Start Browsing</button>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white rounded-3xl p-4 flex gap-4 border border-slate-100 shadow-sm">
              <img src={item.image} className="w-24 h-24 rounded-2xl object-cover" />
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{stores.find(s => s.id === item.storeId)?.name}</p>
                  </div>
                  <button onClick={() => onRemoveFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors"><i className="fas fa-trash-alt text-xs"></i></button>
                </div>
                <div className="flex justify-between items-end">
                  <span className="font-black text-indigo-600 text-lg">${item.price}</span>
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-3">
                    <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm"><i className="fas fa-minus text-xs"></i></button>
                    <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm"><i className="fas fa-plus text-xs"></i></button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white mt-8 space-y-4">
            <div className="flex justify-between items-center opacity-60 font-bold text-sm">
              <span>Subtotal</span>
              <span>${cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center opacity-60 font-bold text-sm">
              <span>Shipping Fee</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-2xl font-black pt-4 border-t border-white/10">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => setSubPage('CHECKOUT')}
              className="w-full bg-white text-indigo-900 py-5 rounded-3xl font-black text-lg mt-4 active:scale-95 transition-all shadow-xl"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderCheckout = () => (
    <div className="p-4 pb-24 max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex items-center gap-4">
        <button onClick={() => setSubPage('DEFAULT')} className="text-slate-400"><i className="fas fa-arrow-left"></i></button>
        <h2 className="text-2xl font-black text-slate-800">Checkout</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <i className="fas fa-truck text-indigo-600"></i> Shipping Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Full Name</label>
              <input 
                type="text" 
                value={checkoutData.name}
                onChange={e => setCheckoutData({...checkoutData, name: e.target.value})}
                className="w-full mt-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Shipping Address</label>
              <textarea 
                rows={3}
                value={checkoutData.address}
                onChange={e => setCheckoutData({...checkoutData, address: e.target.value})}
                className="w-full mt-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Email</label>
                <input type="email" value={checkoutData.email} className="w-full mt-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold" readOnly />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Phone</label>
                <input type="text" value={checkoutData.phone} className="w-full mt-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold" readOnly />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <i className="fas fa-credit-card text-indigo-600"></i> Payment Method
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setCheckoutData({...checkoutData, paymentMethod: 'Card'})}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${checkoutData.paymentMethod === 'Card' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-50 text-slate-400'}`}
            >
              <i className="fas fa-credit-card text-xl"></i>
              <span className="text-[10px] font-black uppercase">Online Card</span>
            </button>
            <button 
              onClick={() => setCheckoutData({...checkoutData, paymentMethod: 'COD'})}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${checkoutData.paymentMethod === 'COD' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-50 text-slate-400'}`}
            >
              <i className="fas fa-hand-holding-usd text-xl"></i>
              <span className="text-[10px] font-black uppercase">Cash on Delivery</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
           <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <i className="fas fa-list text-indigo-600"></i> Order Summary
          </h3>
          <div className="space-y-3 mb-6">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-700">{item.quantity}x {item.name}</span>
                <span className="text-sm font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-50 pt-4 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
              <span>Subtotal</span>
              <span>${cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-black text-slate-900 pt-2">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handlePlaceOrder}
          className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg shadow-2xl shadow-indigo-100 active:scale-95 transition-all"
        >
          Confirm & Place Order
        </button>
      </div>
    </div>
  );

  const renderOrderConfirmation = () => (
    <div className="p-8 pb-24 max-w-2xl mx-auto text-center flex flex-col items-center justify-center min-h-[70vh] animate-fadeIn">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center text-4xl mb-8 shadow-xl shadow-emerald-50">
        <i className="fas fa-check-circle"></i>
      </div>
      <h2 className="text-4xl font-black text-slate-900 mb-4">Order Confirmed!</h2>
      <p className="text-slate-500 mb-12 text-lg leading-relaxed max-w-sm">Your order <span className="text-indigo-600 font-black">#ORD-{Math.floor(1000 + Math.random() * 9000)}</span> has been placed successfully. Estimated delivery in 3-5 days.</p>
      
      <div className="w-full space-y-4">
        <button 
          onClick={() => { setSubPage('DEFAULT'); setActiveTab('ORDERS'); }}
          className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-indigo-100"
        >
          View My Orders
        </button>
        <button 
          onClick={goHome}
          className="w-full bg-slate-100 text-slate-600 py-5 rounded-3xl font-black text-lg"
        >
          Back to Shopping
        </button>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="p-4 pb-24 max-w-2xl mx-auto space-y-6">
      <SectionHeader title="Your Orders" />
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 font-bold">No orders found.</p>
        </div>
      ) : orders.map(order => (
        <div key={order.id} onClick={() => openOrder(order)} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Order Number</span>
              <h4 className="font-black text-slate-800">{order.id}</h4>
            </div>
            <span className={`text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest ${
              order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
            }`}>
              {order.status}
            </span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex -space-x-3 overflow-hidden">
              {order.items.slice(0, 3).map(item => (
                <img key={item.id} src={item.image} className="inline-block h-12 w-12 rounded-xl ring-4 ring-white object-cover" />
              ))}
              {order.items.length > 3 && (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xs font-black text-slate-400 ring-4 ring-white">
                  +{order.items.length - 3}
                </div>
              )}
            </div>
            <div className="flex-1">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Amount</span>
               <span className="text-lg font-black text-slate-800">${order.total.toFixed(2)}</span>
            </div>
            <div className="text-right">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Date</span>
               <span className="text-sm font-bold text-slate-600">{order.date}</span>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-50">
             <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Track Order <i className="fas fa-chevron-right ml-1"></i></span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderOrderDetail = () => selectedOrder && (
    <div className="p-4 pb-24 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setSubPage('DEFAULT')} className="text-slate-400"><i className="fas fa-arrow-left"></i></button>
        <h2 className="text-2xl font-black text-slate-800">Order #{selectedOrder.id}</h2>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-8">Delivery Status</h3>
        <div className="relative space-y-10 pl-10">
          <div className="absolute left-3.5 top-2 bottom-2 w-1 bg-slate-50" />
          {selectedOrder.timeline.map((step, idx) => (
            <div key={idx} className="relative">
              <div className={`absolute -left-10 top-0 w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center z-10 ${
                step.completed ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'
              }`}>
                <i className={`fas ${step.completed ? 'fa-check' : 'fa-circle'} text-[8px]`}></i>
              </div>
              <div>
                <h4 className={`text-sm font-black ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>{step.step}</h4>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tight">{step.date || 'Pending'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-8">
        <div>
          <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Shipping To</h3>
          <p className="font-bold text-slate-700 leading-relaxed">{selectedOrder.customerName}<br/>{selectedOrder.shippingAddress}</p>
        </div>
        <div>
          <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Payment Method</h3>
          <p className="font-bold text-slate-700">{selectedOrder.paymentMethod === 'Card' ? 'Mastercard •••• 5521' : 'Cash on Delivery'}</p>
        </div>
        <div>
          <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Order Items</h3>
          <div className="space-y-4">
            {selectedOrder.items.map(item => (
              <div key={item.id} className="flex gap-4 items-center">
                <img src={item.image} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <h5 className="text-sm font-black text-slate-800 line-clamp-1">{item.name}</h5>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.quantity} units</p>
                </div>
                <span className="font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 border-t border-slate-50 flex justify-between items-center">
           <span className="text-lg font-black text-slate-900">Paid Total</span>
           <span className="text-2xl font-black text-indigo-600">${selectedOrder.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative h-full overflow-y-auto bg-slate-50 flex flex-col">
      {/* Top Main Dynamic Router */}
      <div className="flex-1 overflow-auto">
        {subPage === 'PRODUCT_DETAIL' ? renderProductDetail() :
         subPage === 'STORE_DETAIL' ? renderStoreDetail() :
         subPage === 'CHECKOUT' ? renderCheckout() :
         subPage === 'ORDER_CONFIRMATION' ? renderOrderConfirmation() :
         subPage === 'ORDER_DETAIL' ? renderOrderDetail() : (
          <>
            {activeTab === 'HOME' && renderHome()}
            {activeTab === 'STORES' && (
              <div className="p-4 pb-24 space-y-6 max-w-2xl mx-auto">
                <SectionHeader title="Shop by Category" />
                <div className="grid gap-4">
                  {stores.map(store => (
                    <div key={store.id} onClick={() => openStore(store)} className="bg-white rounded-3xl p-5 flex items-center gap-6 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                      <img src={store.logo} className="w-20 h-20 rounded-2xl object-contain border border-slate-50" />
                      <div className="flex-1">
                        <h3 className="text-lg font-black text-slate-800">{store.name}</h3>
                        <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-1">{store.description}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-[10px] font-black text-amber-500 bg-amber-50 px-2 py-1 rounded-lg uppercase tracking-widest"><i className="fas fa-star mr-1"></i>{store.rating}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{store.category}</span>
                        </div>
                      </div>
                      <i className="fas fa-chevron-right text-slate-200 text-xs"></i>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'CART' && renderCart()}
            {activeTab === 'ORDERS' && renderOrders()}
            {activeTab === 'ACCOUNT' && (
              <div className="p-8 pb-24 max-w-2xl mx-auto text-center">
                <div className="mb-8">
                  <div className="w-32 h-32 rounded-[3rem] overflow-hidden border-8 border-white shadow-xl mx-auto mb-4 bg-indigo-100">
                    <img src={customer.avatar} className="w-full h-full object-cover" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">{customer.name}</h2>
                  <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-widest">{customer.email}</p>
                </div>

                <div className="space-y-3 max-w-xs mx-auto">
                   <button className="w-full bg-white border border-slate-100 py-4 rounded-2xl font-black text-slate-700 text-sm shadow-sm flex items-center px-6 gap-4">
                      <i className="fas fa-user-edit text-indigo-500"></i> Edit Profile
                   </button>
                   <button className="w-full bg-white border border-slate-100 py-4 rounded-2xl font-black text-slate-700 text-sm shadow-sm flex items-center px-6 gap-4">
                      <i className="fas fa-map-marker-alt text-indigo-500"></i> Shipping Address
                   </button>
                   <button className="w-full bg-white border border-slate-100 py-4 rounded-2xl font-black text-slate-700 text-sm shadow-sm flex items-center px-6 gap-4">
                      <i className="fas fa-bell text-indigo-500"></i> Notifications
                   </button>
                   <button className="w-full bg-white border border-slate-100 py-4 rounded-2xl font-black text-slate-700 text-sm shadow-sm flex items-center px-6 gap-4">
                      <i className="fas fa-question-circle text-indigo-500"></i> Help Center
                   </button>
                   <button className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-black text-sm mt-8 border border-red-100">
                      Sign Out
                   </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Persistent Bottom Nav (Hidden on Detail Pages) */}
      {subPage === 'DEFAULT' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-8 py-4 flex justify-between items-center z-[100] safe-area-bottom">
          <NavItem active={activeTab === 'HOME'} icon="fa-home" label="Home" onClick={() => setActiveTab('HOME')} />
          <NavItem active={activeTab === 'STORES'} icon="fa-store" label="Stores" onClick={() => setActiveTab('STORES')} />
          <NavItem active={activeTab === 'CART'} icon="fa-shopping-basket" label="Cart" onClick={() => setActiveTab('CART')} badge={cart.length} />
          <NavItem active={activeTab === 'ORDERS'} icon="fa-box" label="Orders" onClick={() => setActiveTab('ORDERS')} />
          <NavItem active={activeTab === 'ACCOUNT'} icon="fa-user-circle" label="Profile" onClick={() => setActiveTab('ACCOUNT')} />
        </nav>
      )}
    </div>
  );
};

const NavItem: React.FC<{ active: boolean, icon: string, label: string, onClick: () => void, badge?: number }> = ({ active, icon, label, onClick, badge }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all ${active ? 'text-indigo-600' : 'text-slate-300'}`}>
    <div className="relative">
      <i className={`fas ${icon} text-xl`}></i>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
          {badge}
        </span>
      )}
    </div>
    <span className={`text-[10px] font-black uppercase tracking-tighter ${active ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
  </button>
);

export default CustomerView;
