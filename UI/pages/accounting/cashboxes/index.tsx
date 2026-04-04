import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Modal, Badge } from '../../../components/AccountingLayout';

interface CashBox {
  id: number;
  code: string;
  name: string;
  branch: string;
  openingBalance: number;
  currentBalance: number;
  currency: string;
  responsibleUser: string;
  isDefault: boolean;
  isActive: boolean;
}

const mockCashBoxes: CashBox[] = [
  { id: 1, code: 'CB001', name: 'الصندوق الرئيسي', branch: 'الفرع الرئيسي', openingBalance: 10000, currentBalance: 45000, currency: 'SAR', responsibleUser: 'محمد أحمد', isDefault: true, isActive: true },
  { id: 2, code: 'CB002', name: 'صندوق المبيعات', branch: 'الفرع الرئيسي', openingBalance: 5000, currentBalance: 25000, currency: 'SAR', responsibleUser: 'خالد سعد', isDefault: false, isActive: true },
  { id: 3, code: 'CB003', name: 'صندوق فرع جدة', branch: 'فرع جدة', openingBalance: 3000, currentBalance: 18000, currency: 'SAR', responsibleUser: 'فهد عبدالله', isDefault: false, isActive: true },
];

export default function CashBoxesPage() {
  const [cashBoxes, setCashBoxes] = useState<CashBox[]>(mockCashBoxes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<CashBox>>({});

  const filteredCashBoxes = cashBoxes.filter(c => 
    c.name.includes(searchTerm) || c.code.includes(searchTerm) || c.branch.includes(searchTerm)
  );

  const totalBalance = cashBoxes.reduce((sum, c) => sum + c.currentBalance, 0);

  const handleSave = () => {
    if (formData.id) {
      setCashBoxes(cashBoxes.map(c => c.id === formData.id ? { ...c, ...formData } as CashBox : c));
    } else {
      const newCashBox: CashBox = {
        id: cashBoxes.length + 1,
        code: `CB${String(cashBoxes.length + 1).padStart(3, '0')}`,
        name: formData.name || '',
        branch: formData.branch || '',
        openingBalance: formData.openingBalance || 0,
        currentBalance: formData.openingBalance || 0,
        currency: 'SAR',
        responsibleUser: formData.responsibleUser || '',
        isDefault: false,
        isActive: true,
      };
      setCashBoxes([...cashBoxes, newCashBox]);
    }
    setIsModalOpen(false);
    setFormData({});
  };

  return (
    <AccountingLayout title="الصناديق">
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>💰</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>عدد الصناديق</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{cashBoxes.length}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>💵</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>إجمالي الأرصدة</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>{totalBalance.toLocaleString()} ر.س</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Input
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="بحث بالاسم أو الكود أو الفرع..."
            style={{ width: 300 }}
          />
          <Button onClick={() => { setFormData({}); setIsModalOpen(true); }}>+ إضافة صندوق جديد</Button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الكود</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الاسم</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الفرع</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الرصيد الافتتاحي</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الرصيد الحالي</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>المسؤول</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الحالة</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredCashBoxes.map(cashBox => (
              <tr key={cashBox.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 16px', color: '#3b82f6', fontWeight: 600 }}>{cashBox.code}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>{cashBox.name}</div>
                  {cashBox.isDefault && <Badge label="افتراضي" color="#f59e0b" />}
                </td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{cashBox.branch}</td>
                <td style={{ padding: '12px 16px' }}>{cashBox.openingBalance.toLocaleString()} ر.س</td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#059669' }}>{cashBox.currentBalance.toLocaleString()} ر.س</td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{cashBox.responsibleUser}</td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge label={cashBox.isActive ? 'نشط' : 'غير نشط'} color={cashBox.isActive ? '#22c55e' : '#ef4444'} />
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <Button variant="ghost" size="sm" onClick={() => { setFormData(cashBox); setIsModalOpen(true); }}>✏️</Button>
                  <Button variant="ghost" size="sm" onClick={() => setCashBoxes(cashBoxes.filter(c => c.id !== cashBox.id))}>🗑️</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'تعديل صندوق' : 'إضافة صندوق جديد'} width={500}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="اسم الصندوق" value={formData.name || ''} onChange={v => setFormData({ ...formData, name: v })} required />
          <Input label="الفرع" value={formData.branch || ''} onChange={v => setFormData({ ...formData, branch: v })} />
          <Input label="الرصيد الافتتاحي" value={formData.openingBalance || ''} onChange={v => setFormData({ ...formData, openingBalance: parseFloat(v) || 0 })} type="number" />
          <Input label="المسؤول" value={formData.responsibleUser || ''} onChange={v => setFormData({ ...formData, responsibleUser: v })} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
          <Button onClick={handleSave}>حفظ</Button>
        </div>
      </Modal>
    </AccountingLayout>
  );
}
