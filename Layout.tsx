
import React, { useState } from 'react';
import { User } from '../types.ts';
import { Page } from '../App.tsx';
import { 
  Home, Factory, ShoppingBag, Package, Layers, Truck, 
  IndianRupee, Wallet, AlertCircle, BarChart2, Settings as SettingsIcon,
  LogOut, Menu, X, Users, ClipboardCheck
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['Owner', 'Manager', 'Worker'] },
  { id: 'production', label: 'Production', icon: Factory, roles: ['Owner', 'Manager', 'Worker'] },
  { id: 'sales', label: 'Sales', icon: ShoppingBag, roles: ['Owner', 'Manager'] },
  { id: 'stock', label: 'Stock & Inventory', icon: Package, roles: ['Owner', 'Manager', 'Worker'] },
  { id: 'raw-materials', label: 'Raw Materials', icon: Layers, roles: ['Owner', 'Manager'] },
  { id: 'special-orders', label: 'Customer Orders', icon: Truck, roles: ['Owner', 'Manager'] },
  { id: 'attendance', label: 'Attendance', icon: ClipboardCheck, roles: ['Owner', 'Manager'] },
  { id: 'salary', label: 'Salaries', icon: IndianRupee, roles: ['Owner'] },
  { id: 'expenses', label: 'Expenses', icon: Wallet, roles: ['Owner', 'Manager'] },
  { id: 'problems', label: 'Issues', icon: AlertCircle, roles: ['Owner', 'Manager', 'Worker'] },
  { id: 'team', label: 'Team Mgmt', icon: Users, roles: ['Owner'] },
  { id: 'analytics', label: 'Analysis', icon: BarChart2, roles: ['Owner'] },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, roles: ['Owner', 'Manager', 'Worker'] },
];

const NavItem: React.FC<{ 
  item: typeof menuItems[0]; 
  isActive: boolean; 
  onClick: () => void;
}> = ({ item, isActive, onClick }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg' 
          : 'text-white/70 hover:bg-white/10 hover:text-white'
      }`}
    >
      <Icon size={18} />
      <span className="font-medium text-sm">{item.label}</span>
    </button>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, user, currentPage, onPageChange, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const filteredMenu = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-indigo-50/30 flex flex-col md:flex-row">
      <div className="md:hidden bg-indigo-800 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-2">
          <Factory className="text-white" size={20} />
          <h1 className="text-lg font-bold tracking-tight">Anand Papad</h1>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside className={`fixed inset-0 z-40 md:static md:block transform transition-transform duration-500 ease-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 w-64 h-full min-h-screen bg-slate-900 text-white shadow-2xl overflow-y-auto`}>
        <div className="h-full flex flex-col p-5">
          <div className="hidden md:flex items-center space-x-3 mb-8 px-2">
            <div className="bg-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/50">
              <Factory className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold">Anand Papad</h1>
          </div>

          <nav className="flex-1 space-y-1">
            {filteredMenu.map(item => (
              <NavItem 
                key={item.id} 
                item={item} 
                isActive={currentPage === item.id}
                onClick={() => {
                  onPageChange(item.id as Page);
                  setSidebarOpen(false);
                }}
              />
            ))}
          </nav>

          <div className="pt-6 mt-6 border-t border-white/10">
            <div className="flex items-center space-x-3 mb-4 px-2">
              <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-[10px] text-white/50 uppercase tracking-tighter">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-4 md:p-10 relative">
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
      </main>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default Layout;
