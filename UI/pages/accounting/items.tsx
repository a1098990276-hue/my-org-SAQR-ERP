import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Modal, Badge } from '../../components/AccountingLayout';
import { useAccounting, Item, formatCurrency } from '../../lib/useAccounting';

const emptyForm = (): Omit<Item, 'id'> => ({
  code: '', name: '', unit: 'قطعة', salePrice: 0, costPrice: 0, quantity: 0, minQuantity: 0, category: '',
});

export default function ItemsPage() {
  const { items, addItem, updateItem, deleteItem } = useAccounting();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))];
  const filtered = items.filter(i => {
    const matchSearch = i.name.includes(search) || i.code.includes(search);
    const matchCat = filterCategory === 'all' || i.category === filterCategory;
    return matchSearch && matchCat;
  });

  const openAdd = () => { setEditing(null); setForm(emptyForm()); setShowModal(true); };
  const openEdit = (item: Item) => { setEditing(item); setForm({ code: item.code, name: item.name, unit: item.unit, salePrice: item.salePrice, costPrice: item.costPrice, quantity: item.quantity, minQuantity: item.minQuantity, category: item.category }); setShowModal(true); };

  const handleSubmit = () => {
    if (!form.name) return;
    if (editing) updateItem(editing.id, form);
    else addItem(form);
    setShowModal(false);
  };

  const totalInventoryValue = items.reduce((s, i) => s + i.quantity * i.costPrice, 0);
  const totalSaleValue = items.reduce((s, i) => s + i.quantity * i.salePrice, 0);
  const lowStockCount = items.filter(i => i.quantity <= i.minQuantity).length;

  return (
    <AccountingLayout title="الأصناف والمنتجات">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'عدد الأصناف', value: items.length.toString(), color: '#3b82f6', icon: '📦' },
          { label: 'قيمة المخزون (التكلفة)', value: formatCurrency(totalInventoryValue), color: '#8b5cf6', icon: '💰' },
          { label: 'قيمة المخزون (البيع)', value: formatCurrency(totalSaleValue), color: '#22c55e', icon: '💹' },
          { label: 'أصناف مخزون منخفض', value: lowStockCount.toString(), color: lowStockCount > 0 ? '#ef4444' : '#22c55e', icon: '⚠️' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', borderTop: `3px solid ${s.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <span style={{ fontSize: 12, color: '#64748b' }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <Card>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button onClick={openAdd} variant="primary">➕ صنف جديد</Button>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو الرمز..." style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', minWidth: 250, outline: 'none' }} />
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}>
            {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'جميع الفئات' : c}</option>)}
          </select>
          <span style={{ marginRight: 'auto', color: '#64748b', fontSize: 13 }}>{filtered.length} صنف</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['رمز', 'الاسم', 'الفئة', 'الوحدة', 'سعر البيع', 'سعر التكلفة', 'هامش الربح', 'الكمية', 'الحد الأدنى', 'قيمة المخزون', 'الحالة', 'إجراءات'].map(h => (
                <th key={h} style={{ textAlign: 'right', padding: '12px 10px', color: '#64748b', fontWeight: 600, borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap', fontSize: 13 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const margin = item.salePrice > 0 ? ((item.salePrice - item.costPrice) / item.salePrice * 100).toFixed(1) : '0';
              const isLow = item.quantity <= item.minQuantity;
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', background: isLow ? '#fff7f7' : '#fff' }}>
                  <td style={{ padding: '10px 10px', fontFamily: 'monospace', color: '#64748b', fontWeight: 600, fontSize: 12 }}>{item.code}</td>
                  <td style={{ padding: '10px 10px', fontWeight: 600, color: '#1e293b' }}>{item.name}</td>
                  <td style={{ padding: '10px 10px', color: '#64748b' }}>{item.category || '-'}</td>
                  <td style={{ padding: '10px 10px', color: '#374151' }}>{item.unit}</td>
                  <td style={{ padding: '10px 10px', fontWeight: 600, color: '#22c55e' }}>{formatCurrency(item.salePrice)}</td>
                  <td style={{ padding: '10px 10px', color: '#374151' }}>{formatCurrency(item.costPrice)}</td>
                  <td style={{ padding: '10px 10px', fontWeight: 600, color: parseFloat(margin) > 20 ? '#22c55e' : '#f97316' }}>{margin}%</td>
                  <td style={{ padding: '10px 10px', fontWeight: 700, color: isLow ? '#ef4444' : '#1e293b' }}>{item.quantity}</td>
                  <td style={{ padding: '10px 10px', color: '#64748b' }}>{item.minQuantity}</td>
                  <td style={{ padding: '10px 10px', color: '#374151' }}>{formatCurrency(item.quantity * item.costPrice)}</td>
                  <td style={{ padding: '10px 10px' }}>
                    <Badge label={isLow ? 'منخفض' : 'متاح'} color={isLow ? '#ef4444' : '#22c55e'} />
                  </td>
                  <td style={{ padding: '10px 10px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Button size="sm" variant="secondary" onClick={() => openEdit(item)}>تعديل</Button>
                      <Button size="sm" variant="danger" onClick={() => { if (confirm('حذف الصنف؟')) deleteItem(item.id); }}>حذف</Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>لا توجد أصناف</div>}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'تعديل الصنف' : 'إضافة صنف جديد'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Input label="رمز الصنف" value={form.code} onChange={v => setForm(f => ({ ...f, code: v }))} placeholder="I001" />
          <Input label="اسم الصنف" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
          <Input label="الوحدة" value={form.unit} onChange={v => setForm(f => ({ ...f, unit: v }))} placeholder="قطعة، كيلو، لتر..." />
          <Input label="الفئة" value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} placeholder="إلكترونيات، مستلزمات..." />
          <Input label="سعر البيع" value={form.salePrice} onChange={v => setForm(f => ({ ...f, salePrice: parseFloat(v) || 0 }))} type="number" />
          <Input label="سعر التكلفة" value={form.costPrice} onChange={v => setForm(f => ({ ...f, costPrice: parseFloat(v) || 0 }))} type="number" />
          <Input label="الكمية المتاحة" value={form.quantity} onChange={v => setForm(f => ({ ...f, quantity: parseInt(v) || 0 }))} type="number" />
          <Input label="الحد الأدنى للمخزون" value={form.minQuantity} onChange={v => setForm(f => ({ ...f, minQuantity: parseInt(v) || 0 }))} type="number" />
        </div>
        {form.salePrice > 0 && form.costPrice > 0 && (
          <div style={{ marginTop: 12, padding: '10px 14px', background: '#f0fdf4', borderRadius: 8, fontSize: 13, color: '#166534' }}>
            هامش الربح: <strong>{((form.salePrice - form.costPrice) / form.salePrice * 100).toFixed(1)}%</strong>
            {' '}| الربح لكل وحدة: <strong>{formatCurrency(form.salePrice - form.costPrice)}</strong>
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>إلغاء</Button>
          <Button variant="primary" onClick={handleSubmit}>💾 حفظ</Button>
        </div>
      </Modal>
    </AccountingLayout>
  );
}
