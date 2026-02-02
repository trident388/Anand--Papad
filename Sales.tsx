
import React, { useState, useEffect } from 'react';
import { User, SaleEntry } from '../types.ts';
import { storage, STORAGE_KEYS } from '../storage.ts';
import { ShoppingBag, Trash2, IndianRupee } from 'lucide-react';

const Sales: React.FC<{ user: User }> = ({ user }) => {
  const [sales, setSales] = useState<SaleEntry[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [packets, setPackets] = useState('');
  const [price, setPrice] = useState('');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Credit'>('Cash');

  useEffect(() => {
    setSales(storage.getSales());
    const cats = storage.getCategories();
    setCategories(cats);
    if (cats.length > 0) setCategory(cats[0]);
  }, []);

  const total = (parseInt(packets) || 0) * (parseFloat(price) || 0);

  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packets || !price) return;

    const newSale: SaleEntry = {
      id: Date.now().toString(),
      category,
      packets: parseInt(packets),
      pricePerPacket: parseFloat(price),
      totalAmount: total,
      paymentMode,
      date: new Date().toISOString(),
      createdBy: user.name,
    };

    const updated = [newSale, ...sales];
    setSales(updated);
    storage.saveData(STORAGE_KEYS.SALES, updated);
    setPackets('');
    setPrice('');
  };

  const deleteSale = (id: string) => {
    const updated = sales.filter(s => s.id !== id);
    setSales(updated);
    storage.saveData(STORAGE_KEYS.SALES, updated);
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Billing Counter</h2>
        <p className="text-slate-500 font-medium">Direct sales logging with auto-profit tracking.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <div className="bg-white rounded-[40px] p-10 shadow-sm border-2 border-slate-50 h-fit sticky top-10">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
              <ShoppingBag className="text-purple-600" />
              New Sale
            </h3>
            <form onSubmit={handleAddSale} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Select Product</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 focus:border-purple-500 outline-none transition-all capitalize font-bold text-slate-700"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Packets</label>
                  <input type="number" value={packets} onChange={(e) => setPackets(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3 font-black text-lg outline-none focus:border-purple-500" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Price / Unit</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3 font-black text-lg outline-none focus:border-purple-500" required />
                </div>
              </div>
              <div className="flex gap-2">
                {['Cash', 'UPI', 'Credit'].map((mode) => (
                  <button key={mode} type="button" onClick={() => setPaymentMode(mode as any)} className={`flex-1 py-3 rounded-2xl text-[10px] font-black border-2 transition-all ${paymentMode === mode ? 'bg-purple-600 border-purple-600 text-white shadow-lg' : 'bg-slate-50 border-slate-50 text-slate-400'}`}>
                    {mode.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="bg-slate-900 rounded-[28px] p-6 text-white text-center">
                <p className="text-[10px] font-black uppercase opacity-50 mb-1">Grand Total</p>
                <p className="text-4xl font-black">₹{total.toLocaleString()}</p>
              </div>
              <button type="submit" className="w-full bg-purple-600 text-white font-black py-5 rounded-3xl shadow-xl shadow-purple-200 hover:scale-[1.02] transition-all">Record Transaction</button>
            </form>
          </div>
        </div>

        <div className="xl:col-span-2 space-y-4">
          {sales.map(sale => (
            <div key={sale.id} className="bg-white rounded-[32px] p-6 shadow-sm border-2 border-slate-50 flex items-center justify-between group hover:border-purple-100 transition-all">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-black text-xl"><ShoppingBag size={24} /></div>
                <div>
                  <h4 className="font-black text-slate-800 capitalize">{sale.category}</h4>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span>{sale.packets} Packets</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span>{sale.paymentMode}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-2xl font-black text-emerald-600">₹{sale.totalAmount.toLocaleString()}</p>
                  <p className="text-[9px] font-black uppercase text-slate-300">By {sale.createdBy}</p>
                </div>
                <button onClick={() => deleteSale(sale.id)} className="text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={20} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sales;
