import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Modal, Badge } from '../../../components/AccountingLayout';

interface Employee {
  id: number;
  code: string;
  name: string;
  nameEn: string;
  jobTitle: string;
  department: string;
  phone: string;
  email: string;
  nationalId: string;
  hireDate: string;
  salary: number;
  commission: number;
  branch: string;
  isActive: boolean;
}

const mockEmployees: Employee[] = [
  { id: 1, code: 'EMP001', name: 'محمد أحمد الغامدي', nameEn: 'Mohammed Al-Ghamdi', jobTitle: 'مدير المبيعات', department: 'المبيعات', phone: '0501234567', email: 'mohammed@company.com', nationalId: '1098765432', hireDate: '2020-01-15', salary: 12000, commission: 2, branch: 'الفرع الرئيسي', isActive: true },
  { id: 2, code: 'EMP002', name: 'عبدالله سعد القحطاني', nameEn: 'Abdullah Al-Qahtani', jobTitle: 'محاسب', department: 'المالية', phone: '0509876543', email: 'abdullah@company.com', nationalId: '1087654321', hireDate: '2021-03-20', salary: 8000, commission: 0, branch: 'الفرع الرئيسي', isActive: true },
  { id: 3, code: 'EMP003', name: 'فيصل خالد العتيبي', nameEn: 'Faisal Al-Otaibi', jobTitle: 'مندوب مبيعات', department: 'المبيعات', phone: '0551234567', email: 'faisal@company.com', nationalId: '1076543210', hireDate: '2022-06-10', salary: 6000, commission: 5, branch: 'فرع جدة', isActive: true },
  { id: 4, code: 'EMP004', name: 'أحمد فهد الشمري', nameEn: 'Ahmed Al-Shammari', jobTitle: 'أمين مخزن', department: 'المخازن', phone: '0561234567', email: 'ahmed@company.com', nationalId: '1065432109', hireDate: '2021-09-01', salary: 5500, commission: 0, branch: 'الفرع الرئيسي', isActive: true },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Employee>>({});

  const filteredEmployees = employees.filter(e => 
    e.name.includes(searchTerm) || e.code.includes(searchTerm) || e.department.includes(searchTerm)
  );

  const totalSalaries = employees.reduce((sum, e) => sum + e.salary, 0);

  const handleSave = () => {
    if (formData.id) {
      setEmployees(employees.map(e => e.id === formData.id ? { ...e, ...formData } as Employee : e));
    } else {
      const newEmployee: Employee = {
        id: employees.length + 1,
        code: `EMP${String(employees.length + 1).padStart(3, '0')}`,
        name: formData.name || '',
        nameEn: formData.nameEn || '',
        jobTitle: formData.jobTitle || '',
        department: formData.department || '',
        phone: formData.phone || '',
        email: formData.email || '',
        nationalId: formData.nationalId || '',
        hireDate: formData.hireDate || new Date().toISOString().split('T')[0],
        salary: formData.salary || 0,
        commission: formData.commission || 0,
        branch: formData.branch || '',
        isActive: true,
      };
      setEmployees([...employees, newEmployee]);
    }
    setIsModalOpen(false);
    setFormData({});
  };

  return (
    <AccountingLayout title="الموظفين">
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>👔</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>إجمالي الموظفين</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{employees.length}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>💼</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>إجمالي الرواتب الشهرية</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{totalSalaries.toLocaleString()} ر.س</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>✅</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>الموظفين النشطين</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>{employees.filter(e => e.isActive).length}</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Input
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="بحث بالاسم أو الكود أو القسم..."
            style={{ width: 300 }}
          />
          <Button onClick={() => { setFormData({}); setIsModalOpen(true); }}>+ إضافة موظف جديد</Button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الكود</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الاسم</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>المسمى الوظيفي</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>القسم</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الهاتف</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الراتب</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الحالة</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(employee => (
              <tr key={employee.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 16px', color: '#3b82f6', fontWeight: 600 }}>{employee.code}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>{employee.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{employee.nameEn}</div>
                </td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{employee.jobTitle}</td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge label={employee.department} color="#6366f1" />
                </td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{employee.phone}</td>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{employee.salary.toLocaleString()} ر.س</td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge label={employee.isActive ? 'نشط' : 'غير نشط'} color={employee.isActive ? '#22c55e' : '#ef4444'} />
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <Button variant="ghost" size="sm" onClick={() => { setFormData(employee); setIsModalOpen(true); }}>✏️</Button>
                  <Button variant="ghost" size="sm" onClick={() => setEmployees(employees.filter(e => e.id !== employee.id))}>🗑️</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'تعديل موظف' : 'إضافة موظف جديد'} width={700}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="الاسم بالعربي" value={formData.name || ''} onChange={v => setFormData({ ...formData, name: v })} required />
          <Input label="الاسم بالإنجليزي" value={formData.nameEn || ''} onChange={v => setFormData({ ...formData, nameEn: v })} />
          <Input label="المسمى الوظيفي" value={formData.jobTitle || ''} onChange={v => setFormData({ ...formData, jobTitle: v })} />
          <Input label="القسم" value={formData.department || ''} onChange={v => setFormData({ ...formData, department: v })} />
          <Input label="الهاتف" value={formData.phone || ''} onChange={v => setFormData({ ...formData, phone: v })} />
          <Input label="البريد الإلكتروني" value={formData.email || ''} onChange={v => setFormData({ ...formData, email: v })} type="email" />
          <Input label="رقم الهوية" value={formData.nationalId || ''} onChange={v => setFormData({ ...formData, nationalId: v })} />
          <Input label="تاريخ التعيين" value={formData.hireDate || ''} onChange={v => setFormData({ ...formData, hireDate: v })} type="date" />
          <Input label="الراتب" value={formData.salary || ''} onChange={v => setFormData({ ...formData, salary: parseFloat(v) || 0 })} type="number" />
          <Input label="نسبة العمولة %" value={formData.commission || ''} onChange={v => setFormData({ ...formData, commission: parseFloat(v) || 0 })} type="number" />
          <Input label="الفرع" value={formData.branch || ''} onChange={v => setFormData({ ...formData, branch: v })} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
          <Button onClick={handleSave}>حفظ</Button>
        </div>
      </Modal>
    </AccountingLayout>
  );
}
