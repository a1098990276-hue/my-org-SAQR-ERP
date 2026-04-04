import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Modal, Badge, Select } from '../../../components/AccountingLayout';

interface Branch {
  id: number;
  code: string;
  name: string;
  nameEn: string;
  address: string;
  phone: string;
  email: string;
  taxNumber: string;
  commercialReg: string;
  isMain: boolean;
  isActive: boolean;
}

const mockBranches: Branch[] = [
  { id: 1, code: 'BR001', name: 'الفرع الرئيسي', nameEn: 'Main Branch', address: 'الرياض - حي العليا', phone: '0112345678', email: 'main@company.com', taxNumber: '300012345678901', commercialReg: '1010123456', isMain: true, isActive: true },
  { id: 2, code: 'BR002', name: 'فرع جدة', nameEn: 'Jeddah Branch', address: 'جدة - حي الروضة', phone: '0122345678', email: 'jeddah@company.com', taxNumber: '300012345678902', commercialReg: '4030123456', isMain: false, isActive: true },
  { id: 3, code: 'BR003', name: 'فرع الدمام', nameEn: 'Dammam Branch', address: 'الدمام - حي الفيصلية', phone: '0132345678', email: 'dammam@company.com', taxNumber: '300012345678903', commercialReg: '2050123456', isMain: false, isActive: true },
];

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Branch>>({});

  const filteredBranches = branches.filter(b => 
    b.name.includes(searchTerm) || b.code.includes(searchTerm) || b.address.includes(searchTerm)
  );

  const handleSave = () => {
    if (formData.id) {
      setBranches(branches.map(b => b.id === formData.id ? { ...b, ...formData } as Branch : b));
    } else {
      const newBranch: Branch = {
        id: branches.length + 1,
        code: `BR${String(branches.length + 1).padStart(3, '0')}`,
        name: formData.name || '',
        nameEn: formData.nameEn || '',
        address: formData.address || '',
        phone: formData.phone || '',
        email: formData.email || '',
        taxNumber: formData.taxNumber || '',
        commercialReg: formData.commercialReg || '',
        isMain: false,
        isActive: true,
      };
      setBranches([...branches, newBranch]);
    }
    setIsModalOpen(false);
    setFormData({});
  };

  return (
    <AccountingLayout title="الفروع">
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🏢</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>إجمالي الفروع</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{branches.length}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>✅</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>الفروع النشطة</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>{branches.filter(b => b.isActive).length}</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Input
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="بحث بالاسم أو الكود..."
            style={{ width: 300 }}
          />
          <Button onClick={() => { setFormData({}); setIsModalOpen(true); }}>+ إضافة فرع جديد</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
          {filteredBranches.map(branch => (
            <div key={branch.id} style={{ 
              background: '#fff', 
              border: branch.isMain ? '2px solid #3b82f6' : '1px solid #e2e8f0', 
              borderRadius: 12, 
              padding: 20,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 10, 
                    background: branch.isMain ? '#dbeafe' : '#f1f5f9', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: 24 
                  }}>
                    🏢
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{branch.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{branch.code} • {branch.nameEn}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {branch.isMain && <Badge label="رئيسي" color="#3b82f6" />}
                  <Badge label={branch.isActive ? 'نشط' : 'غير نشط'} color={branch.isActive ? '#22c55e' : '#ef4444'} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16, fontSize: 13 }}>
                <div>
                  <div style={{ color: '#64748b' }}>📍 العنوان</div>
                  <div style={{ fontWeight: 500 }}>{branch.address}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b' }}>📞 الهاتف</div>
                  <div style={{ fontWeight: 500 }}>{branch.phone}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b' }}>🏛️ السجل التجاري</div>
                  <div style={{ fontWeight: 500, fontFamily: 'monospace' }}>{branch.commercialReg}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b' }}>📋 الرقم الضريبي</div>
                  <div style={{ fontWeight: 500, fontFamily: 'monospace', fontSize: 11 }}>{branch.taxNumber}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                <Button variant="ghost" size="sm" onClick={() => { setFormData(branch); setIsModalOpen(true); }}>✏️ تعديل</Button>
                {!branch.isMain && <Button variant="ghost" size="sm" onClick={() => setBranches(branches.filter(b => b.id !== branch.id))}>🗑️ حذف</Button>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'تعديل فرع' : 'إضافة فرع جديد'} width={700}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="اسم الفرع بالعربي" value={formData.name || ''} onChange={v => setFormData({ ...formData, name: v })} required />
          <Input label="اسم الفرع بالإنجليزي" value={formData.nameEn || ''} onChange={v => setFormData({ ...formData, nameEn: v })} />
          <Input label="العنوان" value={formData.address || ''} onChange={v => setFormData({ ...formData, address: v })} style={{ gridColumn: 'span 2' }} />
          <Input label="الهاتف" value={formData.phone || ''} onChange={v => setFormData({ ...formData, phone: v })} />
          <Input label="البريد الإلكتروني" value={formData.email || ''} onChange={v => setFormData({ ...formData, email: v })} type="email" />
          <Input label="الرقم الضريبي" value={formData.taxNumber || ''} onChange={v => setFormData({ ...formData, taxNumber: v })} />
          <Input label="السجل التجاري" value={formData.commercialReg || ''} onChange={v => setFormData({ ...formData, commercialReg: v })} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
          <Button onClick={handleSave}>حفظ</Button>
        </div>
      </Modal>
    </AccountingLayout>
  );
}
