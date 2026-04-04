import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Modal, Badge } from '../../../components/AccountingLayout';

interface Partner {
  id: number;
  code: string;
  name: string;
  nameEn: string;
  partnerType: string;
  phone: string;
  email: string;
  sharePercentage: number;
  investmentAmount: number;
  isActive: boolean;
}

const mockPartners: Partner[] = [
  { id: 1, code: 'PTR001', name: 'أحمد محمد العتيبي', nameEn: 'Ahmed Al-Otaibi', partnerType: 'شريك', phone: '0501234567', email: 'ahmed@example.com', sharePercentage: 40, investmentAmount: 500000, isActive: true },
  { id: 2, code: 'PTR002', name: 'فهد عبدالله السبيعي', nameEn: 'Fahad Al-Subaie', partnerType: 'مستثمر', phone: '0509876543', email: 'fahad@example.com', sharePercentage: 30, investmentAmount: 300000, isActive: true },
  { id: 3, code: 'PTR003', name: 'خالد سعود الحربي', nameEn: 'Khalid Al-Harbi', partnerType: 'شريك', phone: '0551234567', email: 'khalid@example.com', sharePercentage: 30, investmentAmount: 200000, isActive: true },
];

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Partner>>({});

  const filteredPartners = partners.filter(p => 
    p.name.includes(searchTerm) || p.code.includes(searchTerm) || p.phone.includes(searchTerm)
  );

  const totalInvestment = partners.reduce((sum, p) => sum + p.investmentAmount, 0);

  const handleSave = () => {
    if (formData.id) {
      setPartners(partners.map(p => p.id === formData.id ? { ...p, ...formData } as Partner : p));
    } else {
      const newPartner: Partner = {
        id: partners.length + 1,
        code: `PTR${String(partners.length + 1).padStart(3, '0')}`,
        name: formData.name || '',
        nameEn: formData.nameEn || '',
        partnerType: formData.partnerType || 'شريك',
        phone: formData.phone || '',
        email: formData.email || '',
        sharePercentage: formData.sharePercentage || 0,
        investmentAmount: formData.investmentAmount || 0,
        isActive: true,
      };
      setPartners([...partners, newPartner]);
    }
    setIsModalOpen(false);
    setFormData({});
  };

  return (
    <AccountingLayout title="الشركاء">
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🤝</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>إجمالي الشركاء</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{partners.length}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>💰</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>إجمالي الاستثمارات</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{totalInvestment.toLocaleString()} ر.س</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Input
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="بحث بالاسم أو الكود أو الهاتف..."
            style={{ width: 300 }}
          />
          <Button onClick={() => { setFormData({}); setIsModalOpen(true); }}>+ إضافة شريك جديد</Button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الكود</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الاسم</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>النوع</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الهاتف</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>نسبة الحصة</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الاستثمار</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الحالة</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartners.map(partner => (
              <tr key={partner.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 16px', color: '#3b82f6', fontWeight: 600 }}>{partner.code}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>{partner.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{partner.nameEn}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge label={partner.partnerType} color={partner.partnerType === 'شريك' ? '#3b82f6' : '#8b5cf6'} />
                </td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{partner.phone}</td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#059669' }}>{partner.sharePercentage}%</td>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{partner.investmentAmount.toLocaleString()} ر.س</td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge label={partner.isActive ? 'نشط' : 'غير نشط'} color={partner.isActive ? '#22c55e' : '#ef4444'} />
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <Button variant="ghost" size="sm" onClick={() => { setFormData(partner); setIsModalOpen(true); }}>✏️</Button>
                  <Button variant="ghost" size="sm" onClick={() => setPartners(partners.filter(p => p.id !== partner.id))}>🗑️</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'تعديل شريك' : 'إضافة شريك جديد'} width={600}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="الاسم بالعربي" value={formData.name || ''} onChange={v => setFormData({ ...formData, name: v })} required />
          <Input label="الاسم بالإنجليزي" value={formData.nameEn || ''} onChange={v => setFormData({ ...formData, nameEn: v })} />
          <Input label="الهاتف" value={formData.phone || ''} onChange={v => setFormData({ ...formData, phone: v })} />
          <Input label="البريد الإلكتروني" value={formData.email || ''} onChange={v => setFormData({ ...formData, email: v })} type="email" />
          <Input label="نسبة الحصة %" value={formData.sharePercentage || ''} onChange={v => setFormData({ ...formData, sharePercentage: parseFloat(v) || 0 })} type="number" />
          <Input label="مبلغ الاستثمار" value={formData.investmentAmount || ''} onChange={v => setFormData({ ...formData, investmentAmount: parseFloat(v) || 0 })} type="number" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
          <Button onClick={handleSave}>حفظ</Button>
        </div>
      </Modal>
    </AccountingLayout>
  );
}
