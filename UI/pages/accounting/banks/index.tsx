import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Modal, Badge } from '../../../components/AccountingLayout';

interface Bank {
  id: number;
  code: string;
  name: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  branch: string;
  openingBalance: number;
  currentBalance: number;
  currency: string;
  isDefault: boolean;
  isActive: boolean;
}

const mockBanks: Bank[] = [
  { id: 1, code: 'BNK001', name: 'حساب الراجحي الرئيسي', bankName: 'مصرف الراجحي', accountNumber: '1234567890', iban: 'SA0380000000608010167519', branch: 'الفرع الرئيسي', openingBalance: 100000, currentBalance: 350000, currency: 'SAR', isDefault: true, isActive: true },
  { id: 2, code: 'BNK002', name: 'حساب الأهلي', bankName: 'البنك الأهلي', accountNumber: '9876543210', iban: 'SA0310000000123456789012', branch: 'الفرع الرئيسي', openingBalance: 50000, currentBalance: 180000, currency: 'SAR', isDefault: false, isActive: true },
  { id: 3, code: 'BNK003', name: 'حساب الإنماء', bankName: 'بنك الإنماء', accountNumber: '5555555555', iban: 'SA0305000000068010167519', branch: 'فرع جدة', openingBalance: 30000, currentBalance: 95000, currency: 'SAR', isDefault: false, isActive: true },
];

export default function BanksPage() {
  const [banks, setBanks] = useState<Bank[]>(mockBanks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Bank>>({});

  const filteredBanks = banks.filter(b => 
    b.name.includes(searchTerm) || b.code.includes(searchTerm) || b.bankName.includes(searchTerm)
  );

  const totalBalance = banks.reduce((sum, b) => sum + b.currentBalance, 0);

  const handleSave = () => {
    if (formData.id) {
      setBanks(banks.map(b => b.id === formData.id ? { ...b, ...formData } as Bank : b));
    } else {
      const newBank: Bank = {
        id: banks.length + 1,
        code: `BNK${String(banks.length + 1).padStart(3, '0')}`,
        name: formData.name || '',
        bankName: formData.bankName || '',
        accountNumber: formData.accountNumber || '',
        iban: formData.iban || '',
        branch: formData.branch || '',
        openingBalance: formData.openingBalance || 0,
        currentBalance: formData.openingBalance || 0,
        currency: 'SAR',
        isDefault: false,
        isActive: true,
      };
      setBanks([...banks, newBank]);
    }
    setIsModalOpen(false);
    setFormData({});
  };

  return (
    <AccountingLayout title="البنوك">
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🏦</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>عدد الحسابات البنكية</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{banks.length}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>💳</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>إجمالي الأرصدة البنكية</div>
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
            placeholder="بحث بالاسم أو الكود أو البنك..."
            style={{ width: 300 }}
          />
          <Button onClick={() => { setFormData({}); setIsModalOpen(true); }}>+ إضافة حساب بنكي</Button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الكود</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>اسم الحساب</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>البنك</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>رقم الحساب</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الرصيد الحالي</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الحالة</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredBanks.map(bank => (
              <tr key={bank.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 16px', color: '#3b82f6', fontWeight: 600 }}>{bank.code}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>{bank.name}</div>
                  {bank.isDefault && <Badge label="افتراضي" color="#f59e0b" />}
                </td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{bank.bankName}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{bank.accountNumber}</td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#059669' }}>{bank.currentBalance.toLocaleString()} ر.س</td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge label={bank.isActive ? 'نشط' : 'غير نشط'} color={bank.isActive ? '#22c55e' : '#ef4444'} />
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <Button variant="ghost" size="sm" onClick={() => { setFormData(bank); setIsModalOpen(true); }}>✏️</Button>
                  <Button variant="ghost" size="sm" onClick={() => setBanks(banks.filter(b => b.id !== bank.id))}>🗑️</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'تعديل حساب بنكي' : 'إضافة حساب بنكي جديد'} width={600}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="اسم الحساب" value={formData.name || ''} onChange={v => setFormData({ ...formData, name: v })} required />
          <Input label="اسم البنك" value={formData.bankName || ''} onChange={v => setFormData({ ...formData, bankName: v })} required />
          <Input label="رقم الحساب" value={formData.accountNumber || ''} onChange={v => setFormData({ ...formData, accountNumber: v })} />
          <Input label="رقم الآيبان (IBAN)" value={formData.iban || ''} onChange={v => setFormData({ ...formData, iban: v })} />
          <Input label="الفرع" value={formData.branch || ''} onChange={v => setFormData({ ...formData, branch: v })} />
          <Input label="الرصيد الافتتاحي" value={formData.openingBalance || ''} onChange={v => setFormData({ ...formData, openingBalance: parseFloat(v) || 0 })} type="number" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
          <Button onClick={handleSave}>حفظ</Button>
        </div>
      </Modal>
    </AccountingLayout>
  );
}
