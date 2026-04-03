import React from 'react';
import AccountingLayout, { Card, StatCard } from '../../components/AccountingLayout';
import { useAccounting, formatCurrency } from '../../lib/useAccounting';
import Link from 'next/link';

export default function AccountingDashboard() {
  const { invoices, customers, suppliers, items, journalEntries, accounts } = useAccounting();

  const salesInvoices = invoices.filter(i => i.type === 'sales');
  const purchaseInvoices = invoices.filter(i => i.type === 'purchase');

  const totalRevenue = salesInvoices.reduce((s, i) => s + i.total, 0);
  const totalPurchases = purchaseInvoices.reduce((s, i) => s + i.total, 0);
  const unpaidInvoices = salesInvoices.filter(i => i.status === 'unpaid');
  const totalReceivable = unpaidInvoices.reduce((s, i) => s + i.total, 0);

  const revenueAcc = accounts.filter(a => a.type === 'revenue' && a.parentId !== undefined);
  const expenseAcc = accounts.filter(a => a.type === 'expense' && a.parentId !== undefined);
  const totalRevenueBalance = revenueAcc.reduce((s, a) => s + a.balance, 0);
  const totalExpenseBalance = expenseAcc.reduce((s, a) => s + a.balance, 0);
  const netProfit = totalRevenueBalance - totalExpenseBalance;

  const lowStockItems = items.filter(i => i.quantity <= i.minQuantity);

  const recentInvoices = [...invoices].sort((a, b) => b.id - a.id).slice(0, 5);

  const stats = [
    { label: 'إجمالي الإيرادات', value: formatCurrency(totalRevenueBalance), icon: '💰', color: '#22c55e' },
    { label: 'إجمالي المصروفات', value: formatCurrency(totalExpenseBalance), icon: '📉', color: '#ef4444' },
    { label: 'صافي الربح', value: formatCurrency(netProfit), icon: '📊', color: netProfit >= 0 ? '#3b82f6' : '#ef4444' },
    { label: 'ذمم مدينة', value: formatCurrency(totalReceivable), icon: '🧾', color: '#f97316' },
    { label: 'عدد العملاء', value: customers.length.toString(), icon: '👥', color: '#8b5cf6' },
    { label: 'عدد الموردين', value: suppliers.length.toString(), icon: '🏭', color: '#06b6d4' },
    { label: 'عدد الأصناف', value: items.length.toString(), icon: '📦', color: '#84cc16' },
    { label: 'قيود يومية', value: journalEntries.length.toString(), icon: '📝', color: '#64748b' },
  ];

  const statusLabel: Record<string, string> = { paid: 'مدفوعة', unpaid: 'غير مدفوعة', draft: 'مسودة', cancelled: 'ملغاة' };
  const statusColor: Record<string, string> = { paid: '#22c55e', unpaid: '#f97316', draft: '#94a3b8', cancelled: '#ef4444' };

  const quickLinks = [
    { href: '/accounting/invoices', label: 'فاتورة بيع جديدة', icon: '➕🧾', color: '#3b82f6' },
    { href: '/accounting/purchases', label: 'فاتورة شراء جديدة', icon: '➕🛒', color: '#22c55e' },
    { href: '/accounting/journal', label: 'قيد يومي جديد', icon: '➕📝', color: '#8b5cf6' },
    { href: '/accounting/customers', label: 'إضافة عميل', icon: '➕👤', color: '#f97316' },
    { href: '/accounting/reports', label: 'عرض التقارير', icon: '📈', color: '#06b6d4' },
    { href: '/accounting/accounts', label: 'دليل الحسابات', icon: '📋', color: '#84cc16' },
  ];

  return (
    <AccountingLayout title="لوحة تحكم المحاسبة">
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        {stats.map(s => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Recent Invoices */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1e293b' }}>آخر الفواتير</h3>
            <Link href="/accounting/invoices" style={{ fontSize: 13, color: '#3b82f6', textDecoration: 'none' }}>عرض الكل</Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                <th style={{ textAlign: 'right', padding: '6px 0', color: '#64748b', fontWeight: 600 }}>رقم</th>
                <th style={{ textAlign: 'right', padding: '6px 0', color: '#64748b', fontWeight: 600 }}>العميل/المورد</th>
                <th style={{ textAlign: 'right', padding: '6px 0', color: '#64748b', fontWeight: 600 }}>المبلغ</th>
                <th style={{ textAlign: 'right', padding: '6px 0', color: '#64748b', fontWeight: 600 }}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map(inv => (
                <tr key={inv.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '8px 0', color: '#1e293b', fontWeight: 600 }}>{inv.number}</td>
                  <td style={{ padding: '8px 0', color: '#374151' }}>{inv.customerName || inv.supplierName || '-'}</td>
                  <td style={{ padding: '8px 0', color: '#1e293b', fontWeight: 600 }}>{formatCurrency(inv.total)}</td>
                  <td style={{ padding: '8px 0' }}>
                    <span style={{ background: `${statusColor[inv.status]}20`, color: statusColor[inv.status], borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>
                      {statusLabel[inv.status]}
                    </span>
                  </td>
                </tr>
              ))}
              {recentInvoices.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: 16 }}>لا توجد فواتير</td></tr>
              )}
            </tbody>
          </table>
        </Card>

        {/* Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card style={{ padding: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>وصول سريع</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {quickLinks.map(link => (
                <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '14px 12px',
                    borderRadius: 10,
                    background: `${link.color}10`,
                    border: `1px solid ${link.color}25`,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    color: link.color,
                    fontWeight: 600,
                    fontSize: 13,
                  }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{link.icon}</div>
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Low Stock Alert */}
          {lowStockItems.length > 0 && (
            <Card style={{ padding: 20, background: '#fff7ed', border: '1px solid #fed7aa' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: '#c2410c' }}>⚠️ تنبيه: مخزون منخفض</h3>
              {lowStockItems.slice(0, 3).map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #fed7aa', fontSize: 13 }}>
                  <span style={{ color: '#374151' }}>{item.name}</span>
                  <span style={{ color: '#c2410c', fontWeight: 700 }}>المتاح: {item.quantity}</span>
                </div>
              ))}
              <Link href="/accounting/items" style={{ fontSize: 13, color: '#ea580c', display: 'block', marginTop: 8, textDecoration: 'none' }}>عرض كل المخزون ←</Link>
            </Card>
          )}
        </div>
      </div>

      {/* P&L Summary */}
      <Card>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>ملخص الأداء المالي</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'إجمالي الإيرادات', value: totalRevenueBalance, color: '#22c55e', bg: '#dcfce7' },
            { label: 'إجمالي المصروفات', value: totalExpenseBalance, color: '#ef4444', bg: '#fee2e2' },
            { label: 'صافي الربح / الخسارة', value: netProfit, color: netProfit >= 0 ? '#3b82f6' : '#ef4444', bg: netProfit >= 0 ? '#dbeafe' : '#fee2e2' },
          ].map(item => (
            <div key={item.label} style={{ background: item.bg, borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: '#475569', marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{formatCurrency(item.value)}</div>
            </div>
          ))}
        </div>
      </Card>
    </AccountingLayout>
  );
}
