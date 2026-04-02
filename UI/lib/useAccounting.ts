import { useState, useEffect, useCallback } from 'react';

// ===== Types =====
export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

export interface Account {
  id: number;
  code: string;
  name: string;
  type: AccountType;
  parentId?: number;
  balance: number;
  isActive: boolean;
}

export interface JournalLine {
  accountId: number;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
}

export interface JournalEntry {
  id: number;
  date: string;
  reference: string;
  description: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  createdAt: string;
}

export interface InvoiceItem {
  itemId: number;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: number;
  number: string;
  type: 'sales' | 'purchase';
  date: string;
  dueDate: string;
  customerId?: number;
  customerName?: string;
  supplierId?: number;
  supplierName?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  tax: number;
  discount: number;
  total: number;
  status: 'draft' | 'paid' | 'unpaid' | 'cancelled';
  notes: string;
  createdAt: string;
}

export interface Customer {
  id: number;
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  taxNumber: string;
  balance: number;
  createdAt: string;
}

export interface Supplier {
  id: number;
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  taxNumber: string;
  balance: number;
  createdAt: string;
}

export interface Item {
  id: number;
  code: string;
  name: string;
  unit: string;
  salePrice: number;
  costPrice: number;
  quantity: number;
  minQuantity: number;
  category: string;
}

export interface AccountingData {
  accounts: Account[];
  journalEntries: JournalEntry[];
  invoices: Invoice[];
  customers: Customer[];
  suppliers: Supplier[];
  items: Item[];
}

// ===== Default Chart of Accounts =====
const defaultAccounts: Account[] = [
  // Assets
  { id: 1, code: '1000', name: 'الأصول', type: 'asset', balance: 0, isActive: true },
  { id: 2, code: '1100', name: 'الأصول المتداولة', type: 'asset', parentId: 1, balance: 0, isActive: true },
  { id: 3, code: '1110', name: 'الصندوق', type: 'asset', parentId: 2, balance: 50000, isActive: true },
  { id: 4, code: '1120', name: 'البنك', type: 'asset', parentId: 2, balance: 150000, isActive: true },
  { id: 5, code: '1130', name: 'حسابات القبض', type: 'asset', parentId: 2, balance: 30000, isActive: true },
  { id: 6, code: '1140', name: 'المخزون', type: 'asset', parentId: 2, balance: 80000, isActive: true },
  { id: 7, code: '1200', name: 'الأصول الثابتة', type: 'asset', parentId: 1, balance: 0, isActive: true },
  { id: 8, code: '1210', name: 'المعدات والأجهزة', type: 'asset', parentId: 7, balance: 200000, isActive: true },
  { id: 9, code: '1220', name: 'السيارات', type: 'asset', parentId: 7, balance: 120000, isActive: true },
  // Liabilities
  { id: 10, code: '2000', name: 'الخصوم', type: 'liability', balance: 0, isActive: true },
  { id: 11, code: '2100', name: 'الخصوم المتداولة', type: 'liability', parentId: 10, balance: 0, isActive: true },
  { id: 12, code: '2110', name: 'حسابات الدفع', type: 'liability', parentId: 11, balance: 20000, isActive: true },
  { id: 13, code: '2120', name: 'القروض قصيرة الأجل', type: 'liability', parentId: 11, balance: 50000, isActive: true },
  { id: 14, code: '2200', name: 'الخصوم طويلة الأجل', type: 'liability', parentId: 10, balance: 0, isActive: true },
  { id: 15, code: '2210', name: 'القروض طويلة الأجل', type: 'liability', parentId: 14, balance: 100000, isActive: true },
  // Equity
  { id: 16, code: '3000', name: 'حقوق الملكية', type: 'equity', balance: 0, isActive: true },
  { id: 17, code: '3100', name: 'رأس المال', type: 'equity', parentId: 16, balance: 300000, isActive: true },
  { id: 18, code: '3200', name: 'الأرباح المحتجزة', type: 'equity', parentId: 16, balance: 160000, isActive: true },
  // Revenue
  { id: 19, code: '4000', name: 'الإيرادات', type: 'revenue', balance: 0, isActive: true },
  { id: 20, code: '4100', name: 'إيرادات المبيعات', type: 'revenue', parentId: 19, balance: 500000, isActive: true },
  { id: 21, code: '4200', name: 'إيرادات أخرى', type: 'revenue', parentId: 19, balance: 10000, isActive: true },
  // Expenses
  { id: 22, code: '5000', name: 'المصروفات', type: 'expense', balance: 0, isActive: true },
  { id: 23, code: '5100', name: 'تكلفة البضاعة المباعة', type: 'expense', parentId: 22, balance: 300000, isActive: true },
  { id: 24, code: '5200', name: 'مصروفات التشغيل', type: 'expense', parentId: 22, balance: 0, isActive: true },
  { id: 25, code: '5210', name: 'الرواتب والأجور', type: 'expense', parentId: 24, balance: 80000, isActive: true },
  { id: 26, code: '5220', name: 'الإيجار', type: 'expense', parentId: 24, balance: 24000, isActive: true },
  { id: 27, code: '5230', name: 'الكهرباء والماء', type: 'expense', parentId: 24, balance: 6000, isActive: true },
  { id: 28, code: '5240', name: 'مصروفات إدارية', type: 'expense', parentId: 24, balance: 12000, isActive: true },
];

