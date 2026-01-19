
import React, { useState } from 'react';
import { Store, Order, Product, PlatformStats } from '../types';

interface AdminViewProps {
  stores: Store[];
  orders: Order[];
  products: Product[];
  onUpdateStatus: (id: string, status: Store['status']) => void;
  onUpdateCommission: (id: string, rate: number) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ stores, orders, products, onUpdateStatus, onUpdateCommission }) => {
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'SELLERS' | 'ORDERS'>('ANALYTICS');

  const stats: PlatformStats = {
    totalGMV: orders.reduce((acc, o) => acc + o.total, 0),
    platformRevenue: stores.reduce((acc, s) => {
      const storeOrders = orders.filter(o => o.items.some(i => i.storeId === s.id));
      const storeRevenue = storeOrders.reduce((a, b) => a + b.total, 0);
      return acc + (storeRevenue * (s.commissionRate / 100));
    }, 0),
    activeSellers: stores.filter(s => s.status === 'Active').length,
    totalOrders: orders.length,
    totalCustomers: 1240, // Mocked total
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-fadeIn">
      {/* Platform Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Marketplace Master</h1>
          <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-[0.2em]">Global Management Dashboard</p>
        </div>
        <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-100 flex gap-1">
           {['ANALYTICS', 'SELLERS', 'ORDERS'].map((t) => (
             <button 
               key={t}
               onClick={() => setActiveTab(t as any)}
               className={`px-6 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${
                 activeTab === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-700'
               }`}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'ANALYTICS' && (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { label: 'Platform GMV', val: `$${stats.totalGMV.toLocaleString()}`, icon: 'fa-globe-americas', bg: 'bg-indigo-600' },
              { label: 'Take Revenue', val: `$${stats.platformRevenue.toLocaleString()}`, icon: 'fa-coins', bg: 'bg-emerald-600' },
              { label: 'Active Sellers', val: stats.activeSellers, icon: 'fa-store', bg: 'bg-blue-600' },
              { label: 'Total Sales', val: stats.totalOrders, icon: 'fa-shopping-cart', bg: 'bg-amber-600' },
              { label: 'Growth YoY', val: '+24.5%', icon: 'fa-arrow-up', bg: 'bg-rose-600' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40">
                <div className={`${s.bg} text-white w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow-lg`}>
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
            {/* Global Orders Feed */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="font-black text-lg text-slate-800">Recent Marketplace Transactions</h3>
                  <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Full Audit Logs</button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <tr>
                       <th className="px-8 py-4">Order ID</th>
                       <th className="px-6 py-4">Customer</th>
                       <th className="px-6 py-4">Merchant</th>
                       <th className="px-6 py-4">Gross</th>
                       <th className="px-6 py-4">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {orders.map(o => (
                       <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-8 py-6 font-black text-slate-800">{o.id}</td>
                         <td className="px-6 py-4">
                            <span className="block text-sm font-bold text-slate-700">{o.customerName}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{o.date}</span>
                         </td>
                         <td className="px-6 py-4">
                            <span className="text-xs font-black text-indigo-600 uppercase tracking-tight">
                              {stores.find(s => s.id === o.items[0]?.storeId)?.name}
                            </span>
                         </td>
                         <td className="px-6 py-4 font-black text-slate-800">${o.total.toFixed(2)}</td>
                         <td className="px-6 py-4">
                            <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${
                              o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                            }`}>
                              {o.status}
                            </span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* Platform Health Section */}
            <div className="space-y-6">
               <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 overflow-hidden relative">
                  <h4 className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-6">Default Commission</h4>
                  <div className="flex justify-between items-end mb-8 relative z-10">
                     <div>
                        <span className="text-5xl font-black">10.0</span>
                        <span className="text-xl font-black opacity-50">%</span>
                     </div>
                     <button className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Adjust Global</button>
                  </div>
                  <p className="text-xs font-bold opacity-40 leading-relaxed relative z-10">
                     The default platform take for new Shopify connections. Can be overridden per individual seller agreement.
                  </p>
                  <i className="fas fa-hand-holding-usd absolute -bottom-10 -right-10 text-[10rem] text-white opacity-5"></i>
               </div>

               <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Pending Approvals</h4>
                  <div className="space-y-6">
                    {stores.filter(s => s.status === 'Pending').length > 0 ? stores.filter(s => s.status === 'Pending').map(s => (
                      <div key={s.id} className="flex items-center gap-4">
                        <img src={s.logo} className="w-12 h-12 rounded-xl border border-slate-100" />
                        <div className="flex-1">
                           <h5 className="text-sm font-black text-slate-800">{s.name}</h5>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{s.shopifyDomain}</p>
                        </div>
                        <button onClick={() => onUpdateStatus(s.id, 'Active')} className="text-emerald-500 hover:scale-110 transition-transform"><i className="fas fa-check-circle text-xl"></i></button>
                      </div>
                    )) : (
                      <p className="text-xs font-bold text-slate-300 italic text-center py-4">All stores approved.</p>
                    )}
                  </div>
               </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'SELLERS' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
             <h3 className="font-black text-lg text-slate-800 uppercase tracking-tight">Seller Lifecycle Management</h3>
             <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-50">Onboard New Merchant</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">Store Identity</th>
                  <th className="px-6 py-4">Commission</th>
                  <th className="px-6 py-4">Platform Status</th>
                  <th className="px-6 py-4 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stores.map(s => (
                  <tr key={s.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-5">
                         <img src={s.logo} className="w-14 h-14 rounded-2xl object-contain border border-slate-100 bg-white p-1" />
                         <div>
                            <span className="block font-black text-slate-800">{s.name}</span>
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{s.shopifyDomain}</span>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <input 
                            type="number" 
                            className="w-16 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-sm font-black text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-500"
                            value={s.commissionRate}
                            onChange={(e) => onUpdateCommission(s.id, parseInt(e.target.value))}
                          />
                          <span className="text-xs font-black text-slate-300">%</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${
                         s.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                         s.status === 'Suspended' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                       }`}>
                         {s.status}
                       </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                       <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         {s.status !== 'Active' && <button onClick={() => onUpdateStatus(s.id, 'Active')} className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"><i className="fas fa-check"></i></button>}
                         {s.status !== 'Suspended' && <button onClick={() => onUpdateStatus(s.id, 'Suspended')} className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"><i className="fas fa-ban"></i></button>}
                         <button className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"><i className="fas fa-cog"></i></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ORDERS' && (
        <div className="p-12 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm text-slate-400">
           <i className="fas fa-scroll text-5xl mb-6 opacity-20"></i>
           <h3 className="text-xl font-black text-slate-800">Advanced Log Viewer</h3>
           <p className="max-w-md mx-auto mt-2 font-bold opacity-60">Global transaction history is synchronized across all 24 cluster nodes in real-time. Use filters above to pinpoint specific store activity.</p>
        </div>
      )}
    </div>
  );
};

export default AdminView;
