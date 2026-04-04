import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Modal, Badge, Select } from '../../../components/AccountingLayout';

interface Asset {
  id: number;
  code: string;
  name: string;
  category: string;
  purchaseDate: string;
  purchaseValue: number;
  currentValue: number;
  depreciationMethod: string;
  depreciationRate: number;
  accumulatedDepreciation: number;
  usefulLife: number;
  location: string;
  status: string;
  supplier: string;
  serialNumber: string;
  isActive: boolean;
}

const mockAssets: Asset[] = [
  { id: 1, code: 'AST001', name: 'مبنى المقر الرئيسي', category: 'مباني', purchaseDate: '2020-01-15', purchaseValue: 2000000, currentValue: 1800000, depreciationMethod: 'القسط الثابت', depreciationRate: 5, accumulatedDepreciation: 200000, usefulLife: 20, location: 'الرياض - حي العليا', status: 'مستخدم', supplier: 'شركة العقارات', serialNumber: '', isActive: true },
  { id: 2, code: 'AST002', name: 'سيارة نقل', category: 'مركبات', purchaseDate: '2022-06-10', purchaseValue: 150000, currentValue: 120000, depreciationMethod: 'القسط الثابت', depreciationRate: 20, accumulatedDepreciation: 30000, usefulLife: 5, location: 'المخزن الرئيسي', status: 'مستخدم', supplier: 'وكالة تويوتا', serialNumber: 'VIN123456789', isActive: true },
  { id: 3, code: 'AST003', name: 'خادم حاسوبي', category: 'معدات تقنية', purchaseDate: '2023-03-20', purchaseValue: 80000, currentValue: 64000, depreciationMethod: 'القسط الثابت', depreciationRate: 20, accumulatedDepreciation: 16000, usefulLife: 5, location: 'غرفة الخوادم', status: 'مستخدم', supplier: 'شركة Dell', serialNumber: 'SRV2023XYZ', isActive: true },
  { id: 4, code: 'AST004', name: 'أثاث مكتبي', category: 'أثاث', purchaseDate: '2021-08-05', purchaseValue: 50000, currentValue: 35000, depreciationMethod: 'القسط الثابت', depreciationRate: 15, accumulatedDepreciation: 15000, usefulLife: 7, location: 'المكتب الرئيسي', status: 'مستخدم', supplier: 'IKEA', serialNumber: '', isActive: true },
  { id: 5, code: 'AST005', name: 'ماكينة طباعة صناعية', category: 'معدات', purchaseDate: '2023-01-10', purchaseValue: 200000, currentValue: 180000, depreciationMethod: 'القسط الثابت', depreciationRate: 10, accumulatedDepreciation: 20000, usefulLife: 10, location: 'قسم الإنتاج', status: 'مستخدم', supplier: 'HP Enterprise', serialNumber: 'PRN2023ABC', isActive: true },
];

