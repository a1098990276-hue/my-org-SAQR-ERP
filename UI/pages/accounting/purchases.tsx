import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Modal, Badge } from '../../components/AccountingLayout';
import { useAccounting, Invoice, InvoiceItem, formatCurrency } from '../../lib/useAccounting';

const emptyItem = (): InvoiceItem => ({ itemId: 0, name: '', unit: 'قطعة', quantity: 1, unitPrice: 0, total: 0 });
const statusLabels: Record<string, string> = { paid: 'مدفوعة', unpaid: 'غير مدفوعة', draft: 'مسودة', cancelled: 'ملغاة' };
const statusColors: Record<string, string> = { paid: '#22c55e', unpaid: '#f97316', draft: '#94a3b8', cancelled: '#ef4444' };

export default function PurchasesPage() {
  const { invoices, suppliers, items: products, addInvoice, updateInvoice, deleteInvoice } = useAccounting();
  const purchaseInvoices = invoices.filter(i => i.type === 'purchase');
  const [showModal, setShowModal] = useState(false);
  const [viewInv, setViewInv] = useState<Invoice | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    supplierId: '',
    taxRate: 15,
    discount: 0,
    notes: '',
    status: 'unpaid' as Invoice['status'],
    invoiceItems: [emptyItem()],
  });

  const filtered = purchaseInvoices.filter(i => {
    const matchSearch = i.number.includes(search) || (i.supplierName || '').includes(search);
    const matchStatus = filterStatus === 'all' || i.status === filterStatus;
    return matchSearch && matchStatus;
  }).sort((a, b) => b.id - a.id);

  const setInvItem = (idx: number, field: keyof InvoiceItem, value: string | number) => {
    setForm(f => {
      const invoiceItems = [...f.invoiceItems];
      invoiceItems[idx] = { ...invoiceItems[idx], [field]: value };
      if (field === 'itemId') {
        const prod = products.find(p => p.id === parseInt(value as string));
        if (prod) invoiceItems[idx] = { ...invoiceItems[idx], name: prod.name, unit: prod.unit, unitPrice: prod.costPrice };
      }
      if (['quantity', 'unitPrice', 'itemId'].includes(field as string)) {
        invoiceItems[idx].total = invoiceItems[idx].quantity * invoiceItems[idx].unitPrice;
      }
      return { ...f, invoiceItems };
    });
  };

  const subtotal = form.invoiceItems.reduce((s, i) => s + i.total, 0);
  const tax = (subtotal * form.taxRate) / 100;
  const total = subtotal + tax - form.discount;

  const handleSubmit = () => {
    const supplier = suppliers.find(s => s.id === parseInt(form.supplierId));
    addInvoice({
      number: `PO-${Date.now().toString().slice(-6)}`,
      type: 'purchase',
      date: form.date,
      dueDate: form.dueDate,
      supplierId: supplier?.id,
      supplierName: supplier?.name,
      items: form.invoiceItems.filter(i => i.name),
      subtotal, taxRate: form.taxRate, tax, discount: form.discount, total,
      status: form.status, notes: form.notes,
    });
    setShowModal(false);
    setForm({ date: new Date().toISOString().split('T')[0], dueDate: '', supplierId: '', taxRate: 15, discount: 0, notes: '', status: 'unpaid', invoiceItems: [emptyItem()] });
  };

  const totalPurchases = purchaseInvoices.reduce((s, i) => s + i.total, 0);
  const totalPaid = purchaseInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const totalUnpaid = purchaseInvoices.filter(i => i.status === 'unpaid').reduce((s, i) => s + i.total, 0);

  return (
    <AccountingLayout title="فواتير المشتريات">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'إجمالي المشتريات', value: formatCurrency(totalPurchases), color: '#3b82f6' },
          { label: 'المدفوع', value: formatCurrency(totalPaid), color: '#22c55e' },
          { label: 'غير المدفوع', value: formatCurrency(totalUnpaid), color: '#f97316' },
          { label: 'عدد الفواتير', value: purchaseInvoices.length.toString(), color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <Card>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button onClick={() => setShowModal(true)} variant="primary">➕ فاتورة شراء جديدة</Button>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث برقم الفاتورة أو اسم المورد..." style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', minWidth: 250, outline: 'none' }} />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}>
            <option value="all">جميع الحالات</option>
            {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['رقم الفاتورة', 'التاريخ', 'المورد', 'المجموع', 'الضريبة', 'الإجمالي', 'الحالة', 'إجراءات'].map(h => (
                <th key={h} style={{ textAlign: 'right', padding: '12px 14px', color: '#64748b', fontWeight: 600, borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1e293b' }}>{inv.number}</td>
                <td style={{ padding: '10px 14px', color: '#374151' }}>{inv.date}</td>
                <td style={{ padding: '10px 14px', color: '#374151' }}>{inv.supplierName || '-'}</td>
                <td style={{ padding: '10px 14px' }}>{formatCurrency(inv.subtotal)}</td>
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
        {filtered.length === 0 && <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>لا توجد فواتير مشتريات</div>}
      </Card>

      {/* Create Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="إنشاء فاتورة مشتريات" width={900}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>التاريخ <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>تاريخ الاستحقاق</label>
            <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>المورد</label>
            <select value={form.supplierId} onChange={e => setForm(f => ({ ...f, supplierId: e.target.value }))} style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}>
              <option value="">-- اختر المورد --</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>الحالة</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Invoice['status'] }))} style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}>
              {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <h4 style={{ margin: 0 }}>الأصناف</h4>
            <Button size="sm" variant="secondary" onClick={() => setForm(f => ({ ...f, invoiceItems: [...f.invoiceItems, emptyItem()] }))}>➕</Button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['الصنف', 'الوحدة', 'الكمية', 'سعر التكلفة', 'الإجمالي', ''].map(h => (
                  <th key={h} style={{ textAlign: 'right', padding: '8px 10px', color: '#64748b', fontWeight: 600, borderBottom: '2px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {form.invoiceItems.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '6px' }}>
                    <select value={item.itemId || ''} onChange={e => setInvItem(idx, 'itemId', parseInt(e.target.value))} style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 8px', fontSize: 13, fontFamily: 'inherit', width: '100%', outline: 'none' }}>
                      <option value="">-- اختر الصنف --</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '6px' }}><input value={item.unit} onChange={e => setInvItem(idx, 'unit', e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 8px', fontSize: 13, fontFamily: 'inherit', width: 70, outline: 'none' }} /></td>
                  <td style={{ padding: '6px' }}><input type="number" value={item.quantity} onChange={e => setInvItem(idx, 'quantity', parseFloat(e.target.value) || 0)} style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 8px', fontSize: 13, fontFamily: 'inherit', width: 70, outline: 'none' }} /></td>
                  <td style={{ padding: '6px' }}><input type="number" value={item.unitPrice} onChange={e => setInvItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)} style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 8px', fontSize: 13, fontFamily: 'inherit', width: 100, outline: 'none' }} /></td>
                  <td style={{ padding: '6px 10px', fontWeight: 600, color: '#22c55e' }}>{formatCurrency(item.total)}</td>
                  <td><button onClick={() => setForm(f => ({ ...f, invoiceItems: f.invoiceItems.filter((_, i) => i !== idx) }))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 18 }}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <div style={{ minWidth: 250 }}>
            {[
              { label: 'المجموع الفرعي', value: subtotal },
              { label: `ضريبة القيمة المضافة (${form.taxRate}%)`, value: tax },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>{r.label}</span>
                <span>{formatCurrency(r.value)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 16, fontWeight: 700, color: '#1e293b', borderTop: '2px solid #e2e8f0', marginTop: 4 }}>
              <span>الإجمالي النهائي</span>
              <span style={{ color: '#3b82f6' }}>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>إلغاء</Button>
          <Button variant="primary" onClick={handleSubmit}>💾 حفظ الفاتورة</Button>
        </div>
      </Modal>

      {/* View Modal */}
      {viewInv && (
        <Modal isOpen={!!viewInv} onClose={() => setViewInv(null)} title={`فاتورة مشتريات: ${viewInv.number}`} width={700}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16, fontSize: 14 }}>
            <div><span style={{ color: '#64748b' }}>المورد: </span><strong>{viewInv.supplierName || '-'}</strong></div>
            <div><span style={{ color: '#64748b' }}>التاريخ: </span><strong>{viewInv.date}</strong></div>
            <div><span style={{ color: '#64748b' }}>الحالة: </span><Badge label={statusLabels[viewInv.status]} color={statusColors[viewInv.status]} /></div>
            <div><span style={{ color: '#64748b' }}>الإجمالي: </span><strong style={{ color: '#3b82f6' }}>{formatCurrency(viewInv.total)}</strong></div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead><tr style={{ background: '#f8fafc' }}>{['الصنف', 'الكمية', 'سعر التكلفة', 'الإجمالي'].map(h => <th key={h} style={{ textAlign: 'right', padding: '10px 12px', color: '#64748b', fontWeight: 600, borderBottom: '2px solid #e2e8f0' }}>{h}</th>)}</tr></thead>
            <tbody>
              {viewInv.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px' }}>{item.name}</td>
                  <td style={{ padding: '8px 12px' }}>{item.quantity} {item.unit}</td>
                  <td style={{ padding: '8px 12px' }}>{formatCurrency(item.unitPrice)}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 600 }}>{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: 'left', marginTop: 12, fontSize: 15, fontWeight: 700 }}>الإجمالي: <span style={{ color: '#3b82f6' }}>{formatCurrency(viewInv.total)}</span></div>
        </Modal>
      )}
    </AccountingLayout>
  );
}