const defaultCustomers: Customer[] = [
  { id: 1, code: 'C001', name: 'شركة النور للتجارة', phone: '0501234567', email: 'info@alnoor.com', address: 'الرياض، حي العليا', taxNumber: '300123456700003', balance: 15000, createdAt: '2024-01-15' },
  { id: 2, code: 'C002', name: 'مؤسسة الفلاح', phone: '0559876543', email: 'falah@mail.com', address: 'جدة، حي الروضة', taxNumber: '300234567800003', balance: 8500, createdAt: '2024-02-20' },
  { id: 3, code: 'C003', name: 'شركة الأمل للمقاولات', phone: '0531112222', email: 'amal@amal.sa', address: 'الدمام، حي الفيصلية', taxNumber: '300345678900003', balance: 6500, createdAt: '2024-03-10' },
];

const defaultSuppliers: Supplier[] = [
  { id: 1, code: 'S001', name: 'شركة الرائد للتوريدات', phone: '0112233445', email: 'raed@raed.com', address: 'الرياض، المنطقة الصناعية', taxNumber: '300456789000003', balance: 12000, createdAt: '2024-01-01' },
  { id: 2, code: 'S002', name: 'مصنع الجودة', phone: '0223344556', email: 'joda@joda.com', address: 'جدة، المنطقة الصناعية', taxNumber: '300567890100003', balance: 8000, createdAt: '2024-02-01' },
];

const defaultItems: Item[] = [
  { id: 1, code: 'I001', name: 'حاسوب محمول', unit: 'قطعة', salePrice: 3500, costPrice: 2800, quantity: 25, minQuantity: 5, category: 'إلكترونيات' },
  { id: 2, code: 'I002', name: 'طابعة ليزر', unit: 'قطعة', salePrice: 1200, costPrice: 900, quantity: 15, minQuantity: 3, category: 'إلكترونيات' },
  { id: 3, code: 'I003', name: 'ورق A4', unit: 'رزمة', salePrice: 25, costPrice: 18, quantity: 200, minQuantity: 50, category: 'مستلزمات مكتبية' },
  { id: 4, code: 'I004', name: 'أقلام حبر', unit: 'علبة', salePrice: 15, costPrice: 10, quantity: 100, minQuantity: 20, category: 'مستلزمات مكتبية' },
];

const defaultJournalEntries: JournalEntry[] = [
  {
    id: 1,
    date: '2024-01-15',
    reference: 'J001',
    description: 'فاتورة مبيعات رقم INV-001',
    lines: [
      { accountId: 5, accountCode: '1130', accountName: 'حسابات القبض', debit: 11500, credit: 0, description: '' },
      { accountId: 20, accountCode: '4100', accountName: 'إيرادات المبيعات', debit: 0, credit: 10000, description: '' },
      { accountId: 12, accountCode: '2110', accountName: 'حسابات الدفع', debit: 0, credit: 1500, description: 'ضريبة القيمة المضافة' },
    ],
    totalDebit: 11500,
    totalCredit: 11500,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    date: '2024-01-20',
    reference: 'J002',
    description: 'دفع رواتب شهر يناير',
    lines: [
      { accountId: 25, accountCode: '5210', accountName: 'الرواتب والأجور', debit: 8000, credit: 0, description: '' },
      { accountId: 3, accountCode: '1110', accountName: 'الصندوق', debit: 0, credit: 8000, description: '' },
    ],
    totalDebit: 8000,
    totalCredit: 8000,
    createdAt: '2024-01-20',
  },
];

const defaultInvoices: Invoice[] = [
  {
    id: 1,
    number: 'INV-001',
    type: 'sales',
    date: '2024-01-15',
    dueDate: '2024-02-15',
    customerId: 1,
    customerName: 'شركة النور للتجارة',
    items: [
      { itemId: 1, name: 'حاسوب محمول', unit: 'قطعة', quantity: 2, unitPrice: 3500, total: 7000 },
      { itemId: 2, name: 'طابعة ليزر', unit: 'قطعة', quantity: 1, unitPrice: 1200, total: 1200 },
    ],
    subtotal: 8200,
    taxRate: 15,
    tax: 1230,
    discount: 0,
    total: 9430,
    status: 'paid',
    notes: '',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    number: 'INV-002',
    type: 'sales',
    date: '2024-02-01',
    dueDate: '2024-03-01',
    customerId: 2,
    customerName: 'مؤسسة الفلاح',
    items: [
      { itemId: 3, name: 'ورق A4', unit: 'رزمة', quantity: 50, unitPrice: 25, total: 1250 },
      { itemId: 4, name: 'أقلام حبر', unit: 'علبة', quantity: 20, unitPrice: 15, total: 300 },
    ],
    subtotal: 1550,
    taxRate: 15,
    tax: 232.5,
    discount: 0,
    total: 1782.5,
    status: 'unpaid',
    notes: '',
    createdAt: '2024-02-01',
  },
];

