import React, { useState } from 'react';
import AccountingLayout, { Card, Button } from '../../components/AccountingLayout';
import { useAccounting, Account, ACCOUNT_TYPE_LABELS, formatCurrency } from '../../lib/useAccounting';

type ReportType = 'trial_balance' | 'income_statement' | 'balance_sheet' | 'ledger';

export default function ReportsPage() {
  const { accounts, invoices, journalEntries } = useAccounting();
  const [activeReport, setActiveReport] = useState<ReportType>('trial_balance');
  const [selectedAccountId, setSelectedAccountId] = useState<number>(0);

  const leafAccounts = accounts.filter(a => a.parentId !== undefined && a.isActive);

  // Trial Balance
  const trialBalance = leafAccounts.map(a => ({
    ...a,
    debit: a.type === 'asset' || a.type === 'expense' ? Math.max(a.balance, 0) : 0,
    credit: a.type === 'liability' || a.type === 'equity' || a.type === 'revenue' ? Math.max(a.balance, 0) : 0,
  }));
  const totalDebit = trialBalance.reduce((s, a) => s + a.debit, 0);
  const totalCredit = trialBalance.reduce((s, a) => s + a.credit, 0);

  // Income Statement
  const revenues = leafAccounts.filter(a => a.type === 'revenue');
  const expenses = leafAccounts.filter(a => a.type === 'expense');
  const totalRevenue = revenues.reduce((s, a) => s + a.balance, 0);
  const totalExpenses = expenses.reduce((s, a) => s + a.balance, 0);
  const netProfit = totalRevenue - totalExpenses;

  // Balance Sheet
  const assets = leafAccounts.filter(a => a.type === 'asset');
  const liabilities = leafAccounts.filter(a => a.type === 'liability');
  const equity = leafAccounts.filter(a => a.type === 'equity');
  const totalAssets = assets.reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = liabilities.reduce((s, a) => s + a.balance, 0);
  const totalEquity = equity.reduce((s, a) => s + a.balance, 0) + netProfit;

  // Ledger
  const ledgerAccount = accounts.find(a => a.id === selectedAccountId);
  const ledgerEntries = journalEntries.flatMap(entry =>
    entry.lines
      .filter(line => line.accountId === selectedAccountId)
      .map(line => ({ date: entry.date, reference: entry.reference, description: entry.description, debit: line.debit, credit: line.credit }))
  ).sort((a, b) => a.date.localeCompare(b.date));

  let runningBalance = 0;
  const ledgerWithBalance = ledgerEntries.map(e => {
    runningBalance += e.debit - e.credit;
    return { ...e, balance: runningBalance };
  });

  const reportTabs: { key: ReportType; label: string; icon: string }[] = [
    { key: 'trial_balance', label: 'ميزان المراجعة', icon: '⚖️' },
    { key: 'income_statement', label: 'قائمة الدخل', icon: '📊' },
    { key: 'balance_sheet', label: 'الميزانية العمومية', icon: '🏦' },
    { key: 'ledger', label: 'دفتر الأستاذ', icon: '📒' },
  ];

  const printReport = () => window.print();

  return (
    <AccountingLayout title="التقارير المالية">
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: '#fff', padding: '8px', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', width: 'fit-content' }}>
        {reportTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveReport(tab.key)}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: activeReport === tab.key ? '#3b82f6' : 'transparent',
              color: activeReport === tab.key ? '#fff' : '#64748b',
              fontWeight: activeReport === tab.key ? 700 : 400,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 14,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Print button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button onClick={printReport} variant="secondary">🖨️ طباعة التقرير</Button>
      </div>

      {/* Trial Balance */}
      {activeReport === 'trial_balance' && (
        <Card>
          <h2 style={{ textAlign: 'center', marginBottom: 4, color: '#1e293b' }}>ميزان المراجعة</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 20 }}>{new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#1e293b', color: '#fff' }}>
                {['رمز الحساب', 'اسم الحساب', 'النوع', 'مدين', 'دائن'].map(h => (
                  <th key={h} style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trialBalance.map((acc, idx) => (
                <tr key={acc.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={{ padding: '10px 16px', fontFamily: 'monospace', color: '#64748b' }}>{acc.code}</td>
                  <td style={{ padding: '10px 16px', color: '#1e293b' }}>{acc.name}</td>
                  <td style={{ padding: '10px 16px', color: '#64748b', fontSize: 13 }}>{ACCOUNT_TYPE_LABELS[acc.type]}</td>
                  <td style={{ padding: '10px 16px', color: '#3b82f6', fontWeight: acc.debit > 0 ? 600 : 400 }}>{acc.debit > 0 ? formatCurrency(acc.debit) : '-'}</td>
                  <td style={{ padding: '10px 16px', color: '#8b5cf6', fontWeight: acc.credit > 0 ? 600 : 400 }}>{acc.credit > 0 ? formatCurrency(acc.credit) : '-'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#1e293b', color: '#fff', fontWeight: 700, fontSize: 15 }}>
                <td colSpan={3} style={{ padding: '14px 16px' }}>الإجمالي</td>
                <td style={{ padding: '14px 16px', color: '#93c5fd' }}>{formatCurrency(totalDebit)}</td>
                <td style={{ padding: '14px 16px', color: '#c4b5fd' }}>{formatCurrency(totalCredit)}</td>
              </tr>
              <tr style={{ background: Math.abs(totalDebit - totalCredit) < 0.01 ? '#dcfce7' : '#fee2e2' }}>
                <td colSpan={5} style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 700, color: Math.abs(totalDebit - totalCredit) < 0.01 ? '#166534' : '#991b1b', fontSize: 15 }}>
                  {Math.abs(totalDebit - totalCredit) < 0.01 ? '✅ الميزان متطابق' : `⚠️ الفرق: ${formatCurrency(Math.abs(totalDebit - totalCredit))}`}
                </td>
              </tr>
            </tfoot>
          </table>
        </Card>
      )}

      {/* Income Statement */}
      {activeReport === 'income_statement' && (
        <Card>
          <h2 style={{ textAlign: 'center', marginBottom: 4, color: '#1e293b' }}>قائمة الدخل (الأرباح والخسائر)</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 24 }}>للسنة المنتهية في {new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            {/* Revenues */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ background: '#dcfce7', padding: '10px 16px', borderRadius: '8px 8px 0 0', fontWeight: 700, color: '#166534', fontSize: 15 }}>الإيرادات</div>
              {revenues.map(a => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#374151' }}>{a.code} - {a.name}</span>
                  <span style={{ fontWeight: 600, color: '#22c55e' }}>{formatCurrency(a.balance)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f0fdf4', fontWeight: 700, borderTop: '2px solid #22c55e' }}>
                <span style={{ color: '#166534' }}>إجمالي الإيرادات</span>
                <span style={{ color: '#22c55e', fontSize: 16 }}>{formatCurrency(totalRevenue)}</span>
              </div>
            </div>

            {/* Expenses */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ background: '#fee2e2', padding: '10px 16px', borderRadius: '8px 8px 0 0', fontWeight: 700, color: '#991b1b', fontSize: 15 }}>المصروفات</div>
              {expenses.map(a => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#374151' }}>{a.code} - {a.name}</span>
                  <span style={{ fontWeight: 600, color: '#ef4444' }}>{formatCurrency(a.balance)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#fef2f2', fontWeight: 700, borderTop: '2px solid #ef4444' }}>
                <span style={{ color: '#991b1b' }}>إجمالي المصروفات</span>
                <span style={{ color: '#ef4444', fontSize: 16 }}>{formatCurrency(totalExpenses)}</span>
              </div>
            </div>

            {/* Net Profit */}
            <div style={{ background: netProfit >= 0 ? '#dbeafe' : '#fee2e2', borderRadius: 12, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `2px solid ${netProfit >= 0 ? '#3b82f6' : '#ef4444'}` }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>{netProfit >= 0 ? '✅ صافي الربح' : '❌ صافي الخسارة'}</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: netProfit >= 0 ? '#3b82f6' : '#ef4444' }}>{formatCurrency(Math.abs(netProfit))}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Balance Sheet */}
      {activeReport === 'balance_sheet' && (
        <Card>
          <h2 style={{ textAlign: 'center', marginBottom: 4, color: '#1e293b' }}>الميزانية العمومية</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 24 }}>كما في {new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Assets Side */}
            <div>
              <div style={{ background: '#1e40af', color: '#fff', padding: '10px 16px', borderRadius: '8px 8px 0 0', fontWeight: 700, fontSize: 15 }}>الأصول</div>
              {assets.map(a => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#374151', fontSize: 14 }}>{a.name}</span>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{formatCurrency(a.balance)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', background: '#dbeafe', fontWeight: 800, borderTop: '2px solid #3b82f6', fontSize: 16 }}>
                <span style={{ color: '#1e40af' }}>إجمالي الأصول</span>
                <span style={{ color: '#1d4ed8' }}>{formatCurrency(totalAssets)}</span>
              </div>
            </div>

            {/* Liabilities + Equity Side */}
            <div>
              <div style={{ background: '#7c3aed', color: '#fff', padding: '10px 16px', borderRadius: '8px 8px 0 0', fontWeight: 700, fontSize: 15 }}>الخصوم وحقوق الملكية</div>

              <div style={{ padding: '8px 16px', fontWeight: 600, color: '#7c3aed', background: '#f5f3ff', borderBottom: '1px solid #ede9fe', fontSize: 13 }}>الخصوم</div>
              {liabilities.map(a => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#374151', fontSize: 14 }}>{a.name}</span>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{formatCurrency(a.balance)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', background: '#faf5ff', borderBottom: '2px solid #ede9fe', fontWeight: 600, fontSize: 13 }}>
                <span style={{ color: '#7c3aed' }}>إجمالي الخصوم</span>
                <span style={{ color: '#6d28d9' }}>{formatCurrency(totalLiabilities)}</span>
              </div>

              <div style={{ padding: '8px 16px', fontWeight: 600, color: '#0891b2', background: '#ecfeff', borderBottom: '1px solid #cffafe', fontSize: 13, marginTop: 4 }}>حقوق الملكية</div>
              {equity.map(a => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#374151', fontSize: 14 }}>{a.name}</span>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{formatCurrency(a.balance)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#374151', fontSize: 14 }}>صافي الربح / الخسارة</span>
                <span style={{ fontWeight: 600, color: netProfit >= 0 ? '#22c55e' : '#ef4444' }}>{formatCurrency(netProfit)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', background: '#ecfeff', borderBottom: '2px solid #06b6d4', fontWeight: 600, fontSize: 13 }}>
                <span style={{ color: '#0891b2' }}>إجمالي حقوق الملكية</span>
                <span style={{ color: '#0e7490' }}>{formatCurrency(totalEquity)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', background: '#f5f3ff', fontWeight: 800, borderTop: '2px solid #7c3aed', fontSize: 16 }}>
                <span style={{ color: '#5b21b6' }}>إجمالي الخصوم + حقوق الملكية</span>
                <span style={{ color: '#6d28d9' }}>{formatCurrency(totalLiabilities + totalEquity)}</span>
              </div>
            </div>
          </div>

          {/* Balance check */}
          <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 10, textAlign: 'center', background: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 1 ? '#dcfce7' : '#fee2e2' }}>
            <span style={{ fontWeight: 700, color: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 1 ? '#166534' : '#991b1b', fontSize: 15 }}>
              {Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 1 ? '✅ الميزانية متوازنة' : `⚠️ الفرق: ${formatCurrency(Math.abs(totalAssets - (totalLiabilities + totalEquity)))}`}
            </span>
          </div>
        </Card>
      )}

      {/* General Ledger */}
      {activeReport === 'ledger' && (
        <Card>
          <h2 style={{ textAlign: 'center', marginBottom: 20, color: '#1e293b' }}>دفتر الأستاذ العام</h2>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
            <label style={{ fontWeight: 600, color: '#374151', minWidth: 100 }}>اختر الحساب:</label>
            <select
              value={selectedAccountId}
              onChange={e => setSelectedAccountId(parseInt(e.target.value))}
              style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none', minWidth: 300 }}
            >
              <option value={0}>-- اختر حساباً --</option>
              {leafAccounts.map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
            </select>
          </div>

          {ledgerAccount && (
            <>
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 20px', marginBottom: 20, display: 'flex', gap: 24, fontSize: 14 }}>
                <div><span style={{ color: '#64748b' }}>الحساب: </span><strong>{ledgerAccount.code} - {ledgerAccount.name}</strong></div>
                <div><span style={{ color: '#64748b' }}>النوع: </span><strong>{ACCOUNT_TYPE_LABELS[ledgerAccount.type]}</strong></div>
                <div><span style={{ color: '#64748b' }}>الرصيد الحالي: </span><strong style={{ color: '#3b82f6' }}>{formatCurrency(ledgerAccount.balance)}</strong></div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#1e293b', color: '#fff' }}>
                    {['التاريخ', 'المرجع', 'البيان', 'مدين', 'دائن', 'الرصيد'].map(h => (
                      <th key={h} style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ledgerWithBalance.map((entry, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                      <td style={{ padding: '10px 16px', color: '#374151' }}>{entry.date}</td>
                      <td style={{ padding: '10px 16px', fontFamily: 'monospace', color: '#64748b' }}>{entry.reference || '-'}</td>
                      <td style={{ padding: '10px 16px', color: '#1e293b' }}>{entry.description}</td>
                      <td style={{ padding: '10px 16px', color: '#3b82f6', fontWeight: entry.debit > 0 ? 600 : 400 }}>{entry.debit > 0 ? formatCurrency(entry.debit) : '-'}</td>
                      <td style={{ padding: '10px 16px', color: '#8b5cf6', fontWeight: entry.credit > 0 ? 600 : 400 }}>{entry.credit > 0 ? formatCurrency(entry.credit) : '-'}</td>
                      <td style={{ padding: '10px 16px', fontWeight: 700, color: entry.balance >= 0 ? '#22c55e' : '#ef4444' }}>{formatCurrency(entry.balance)}</td>
                    </tr>
                  ))}
                  {ledgerWithBalance.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: 24 }}>لا توجد حركات لهذا الحساب</td></tr>
                  )}
                </tbody>
              </table>
            </>
          )}
          {!ledgerAccount && selectedAccountId === 0 && (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '60px 0', fontSize: 15 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📒</div>
              اختر حساباً لعرض حركاته
            </div>
          )}
        </Card>
      )}
    </AccountingLayout>
  );
}
