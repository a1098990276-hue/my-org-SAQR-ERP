import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Modal, Badge, Select } from '../../../components/AccountingLayout';

interface CostCenter {
  id: number;
  code: string;
  name: string;
  nameEn: string;
  type: string;
  parentId: number | null;
  parentName: string;
  budget: number;
  actualCost: number;
  isActive: boolean;
}

const mockCostCenters: CostCenter[] = [
  { id: 1, code: 'CC001', name: 'الإدارة العامة', nameEn: 'General Administration', type: 'إداري', parentId: null, parentName: '', budget: 500000, actualCost: 420000, isActive: true },
  { id: 2, code: 'CC002', name: 'المبيعات', nameEn: 'Sales', type: 'تشغيلي', parentId: null, parentName: '', budget: 300000, actualCost: 285000, isActive: true },
  { id: 3, code: 'CC003', name: 'التسويق', nameEn: 'Marketing', type: 'تشغيلي', parentId: null, parentName: '', budget: 200000, actualCost: 180000, isActive: true },
  { id: 4, code: 'CC004', name: 'المشاريع', nameEn: 'Projects', type: 'مشاريع', parentId: null, parentName: '', budget: 1000000, actualCost: 750000, isActive: true },
  { id: 5, code: 'CC005', name: 'مشروع أ', nameEn: 'Project A', type: 'مشاريع', parentId: 4, parentName: 'المشاريع', budget: 400000, actualCost: 350000, isActive: true },
  { id: 6, code: 'CC006', name: 'مشروع ب', nameEn: 'Project B', type: 'مشاريع', parentId: 4, parentName: 'المشاريع', budget: 600000, actualCost: 400000, isActive: true },
];

export default function CostCentersPage() {
  const [costCenters, setCostCenters] = useState<CostCenter[]>(mockCostCenters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [formData, setFormData] = useState<Partial<CostCenter>>({});

  const filteredCostCenters = costCenters.filter(c => {
    const matchesSearch = c.name.includes(searchTerm) || c.code.includes(searchTerm);
    const matchesFilter = filter === 'all' || c.type === filter;
    return matchesSearch && matchesFilter;
  });

  const totalBudget = costCenters.filter(c => !c.parentId).reduce((sum, c) => sum + c.budget, 0);
  const totalActual = costCenters.filter(c => !c.parentId).reduce((sum, c) => sum + c.actualCost, 0);

  const handleSave = () => {
    if (formData.id) {
      setCostCenters(costCenters.map(c => c.id === formData.id ? { ...c, ...formData } as CostCenter : c));
    } else {
      const newCostCenter: CostCenter = {
        id: costCenters.length + 1,
        code: `CC${String(costCenters.length + 1).padStart(3, '0')}`,
        name: formData.name || '',
        nameEn: formData.nameEn || '',
        type: formData.type || 'تشغيلي',
        parentId: formData.parentId || null,
        parentName: formData.parentId ? costCenters.find(c => c.id === formData.parentId)?.name || '' : '',
        budget: formData.budget || 0,
        actualCost: 0,
        isActive: true,
      };
      setCostCenters([...costCenters, newCostCenter]);
    }
    setIsModalOpen(false);
    setFormData({});
  };

  const getVariance = (budget: number, actual: number) => {
    const variance = budget - actual;
    const percentage = budget > 0 ? ((variance / budget) * 100).toFixed(1) : 0;
    return { variance, percentage, isPositive: variance >= 0 };
  };

  return (
    <AccountingLayout title="مراكز التكلفة">
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📊</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>إجمالي الميزانية</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6' }}>{totalBudget.toLocaleString()} ر.س</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>💰</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>التكلفة الفعلية</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#d97706' }}>{totalActual.toLocaleString()} ر.س</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>✅</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>الفرق</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>{(totalBudget - totalActual).toLocaleString()} ر.س</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🏢</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>عدد المراكز</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{costCenters.length}</div>
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
              <Button variant={filter === 'إداري' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('إداري')}>إداري</Button>
              <Button variant={filter === 'تشغيلي' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('تشغيلي')}>تشغيلي</Button>
              <Button variant={filter === 'مشاريع' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('مشاريع')}>مشاريع</Button>
            </div>
          </div>
          <Button onClick={() => { setFormData({}); setIsModalOpen(true); }}>+ إضافة مركز تكلفة</Button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الكود</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الاسم</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>النوع</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>المركز الرئيسي</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الميزانية</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الفعلي</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الفرق</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الاستهلاك</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredCostCenters.map(center => {
              const variance = getVariance(center.budget, center.actualCost);
              const consumptionPercent = center.budget > 0 ? ((center.actualCost / center.budget) * 100).toFixed(0) : 0;
              return (
                <tr key={center.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 16px', color: '#3b82f6', fontWeight: 600 }}>{center.code}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#1e293b', paddingRight: center.parentId ? 20 : 0 }}>
                      {center.parentId ? '└ ' : ''}{center.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{center.nameEn}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge label={center.type} color={center.type === 'إداري' ? '#3b82f6' : center.type === 'تشغيلي' ? '#22c55e' : '#f59e0b'} />
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>
                    {center.parentName || '-'}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{center.budget.toLocaleString()} ر.س</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#d97706' }}>{center.actualCost.toLocaleString()} ر.س</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: variance.isPositive ? '#059669' : '#dc2626' }}>
                    {variance.isPositive ? '+' : ''}{variance.variance.toLocaleString()} ر.س
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${Math.min(Number(consumptionPercent), 100)}%`, 
                          height: '100%', 
                          background: Number(consumptionPercent) > 90 ? '#ef4444' : Number(consumptionPercent) > 75 ? '#f59e0b' : '#22c55e',
                          borderRadius: 4,
                          transition: 'width 0.3s'
                        }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', minWidth: 40 }}>{consumptionPercent}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <Button variant="ghost" size="sm" onClick={() => { setFormData(center); setIsModalOpen(true); }}>✏️</Button>
                    <Button variant="ghost" size="sm" onClick={() => setCostCenters(costCenters.filter(c => c.id !== center.id))}>🗑️</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'تعديل مركز تكلفة' : 'إضافة مركز تكلفة جديد'} width={600}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="الاسم بالعربي" value={formData.name || ''} onChange={v => setFormData({ ...formData, name: v })} required />
          <Input label="الاسم بالإنجليزي" value={formData.nameEn || ''} onChange={v => setFormData({ ...formData, nameEn: v })} />
          <Select 
            label="النوع" 
            value={formData.type || 'تشغيلي'} 
            onChange={v => setFormData({ ...formData, type: v })}
            options={[
              { value: 'إداري', label: 'إداري' },
              { value: 'تشغيلي', label: 'تشغيلي' },
              { value: 'مشاريع', label: 'مشاريع' },
            ]}
          />
          <Select 
            label="المركز الرئيسي" 
            value={formData.parentId?.toString() || ''} 
            onChange={v => setFormData({ ...formData, parentId: v ? parseInt(v) : null })}
            options={[
              { value: '', label: 'بدون (رئيسي)' },
              ...costCenters.filter(c => !c.parentId && c.id !== formData.id).map(c => ({ value: c.id.toString(), label: c.name }))
            ]}
          />
          <Input label="الميزانية" value={formData.budget || ''} onChange={v => setFormData({ ...formData, budget: parseFloat(v) || 0 })} type="number" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
          <Button onClick={handleSave}>حفظ</Button>
        </div>
      </Modal>
    </AccountingLayout>
  );
}