const STORAGE_KEY = 'saqr_erp_accounting_data';

function loadData(): AccountingData {
  if (typeof window === 'undefined') {
    return { accounts: defaultAccounts, journalEntries: defaultJournalEntries, invoices: defaultInvoices, customers: defaultCustomers, suppliers: defaultSuppliers, items: defaultItems };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const initial: AccountingData = {
    accounts: defaultAccounts,
    journalEntries: defaultJournalEntries,
    invoices: defaultInvoices,
    customers: defaultCustomers,
    suppliers: defaultSuppliers,
    items: defaultItems,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveData(data: AccountingData) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export function useAccounting() {
  const [data, setData] = useState<AccountingData>(() => ({
    accounts: defaultAccounts,
    journalEntries: defaultJournalEntries,
    invoices: defaultInvoices,
    customers: defaultCustomers,
    suppliers: defaultSuppliers,
    items: defaultItems,
  }));

  useEffect(() => {
    setData(loadData());
  }, []);

  const update = useCallback((newData: AccountingData) => {
    setData(newData);
    saveData(newData);
  }, []);

  // Accounts
  const addAccount = (account: Omit<Account, 'id'>) => {
    const newAcc = { ...account, id: Date.now() };
    update({ ...data, accounts: [...data.accounts, newAcc] });
  };
  const updateAccount = (id: number, changes: Partial<Account>) => {
    update({ ...data, accounts: data.accounts.map(a => a.id === id ? { ...a, ...changes } : a) });
  };
  const deleteAccount = (id: number) => {
    update({ ...data, accounts: data.accounts.filter(a => a.id !== id) });
  };

  // Journal Entries
  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const newEntry = { ...entry, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
    update({ ...data, journalEntries: [...data.journalEntries, newEntry] });
  };
  const deleteJournalEntry = (id: number) => {
    update({ ...data, journalEntries: data.journalEntries.filter(e => e.id !== id) });
  };

  // Invoices
  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInv = { ...invoice, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
    update({ ...data, invoices: [...data.invoices, newInv] });
  };
  const updateInvoice = (id: number, changes: Partial<Invoice>) => {
    update({ ...data, invoices: data.invoices.map(i => i.id === id ? { ...i, ...changes } : i) });
  };
  const deleteInvoice = (id: number) => {
    update({ ...data, invoices: data.invoices.filter(i => i.id !== id) });
  };

  // Customers
  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCust = { ...customer, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
    update({ ...data, customers: [...data.customers, newCust] });
  };
  const updateCustomer = (id: number, changes: Partial<Customer>) => {
    update({ ...data, customers: data.customers.map(c => c.id === id ? { ...c, ...changes } : c) });
  };
  const deleteCustomer = (id: number) => {
    update({ ...data, customers: data.customers.filter(c => c.id !== id) });
  };

  // Suppliers
  const addSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
    const newSup = { ...supplier, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
    update({ ...data, suppliers: [...data.suppliers, newSup] });
  };
  const updateSupplier = (id: number, changes: Partial<Supplier>) => {
    update({ ...data, suppliers: data.suppliers.map(s => s.id === id ? { ...s, ...changes } : s) });
  };
  const deleteSupplier = (id: number) => {
    update({ ...data, suppliers: data.suppliers.filter(s => s.id !== id) });
  };

  // Items
  const addItem = (item: Omit<Item, 'id'>) => {
    const newItem = { ...item, id: Date.now() };
    update({ ...data, items: [...data.items, newItem] });
  };
  const updateItem = (id: number, changes: Partial<Item>) => {
    update({ ...data, items: data.items.map(i => i.id === id ? { ...i, ...changes } : i) });
  };
  const deleteItem = (id: number) => {
    update({ ...data, items: data.items.filter(i => i.id !== id) });
  };

  return {
    data,
    accounts: data.accounts,
    journalEntries: data.journalEntries,
    invoices: data.invoices,
    customers: data.customers,
    suppliers: data.suppliers,
    items: data.items,
    addAccount, updateAccount, deleteAccount,
    addJournalEntry, deleteJournalEntry,
    addInvoice, updateInvoice, deleteInvoice,
    addCustomer, updateCustomer, deleteCustomer,
    addSupplier, updateSupplier, deleteSupplier,
    addItem, updateItem, deleteItem,
  };
}

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  asset: 'أصول',
  liability: 'خصوم',
  equity: 'حقوق الملكية',
  revenue: 'إيرادات',
  expense: 'مصروفات',
};

export const ACCOUNT_TYPE_COLORS: Record<AccountType, string> = {
  asset: '#3b82f6',
  liability: '#ef4444',
  equity: '#8b5cf6',
  revenue: '#22c55e',
  expense: '#f97316',
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 2 }).format(amount);
}
