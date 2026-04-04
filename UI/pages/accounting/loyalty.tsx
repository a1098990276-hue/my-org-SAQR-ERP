import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Modal, Badge } from '../../components/AccountingLayout';

interface LoyaltyTransaction {
  id: number;
  customerName: string;
  customerPhone: string;
  transactionType: string;
  points: number;
  balanceAfter: number;
  reference: string;
  description: string;
  createdAt: string;
}

interface LoyaltySettings {
  pointsPerSAR: number;
  sarPerPoint: number;
  minRedeemPoints: number;
  maxRedeemPercentage: number;
  expiryDays: number;
}

const mockTransactions: LoyaltyTransaction[] = [
  { id: 1, customerName: 'أحمد محمد', customerPhone: '0501234567', transactionType: 'كسب', points: 150, balanceAfter: 2150, reference: 'INV-2024-001', description: 'فاتورة مبيعات', createdAt: '2024-01-15 10:30' },
  { id: 2, customerName: 'فهد عبدالله', customerPhone: '0509876543', transactionType: 'استبدال', points: -500, balanceAfter: 1500, reference: 'RDM-2024-001', description: 'استبدال نقاط', createdAt: '2024-01-15 11:45' },
  { id: 3, customerName: 'خالد سعد', customerPhone: '0551234567', transactionType: 'كسب', points: 80, balanceAfter: 580, reference: 'INV-2024-002', description: 'فاتورة مبيعات', createdAt: '2024-01-15 14:20' },
  { id: 4, customerName: 'محمد سالم', customerPhone: '0561234567', transactionType: 'انتهاء', points: -200, balanceAfter: 0, reference: 'EXP-2024-001', description: 'انتهاء صلاحية النقاط', createdAt: '2024-01-16 00:00' },
  { id: 5, customerName: 'عبدالله حسن', customerPhone: '0571234567', transactionType: 'كسب', points: 300, balanceAfter: 2300, reference: 'INV-2024-003', description: 'فاتورة مبيعات', createdAt: '2024-01-16 09:15' },
];

const mockSettings: LoyaltySettings = {
  pointsPerSAR: 1,
  sarPerPoint: 0.1,
  minRedeemPoints: 100,
  maxRedeemPercentage: 50,
  expiryDays: 365,
};

const topCustomers = [
  { name: 'أحمد محمد', phone: '0501234567', points: 2150, totalSpent: 21500 },
  { name: 'عبدالله حسن', phone: '0571234567', points: 2300, totalSpent: 23000 },
  { name: 'فهد عبدالله', phone: '0509876543', points: 1500, totalSpent: 20000 },
  { name: 'خالد سعد', phone: '0551234567', points: 580, totalSpent: 5800 },
];

