
import React, { useState } from 'react';
import { Store, Product, Order } from '../types';

interface SellerViewProps {
  store: Store;
  products: Product[];
  orders: Order[];
  onUpdateInventory: (id: string, updates: Partial<Product>) => void;
}

const SellerView: React.FC<SellerViewProps> = ({ store, products, orders, onUpdateInventory }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1500);
  };

  const handleUpdateStock = (p: Product, delta: number) => {
    onUpdateInventory(p.id, { stock: Math.max(0, p.stock + delta) });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white rounded-3xl p-3 shadow-sm border border-slate-100 flex items-center justify-center">
            <img src={store.logo} className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{store.name}</h1>
            <p className="text-slate-500 font-bold mt-1 flex items-center gap-2">
              <span className="text-emerald-500 flex items-center gap-1"><i className="fas fa-circle text-[6px]"></i> Shopify Active</span>
              <span className="text-slate-300">|</span>
              <span className="uppercase text-[10px] tracking-widest">{store.shopifyDomain}</span>
            </p>
          </div>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className={`px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 transition-all shadow-xl ${
            isSyncing ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
          }`}
        >
          <i className={`fas fa-sync-alt ${isSyncing ? 'animate-spin' : ''}`}></i>
          {isSyncing ? 'Syncing...' : 'Sync Shopify Inventory'}
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Marketplace GMV', val: `$${orders.reduce((a,b)=>a+b.total,0).toFixed(2)}`, icon: 'fa-chart-pie', color: 'bg-indigo-600' },
          { label: 'Total Orders', val: orders.length, icon: 'fa-shopping-bag', color: 'bg-blue-600' },
          { label: 'Active Listings', val: products.length, icon: 'fa-box-open', color: 'bg-emerald-600' },
          { label: 'Avg Feedback', val: store.rating, icon: 'fa-star', color: 'bg-amber-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`${s.color} text-white w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-slate-100`}>
              <i className={`fas ${s.icon}`}></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
              <p className="text-2xl font-black text-slate-900">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Inventory List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-black text-lg text-slate-800">Shopify Product Feed</h3>
              <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-widest">Real-time</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Listing</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Market Stock</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map(p => (
                    <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={p.image} className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-50" />
                          <div>
                            <span className="block text-sm font-black text-slate-800">{p.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{p.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-800">${p.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <button onClick={() => handleUpdateStock(p, -1)} className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"><i className="fas fa-minus text-[10px]"></i></button>
                           <span className={`text-sm font-black ${p.stock < 5 ? 'text-red-500' : 'text-slate-800'}`}>{p.stock}</span>
                           <button onClick={() => handleUpdateStock(p, 1)} className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-500 transition-colors"><i className="fas fa-plus text-[10px]"></i></button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button 
                           onClick={() => setEditingProduct(p)}
                           className="text-xs font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                           Edit
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Global Marketplace Orders */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden h-fit">
          <div className="px-8 py-6 border-b border-slate-50">
             <h3 className="font-black text-lg text-slate-800">Store Orders</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {orders.length === 0 ? (
              <div className="p-12 text-center text-slate-300">
                <i className="fas fa-inbox text-4xl mb-4"></i>
                <p className="font-bold text-sm">No marketplace orders yet.</p>
              </div>
            ) : orders.map(o => (
              <div key={o.id} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                   <h4 className="font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{o.id}</h4>
                   <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{o.status}</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-slate-400">{o.customerName}</p>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">{o.date}</p>
                  </div>
                  <span className="font-black text-slate-900">${o.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-slate-50/50 text-center">
             <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All Sales History</button>
          </div>
        </div>
      </div>

      {/* Quick Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-indigo-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800">Edit Marketplace Listing</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-300"><i className="fas fa-times"></i></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Product Name</label>
                <input 
                  type="text" 
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="w-full mt-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Price ($)</label>
                <input 
                  type="number" 
                  value={editingProduct.price}
                  onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                  className="w-full mt-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={() => setEditingProduct(null)} className="flex-1 py-4 font-black text-slate-500 uppercase tracking-widest text-[10px]">Cancel</button>
              <button 
                onClick={() => { onUpdateInventory(editingProduct.id, editingProduct); setEditingProduct(null); }}
                className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerView;
