import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Modal, Badge, Select } from '../../components/AccountingLayout';

interface Promotion {
  id: number;
  code: string;
  name: string;
  promotionType: string;
  discountType: string;
  discountValue: number;
  minPurchase: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

const mockPromotions: Promotion[] = [
  { id: 1, code: 'SUMMER2024', name: 'خصم الصيف', promotionType: 'خصم', discountType: 'نسبة', discountValue: 20, minPurchase: 100, maxDiscount: 50, startDate: '2024-06-01', endDate: '2024-08-31', usageLimit: 1000, usedCount: 450, isActive: true },
  { id: 2, code: 'NEWUSER', name: 'عرض العملاء الجدد', promotionType: 'خصم', discountType: 'مبلغ', discountValue: 25, minPurchase: 50, maxDiscount: 25, startDate: '2024-01-01', endDate: '2024-12-31', usageLimit: 0, usedCount: 2500, isActive: true },
  { id: 3, code: 'BUY2GET1', name: 'اشتري 2 واحصل على 1', promotionType: 'اشتري واحصل', discountType: 'نسبة', discountValue: 33, minPurchase: 0, maxDiscount: 0, startDate: '2024-01-15', endDate: '2024-02-28', usageLimit: 500, usedCount: 500, isActive: false },
];

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Promotion>>({});

  const filteredPromotions = promotions.filter(p => 
    p.name.includes(searchTerm) || p.code.includes(searchTerm)
  );

  const handleSave = () => {
    if (formData.id) {
      setPromotions(promotions.map(p => p.id === formData.id ? { ...p, ...formData } as Promotion : p));
    } else {
      const newPromotion: Promotion = {
        id: promotions.length + 1,
        code: formData.code || '',
        name: formData.name || '',
        promotionType: formData.promotionType || 'خصم',
        discountType: formData.discountType || 'نسبة',
        discountValue: formData.discountValue || 0,
        minPurchase: formData.minPurchase || 0,
        maxDiscount: formData.maxDiscount || 0,
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        usageLimit: formData.usageLimit || 0,
        usedCount: 0,
        isActive: true,
      };
      setPromotions([...promotions, newPromotion]);
    }
    setIsModalOpen(false);
    setFormData({});
  };

  const isExpired = (endDate: string) => new Date(endDate) < new Date();
  const isActive = (p: Promotion) => p.isActive && !isExpired(p.endDate) && (p.usageLimit === 0 || p.usedCount < p.usageLimit);

  return (
    <AccountingLayout title="العروض الترويجية">
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🏷️</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>إجمالي العروض</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{promotions.length}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>✅</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>العروض النشطة</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>{promotions.filter(isActive).length}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📊</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>إجمالي الاستخدام</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#d97706' }}>{promotions.reduce((sum, p) => sum + p.usedCount, 0)}</div>
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
          <Button onClick={() => { setFormData({}); setIsModalOpen(true); }}>+ إضافة عرض ترويجي</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16 }}>
          {filteredPromotions.map(promotion => (
            <div key={promotion.id} style={{ 
              background: '#fff', 
              border: '1px solid #e2e8f0', 
              borderRadius: 12, 
              padding: 20,
              opacity: isActive(promotion) ? 1 : 0.7,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 16, marginBottom: 4 }}>{promotion.name}</div>
                  <div style={{ fontSize: 14, color: '#3b82f6', fontFamily: 'monospace', fontWeight: 600 }}>{promotion.code}</div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <Badge label={promotion.promotionType} color="#8b5cf6" />
                  <Badge 
                    label={isActive(promotion) ? 'نشط' : isExpired(promotion.endDate) ? 'منتهي' : 'معطل'} 
                    color={isActive(promotion) ? '#22c55e' : '#ef4444'} 
                  />
                </div>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: 8, padding: 12, marginBottom: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#3b82f6' }}>
                  {promotion.discountType === 'نسبة' ? `${promotion.discountValue}%` : `${promotion.discountValue} ر.س`}
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {promotion.discountType === 'نسبة' ? 'خصم' : 'خصم ثابت'}
                  {promotion.maxDiscount > 0 && ` (أقصى ${promotion.maxDiscount} ر.س)`}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13, marginBottom: 16 }}>
                <div>
                  <span style={{ color: '#64748b' }}>الحد الأدنى: </span>
                  <span style={{ fontWeight: 600 }}>{promotion.minPurchase} ر.س</span>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>الاستخدام: </span>
                  <span style={{ fontWeight: 600 }}>{promotion.usedCount}{promotion.usageLimit > 0 ? `/${promotion.usageLimit}` : ''}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>البداية: </span>
                  <span style={{ fontWeight: 500 }}>{promotion.startDate}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>النهاية: </span>
                  <span style={{ fontWeight: 500 }}>{promotion.endDate}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                <Button variant="ghost" size="sm" onClick={() => { setFormData(promotion); setIsModalOpen(true); }}>✏️ تعديل</Button>
                <Button variant="ghost" size="sm" onClick={() => setPromotions(promotions.filter(p => p.id !== promotion.id))}>🗑️ حذف</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'تعديل عرض ترويجي' : 'إضافة عرض ترويجي جديد'} width={600}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="كود العرض" value={formData.code || ''} onChange={v => setFormData({ ...formData, code: v.toUpperCase() })} required />
          <Input label="اسم العرض" value={formData.name || ''} onChange={v => setFormData({ ...formData, name: v })} required />
          <Select 
            label="نوع العرض" 
            value={formData.promotionType || 'خصم'} 
            onChange={v => setFormData({ ...formData, promotionType: v })}
            options={[
              { value: 'خصم', label: 'خصم' },
              { value: 'اشتري واحصل', label: 'اشتري واحصل' },
              { value: 'حزمة', label: 'حزمة' },
            ]}
          />
          <Select 
            label="نوع الخصم" 
            value={formData.discountType || 'نسبة'} 
            onChange={v => setFormData({ ...formData, discountType: v })}
            options={[
              { value: 'نسبة', label: 'نسبة مئوية' },
              { value: 'مبلغ', label: 'مبلغ ثابت' },
            ]}
          />
          <Input label="قيمة الخصم" value={formData.discountValue || ''} onChange={v => setFormData({ ...formData, discountValue: parseFloat(v) || 0 })} type="number" />
          <Input label="الحد الأدنى للشراء" value={formData.minPurchase || ''} onChange={v => setFormData({ ...formData, minPurchase: parseFloat(v) || 0 })} type="number" />
          <Input label="أقصى خصم" value={formData.maxDiscount || ''} onChange={v => setFormData({ ...formData, maxDiscount: parseFloat(v) || 0 })} type="number" />
          <Input label="حد الاستخدام (0 = غير محدود)" value={formData.usageLimit || ''} onChange={v => setFormData({ ...formData, usageLimit: parseInt(v) || 0 })} type="number" />
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
