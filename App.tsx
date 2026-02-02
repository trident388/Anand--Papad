
import React, { useState, useEffect } from 'react';
import { storage } from './storage.ts';
import { User } from './types.ts';
import Login from './components/Login.tsx';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import Production from './components/Production.tsx';
import Sales from './components/Sales.tsx';
import RawMaterials from './components/RawMaterials.tsx';
import SpecialOrders from './components/SpecialOrders.tsx';
import Salary from './components/Salary.tsx';
import Expenses from './components/Expenses.tsx';
import Stock from './components/Stock.tsx';
import Problems from './components/Problems.tsx';
import Analytics from './components/Analytics.tsx';
import Settings from './components/Settings.tsx';
import Attendance from './components/Attendance.tsx';
import Team from './components/Team.tsx';

export type Page = 
  | 'dashboard' 
  | 'production' 
  | 'sales' 
  | 'stock' 
  | 'raw-materials' 
  | 'special-orders' 
  | 'salary' 
  | 'expenses' 
  | 'problems' 
  | 'analytics' 
  | 'settings'
  | 'attendance'
  | 'team';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(storage.getCurrentUser());
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  useEffect(() => {
    storage.setCurrentUser(user);
  }, [user]);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard user={user} setPage={setCurrentPage} />;
      case 'production': return <Production user={user} />;
      case 'sales': return <Sales user={user} />;
      case 'stock': return <Stock />;
      case 'raw-materials': return <RawMaterials user={user} />;
      case 'special-orders': return <SpecialOrders user={user} />;
      case 'salary': return <Salary user={user} />;
      case 'expenses': return <Expenses user={user} />;
      case 'problems': return <Problems user={user} />;
      case 'analytics': return <Analytics />;
      case 'attendance': return <Attendance user={user} />;
      case 'team': return <Team user={user} />;
      case 'settings': return <Settings user={user} onUpdateUser={setUser} onLogout={() => setUser(null)} />;
      default: return <Dashboard user={user} setPage={setCurrentPage} />;
    }
  };

  return (
    <Layout user={user} currentPage={currentPage} onPageChange={setCurrentPage} onLogout={() => setUser(null)}>
      {renderPage()}
    </Layout>
  );
};

export default App;
