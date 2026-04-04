import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Modal, Badge, Select } from '../../../components/AccountingLayout';

interface InventoryMovement {
  id: number;
  documentNumber: string;
  documentDate: string;
  movementType: string;
  warehouse: string;
  toWarehouse?: string;
  itemsCount: number;
  totalValue: number;
  description: string;
  status: string;
  createdBy: string;
}

const mockMovements: InventoryMovement[] = [
  { id: 1, documentNumber: 'TRF-2024-001', documentDate: '2024-01-15', movementType: 'نقل', warehouse: 'المخزن الرئيسي', toWarehouse: 'نقطة البيع 1', itemsCount: 15, totalValue: 12500, description: 'نقل بضاعة لنقطة البيع', status: 'مكتمل', createdBy: 'أحمد محمد' },
  { id: 2, documentNumber: 'ISS-2024-001', documentDate: '2024-01-16', movementType: 'صرف', warehouse: 'المخزن الرئيسي', itemsCount: 5, totalValue: 3500, description: 'صرف مواد للمشروع أ', status: 'مكتمل', createdBy: 'خالد سعد' },
  { id: 3, documentNumber: 'RCV-2024-001', documentDate: '2024-01-17', movementType: 'استلام', warehouse: 'المخزن الرئيسي', itemsCount: 25, totalValue: 45000, description: 'استلام شحنة من المورد', status: 'مكتمل', createdBy: 'فهد عبدالله' },
  { id: 4, documentNumber: 'ADJ-2024-001', documentDate: '2024-01-18', movementType: 'تصحيح', warehouse: 'المخزن الرئيسي', itemsCount: 3, totalValue: 1200, description: 'تصحيح كميات بعد الجرد', status: 'مسودة', createdBy: 'محمد أحمد' },
  { id: 5, documentNumber: 'CNT-2024-001', documentDate: '2024-01-19', movementType: 'جرد', warehouse: 'نقطة البيع 1', itemsCount: 85, totalValue: 95000, description: 'جرد شهر يناير', status: 'قيد التنفيذ', createdBy: 'سامي علي' },
];

interface InventoryItem {
  id: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  unitCost: number;
  totalValue: number;
}

