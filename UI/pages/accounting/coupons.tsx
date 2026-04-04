import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Modal, Badge } from '../../components/AccountingLayout';

interface Coupon {
  id: number;
  code: string;
  name: string;
  discountType: string;
  discountValue: number;
  minPurchase: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageLimitPerCustomer: number;
  usedCount: number;
  isActive: boolean;
}

const mockCoupons: Coupon[] = [
  { id: 1, code: 'WELCOME10', name: 'كوبون الترحيب', discountType: 'نسبة', discountValue: 10, minPurchase: 50, maxDiscount: 30, startDate: '2024-01-01', endDate: '2024-12-31', usageLimit: 0, usageLimitPerCustomer: 1, usedCount: 1250, isActive: true },
  { id: 2, code: 'SAVE20', name: 'وفر 20 ريال', discountType: 'مبلغ', discountValue: 20, minPurchase: 100, maxDiscount: 20, startDate: '2024-02-01', endDate: '2024-06-30', usageLimit: 500, usageLimitPerCustomer: 2, usedCount: 320, isActive: true },
  { id: 3, code: 'RAMADAN2024', name: 'عروض رمضان', discountType: 'نسبة', discountValue: 15, minPurchase: 0, maxDiscount: 0, startDate: '2024-03-10', endDate: '2024-04-10', usageLimit: 2000, usageLimitPerCustomer: 3, usedCount: 1850, isActive: true },
];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Coupon>>({});

  const filteredCoupons = coupons.filter(c => 
    c.name.includes(searchTerm) || c.code.includes(searchTerm)
  );

  const handleSave = () => {
    if (formData.id) {
      setCoupons(coupons.map(c => c.id === formData.id ? { ...c, ...formData } as Coupon : c));
    } else {
      const newCoupon: Coupon = {
        id: coupons.length + 1,
        code: formData.code || '',
        name: formData.name || '',
        discountType: formData.discountType || 'نسبة',
        discountValue: formData.discountValue || 0,
        minPurchase: formData.minPurchase || 0,
        maxDiscount: formData.maxDiscount || 0,
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        usageLimit: formData.usageLimit || 0,
        usageLimitPerCustomer: formData.usageLimitPerCustomer || 1,
        usedCount: 0,
        isActive: true,
      };
      setCoupons([...coupons, newCoupon]);
    }
    setIsModalOpen(false);
    setFormData({});
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const isExpired = (endDate: string) => new Date(endDate) < new Date();
  const isActive = (c: Coupon) => c.isActive && !isExpired(c.endDate) && (c.usageLimit === 0 || c.usedCount < c.usageLimit);

  return (
    <AccountingLayout title="الكوبونات والقسائم">
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🎟️</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>إجمالي الكوبونات</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{coupons.length}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>✅</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>الكوبونات النشطة</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>{coupons.filter(isActive).length}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📊</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>مرات الاستخدام</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#d97706' }}>{coupons.reduce((sum, c) => sum + c.usedCount, 0)}</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Input
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="بحث بالكود أو الاسم..."
            style={{ width: 300 }}
          />
          <Button onClick={() => { setFormData({}); setIsModalOpen(true); }}>+ إنشاء كوبون جديد</Button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الكود</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الاسم</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الخصم</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الحد الأدنى</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الصلاحية</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الاستخدام</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الحالة</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.map(coupon => (
              <tr key={coupon.id} style={{ borderBottom: '1px solid #e2e8f0', opacity: isActive(coupon) ? 1 : 0.6 }}>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: '#3b82f6', background: '#dbeafe', padding: '4px 8px', borderRadius: 4 }}>
                    {coupon.code}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>{coupon.name}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontWeight: 700, color: '#059669', fontSize: 16 }}>
                    {coupon.discountType === 'نسبة' ? `${coupon.discountValue}%` : `${coupon.discountValue} ر.س`}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>
                  {coupon.minPurchase > 0 ? `${coupon.minPurchase} ر.س` : '-'}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>
                  <div>{coupon.startDate}</div>
                  <div>← {coupon.endDate}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ 
                        width: coupon.usageLimit > 0 ? `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` : '50%', 
                        height: '100%', 
                        background: coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit ? '#ef4444' : '#22c55e',
                        borderRadius: 3 
                      }} />
                    </div>
                    <span style={{ fontSize: 12, color: '#64748b' }}>
                      {coupon.usedCount}{coupon.usageLimit > 0 ? `/${coupon.usageLimit}` : ''}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge 
                    label={isActive(coupon) ? 'نشط' : isExpired(coupon.endDate) ? 'منتهي' : 'معطل'} 
                    color={isActive(coupon) ? '#22c55e' : '#ef4444'} 
                  />
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <Button variant="ghost" size="sm" onClick={() => { setFormData(coupon); setIsModalOpen(true); }}>✏️</Button>
                  <Button variant="ghost" size="sm" onClick={() => {navigator.clipboard.writeText(coupon.code)}}>📋</Button>
                  <Button variant="ghost" size="sm" onClick={() => setCoupons(coupons.filter(c => c.id !== coupon.id))}>🗑️</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'تعديل كوبون' : 'إنشاء كوبون جديد'} width={600}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input label="كود الكوبون" value={formData.code || ''} onChange={v => setFormData({ ...formData, code: v.toUpperCase() })} required style={{ flex: 1 }} />
            <Button variant="secondary" size="sm" onClick={generateCode} style={{ marginTop: 24 }}>🎲</Button>
          </div>
          <Input label="اسم الكوبون" value={formData.name || ''} onChange={v => setFormData({ ...formData, name: v })} required />
          <div style={{ display: 'flex', gap: 8 }}>
            <select 
              value={formData.discountType || 'نسبة'} 
              onChange={e => setFormData({ ...formData, discountType: e.target.value })}
              style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, marginTop: 24 }}
            >
              <option value="نسبة">%</option>
              <option value="مبلغ">ر.س</option>
            </select>
            <Input label="قيمة الخصم" value={formData.discountValue || ''} onChange={v => setFormData({ ...formData, discountValue: parseFloat(v) || 0 })} type="number" style={{ flex: 1 }} />
          </div>
          <Input label="أقصى خصم (ر.س)" value={formData.maxDiscount || ''} onChange={v => setFormData({ ...formData, maxDiscount: parseFloat(v) || 0 })} type="number" />
          <Input label="الحد الأدنى للشراء" value={formData.minPurchase || ''} onChange={v => setFormData({ ...formData, minPurchase: parseFloat(v) || 0 })} type="number" />
          <Input label="حد الاستخدام الكلي (0 = غير محدود)" value={formData.usageLimit || ''} onChange={v => setFormData({ ...formData, usageLimit: parseInt(v) || 0 })} type="number" />
          <Input label="حد الاستخدام لكل عميل" value={formData.usageLimitPerCustomer || 1} onChange={v => setFormData({ ...formData, usageLimitPerCustomer: parseInt(v) || 1 })} type="number" />
          <Input label="تاريخ البداية" value={formData.startDate || ''} onChange={v => setFormData({ ...formData, startDate: v })} type="date" required />
          <Input label="تاريخ النهاية" value={formData.endDate || ''} onChange={v => setFormData({ ...formData, endDate: v })} type="date" required />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
          <Button onClick={handleSave}>حفظ</Button>
        </div>
      </Modal>
    </AccountingLayout>
  );
}
