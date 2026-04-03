import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Select, Modal, Badge } from '../../components/AccountingLayout';
import { useAccounting, Invoice, InvoiceItem, formatCurrency } from '../../lib/useAccounting';

const emptyItem = (): InvoiceItem => ({ itemId: 0, name: '', unit: 'قطعة', quantity: 1, unitPrice: 0, total: 0 });

const statusLabels: Record<string, string> = { paid: 'مدفوعة', unpaid: 'غير مدفوعة', draft: 'مسودة', cancelled: 'ملغاة' };
const statusColors: Record<string, string> = { paid: '#22c55e', unpaid: '#f97316', draft: '#94a3b8', cancelled: '#ef4444' };

export default function InvoicesPage() {
  const { invoices, customers, items: products, addInvoice, updateInvoice, deleteInvoice } = useAccounting();
  const salesInvoices = invoices.filter(i => i.type === 'sales');
  const [showModal, setShowModal] = useState(false);
  const [viewInv, setViewInv] = useState<Invoice | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    customerId: '',
    taxRate: 15,
    discount: 0,
    notes: '',
    status: 'unpaid' as Invoice['status'],
    invoiceItems: [emptyItem()],
  });

  const filtered = salesInvoices.filter(i => {
    const matchSearch = i.number.includes(search) || (i.customerName || '').includes(search);
    const matchStatus = filterStatus === 'all' || i.status === filterStatus;
    return matchSearch && matchStatus;
  }).sort((a, b) => b.id - a.id);

  const setInvItem = (idx: number, field: keyof InvoiceItem, value: string | number) => {
    setForm(f => {
      const invoiceItems = [...f.invoiceItems];
      invoiceItems[idx] = { ...invoiceItems[idx], [field]: value };
      if (field === 'itemId') {
        const prod = products.find(p => p.id === parseInt(value as string));
        if (prod) invoiceItems[idx] = { ...invoiceItems[idx], name: prod.name, unit: prod.unit, unitPrice: prod.salePrice };
      }
      if (field === 'quantity' || field === 'unitPrice' || field === 'itemId') {
        invoiceItems[idx].total = invoiceItems[idx].quantity * invoiceItems[idx].unitPrice;
      }
      return { ...f, invoiceItems };
    });
  };

  const subtotal = form.invoiceItems.reduce((s, i) => s + i.total, 0);
  const tax = (subtotal * form.taxRate) / 100;
  const total = subtotal + tax - form.discount;

  const handleSubmit = () => {
    const customer = customers.find(c => c.id === parseInt(form.customerId));
    const inv: Omit<Invoice, 'id' | 'createdAt'> = {
      number: `INV-${Date.now().toString().slice(-6)}`,
      type: 'sales',
      date: form.date,
      dueDate: form.dueDate,
      customerId: customer?.id,
      customerName: customer?.name,
      items: form.invoiceItems.filter(i => i.name),
      subtotal,
      taxRate: form.taxRate,
      tax,
      discount: form.discount,
      total,
      status: form.status,
      notes: form.notes,
    };
    addInvoice(inv);
    setShowModal(false);
    setForm({ date: new Date().toISOString().split('T')[0], dueDate: '', customerId: '', taxRate: 15, discount: 0, notes: '', status: 'unpaid', invoiceItems: [emptyItem()] });
  };

  const totalRevenue = salesInvoices.reduce((s, i) => s + i.total, 0);
  const totalPaid = salesInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const totalUnpaid = salesInvoices.filter(i => i.status === 'unpaid').reduce((s, i) => s + i.total, 0);

  return (
    <AccountingLayout title="فواتير المبيعات">
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'إجمالي الفواتير', value: formatCurrency(totalRevenue), color: '#3b82f6' },
          { label: 'المدفوع', value: formatCurrency(totalPaid), color: '#22c55e' },
          { label: 'غير المدفوع', value: formatCurrency(totalUnpaid), color: '#f97316' },
          { label: 'عدد الفواتير', value: salesInvoices.length.toString(), color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <Card>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button onClick={() => setShowModal(true)} variant="primary">➕ فاتورة جديدة</Button>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث برقم الفاتورة أو اسم العميل..." style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', minWidth: 250, outline: 'none' }} />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}>
            <option value="all">جميع الحالات</option>
            {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <span style={{ marginRight: 'auto', color: '#64748b', fontSize: 13 }}>{filtered.length} فاتورة</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['رقم الفاتورة', 'التاريخ', 'تاريخ الاستحقاق', 'العميل', 'المجموع', 'الضريبة', 'الإجمالي', 'الحالة', 'إجراءات'].map(h => (
                <th key={h} style={{ textAlign: 'right', padding: '12px 14px', color: '#64748b', fontWeight: 600, borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1e293b' }}>{inv.number}</td>
                <td style={{ padding: '10px 14px', color: '#374151' }}>{inv.date}</td>
                <td style={{ padding: '10px 14px', color: inv.dueDate && new Date(inv.dueDate) < new Date() && inv.status === 'unpaid' ? '#ef4444' : '#374151' }}>{inv.dueDate || '-'}</td>
                <td style={{ padding: '10px 14px', color: '#374151' }}>{inv.customerName || '-'}</td>
                <td style={{ padding: '10px 14px', color: '#374151' }}>{formatCurrency(inv.subtotal)}</td>
                <td style={{ padding: '10px 14px', color: '#64748b' }}>{formatCurrency(inv.tax)}</td>
                <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1e293b' }}>{formatCurrency(inv.total)}</td>
                <td style={{ padding: '10px 14px' }}><Badge label={statusLabels[inv.status]} color={statusColors[inv.status]} /></td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Button size="sm" variant="secondary" onClick={() => setViewInv(inv)}>عرض</Button>
                    {inv.status === 'unpaid' && <Button size="sm" variant="success" onClick={() => updateInvoice(inv.id, { status: 'paid' })}>✓ مدفوعة</Button>}
                    <Button size="sm" variant="danger" onClick={() => { if (confirm('حذف الفاتورة؟')) deleteInvoice(inv.id); }}>حذف</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>لا توجد فواتير</div>}
      </Card>

      {/* Create Invoice Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="إنشاء فاتورة مبيعات" width={900}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
          <Input label="تاريخ الفاتورة" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} type="date" required />
          <Input label="تاريخ الاستحقاق" value={form.dueDate} onChange={v => setForm(f => ({ ...f, dueDate: v }))} type="date" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>العميل</label>
            <select value={form.customerId} onChange={e => setForm(f => ({ ...f, customerId: e.target.value }))} style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}>
              <option value="">-- اختر العميل --</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>الحالة</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Invoice['status'] }))} style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}>
              {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>

        {/* Items */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <h4 style={{ margin: 0 }}>بنود الفاتورة</h4>
            <Button size="sm" variant="secondary" onClick={() => setForm(f => ({ ...f, invoiceItems: [...f.invoiceItems, emptyItem()] }))}>➕ صنف</Button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['الصنف', 'الوحدة', 'الكمية', 'سعر الوحدة', 'الإجمالي', ''].map(h => (
                  <th key={h} style={{ textAlign: 'right', padding: '8px 10px', color: '#64748b', fontWeight: 600, borderBottom: '2px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {form.invoiceItems.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '6px 6px' }}>
                    <select value={item.itemId || ''} onChange={e => setInvItem(idx, 'itemId', parseInt(e.target.value))} style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 8px', fontSize: 13, fontFamily: 'inherit', width: '100%', outline: 'none' }}>
                      <option value="">-- اختر الصنف --</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.code} - {p.name}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '6px 6px' }}>
                    <input value={item.unit} onChange={e => setInvItem(idx, 'unit', e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 8px', fontSize: 13, fontFamily: 'inherit', width: 80, outline: 'none' }} />
                  </td>
                  <td style={{ padding: '6px 6px' }}>
                    <input type="number" value={item.quantity} onChange={e => setInvItem(idx, 'quantity', parseFloat(e.target.value) || 0)} style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 8px', fontSize: 13, fontFamily: 'inherit', width: 80, outline: 'none' }} />
                  </td>
                  <td style={{ padding: '6px 6px' }}>
                    <input type="number" value={item.unitPrice} onChange={e => setInvItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)} style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 8px', fontSize: 13, fontFamily: 'inherit', width: 100, outline: 'none' }} />
                  </td>
                  <td style={{ padding: '6px 10px', fontWeight: 600, color: '#22c55e' }}>{formatCurrency(item.total)}</td>
                  <td><button onClick={() => setForm(f => ({ ...f, invoiceItems: f.invoiceItems.filter((_, i) => i !== idx) }))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 18 }}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <div style={{ minWidth: 280 }}>
            {[
              { label: 'المجموع الفرعي', value: subtotal, color: '#374151' },
              { label: `ضريبة القيمة المضافة (${form.taxRate}%)`, value: tax, color: '#64748b' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14, borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>{r.label}</span>
                <span style={{ fontWeight: 600, color: r.color }}>{formatCurrency(r.value)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 16, fontWeight: 700, color: '#1e293b', borderTop: '2px solid #e2e8f0', marginTop: 4 }}>
              <span>الإجمالي النهائي</span>
              <span style={{ color: '#3b82f6' }}>{formatCurrency(total)}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>الخصم:</span>
              <input type="number" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: parseFloat(e.target.value) || 0 }))} style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '4px 8px', fontSize: 13, width: 100, fontFamily: 'inherit', outline: 'none' }} />
            </div>
          </div>
        </div>

        <Input label="ملاحظات" value={form.notes} onChange={v => setForm(f => ({ ...f, notes: v }))} placeholder="ملاحظات اختيارية" />

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>إلغاء</Button>
          <Button variant="primary" onClick={handleSubmit}>💾 حفظ الفاتورة</Button>
        </div>
      </Modal>

      {/* View Invoice */}
      {viewInv && (
        <Modal isOpen={!!viewInv} onClose={() => setViewInv(null)} title={`فاتورة رقم: ${viewInv.number}`} width={750}>
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#1e293b' }}>🦅 نظام صقر للمحاسبة</div>
                <div style={{ color: '#64748b', fontSize: 13 }}>فاتورة مبيعات</div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: 20, color: '#3b82f6' }}>{viewInv.number}</div>
                <Badge label={statusLabels[viewInv.status]} color={statusColors[viewInv.status]} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
              <div><span style={{ color: '#64748b' }}>العميل: </span><strong>{viewInv.customerName || '-'}</strong></div>
              <div><span style={{ color: '#64748b' }}>التاريخ: </span><strong>{viewInv.date}</strong></div>
              <div><span style={{ color: '#64748b' }}>تاريخ الاستحقاق: </span><strong>{viewInv.dueDate || '-'}</strong></div>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, marginBottom: 16 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['الصنف', 'الوحدة', 'الكمية', 'سعر الوحدة', 'الإجمالي'].map(h => (
                  <th key={h} style={{ textAlign: 'right', padding: '10px 12px', color: '#64748b', fontWeight: 600, borderBottom: '2px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {viewInv.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px' }}>{item.name}</td>
                  <td style={{ padding: '8px 12px', color: '#64748b' }}>{item.unit}</td>
                  <td style={{ padding: '8px 12px' }}>{item.quantity}</td>
                  <td style={{ padding: '8px 12px' }}>{formatCurrency(item.unitPrice)}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 600 }}>{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ minWidth: 250 }}>
              {[
                { label: 'المجموع الفرعي', value: formatCurrency(viewInv.subtotal) },
                { label: `ضريبة (${viewInv.taxRate}%)`, value: formatCurrency(viewInv.tax) },
                { label: 'الخصم', value: `-${formatCurrency(viewInv.discount)}` },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b' }}>{r.label}</span>
                  <span>{r.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 16, fontWeight: 700, color: '#3b82f6' }}>
                <span>الإجمالي</span>
                <span>{formatCurrency(viewInv.total)}</span>
              </div>
            </div>
          </div>
          {viewInv.notes && <div style={{ marginTop: 12, fontSize: 13, color: '#64748b' }}>ملاحظات: {viewInv.notes}</div>}
        </Modal>
      )}
    </AccountingLayout>
  );
}
