
import React, { useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../storage.ts';
import { Package, TrendingDown, TrendingUp, AlertTriangle, Plus, X } from 'lucide-react';

const Stock: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCat, setNewCat] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  
  const production = storage.getProduction();
  const sales = storage.getSales();

  useEffect(() => {
    setCategories(storage.getCategories());
  }, []);

  const handleAddCategory = () => {
    if (!newCat.trim()) return;
    const updated = [...categories, newCat.trim().toLowerCase()];
    setCategories(updated);
    storage.saveCategories(updated);
    setNewCat('');
    setShowAdd(false);
  };

  const getStock = (cat: string) => {
    const prodCount = production.filter(p => p.category === cat).reduce((acc, curr) => acc + curr.packets, 0);
    const saleCount = sales.filter(s => s.category === cat).reduce((acc, curr) => acc + curr.packets, 0);
    return prodCount - saleCount;
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Live Inventory</h2>
          <p className="text-slate-500">Real-time stock levels for all Anand Papad products.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold shadow-xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          <span>New Product Type</span>
        </button>
      </header>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black">Add New Category</h3>
              <button onClick={() => setShowAdd(false)}><X /></button>
            </div>
            <input 
              type="text" 
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="e.g. Garlic Papad"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-4 mb-6 focus:border-indigo-500 outline-none"
              autoFocus
            />
            <button 
              onClick={handleAddCategory}
              className="w-full bg-indigo-600 text-white py-4 rounded-3xl font-black shadow-lg"
            >
              Add Product
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => {
          const stock = getStock(cat);
          const isLow = stock < 10;
          return (
            <div key={cat} className={`bg-white rounded-3xl p-6 shadow-sm border-2 ${isLow ? 'border-red-100 bg-red-50/30' : 'border-slate-50'} hover:border-indigo-200 transition-all group`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-4 rounded-2xl ${isLow ? 'bg-red-500 shadow-lg shadow-red-200' : 'bg-indigo-600 shadow-lg shadow-indigo-200'} text-white`}>
                  <Package size={24} />
                </div>
                {isLow && <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse uppercase">Critical Stock</span>}
              </div>
              <h3 className="text-xl font-black capitalize text-slate-800 mb-2">{cat}</h3>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-black ${isLow ? 'text-red-600' : 'text-slate-900'}`}>{stock}</span>
                <span className="text-slate-400 font-bold text-sm uppercase">Packets</span>
              </div>
              <div className="mt-6 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${isLow ? 'bg-red-500' : 'bg-indigo-600'}`} style={{ width: `${Math.min(stock * 2, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stock;
