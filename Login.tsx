
import React, { useState } from 'react';
import { User } from '../types.ts';
import { storage } from '../storage.ts';
import { Factory, Lock, ShieldCheck, User as UserIcon } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [users] = useState<User[]>(storage.getUsers());
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.id === selectedUserId);
    if (user && user.password === password) {
      onLogin(user);
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-indigo-900 to-purple-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10 text-white">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-3xl mb-4 border border-white/20">
            <Factory size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Anand Papad</h1>
          <p className="text-indigo-200 font-medium uppercase tracking-widest text-xs">Business Management v1.0</p>
        </div>

        <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 flex items-center gap-2 px-1">
                <UserIcon size={16} /> Select Account
              </label>
              <div className="grid grid-cols-1 gap-3">
                {users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setSelectedUserId(u.id);
                      setError('');
                    }}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 ${
                      selectedUserId === u.id 
                        ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-100' 
                        : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        u.role === 'Owner' ? 'bg-indigo-600' : u.role === 'Manager' ? 'bg-purple-600' : 'bg-gray-500'
                      }`}>
                        {u.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className={`font-bold ${selectedUserId === u.id ? 'text-indigo-900' : 'text-gray-700'}`}>{u.name}</p>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{u.role}</p>
                      </div>
                    </div>
                    {selectedUserId === u.id && <ShieldCheck className="text-indigo-600" size={20} />}
                  </button>
                ))}
              </div>
            </div>

            {selectedUserId && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="text-sm font-bold text-gray-600 flex items-center gap-2 px-1">
                  <Lock size={16} /> Security Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold tracking-widest text-lg"
                  placeholder="••••"
                  autoFocus
                  required
                />
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-3 rounded-xl border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!selectedUserId || !password}
              className={`w-full py-5 rounded-[24px] font-black text-lg shadow-xl transition-all duration-300 transform active:scale-95 ${
                !selectedUserId || !password
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/30'
              }`}
            >
              Enter Dashboard
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-white/50 text-xs font-medium uppercase tracking-[0.2em]">
          Secured for Anand Papad Team
        </p>
      </div>
    </div>
  );
};

export default Login;
