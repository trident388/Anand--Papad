
import React, { useState, useEffect } from 'react';
import { User, ProductionEntry, SaleEntry, ExpenseEntry, SalaryPayment } from '../types.ts';
import { Page } from '../App.tsx';
import { storage } from '../storage.ts';
import { Factory, ShoppingBag, TrendingUp, AlertCircle, Plus, Wallet, Package, Smartphone, X, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  user: User;
  setPage: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setPage }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  const production = storage.getProduction();
  const sales = storage.getSales();
  const expenses = storage.getExpenses();
  const salary = storage.getSalary();
  const problems = storage.getProblems().filter(p => p.status === 'Open');

  // Stats
  const totalProduction = production.reduce((acc, curr) => acc + curr.packets, 0);
  const totalSales = sales.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalPacketsSold = sales.reduce((acc, curr) => acc + curr.packets, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0) + 
                       salary.reduce((acc, curr) => acc + curr.amount, 0);
  const currentStock = totalProduction - totalPacketsSold;
  const netProfit = totalSales - totalExpenses;

  const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Dynamic Install Banner */}
      {showInstallBanner && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Smartphone size={28} />
            </div>
            <div>
              <h4 className="font-black text-lg">Install Anand Papad App</h4>
              <p className="text-sm opacity-80 font-medium">Use it directly from your home screen like WhatsApp!</p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={handleInstall}
              className="flex-1 md:flex-none bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black shadow-lg hover:bg-slate-50 transition-all text-sm"
            >
              Install Now
            </button>
            <button 
              onClick={() => setShowInstallBanner(false)}
              className="p-3 hover:bg-white/10 rounded-2xl transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome, {user.name} 👋</h2>
          <p className="text-gray-500 mt-1 font-medium">Here's what's happening at Anand Papad today.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setPage('production')}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all"
          >
            <Plus size={18} />
            <span>Add Production</span>
          </button>
          <button 
            onClick={() => setPage('sales')}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-purple-200 transition-all"
          >
            <Plus size={18} />
            <span>New Sale</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Production" 
          value={`${totalProduction} Packets`} 
          icon={Factory} 
          color="bg-blue-500 shadow-lg shadow-blue-100" 
        />
        <StatCard 
          label="Total Sales" 
          value={`₹${totalSales.toLocaleString()}`} 
          icon={ShoppingBag} 
          color="bg-purple-500 shadow-lg shadow-purple-100" 
        />
        <StatCard 
          label="Current Stock" 
          value={`${currentStock} Packets`} 
          icon={Package} 
          color="bg-amber-500 shadow-lg shadow-amber-100" 
        />
        <StatCard 
          label="Net Profit" 
          value={`₹${netProfit.toLocaleString()}`} 
          icon={TrendingUp} 
          color="bg-green-500 shadow-lg shadow-green-100" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Problems Section */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <AlertCircle className="text-red-500" size={20} />
              Daily Issues
            </h3>
            <span className="bg-red-50 text-red-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
              {problems.length} Open
            </span>
          </div>
          <div className="space-y-4">
            {problems.length > 0 ? (
              problems.slice(0, 3).map(p => (
                <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-red-100 transition-all">
                  <p className="text-sm font-bold text-slate-700 line-clamp-2">{p.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[10px] font-black uppercase text-slate-400">{new Date(p.date).toLocaleDateString()}</span>
                    <span className="text-[10px] font-black uppercase text-indigo-600 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">By {p.createdBy}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <p className="text-slate-400 font-bold text-sm">No open problems!</p>
              </div>
            )}
            <button 
              onClick={() => setPage('problems')}
              className="w-full text-center text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline pt-2"
            >
              View Full Problem Log
            </button>
          </div>
        </div>

        {/* Quick Summary Section */}
        <div className="lg:col-span-2 bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-8 tracking-tight">Real-time Financials</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl text-emerald-400"><ShoppingBag size={20} /></div>
                  <span className="font-bold opacity-80 uppercase text-[10px] tracking-widest">Gross Income</span>
                </div>
                <span className="text-2xl font-black text-emerald-400">₹{totalSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl text-red-400"><Wallet size={20} /></div>
                  <span className="font-bold opacity-80 uppercase text-[10px] tracking-widest">Total Costs</span>
                </div>
                <span className="text-2xl font-black text-red-400">₹{totalExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-sm font-black uppercase tracking-[0.2em] opacity-50">Current Net Profit</span>
                <div className="text-right">
                   <span className="text-4xl font-black block">₹{netProfit.toLocaleString()}</span>
                   <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