export default function LoyaltyPage() {
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>(mockTransactions);
  const [settings, setSettings] = useState<LoyaltySettings>(mockSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.customerName.includes(searchTerm) || t.customerPhone.includes(searchTerm);
    const matchesFilter = filter === 'all' || t.transactionType === filter;
    return matchesSearch && matchesFilter;
  });

  const totalEarned = transactions.filter(t => t.transactionType === 'كسب').reduce((sum, t) => sum + t.points, 0);
  const totalRedeemed = Math.abs(transactions.filter(t => t.transactionType === 'استبدال').reduce((sum, t) => sum + t.points, 0));
  const totalExpired = Math.abs(transactions.filter(t => t.transactionType === 'انتهاء').reduce((sum, t) => sum + t.points, 0));

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'كسب': return '#22c55e';
      case 'استبدال': return '#3b82f6';
      case 'انتهاء': return '#ef4444';
      case 'تعديل': return '#f59e0b';
      default: return '#64748b';
    }
  };

  return (
    <AccountingLayout title="نقاط الولاء">
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>⭐</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>النقاط المكتسبة</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>{totalEarned.toLocaleString()}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🎁</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>النقاط المستبدلة</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6' }}>{totalRedeemed.toLocaleString()}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>⏰</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>النقاط المنتهية</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#dc2626' }}>{totalExpired.toLocaleString()}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1, cursor: 'pointer' }} onClick={() => setIsSettingsOpen(true)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>⚙️</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>قيمة النقطة</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{settings.sarPerPoint} ر.س</div>
              <div style={{ fontSize: 11, color: '#3b82f6' }}>إعدادات البرنامج ←</div>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <Input
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="بحث بالاسم أو الهاتف..."
                style={{ width: 250 }}
              />
              <div style={{ display: 'flex', gap: 4 }}>
                <Button variant={filter === 'all' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('all')}>الكل</Button>
                <Button variant={filter === 'كسب' ? 'success' : 'secondary'} size="sm" onClick={() => setFilter('كسب')}>كسب</Button>
                <Button variant={filter === 'استبدال' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('استبدال')}>استبدال</Button>
                <Button variant={filter === 'انتهاء' ? 'danger' : 'secondary'} size="sm" onClick={() => setFilter('انتهاء')}>انتهاء</Button>
              </div>
            </div>
            <Button onClick={() => setIsRedeemOpen(true)}>🎁 استبدال نقاط</Button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>العميل</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>النوع</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>النقاط</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الرصيد</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الوصف</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <tr key={transaction.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{transaction.customerName}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{transaction.customerPhone}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge label={transaction.transactionType} color={getTransactionColor(transaction.transactionType)} />
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: transaction.points > 0 ? '#059669' : '#dc2626' }}>
                    {transaction.points > 0 ? '+' : ''}{transaction.points}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{transaction.balanceAfter.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>
                    <div>{transaction.description}</div>
                    {transaction.reference && <div style={{ fontFamily: 'monospace', fontSize: 11 }}>{transaction.reference}</div>}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 12 }}>{transaction.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>🏆 أفضل العملاء</h3>
            {topCustomers.map((customer, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: index < topCustomers.length - 1 ? '1px solid #f1f5f9' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    background: index === 0 ? '#fef3c7' : index === 1 ? '#f1f5f9' : index === 2 ? '#ffedd5' : '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                    color: index === 0 ? '#d97706' : index === 1 ? '#64748b' : index === 2 ? '#ea580c' : '#94a3b8'
                  }}>
                    {index + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>{customer.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{customer.phone}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, color: '#3b82f6', fontSize: 16 }}>⭐ {customer.points.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{customer.totalSpent.toLocaleString()} ر.س</div>
                </div>
              </div>
            ))}
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#fff' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>📊 إحصائيات البرنامج</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 12, opacity: 0.9 }}>نقاط / ريال</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{settings.pointsPerSAR}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 12, opacity: 0.9 }}>الحد الأدنى</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{settings.minRedeemPoints}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 12, opacity: 0.9 }}>أقصى استبدال</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{settings.maxRedeemPercentage}%</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 12, opacity: 0.9 }}>صلاحية النقاط</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{settings.expiryDays} يوم</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="إعدادات برنامج الولاء" width={500}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="النقاط لكل ريال" value={settings.pointsPerSAR} onChange={v => setSettings({ ...settings, pointsPerSAR: parseFloat(v) || 0 })} type="number" />
          <Input label="قيمة النقطة (ر.س)" value={settings.sarPerPoint} onChange={v => setSettings({ ...settings, sarPerPoint: parseFloat(v) || 0 })} type="number" />
          <Input label="الحد الأدنى للاستبدال (نقطة)" value={settings.minRedeemPoints} onChange={v => setSettings({ ...settings, minRedeemPoints: parseInt(v) || 0 })} type="number" />
          <Input label="أقصى نسبة استبدال من الفاتورة %" value={settings.maxRedeemPercentage} onChange={v => setSettings({ ...settings, maxRedeemPercentage: parseFloat(v) || 0 })} type="number" />
          <Input label="صلاحية النقاط (يوم)" value={settings.expiryDays} onChange={v => setSettings({ ...settings, expiryDays: parseInt(v) || 0 })} type="number" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
          <Button variant="secondary" onClick={() => setIsSettingsOpen(false)}>إلغاء</Button>
          <Button onClick={() => setIsSettingsOpen(false)}>حفظ الإعدادات</Button>
        </div>
      </Modal>

      {/* Redeem Modal */}
      <Modal isOpen={isRedeemOpen} onClose={() => setIsRedeemOpen(false)} title="استبدال نقاط" width={500}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="رقم هاتف العميل" value="" placeholder="05xxxxxxxx" onChange={() => {}} />
          <Input label="عدد النقاط للاستبدال" value="" type="number" onChange={() => {}} />
          <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#64748b' }}>رصيد العميل:</span>
              <span style={{ fontWeight: 600 }}>0 نقطة</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>قيمة الاستبدال:</span>
              <span style={{ fontWeight: 600, color: '#059669' }}>0 ر.س</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
          <Button variant="secondary" onClick={() => setIsRedeemOpen(false)}>إلغاء</Button>
          <Button>تأكيد الاستبدال</Button>
        </div>
      </Modal>
    </AccountingLayout>
  );
}
