import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Modal, Badge, Select } from '../../../components/AccountingLayout';

interface SalesInvoice {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceType: string;
  customerName: string;
  customerPhone: string;
  warehouse: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  paymentStatus: string;
  status: string;
}

const mockInvoices: SalesInvoice[] = [
  { id: 1, invoiceNumber: 'INV-2024-001', invoiceDate: '2024-01-15', invoiceType: 'مبيعات', customerName: 'شركة الفجر التجارية', customerPhone: '0501234567', warehouse: 'المخزن الرئيسي', subtotal: 10000, discount: 500, tax: 1425, total: 10925, paidAmount: 10925, paymentStatus: 'مدفوع', status: 'مكتمل' },
  { id: 2, invoiceNumber: 'INV-2024-002', invoiceDate: '2024-01-16', invoiceType: 'مبيعات', customerName: 'مطاعم الضيافة', customerPhone: '0509876543', warehouse: 'المخزن الرئيسي', subtotal: 5500, discount: 0, tax: 825, total: 6325, paidAmount: 3000, paymentStatus: 'جزئي', status: 'مكتمل' },
  { id: 3, invoiceNumber: 'INV-2024-003', invoiceDate: '2024-01-17', invoiceType: 'كاشير', customerName: 'عميل نقدي', customerPhone: '', warehouse: 'نقطة البيع 1', subtotal: 850, discount: 0, tax: 127.5, total: 977.5, paidAmount: 977.5, paymentStatus: 'مدفوع', status: 'مكتمل' },
  { id: 4, invoiceNumber: 'INV-2024-004', invoiceDate: '2024-01-18', invoiceType: 'مبيعات', customerName: 'مؤسسة البناء الحديث', customerPhone: '0551234567', warehouse: 'المخزن الرئيسي', subtotal: 25000, discount: 1250, tax: 3562.5, total: 27312.5, paidAmount: 0, paymentStatus: 'غير مدفوع', status: 'معلق' },
];

