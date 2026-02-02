
import { 
  User, 
  ProductionEntry, 
  SaleEntry, 
  RawMaterialPurchase, 
  ExpenseEntry, 
  SalaryPayment, 
  ProblemLog, 
  SpecialOrder,
  AttendanceRecord
} from './types';

const STORAGE_KEYS = {
  USERS: 'ap_users_v2',
  PRODUCTION: 'ap_production_v2',
  SALES: 'ap_sales_v2',
  RAW_PURCHASES: 'ap_raw_purchases_v2',
  EXPENSES: 'ap_expenses_v2',
  SALARY: 'ap_salary_v2',
  PROBLEMS: 'ap_problems_v2',
  SPECIAL_ORDERS: 'ap_special_orders_v2',
  CURRENT_USER: 'ap_current_user_v2',
  CATEGORIES: 'ap_categories_v2',
  ATTENDANCE: 'ap_attendance_v2'
};

const DEFAULT_USERS: User[] = [
  { id: '1', name: 'Anand', role: 'Owner', password: '123' },
  { id: '2', name: 'Manager', role: 'Manager', password: '456' },
  { id: '3', name: 'Worker', role: 'Worker', password: '789' }
];

const DEFAULT_CATEGORIES = [
  'udid papad', 'sabudana papad', 'poha papad', 'chana masala papad', 
  'tandool papad', 'nagli papad', 'disco papad', 'kurdai', 'murkul'
];

export const storage = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : DEFAULT_USERS;
  },
  saveUsers: (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },
  setCurrentUser: (user: User | null) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },
  getCategories: (): string[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
  },
  saveCategories: (cats: string[]) => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
  },
  getData: <T,>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },
  saveData: <T,>(key: string, data: T[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  getProduction: () => storage.getData<ProductionEntry>(STORAGE_KEYS.PRODUCTION),
  getSales: () => storage.getData<SaleEntry>(STORAGE_KEYS.SALES),
  getRawPurchases: () => storage.getData<RawMaterialPurchase>(STORAGE_KEYS.RAW_PURCHASES),
  getExpenses: () => storage.getData<ExpenseEntry>(STORAGE_KEYS.EXPENSES),
  getSalary: () => storage.getData<SalaryPayment>(STORAGE_KEYS.SALARY),
  getProblems: () => storage.getData<ProblemLog>(STORAGE_KEYS.PROBLEMS),
  getSpecialOrders: () => storage.getData<SpecialOrder>(STORAGE_KEYS.SPECIAL_ORDERS),
  getAttendance: () => storage.getData<AttendanceRecord>(STORAGE_KEYS.ATTENDANCE),
};

export { STORAGE_KEYS };