export default function InventoryPage() {
  const [movements, setMovements] = useState<InventoryMovement[]>(mockMovements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [formData, setFormData] = useState<Partial<InventoryMovement & { movementType: string }>>({});
  const [items, setItems] = useState<InventoryItem[]>([
    { id: 1, itemCode: '', itemName: '', quantity: 1, unitCost: 0, totalValue: 0 }
  ]);

  const filteredMovements = movements.filter(m => {
    const matchesSearch = m.documentNumber.includes(searchTerm) || m.description.includes(searchTerm);
    const matchesFilter = filter === 'all' || m.movementType === filter;
    return matchesSearch && matchesFilter;
  });

  const addItem = () => {
    setItems([...items, { id: items.length + 1, itemCode: '', itemName: '', quantity: 1, unitCost: 0, totalValue: 0 }]);
  };

  const updateItem = (id: number, field: keyof InventoryItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        updated.totalValue = updated.quantity * updated.unitCost;
        return updated;
      }
      return item;
    }));
  };

  const openNewMovement = (type: string) => {
    setFormData({ movementType: type });
    setIsModalOpen(true);
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'نقل': return '🔀';
      case 'صرف': return '📤';
      case 'استلام': return '📥';
      case 'تصحيح': return '✏️';
      case 'جرد': return '📊';
      default: return '📦';
    }
  };

  const getMovementColor = (type: string) => {
    switch (type) {
      case 'نقل': return '#8b5cf6';
      case 'صرف': return '#ef4444';
      case 'استلام': return '#22c55e';
      case 'تصحيح': return '#f59e0b';
      case 'جرد': return '#3b82f6';
      default: return '#64748b';
    }
  };

  const handleSave = () => {
    const prefix = formData.movementType === 'نقل' ? 'TRF' : formData.movementType === 'صرف' ? 'ISS' : formData.movementType === 'استلام' ? 'RCV' : formData.movementType === 'تصحيح' ? 'ADJ' : 'CNT';
    const count = movements.filter(m => m.documentNumber.startsWith(prefix)).length + 1;
    const totalValue = items.reduce((sum, i) => sum + i.totalValue, 0);
    
    const newMovement: InventoryMovement = {
      id: movements.length + 1,
      documentNumber: `${prefix}-2024-${String(count).padStart(3, '0')}`,
      documentDate: formData.documentDate || new Date().toISOString().split('T')[0],
      movementType: formData.movementType || 'صرف',
      warehouse: formData.warehouse || '',
      toWarehouse: formData.toWarehouse,
      itemsCount: items.length,
      totalValue: totalValue,
      description: formData.description || '',
      status: 'مسودة',
      createdBy: 'المستخدم الحالي',
    };
    setMovements([...movements, newMovement]);
    setIsModalOpen(false);
    setFormData({});
    setItems([{ id: 1, itemCode: '', itemName: '', quantity: 1, unitCost: 0, totalValue: 0 }]);
  };

  return (
    <AccountingLayout title="إدارة المخزون">
      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        <Card style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => openNewMovement('نقل')}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔀</div>
          <div style={{ fontWeight: 600, color: '#1e293b' }}>نقل مخزون</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>بين المخازن</div>
        </Card>
        <Card style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => openNewMovement('صرف')}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📤</div>
          <div style={{ fontWeight: 600, color: '#1e293b' }}>صرف مخزني</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>للمشاريع والأقسام</div>
        </Card>
        <Card style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => openNewMovement('استلام')}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📥</div>
          <div style={{ fontWeight: 600, color: '#1e293b' }}>استلام مخزون</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>توريدات واستلام</div>
        </Card>
        <Card style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => openNewMovement('تصحيح')}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✏️</div>
          <div style={{ fontWeight: 600, color: '#1e293b' }}>تصحيح كميات</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>تعديل الأرصدة</div>
        </Card>
        <Card style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => openNewMovement('جرد')}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
          <div style={{ fontWeight: 600, color: '#1e293b' }}>جرد المخزون</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>جرد دوري وكامل</div>
        </Card>
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <Input
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="بحث برقم المستند..."
              style={{ width: 300 }}
            />
            <div style={{ display: 'flex', gap: 4 }}>
              <Button variant={filter === 'all' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('all')}>الكل</Button>
              <Button variant={filter === 'نقل' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('نقل')}>نقل</Button>
              <Button variant={filter === 'صرف' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('صرف')}>صرف</Button>
              <Button variant={filter === 'استلام' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('استلام')}>استلام</Button>
              <Button variant={filter === 'تصحيح' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('تصحيح')}>تصحيح</Button>
              <Button variant={filter === 'جرد' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('جرد')}>جرد</Button>
            </div>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>رقم المستند</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>التاريخ</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>النوع</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>المخزن</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>عدد الأصناف</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>القيمة</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الحالة</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovements.map(movement => (
              <tr key={movement.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 16px', color: '#3b82f6', fontWeight: 600 }}>{movement.documentNumber}</td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{movement.documentDate}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{getMovementIcon(movement.movementType)}</span>
                    <Badge label={movement.movementType} color={getMovementColor(movement.movementType)} />
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 500 }}>{movement.warehouse}</div>
                  {movement.toWarehouse && <div style={{ fontSize: 12, color: '#64748b' }}>← {movement.toWarehouse}</div>}
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{movement.itemsCount}</td>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{movement.totalValue.toLocaleString()} ر.س</td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge 
                    label={movement.status} 
                    color={movement.status === 'مكتمل' ? '#22c55e' : movement.status === 'قيد التنفيذ' ? '#3b82f6' : '#f59e0b'} 
                  />
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <Button variant="ghost" size="sm">👁️</Button>
                  {movement.status === 'مسودة' && <Button variant="ghost" size="sm">✏️</Button>}
                  <Button variant="ghost" size="sm">🖨️</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${formData.movementType || 'حركة'} مخزون جديد`} width={800}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
          <Input label="التاريخ" value={formData.documentDate || new Date().toISOString().split('T')[0]} onChange={v => setFormData({ ...formData, documentDate: v })} type="date" />
          <Input label="المخزن" value={formData.warehouse || ''} onChange={v => setFormData({ ...formData, warehouse: v })} required />
          {formData.movementType === 'نقل' && (
            <Input label="إلى المخزن" value={formData.toWarehouse || ''} onChange={v => setFormData({ ...formData, toWarehouse: v })} />
          )}
        </div>
        <div style={{ marginBottom: 16 }}>
          <Input label="الوصف" value={formData.description || ''} onChange={v => setFormData({ ...formData, description: v })} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>الأصناف</h3>
            <Button size="sm" onClick={addItem}>+ إضافة صنف</Button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, fontWeight: 600 }}>كود الصنف</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, fontWeight: 600 }}>اسم الصنف</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, fontWeight: 600, width: 100 }}>الكمية</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, fontWeight: 600, width: 120 }}>التكلفة</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, fontWeight: 600, width: 120 }}>الإجمالي</th>
                <th style={{ padding: '8px 12px', width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td style={{ padding: '4px 8px' }}>
                    <input 
                      type="text" 
                      value={item.itemCode} 
                      onChange={e => updateItem(item.id, 'itemCode', e.target.value)}
                      style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}
                    />
                  </td>
                  <td style={{ padding: '4px 8px' }}>
                    <input 
                      type="text" 
                      value={item.itemName} 
                      onChange={e => updateItem(item.id, 'itemName', e.target.value)}
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
                      value={item.unitCost} 
                      onChange={e => updateItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}
                    />
                  </td>
                  <td style={{ padding: '4px 8px', fontWeight: 600 }}>
                    {item.totalValue.toFixed(2)} ر.س
                  </td>
                  <td style={{ padding: '4px 8px' }}>
                    {items.length > 1 && (
                      <button onClick={() => setItems(items.filter(i => i.id !== item.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>🗑️</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
          <Button onClick={handleSave}>حفظ</Button>
        </div>
      </Modal>
    </AccountingLayout>
  );
}
