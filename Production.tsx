
import React, { useState, useEffect } from 'react';
import { User, ProductionEntry } from '../types.ts';
import { storage, STORAGE_KEYS } from '../storage.ts';
import { Factory, History, Trash2, CheckCircle2 } from 'lucide-react';

const Production: React.FC<{ user: User }> = ({ user }) => {
  const [entries, setEntries] = useState<ProductionEntry[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [packets, setPackets] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setEntries(storage.getProduction());
    const cats = storage.getCategories();
    setCategories(cats);
    if (cats.length > 0) setCategory(cats[0]);
  }, []);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packets || isNaN(parseInt(packets))) return;

    const newEntry: ProductionEntry = {
      id: Date.now().toString(),
      category,
      packets: parseInt(packets),
      date: new Date().toISOString(),
      createdBy: user.name,
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    storage.saveData(STORAGE_KEYS.PRODUCTION, updated);
    setPackets('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    storage.saveData(STORAGE_KEYS.PRODUCTION, updated);
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-black text-slate-900">Batch Production</h2>
        <p className="text-slate-500 font-medium">Daily output logging for Anand Papad workshops.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[40px] p-8 shadow-sm border-2 border-slate-50 h-fit">
          <form onSubmit={handleAddEntry} className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-4 bg-indigo-600 text-white rounded-[24px] shadow-lg shadow-indigo-200">
                <Factory size={24} />
              </div>
              <h3 className="text-2xl font-black text-slate-800">New Entry</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Select Product</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 focus:border-indigo-500 outline-none transition-all capitalize font-bold text-slate-700"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Packet Quantity</label>
                <input 
                  type="number"
                  value={packets}
                  onChange={(e) => setPackets(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 focus:border-indigo-500 outline-none transition-all font-black text-xl text-slate-900"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className={`w-full font-black py-5 rounded-3xl shadow-xl transition-all flex items-center justify-center gap-3 transform active:scale-95 ${success ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'}`}
            >
              {success ? <CheckCircle2 size={24} /> : <Factory size={24} />}
              {success ? 'Entry Saved!' : 'Record Batch'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-[40px] shadow-sm border-2 border-slate-50 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xl font-black flex items-center gap-2">
              <History size={20} className="text-indigo-400" />
              Recent Output
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-8 py-5">Product Type</th>
                  <th className="px-8 py-5">Qty</th>
                  <th className="px-8 py-5">By</th>
                  <th className="px-8 py-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-8 py-5 font-bold text-slate-900 capitalize">{entry.category}</td>
                    <td className="px-8 py-5 font-black text-indigo-600 text-lg">{entry.packets}</td>
                    <td className="px-8 py-5 text-slate-400 text-xs font-bold">{entry.createdBy}</td>
                    <td className="px-8 py-5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => deleteEntry(entry.id)} className="text-red-300 hover:text-red-500"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Production;
