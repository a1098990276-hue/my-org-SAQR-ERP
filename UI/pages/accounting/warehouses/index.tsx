import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Modal, Badge, Select } from '../../../components/AccountingLayout';

interface Warehouse {
  id: number;
  code: string;
  name: string;
  nameEn: string;
  warehouseType: string;
  branch: string;
  address: string;
  responsibleUser: string;
  itemsCount: number;
  totalValue: number;
  isDefault: boolean;
  isActive: boolean;
}

const mockWarehouses: Warehouse[] = [
  { id: 1, code: 'WH001', name: 'المخزن الرئيسي', nameEn: 'Main Warehouse', warehouseType: 'مخزن', branch: 'الفرع الرئيسي', address: 'الرياض - حي الصناعية', responsibleUser: 'أحمد محمد', itemsCount: 450, totalValue: 850000, isDefault: true, isActive: true },
  { id: 2, code: 'WH002', name: 'مخزن المواد الخام', nameEn: 'Raw Materials', warehouseType: 'مخزن', branch: 'الفرع الرئيسي', address: 'الرياض - حي الصناعية', responsibleUser: 'خالد سعد', itemsCount: 120, totalValue: 320000, isDefault: false, isActive: true },
  { id: 3, code: 'POS001', name: 'نقطة البيع 1', nameEn: 'POS 1', warehouseType: 'نقطة بيع', branch: 'الفرع الرئيسي', address: 'الرياض - مول العرب', responsibleUser: 'فهد عبدالله', itemsCount: 85, totalValue: 95000, isDefault: false, isActive: true },
  { id: 4, code: 'WH003', name: 'مخزن فرع جدة', nameEn: 'Jeddah Warehouse', warehouseType: 'مخزن', branch: 'فرع جدة', address: 'جدة - حي الروضة', responsibleUser: 'سامي أحمد', itemsCount: 200, totalValue: 450000, isDefault: false, isActive: true },
];

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(mockWarehouses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [formData, setFormData] = useState<Partial<Warehouse>>({});

  const filteredWarehouses = warehouses.filter(w => {
    const matchesSearch = w.name.includes(searchTerm) || w.code.includes(searchTerm) || w.branch.includes(searchTerm);
    const matchesFilter = filter === 'all' || w.warehouseType === filter;
    return matchesSearch && matchesFilter;
  });

  const totalItems = warehouses.reduce((sum, w) => sum + w.itemsCount, 0);
  const totalValue = warehouses.reduce((sum, w) => sum + w.totalValue, 0);

  const handleSave = () => {
    if (formData.id) {
      setWarehouses(warehouses.map(w => w.id === formData.id ? { ...w, ...formData } as Warehouse : w));
    } else {
      const prefix = formData.warehouseType === 'نقطة بيع' ? 'POS' : 'WH';
      const count = warehouses.filter(w => w.code.startsWith(prefix)).length + 1;
      const newWarehouse: Warehouse = {
        id: warehouses.length + 1,
        code: `${prefix}${String(count).padStart(3, '0')}`,
        name: formData.name || '',
        nameEn: formData.nameEn || '',
        warehouseType: formData.warehouseType || 'مخزن',
        branch: formData.branch || '',
        address: formData.address || '',
        responsibleUser: formData.responsibleUser || '',
        itemsCount: 0,
        totalValue: 0,
        isDefault: false,
        isActive: true,
      };
      setWarehouses([...warehouses, newWarehouse]);
    }
    setIsModalOpen(false);
    setFormData({});
  };

  return (
    <AccountingLayout title="المخازن ونقاط البيع">
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🏪</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>عدد المخازن</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{warehouses.filter(w => w.warehouseType === 'مخزن').length}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🖥️</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>نقاط البيع</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{warehouses.filter(w => w.warehouseType === 'نقطة بيع').length}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📦</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>إجمالي الأصناف</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{totalItems.toLocaleString()}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>💰</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>قيمة المخزون</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#6366f1' }}>{totalValue.toLocaleString()} ر.س</div>
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
              placeholder="بحث بالاسم أو الكود..."
              style={{ width: 300 }}
            />
            <div style={{ display: 'flex', gap: 4 }}>
              <Button variant={filter === 'all' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('all')}>الكل</Button>
              <Button variant={filter === 'مخزن' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('مخزن')}>المخازن</Button>
              <Button variant={filter === 'نقطة بيع' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('نقطة بيع')}>نقاط البيع</Button>
            </div>
          </div>
          <Button onClick={() => { setFormData({}); setIsModalOpen(true); }}>+ إضافة مخزن/نقطة بيع</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16 }}>
          {filteredWarehouses.map(warehouse => (
            <div key={warehouse.id} style={{ 
              background: '#fff', 
              border: '1px solid #e2e8f0', 
              borderRadius: 12, 
              padding: 20,
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 10, 
                    background: warehouse.warehouseType === 'مخزن' ? '#dbeafe' : '#fef3c7', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: 24 
                  }}>
                    {warehouse.warehouseType === 'مخزن' ? '🏪' : '🖥️'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>{warehouse.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{warehouse.code}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <Badge label={warehouse.warehouseType} color={warehouse.warehouseType === 'مخزن' ? '#3b82f6' : '#f59e0b'} />
                  {warehouse.isDefault && <Badge label="افتراضي" color="#8b5cf6" />}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>الفرع</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{warehouse.branch}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>المسؤول</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{warehouse.responsibleUser}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>عدد الأصناف</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#3b82f6' }}>{warehouse.itemsCount}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>قيمة المخزون</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#059669' }}>{warehouse.totalValue.toLocaleString()} ر.س</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12, color: '#64748b' }}>{warehouse.address}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="ghost" size="sm" onClick={() => { setFormData(warehouse); setIsModalOpen(true); }}>✏️</Button>
                  <Button variant="ghost" size="sm" onClick={() => setWarehouses(warehouses.filter(w => w.id !== warehouse.id))}>🗑️</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'تعديل مخزن/نقطة بيع' : 'إضافة مخزن/نقطة بيع جديد'} width={600}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="الاسم بالعربي" value={formData.name || ''} onChange={v => setFormData({ ...formData, name: v })} required />
          <Input label="الاسم بالإنجليزي" value={formData.nameEn || ''} onChange={v => setFormData({ ...formData, nameEn: v })} />
          <Select 
            label="النوع" 
            value={formData.warehouseType || 'مخزن'} 
            onChange={v => setFormData({ ...formData, warehouseType: v })}
            options={[
              { value: 'مخزن', label: 'مخزن' },
              { value: 'نقطة بيع', label: 'نقطة بيع' },
            ]}
          />
          <Input label="الفرع" value={formData.branch || ''} onChange={v => setFormData({ ...formData, branch: v })} />
          <Input label="المسؤول" value={formData.responsibleUser || ''} onChange={v => setFormData({ ...formData, responsibleUser: v })} />
          <Input label="العنوان" value={formData.address || ''} onChange={v => setFormData({ ...formData, address: v })} style={{ gridColumn: 'span 2' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
          <Button onClick={handleSave}>حفظ</Button>
        </div>
      </Modal>
    </AccountingLayout>
  );
}
