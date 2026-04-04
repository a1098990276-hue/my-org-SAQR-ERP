import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Modal, Badge, Select } from '../../../components/AccountingLayout';

interface Voucher {
  id: number;
  voucherNumber: string;
  voucherDate: string;
  voucherType: 'receipt' | 'payment';
  paymentMethod: string;
  amount: number;
  partyType: string;
  partyName: string;
  description: string;
  reference: string;
  status: string;
}

const mockVouchers: Voucher[] = [
  { id: 1, voucherNumber: 'RV-2024-001', voucherDate: '2024-01-15', voucherType: 'receipt', paymentMethod: 'نقدي', amount: 15000, partyType: 'عميل', partyName: 'شركة الفجر التجارية', description: 'تحصيل فاتورة رقم INV-001', reference: 'INV-001', status: 'مرحّل' },
  { id: 2, voucherNumber: 'PV-2024-001', voucherDate: '2024-01-16', voucherType: 'payment', paymentMethod: 'تحويل بنكي', amount: 25000, partyType: 'مورد', partyName: 'مؤسسة النور للتوريدات', description: 'سداد فاتورة مشتريات', reference: 'PUR-005', status: 'مرحّل' },
  { id: 3, voucherNumber: 'RV-2024-002', voucherDate: '2024-01-17', voucherType: 'receipt', paymentMethod: 'شيك', amount: 8500, partyType: 'عميل', partyName: 'مطاعم الضيافة', description: 'دفعة من العميل', reference: '', status: 'مسودة' },
  { id: 4, voucherNumber: 'PV-2024-002', voucherDate: '2024-01-18', voucherType: 'payment', paymentMethod: 'نقدي', amount: 5000, partyType: 'موظف', partyName: 'محمد أحمد', description: 'سلفة راتب', reference: '', status: 'مرحّل' },
];

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'receipt' | 'payment'>('all');
  const [formData, setFormData] = useState<Partial<Voucher>>({});

  const filteredVouchers = vouchers.filter(v => {
    const matchesSearch = v.voucherNumber.includes(searchTerm) || v.partyName.includes(searchTerm) || v.description.includes(searchTerm);
    const matchesFilter = filter === 'all' || v.voucherType === filter;
    return matchesSearch && matchesFilter;
  });

  const totalReceipts = vouchers.filter(v => v.voucherType === 'receipt').reduce((sum, v) => sum + v.amount, 0);
  const totalPayments = vouchers.filter(v => v.voucherType === 'payment').reduce((sum, v) => sum + v.amount, 0);

  const handleSave = () => {
    if (formData.id) {
      setVouchers(vouchers.map(v => v.id === formData.id ? { ...v, ...formData } as Voucher : v));
    } else {
      const prefix = formData.voucherType === 'receipt' ? 'RV' : 'PV';
      const count = vouchers.filter(v => v.voucherType === formData.voucherType).length + 1;
      const newVoucher: Voucher = {
        id: vouchers.length + 1,
        voucherNumber: `${prefix}-2024-${String(count).padStart(3, '0')}`,
        voucherDate: formData.voucherDate || new Date().toISOString().split('T')[0],
        voucherType: formData.voucherType || 'receipt',
        paymentMethod: formData.paymentMethod || 'نقدي',
        amount: formData.amount || 0,
        partyType: formData.partyType || '',
        partyName: formData.partyName || '',
        description: formData.description || '',
        reference: formData.reference || '',
        status: 'مسودة',
      };
      setVouchers([...vouchers, newVoucher]);
    }
    setIsModalOpen(false);
    setFormData({});
  };

  const openNewVoucher = (type: 'receipt' | 'payment') => {
    setFormData({ voucherType: type });
    setIsModalOpen(true);
  };

  return (
    <AccountingLayout title="السندات المالية">
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card style={{ flex: 1, cursor: 'pointer' }} onClick={() => openNewVoucher('receipt')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📥</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>إجمالي التحصيلات</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>{totalReceipts.toLocaleString()} ر.س</div>
              <div style={{ fontSize: 12, color: '#3b82f6', marginTop: 4 }}>+ سند قبض جديد</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1, cursor: 'pointer' }} onClick={() => openNewVoucher('payment')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📤</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>إجمالي المدفوعات</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#dc2626' }}>{totalPayments.toLocaleString()} ر.س</div>
              <div style={{ fontSize: 12, color: '#3b82f6', marginTop: 4 }}>+ سند صرف جديد</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📊</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>صافي الحركة</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: totalReceipts - totalPayments >= 0 ? '#059669' : '#dc2626' }}>
                {(totalReceipts - totalPayments).toLocaleString()} ر.س
              </div>
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
              placeholder="بحث برقم السند أو الاسم..."
              style={{ width: 300 }}
            />
            <div style={{ display: 'flex', gap: 4 }}>
              <Button variant={filter === 'all' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('all')}>الكل</Button>
              <Button variant={filter === 'receipt' ? 'success' : 'secondary'} size="sm" onClick={() => setFilter('receipt')}>القبض</Button>
              <Button variant={filter === 'payment' ? 'danger' : 'secondary'} size="sm" onClick={() => setFilter('payment')}>الصرف</Button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="success" onClick={() => openNewVoucher('receipt')}>📥 سند قبض</Button>
            <Button variant="danger" onClick={() => openNewVoucher('payment')}>📤 سند صرف</Button>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>رقم السند</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>التاريخ</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>النوع</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>طريقة الدفع</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الطرف</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>المبلغ</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>البيان</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الحالة</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredVouchers.map(voucher => (
              <tr key={voucher.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 16px', color: '#3b82f6', fontWeight: 600 }}>{voucher.voucherNumber}</td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{voucher.voucherDate}</td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge 
                    label={voucher.voucherType === 'receipt' ? 'سند قبض' : 'سند صرف'} 
                    color={voucher.voucherType === 'receipt' ? '#22c55e' : '#ef4444'} 
                  />
                </td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{voucher.paymentMethod}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>{voucher.partyName}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{voucher.partyType}</div>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: voucher.voucherType === 'receipt' ? '#059669' : '#dc2626' }}>
                  {voucher.voucherType === 'receipt' ? '+' : '-'}{voucher.amount.toLocaleString()} ر.س
                </td>
                <td style={{ padding: '12px 16px', color: '#64748b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {voucher.description}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge label={voucher.status} color={voucher.status === 'مرحّل' ? '#3b82f6' : '#f59e0b'} />
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <Button variant="ghost" size="sm" onClick={() => { setFormData(voucher); setIsModalOpen(true); }}>✏️</Button>
                  <Button variant="ghost" size="sm">🖨️</Button>
                  <Button variant="ghost" size="sm" onClick={() => setVouchers(vouchers.filter(v => v.id !== voucher.id))}>🗑️</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.voucherType === 'receipt' ? 'سند تحصيل / قبض' : 'سند سداد / صرف'} width={700}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="التاريخ" value={formData.voucherDate || new Date().toISOString().split('T')[0]} onChange={v => setFormData({ ...formData, voucherDate: v })} type="date" required />
          <Select 
            label="طريقة الدفع" 
            value={formData.paymentMethod || 'نقدي'} 
            onChange={v => setFormData({ ...formData, paymentMethod: v })}
            options={[
              { value: 'نقدي', label: 'نقدي' },
              { value: 'تحويل بنكي', label: 'تحويل بنكي' },
              { value: 'شيك', label: 'شيك' },
              { value: 'بطاقة', label: 'بطاقة ائتمانية' },
            ]}
          />
          <Input label="المبلغ" value={formData.amount || ''} onChange={v => setFormData({ ...formData, amount: parseFloat(v) || 0 })} type="number" required />
          <Select 
            label="نوع الطرف" 
            value={formData.partyType || 'عميل'} 
            onChange={v => setFormData({ ...formData, partyType: v })}
            options={[
              { value: 'عميل', label: 'عميل' },
              { value: 'مورد', label: 'مورد' },
              { value: 'موظف', label: 'موظف' },
              { value: 'شريك', label: 'شريك' },
              { value: 'أخرى', label: 'أخرى' },
            ]}
          />
          <Input label="اسم الطرف" value={formData.partyName || ''} onChange={v => setFormData({ ...formData, partyName: v })} required />
          <Input label="المرجع" value={formData.reference || ''} onChange={v => setFormData({ ...formData, reference: v })} />
        </div>
        <div style={{ marginTop: 16 }}>
          <Input label="البيان / الوصف" value={formData.description || ''} onChange={v => setFormData({ ...formData, description: v })} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
          <Button variant="secondary">حفظ كمسودة</Button>
          <Button onClick={handleSave}>حفظ وترحيل</Button>
        </div>
      </Modal>
    </AccountingLayout>
  );
}
