CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INTEGER NOT NULL,
  permission_id INTEGER NOT NULL,
  allowed INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

CREATE TABLE IF NOT EXISTS user_permissions (
  user_id INTEGER NOT NULL,
  permission_id INTEGER NOT NULL,
  allowed INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, permission_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  language TEXT NOT NULL DEFAULT 'ar',
  is_active INTEGER NOT NULL DEFAULT 1,
  role_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS fiscal_periods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  is_closed INTEGER NOT NULL DEFAULT 0,
  closed_at TEXT
);

CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  type TEXT NOT NULL,
  parent_id INTEGER,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (parent_id) REFERENCES accounts(id)
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entry_no TEXT NOT NULL UNIQUE,
  date TEXT NOT NULL,
  description TEXT,
  posted INTEGER NOT NULL DEFAULT 0,
  created_by INTEGER NOT NULL,
  posted_by INTEGER,
  posted_at TEXT,
  period_id INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (posted_by) REFERENCES users(id),
  FOREIGN KEY (period_id) REFERENCES fiscal_periods(id)
);

CREATE TABLE IF NOT EXISTS journal_lines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entry_id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  debit REAL NOT NULL DEFAULT 0,
  credit REAL NOT NULL DEFAULT 0,
  description TEXT,
  FOREIGN KEY (entry_id) REFERENCES journal_entries(id),
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sku TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  cost REAL NOT NULL DEFAULT 0,
  price REAL NOT NULL DEFAULT 0,
  avg_cost REAL NOT NULL DEFAULT 0,
  stock_qty REAL NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS invoice_sequences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL UNIQUE,
  prefix TEXT NOT NULL,
  next_no INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_no TEXT NOT NULL UNIQUE,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  customer_id INTEGER,
  supplier_id INTEGER,
  subtotal REAL NOT NULL DEFAULT 0,
  discount REAL NOT NULL DEFAULT 0,
  tax REAL NOT NULL DEFAULT 0,
  net_total REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  period_id INTEGER,
  created_by INTEGER NOT NULL,
  posted_by INTEGER,
  posted_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (posted_by) REFERENCES users(id),
  FOREIGN KEY (period_id) REFERENCES fiscal_periods(id)
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  qty REAL NOT NULL DEFAULT 0,
  price REAL NOT NULL DEFAULT 0,
  discount REAL NOT NULL DEFAULT 0,
  tax REAL NOT NULL DEFAULT 0,
  total REAL NOT NULL DEFAULT 0,
  cost REAL NOT NULL DEFAULT 0,
  avg_cost_snapshot REAL NOT NULL DEFAULT 0,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS stock_moves (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  qty REAL NOT NULL,
  unit_cost REAL NOT NULL DEFAULT 0,
  total_cost REAL NOT NULL DEFAULT 0,
  move_type TEXT NOT NULL,
  date TEXT NOT NULL,
  source TEXT,
  ref_id INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS sync_log (
  id TEXT PRIMARY KEY,
  table_name TEXT NOT NULL,
  row_id TEXT NOT NULL,
  action TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO roles (id, name) VALUES (1, 'admin');

INSERT OR IGNORE INTO permissions (code, description) VALUES
  ('accounts.read', 'Read accounts'),
  ('accounts.write', 'Create/update accounts'),
  ('products.read', 'Read products'),
  ('products.write', 'Create/update products'),
  ('customers.read', 'Read customers'),
  ('customers.write', 'Create/update customers'),
  ('suppliers.read', 'Read suppliers'),
  ('suppliers.write', 'Create/update suppliers'),
  ('invoices.read', 'Read invoices'),
  ('invoices.write', 'Create/update invoices'),
  ('invoices.post', 'Post invoices'),
  ('journal.read', 'Read journal'),
  ('journal.write', 'Create journal entries'),
  ('journal.post', 'Post journal entries'),
  ('reports.view', 'View reports'),
  ('periods.read', 'View fiscal periods'),
  ('periods.close', 'Close fiscal periods'),
  ('users.manage', 'Manage users'),
  ('roles.manage', 'Manage roles/permissions'),
  ('settings.manage', 'Manage settings'),
  ('sync.execute', 'Execute sync');

INSERT OR IGNORE INTO role_permissions (role_id, permission_id, allowed)
SELECT 1, id, 1 FROM permissions;

INSERT OR IGNORE INTO users (id, username, password_hash, full_name, email, language, is_active, role_id)
VALUES (1, 'admin', '$2a$10$g0o9b7dO8A3cW8E9WlPnO.xP8nH4S7XbG1SMLf3w3vIhT44yVZc7u', 'Administrator', 'admin@example.com', 'ar', 1, 1);

INSERT OR IGNORE INTO fiscal_periods (id, name, start_date, end_date, is_closed)
VALUES (1, 'FY ' || strftime('%Y','now'), strftime('%Y-01-01','now'), strftime('%Y-12-31','now'), 0);

INSERT OR IGNORE INTO invoice_sequences (type, prefix, next_no) VALUES
  ('sale', 'S-', 1),
  ('purchase', 'P-', 1);

INSERT OR IGNORE INTO accounts (id, code, name_ar, name_en, type, is_active)
VALUES
  (1, '1000', 'الصندوق', 'Cash', 'asset', 1),
  (2, '1100', 'الذمم المدينة', 'Accounts Receivable', 'asset', 1),
  (3, '1200', 'المخزون', 'Inventory', 'asset', 1),
  (4, '2000', 'الذمم الدائنة', 'Accounts Payable', 'liability', 1),
  (5, '2100', 'ضريبة مستحقة', 'Tax Payable', 'liability', 1),
  (6, '3000', 'حقوق الملكية', 'Equity', 'equity', 1),
  (7, '4000', 'المبيعات', 'Sales', 'income', 1),
  (8, '5000', 'تكلفة المبيعات', 'Cost of Goods Sold', 'expense', 1),
  (9, '6000', 'المصروفات', 'Expenses', 'expense', 1);

INSERT OR IGNORE INTO settings (key, value) VALUES
  ('account_receivable', '2'),
  ('account_payable', '4'),
  ('account_inventory', '3'),
  ('account_sales', '7'),
  ('account_cogs', '8'),
  ('account_tax', '5');