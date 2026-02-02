
export type UserRole = 'Owner' | 'Manager' | 'Worker';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  password?: string;
}

// Added missing PapadCategory type
export type PapadCategory = 
  | 'udid papad'
  | 'sabudana papad'
  | 'poha papad'
  | 'chana masala papad'
  | 'tandool papad'
  | 'nagli papad'
  | 'disco papad'
  | 'kurdai'
  | 'murkul';

export type RawMaterial = 
  | 'moong dal'
  | 'udid dal'
  | 'chana dal'
  | 'tandool'
  | 'sabudana'
  | 'gahu'
  | 'poha'
  | 'nagli'
  | 'papad masala'
  | 'papad khar'
  | 'mith'
  | 'tel'
  | 'jire'
  | 'mire';

export interface ProductionEntry {
  id: string;
  category: string;
  packets: number;
  date: string;
  createdBy: string;
}

export interface SaleEntry {
  id: string;
  category: string;
  packets: number;
  pricePerPacket: number;
  totalAmount: number;
  paymentMode: 'Cash' | 'UPI' | 'Credit';
  date: string;
  createdBy: string;
}

export interface RawMaterialPurchase {
  id: string;
  material: RawMaterial;
  quantity: number;
  cost: number;
  date: string;
  createdBy: string;
}

export interface ExpenseEntry {
  id: string;
  type: 'Maintenance' | 'Electricity' | 'Rent' | 'Other';
  description: string;
  amount: number;
  date: string;
  createdBy: string;
}

export interface SalaryPayment {
  id: string;
  employeeName: string;
  amount: number;
  date: string;
  createdBy: string;
}

export interface ProblemLog {
  id: string;
  description: string;
  date: string;
  status: 'Open' | 'Resolved';
  createdBy: string;
}

export interface SpecialOrder {
  id: string;
  customerName: string;
  orderType: string;
  quantity: number;
  customerMaterials: RawMaterial[];
  ourMaterials: RawMaterial[];
  amountCharged: number;
  paymentMode: string;
  date: string;
  createdBy: string;
}

export interface AttendanceRecord {
  date: string; // ISO date YYYY-MM-DD
  presentUserIds: string[];
}