const categories = ['مباني', 'مركبات', 'معدات تقنية', 'أثاث', 'معدات', 'أراضي', 'آلات'];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [formData, setFormData] = useState<Partial<Asset>>({});

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.includes(searchTerm) || a.code.includes(searchTerm);
    const matchesFilter = filter === 'all' || a.category === filter;
    return matchesSearch && matchesFilter;
  });

  const totalPurchaseValue = assets.reduce((sum, a) => sum + a.purchaseValue, 0);
  const totalCurrentValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
  const totalDepreciation = assets.reduce((sum, a) => sum + a.accumulatedDepreciation, 0);

  const handleSave = () => {
    if (formData.id) {
      setAssets(assets.map(a => a.id === formData.id ? { ...a, ...formData } as Asset : a));
    } else {
      const newAsset: Asset = {
        id: assets.length + 1,
        code: `AST${String(assets.length + 1).padStart(3, '0')}`,
        name: formData.name || '',
        category: formData.category || 'معدات',
        purchaseDate: formData.purchaseDate || new Date().toISOString().split('T')[0],
        purchaseValue: formData.purchaseValue || 0,
        currentValue: formData.purchaseValue || 0,
        depreciationMethod: formData.depreciationMethod || 'القسط الثابت',
        depreciationRate: formData.depreciationRate || 10,
        accumulatedDepreciation: 0,
        usefulLife: formData.usefulLife || 5,
        location: formData.location || '',
        status: 'مستخدم',
        supplier: formData.supplier || '',
        serialNumber: formData.serialNumber || '',
        isActive: true,
      };
      setAssets([...assets, newAsset]);
    }
    setIsModalOpen(false);
    setFormData({});
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'مباني': return '🏢';
      case 'مركبات': return '🚗';
      case 'معدات تقنية': return '💻';
      case 'أثاث': return '🪑';
      case 'معدات': return '⚙️';
      case 'أراضي': return '🏞️';
      case 'آلات': return '🏭';
      default: return '📦';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مستخدم': return '#22c55e';
      case 'صيانة': return '#f59e0b';
      case 'مخزن': return '#3b82f6';
      case 'مستبعد': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <AccountingLayout title="الأصول الثابتة">
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🏗️</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>قيمة الشراء</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6' }}>{totalPurchaseValue.toLocaleString()} ر.س</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>💰</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>القيمة الحالية</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>{totalCurrentValue.toLocaleString()} ر.س</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📉</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>مجمع الإهلاك</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#dc2626' }}>{totalDepreciation.toLocaleString()} ر.س</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📊</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>عدد الأصول</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{assets.length}</div>
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
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <Button variant={filter === 'all' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('all')}>الكل</Button>
              {categories.slice(0, 5).map(cat => (
                <Button key={cat} variant={filter === cat ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter(cat)}>{cat}</Button>
              ))}
            </div>
          </div>
          <Button onClick={() => { setFormData({}); setIsModalOpen(true); }}>+ إضافة أصل جديد</Button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الكود</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الأصل</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>التصنيف</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>تاريخ الشراء</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>قيمة الشراء</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>القيمة الحالية</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الإهلاك %</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الحالة</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map(asset => {
              const depreciationPercent = asset.purchaseValue > 0 ? ((asset.accumulatedDepreciation / asset.purchaseValue) * 100).toFixed(0) : 0;
              return (
                <tr key={asset.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 16px', color: '#3b82f6', fontWeight: 600 }}>{asset.code}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 20 }}>{getCategoryIcon(asset.category)}</span>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{asset.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{asset.location}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge label={asset.category} color="#6366f1" />
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{asset.purchaseDate}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{asset.purchaseValue.toLocaleString()} ر.س</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#059669' }}>{asset.currentValue.toLocaleString()} ر.س</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden', maxWidth: 60 }}>
                        <div style={{ 
                          width: `${depreciationPercent}%`, 
                          height: '100%', 
                          background: '#ef4444',
                          borderRadius: 3 
                        }} />
                      </div>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{depreciationPercent}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge label={asset.status} color={getStatusColor(asset.status)} />
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <Button variant="ghost" size="sm" onClick={() => { setFormData(asset); setIsModalOpen(true); }}>✏️</Button>
                    <Button variant="ghost" size="sm" onClick={() => setAssets(assets.filter(a => a.id !== asset.id))}>🗑️</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'تعديل أصل' : 'إضافة أصل جديد'} width={700}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="اسم الأصل" value={formData.name || ''} onChange={v => setFormData({ ...formData, name: v })} required />
          <Select 
            label="التصنيف" 
            value={formData.category || 'معدات'} 
            onChange={v => setFormData({ ...formData, category: v })}
            options={categories.map(c => ({ value: c, label: c }))}
          />
          <Input label="تاريخ الشراء" value={formData.purchaseDate || ''} onChange={v => setFormData({ ...formData, purchaseDate: v })} type="date" />
          <Input label="قيمة الشراء" value={formData.purchaseValue || ''} onChange={v => setFormData({ ...formData, purchaseValue: parseFloat(v) || 0 })} type="number" />
          <Input label="العمر الإنتاجي (سنوات)" value={formData.usefulLife || ''} onChange={v => setFormData({ ...formData, usefulLife: parseInt(v) || 0 })} type="number" />
          <Input label="نسبة الإهلاك السنوي %" value={formData.depreciationRate || ''} onChange={v => setFormData({ ...formData, depreciationRate: parseFloat(v) || 0 })} type="number" />
          <Input label="الموقع" value={formData.location || ''} onChange={v => setFormData({ ...formData, location: v })} />
          <Input label="المورد" value={formData.supplier || ''} onChange={v => setFormData({ ...formData, supplier: v })} />
          <Input label="الرقم التسلسلي" value={formData.serialNumber || ''} onChange={v => setFormData({ ...formData, serialNumber: v })} />
          <Select 
            label="طريقة الإهلاك" 
            value={formData.depreciationMethod || 'القسط الثابت'} 
            onChange={v => setFormData({ ...formData, depreciationMethod: v })}
            options={[
              { value: 'القسط الثابت', label: 'القسط الثابت' },
              { value: 'القسط المتناقص', label: 'القسط المتناقص' },
              { value: 'وحدات الإنتاج', label: 'وحدات الإنتاج' },
            ]}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
          <Button onClick={handleSave}>حفظ</Button>
        </div>
      </Modal>
    </AccountingLayout>
  );
}
