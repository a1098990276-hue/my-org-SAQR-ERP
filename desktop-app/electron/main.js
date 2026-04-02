const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const express = require('express');
const Database = require('better-sqlite3');

let mainWindow;
let server;

function initDb() {
  const dbPath = path.join(app.getPath('userData'), 'saqr-erp.db');
  const db = new Database(dbPath);
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schemaSql);
  return db;
}

function startApi(db) {
  const api = express();
  api.use(express.json());

  api.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  api.get('/api/accounts', (req, res) => {
    const rows = db.prepare('SELECT * FROM accounts ORDER BY code').all();
    res.json(rows);
  });

  api.post('/api/accounts', (req, res) => {
    const { code, name_ar, name_en, parent_id, type } = req.body;
    const stmt = db.prepare(
      'INSERT INTO accounts (code, name_ar, name_en, parent_id, type, is_active) VALUES (?, ?, ?, ?, ?, 1)'
    );
    const info = stmt.run(code, name_ar, name_en, parent_id || null, type);
    res.json({ id: info.lastInsertRowid });
  });

  api.get('/api/products', (req, res) => {
    const rows = db.prepare('SELECT * FROM products ORDER BY name_ar').all();
    res.json(rows);
  });

  api.post('/api/products', (req, res) => {
    const { sku, name_ar, name_en, cost, price, stock_qty } = req.body;
    const stmt = db.prepare(
      'INSERT INTO products (sku, name_ar, name_en, cost, price, stock_qty) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const info = stmt.run(sku, name_ar, name_en, cost || 0, price || 0, stock_qty || 0);
    res.json({ id: info.lastInsertRowid });
  });

  api.get('/api/invoices', (req, res) => {
    const rows = db.prepare('SELECT * FROM invoices ORDER BY date DESC').all();
    res.json(rows);
  });

  api.post('/api/invoices', (req, res) => {
    const { invoice_no, date, type, customer_id, supplier_id, total, tax, net_total, status } = req.body;
    const stmt = db.prepare(
      'INSERT INTO invoices (invoice_no, date, type, customer_id, supplier_id, total, tax, net_total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    const info = stmt.run(invoice_no, date, type, customer_id || null, supplier_id || null, total || 0, tax || 0, net_total || 0, status || 'draft');
    res.json({ id: info.lastInsertRowid });
  });

  api.post('/api/journal-entries', (req, res) => {
    const { entry_no, date, description, lines, created_by } = req.body;
    const entryStmt = db.prepare(
      'INSERT INTO journal_entries (entry_no, date, description, posted, created_by) VALUES (?, ?, ?, 0, ?)'
    );
    const lineStmt = db.prepare(
      'INSERT INTO journal_lines (entry_id, account_id, debit, credit, description) VALUES (?, ?, ?, ?, ?)'
    );
    const tx = db.transaction(() => {
      const entryInfo = entryStmt.run(entry_no, date, description || '', created_by || 1);
      const entryId = entryInfo.lastInsertRowid;
      for (const line of lines || []) {
        lineStmt.run(entryId, line.account_id, line.debit || 0, line.credit || 0, line.description || '');
      }
      return entryId;
    });
    const entryId = tx();
    res.json({ id: entryId });
  });

  server = api.listen(3001, () => {
    console.log('Local API running on http://localhost:3001');
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const devUrl = 'http://localhost:5173';
  if (process.env.ELECTRON_START_URL) {
    mainWindow.loadURL(process.env.ELECTRON_START_URL);
  } else if (!app.isPackaged) {
    mainWindow.loadURL(devUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  const db = initDb();
  startApi(db);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (server) server.close();
    app.quit();
  }
});