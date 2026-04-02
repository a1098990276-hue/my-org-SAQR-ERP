import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Modal } from '../../components/AccountingLayout';
import { useAccounting, Customer, formatCurrency } from '../../lib/useAccounting';

const emptyForm = (): Omit<Customer, 'id' | 'createdAt'> => ({
  code: '', name: '', phone: '', email: '', address: '', taxNumber: '', balance: 0,
});

export default function CustomersPage() {
  const { customers, invoices, addCustomer, updateCustomer, deleteCustomer } = useAccounting();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [search, setSearch] = useState('');
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);

  const filtered = customers.filter(c =>
    c.name.includes(search) || c.code.includes(search) || c.phone.includes(search)
  );

  const openAdd = () => { setEditing(null); setForm(emptyForm()); setShowModal(true); };
  const openEdit = (c: Customer) => { setEditing(c); setForm({ code: c.code, name: c.name, phone: c.phone, email: c.email, address: c.address, taxNumber: c.taxNumber, balance: c.balance }); setShowModal(true); };

  const handleSubmit = () => {
    if (!form.name) return;
    if (editing) updateCustomer(editing.id, form);
    else addCustomer(form);
    setShowModal(false);
  };

  const totalBalance = customers.reduce((s, c) => s + c.balance, 0);

  const getCustomerInvoices = (id: number) => invoices.filter(i => i.customerId === id && i.type === 'sales');

  return (
    <AccountingLayout title="إدارة العملاء">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'إجمالي العملاء', value: customers.length.toString(), color: '#3b82f6', icon: '👥' },
          { label: 'إجمالي الذمم المدينة', value: formatCurrency(totalBalance), color: '#f97316', icon: '💰' },
          { label: 'متوسط رصيد العميل', value: formatCurrency(customers.length ? totalBalance / customers.length : 0), color: '#8b5cf6', icon: '📊' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 50, height: 50, borderRadius: 10, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <Card>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <Button onClick={openAdd} variant="primary">➕ عميل جديد</Button>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو الرمز أو الهاتف..." style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', minWidth: 280, outline: 'none' }} />
          <span style={{ marginRight: 'auto', color: '#64748b', fontSize: 13 }}>{filtered.length} عميل</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['رمز', 'الاسم', 'الهاتف', 'البريد الإلكتروني', 'العنوان', 'الرقم الضريبي', 'الرصيد', 'الفواتير', 'إجراءات'].map(h => (
                <th key={h} style={{ textAlign: 'right', padding: '12px 14px', color: '#64748b', fontWeight: 600, borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const custInvoices = getCustomerInvoices(c.id);
              const totalSales = custInvoices.reduce((s, i) => s + i.total, 0);
              return (
                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#64748b', fontWeight: 600 }}>{c.code}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>{c.name}</td>
                  <td style={{ padding: '10px 14px', color: '#374151' }}>{c.phone || '-'}</td>
                  <td style={{ padding: '10px 14px', color: '#374151' }}>{c.email || '-'}</td>
                  <td style={{ padding: '10px 14px', color: '#374151', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.address || '-'}</td>
                  <td style={{ padding: '10px 14px', color: '#64748b', fontFamily: 'monospace', fontSize: 12 }}>{c.taxNumber || '-'}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: c.balance > 0 ? '#f97316' : '#22c55e' }}>{formatCurrency(c.balance)}</td>
                  <td style={{ padding: '10px 14px', color: '#64748b' }}>
                    <span style={{ fontSize: 12 }}>{custInvoices.length} فاتورة</span>
                    <br />
                    <span style={{ fontSize: 11, color: '#22c55e' }}>{formatCurrency(totalSales)}</span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Button size="sm" variant="secondary" onClick={() => openEdit(c)}>تعديل</Button>
                      <Button size="sm" variant="ghost" onClick={() => setViewCustomer(c)}>كشف</Button>
                      <Button size="sm" variant="danger" onClick={() => { if (confirm('حذف العميل؟')) deleteCustomer(c.id); }}>حذف</Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>لا يوجد عملاء</div>}
      </Card>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Input label="رمز العميل" value={form.code} onChange={v => setForm(f => ({ ...f, code: v }))} placeholder="C001" />
          <Input label="اسم العميل" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
          <Input label="رقم الهاتف" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="05xxxxxxxx" />
          <Input label="البريد الإلكتروني" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} type="email" />
          <Input label="العنوان" value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} />
          <Input label="الرقم الضريبي" value={form.taxNumber} onChange={v => setForm(f => ({ ...f, taxNumber: v }))} />
          <Input label="الرصيد الافتتاحي" value={form.balance} onChange={v => setForm(f => ({ ...f, balance: parseFloat(v) || 0 }))} type="number" />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>إلغاء</Button>
          <Button variant="primary" onClick={handleSubmit}>💾 حفظ</Button>
        </div>
      </Modal>

      {/* Customer Statement Modal */}
      {viewCustomer && (
        <Modal isOpen={!!viewCustomer} onClose={() => setViewCustomer(null)} title={`كشف حساب: ${viewCustomer.name}`} width={700}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20, background: '#f8fafc', borderRadius: 10, padding: 16, fontSize: 14 }}>
            <div><span style={{ color: '#64748b' }}>الرمز: </span><strong>{viewCustomer.code}</strong></div>
            <div><span style={{ color: '#64748b' }}>الهاتف: </span><strong>{viewCustomer.phone || '-'}</strong></div>
            <div><span style={{ color: '#64748b' }}>البريد: </span><strong>{viewCustomer.email || '-'}</strong></div>
            <div><span style={{ color: '#64748b' }}>الرصيد: </span><strong style={{ color: '#f97316' }}>{formatCurrency(viewCustomer.balance)}</strong></div>
          </div>
          {(() => {
            const custInvoices = getCustomerInvoices(viewCustomer.id);
            return (
              <>
                <h4 style={{ margin: '0 0 12px', color: '#374151' }}>الفواتير ({custInvoices.length})</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['رقم الفاتورة', 'التاريخ', 'الإجمالي', 'الحالة'].map(h => (
                        <th key={h} style={{ textAlign: 'right', padding: '10px 12px', color: '#64748b', fontWeight: 600, borderBottom: '2px solid #e2e8f0' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {custInvoices.map(inv => (
                      <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 700 }}>{inv.number}</td>
                        <td style={{ padding: '8px 12px' }}>{inv.date}</td>
                        <td style={{ padding: '8px 12px', fontWeight: 700, color: '#3b82f6' }}>{formatCurrency(inv.total)}</td>
                        <td style={{ padding: '8px 12px' }}>
                          <span style={{ background: `${inv.status === 'paid' ? '#22c55e' : '#f97316'}20`, color: inv.status === 'paid' ? '#22c55e' : '#f97316', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>
                            {inv.status === 'paid' ? 'مدفوعة' : 'غير مدفوعة'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ fontWeight: 700, background: '#f8fafc' }}>
                      <td colSpan={2} style={{ padding: '10px 12px' }}>الإجمالي</td>
                      <td style={{ padding: '10px 12px', color: '#3b82f6' }}>{formatCurrency(custInvoices.reduce((s, i) => s + i.total, 0))}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </>
            );
          })()}
        </Modal>
      )}
    </AccountingLayout>
  );
}