interface InvoiceItem {
  id: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

export default function SalesPage() {
  const [invoices, setInvoices] = useState<SalesInvoice[]>(mockInvoices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [formData, setFormData] = useState<Partial<SalesInvoice>>({});
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { id: 1, itemName: '', quantity: 1, unitPrice: 0, discount: 0, tax: 15, total: 0 }
  ]);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.includes(searchTerm) || inv.customerName.includes(searchTerm);
    const matchesFilter = filter === 'all' || inv.paymentStatus === filter;
    return matchesSearch && matchesFilter;
  });

  const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalDue = totalSales - totalPaid;

  const addItem = () => {
    setInvoiceItems([...invoiceItems, { id: invoiceItems.length + 1, itemName: '', quantity: 1, unitPrice: 0, discount: 0, tax: 15, total: 0 }]);
  };

  const removeItem = (id: number) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: any) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        const subtotal = updated.quantity * updated.unitPrice;
        const discountAmount = updated.discount;
        const taxAmount = (subtotal - discountAmount) * (updated.tax / 100);
        updated.total = subtotal - discountAmount + taxAmount;
        return updated;
      }
      return item;
    }));
  };

  const calculateTotals = () => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const discount = invoiceItems.reduce((sum, item) => sum + item.discount, 0);
    const tax = invoiceItems.reduce((sum, item) => sum + ((item.quantity * item.unitPrice - item.discount) * item.tax / 100), 0);
    const total = subtotal - discount + tax;
    return { subtotal, discount, tax, total };
  };

  const handleSave = () => {
    const totals = calculateTotals();
    const newInvoice: SalesInvoice = {
      id: invoices.length + 1,
      invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      invoiceDate: formData.invoiceDate || new Date().toISOString().split('T')[0],
      invoiceType: formData.invoiceType || 'مبيعات',
      customerName: formData.customerName || 'عميل نقدي',
      customerPhone: formData.customerPhone || '',
      warehouse: formData.warehouse || 'المخزن الرئيسي',
      subtotal: totals.subtotal,
      discount: totals.discount,
      tax: totals.tax,
      total: totals.total,
      paidAmount: 0,
      paymentStatus: 'غير مدفوع',
      status: 'مسودة',
    };
    setInvoices([...invoices, newInvoice]);
    setIsModalOpen(false);
    setFormData({});
    setInvoiceItems([{ id: 1, itemName: '', quantity: 1, unitPrice: 0, discount: 0, tax: 15, total: 0 }]);
  };

  return (
    <AccountingLayout title="المبيعات">
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🧾</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>إجمالي المبيعات</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{totalSales.toLocaleString()} ر.س</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>✅</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>المبالغ المحصلة</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>{totalPaid.toLocaleString()} ر.س</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>⏳</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>المبالغ المستحقة</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#dc2626' }}>{totalDue.toLocaleString()} ر.س</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📊</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>عدد الفواتير</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{invoices.length}</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <Input
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="بحث برقم الفاتورة أو اسم العميل..."
              style={{ width: 300 }}
            />
            <div style={{ display: 'flex', gap: 4 }}>
              <Button variant={filter === 'all' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('all')}>الكل</Button>
              <Button variant={filter === 'مدفوع' ? 'success' : 'secondary'} size="sm" onClick={() => setFilter('مدفوع')}>مدفوع</Button>
              <Button variant={filter === 'جزئي' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('جزئي')}>جزئي</Button>
              <Button variant={filter === 'غير مدفوع' ? 'danger' : 'secondary'} size="sm" onClick={() => setFilter('غير مدفوع')}>غير مدفوع</Button>
            </div>
          </div>
          <Button onClick={() => { setFormData({}); setIsModalOpen(true); }}>+ فاتورة مبيعات جديدة</Button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>رقم الفاتورة</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>التاريخ</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>النوع</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>العميل</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الإجمالي</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>المدفوع</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>المستحق</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الحالة</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(invoice => (
              <tr key={invoice.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 16px', color: '#3b82f6', fontWeight: 600 }}>{invoice.invoiceNumber}</td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{invoice.invoiceDate}</td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge label={invoice.invoiceType} color="#6366f1" />
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>{invoice.customerName}</div>
                  {invoice.customerPhone && <div style={{ fontSize: 12, color: '#64748b' }}>{invoice.customerPhone}</div>}
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{invoice.total.toLocaleString()} ر.س</td>
                <td style={{ padding: '12px 16px', color: '#059669' }}>{invoice.paidAmount.toLocaleString()} ر.س</td>
                <td style={{ padding: '12px 16px', color: '#dc2626', fontWeight: invoice.total - invoice.paidAmount > 0 ? 600 : 400 }}>
                  {(invoice.total - invoice.paidAmount).toLocaleString()} ر.س
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge 
                    label={invoice.paymentStatus} 
                    color={invoice.paymentStatus === 'مدفوع' ? '#22c55e' : invoice.paymentStatus === 'جزئي' ? '#f59e0b' : '#ef4444'} 
                  />
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <Button variant="ghost" size="sm">👁️</Button>
                  <Button variant="ghost" size="sm">✏️</Button>
                  <Button variant="ghost" size="sm">🖨️</Button>
                  <Button variant="ghost" size="sm" onClick={() => setInvoices(invoices.filter(i => i.id !== invoice.id))}>🗑️</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="فاتورة مبيعات جديدة" width={900}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
          <Input label="التاريخ" value={formData.invoiceDate || new Date().toISOString().split('T')[0]} onChange={v => setFormData({ ...formData, invoiceDate: v })} type="date" />
          <Select 
            label="نوع الفاتورة" 
            value={formData.invoiceType || 'مبيعات'} 
            onChange={v => setFormData({ ...formData, invoiceType: v })}
            options={[
              { value: 'مبيعات', label: 'مبيعات' },
              { value: 'كاشير', label: 'كاشير' },
              { value: 'لمس', label: 'لمس' },
            ]}
          />
          <Input label="المخزن" value={formData.warehouse || 'المخزن الرئيسي'} onChange={v => setFormData({ ...formData, warehouse: v })} />
          <Input label="اسم العميل" value={formData.customerName || ''} onChange={v => setFormData({ ...formData, customerName: v })} />
          <Input label="هاتف العميل" value={formData.customerPhone || ''} onChange={v => setFormData({ ...formData, customerPhone: v })} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>الأصناف</h3>
            <Button size="sm" onClick={addItem}>+ إضافة صنف</Button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, fontWeight: 600 }}>الصنف</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, fontWeight: 600, width: 80 }}>الكمية</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, fontWeight: 600, width: 100 }}>السعر</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, fontWeight: 600, width: 80 }}>الخصم</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, fontWeight: 600, width: 80 }}>الضريبة %</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, fontWeight: 600, width: 100 }}>الإجمالي</th>
                <th style={{ padding: '8px 12px', width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems.map(item => (
                <tr key={item.id}>
                  <td style={{ padding: '4px 8px' }}>
                    <input 
                      type="text" 
                      value={item.itemName} 
                      onChange={e => updateItem(item.id, 'itemName', e.target.value)}
                      placeholder="اسم الصنف"
                      style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}
                    />
                  </td>
                  <td style={{ padding: '4px 8px' }}>
                    <input 
                      type="number" 
                      value={item.quantity} 
                      onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '4px 8px' }}>
                    <input 
                      type="number" 
                      value={item.unitPrice} 
                      onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}
                    />
                  </td>
                  <td style={{ padding: '4px 8px' }}>
                    <input 
                      type="number" 
                      value={item.discount} 
                      onChange={e => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}
                    />
                  </td>
                  <td style={{ padding: '4px 8px' }}>
                    <input 
                      type="number" 
                      value={item.tax} 
                      onChange={e => updateItem(item.id, 'tax', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '4px 8px', fontWeight: 600, color: '#1e293b' }}>
                    {item.total.toFixed(2)} ر.س
                  </td>
                  <td style={{ padding: '4px 8px' }}>
                    {invoiceItems.length > 1 && (
                      <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>🗑️</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <div style={{ width: 300, background: '#f8fafc', padding: 16, borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#64748b' }}>المجموع:</span>
              <span style={{ fontWeight: 600 }}>{calculateTotals().subtotal.toFixed(2)} ر.س</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#64748b' }}>الخصم:</span>
              <span style={{ color: '#dc2626' }}>-{calculateTotals().discount.toFixed(2)} ر.س</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#64748b' }}>الضريبة (15%):</span>
              <span>{calculateTotals().tax.toFixed(2)} ر.س</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '2px solid #e2e8f0' }}>
              <span style={{ fontWeight: 700 }}>الإجمالي:</span>
              <span style={{ fontWeight: 700, fontSize: 18, color: '#3b82f6' }}>{calculateTotals().total.toFixed(2)} ر.س</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
          <Button variant="secondary">حفظ كمسودة</Button>
          <Button onClick={handleSave}>حفظ وطباعة</Button>
        </div>
      </Modal>
    </AccountingLayout>
  );
}
