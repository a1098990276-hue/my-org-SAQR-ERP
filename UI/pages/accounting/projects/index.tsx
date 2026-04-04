import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Modal, Badge, Select } from '../../../components/AccountingLayout';

interface Project {
  id: number;
  code: string;
  name: string;
  description: string;
  customer: string;
  manager: string;
  startDate: string;
  endDate: string;
  budget: number;
  actualCost: number;
  revenue: number;
  status: string;
  progress: number;
}

const mockProjects: Project[] = [
  { id: 1, code: 'PRJ001', name: 'مشروع تطوير النظام', description: 'تطوير نظام ERP متكامل', customer: 'شركة الفجر', manager: 'أحمد محمد', startDate: '2024-01-01', endDate: '2024-06-30', budget: 500000, actualCost: 280000, revenue: 0, status: 'قيد التنفيذ', progress: 60 },
  { id: 2, code: 'PRJ002', name: 'مشروع البنية التحتية', description: 'تحديث الشبكة والخوادم', customer: 'مؤسسة النور', manager: 'خالد سعد', startDate: '2024-02-15', endDate: '2024-05-15', budget: 200000, actualCost: 150000, revenue: 0, status: 'قيد التنفيذ', progress: 80 },
  { id: 3, code: 'PRJ003', name: 'مشروع التسويق الرقمي', description: 'حملة تسويقية شاملة', customer: 'داخلي', manager: 'فهد عبدالله', startDate: '2024-03-01', endDate: '2024-04-30', budget: 100000, actualCost: 95000, revenue: 0, status: 'مكتمل', progress: 100 },
  { id: 4, code: 'PRJ004', name: 'مشروع التدريب', description: 'برنامج تدريب الموظفين', customer: 'داخلي', manager: 'سامي أحمد', startDate: '2024-04-01', endDate: '2024-12-31', budget: 80000, actualCost: 15000, revenue: 0, status: 'قيد التنفيذ', progress: 20 },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [formData, setFormData] = useState<Partial<Project>>({});

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.includes(searchTerm) || p.code.includes(searchTerm) || p.customer.includes(searchTerm);
    const matchesFilter = filter === 'all' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalActualCost = projects.reduce((sum, p) => sum + p.actualCost, 0);
  const activeProjects = projects.filter(p => p.status === 'قيد التنفيذ').length;
  const completedProjects = projects.filter(p => p.status === 'مكتمل').length;

  const handleSave = () => {
    if (formData.id) {
      setProjects(projects.map(p => p.id === formData.id ? { ...p, ...formData } as Project : p));
    } else {
      const newProject: Project = {
        id: projects.length + 1,
        code: `PRJ${String(projects.length + 1).padStart(3, '0')}`,
        name: formData.name || '',
        description: formData.description || '',
        customer: formData.customer || '',
        manager: formData.manager || '',
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        budget: formData.budget || 0,
        actualCost: 0,
        revenue: 0,
        status: 'تخطيط',
        progress: 0,
      };
      setProjects([...projects, newProject]);
    }
    setIsModalOpen(false);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'تخطيط': return '#64748b';
      case 'قيد التنفيذ': return '#3b82f6';
      case 'مكتمل': return '#22c55e';
      case 'متوقف': return '#f59e0b';
      case 'ملغي': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <AccountingLayout title="إدارة المشاريع">
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📁</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>إجمالي المشاريع</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{projects.length}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>⚡</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>قيد التنفيذ</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#6366f1' }}>{activeProjects}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>✅</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>مكتملة</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>{completedProjects}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>💰</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>إجمالي الميزانيات</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#d97706' }}>{totalBudget.toLocaleString()} ر.س</div>
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
            <div style={{ display: 'flex', gap: 4 }}>
              <Button variant={filter === 'all' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('all')}>الكل</Button>
              <Button variant={filter === 'قيد التنفيذ' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('قيد التنفيذ')}>قيد التنفيذ</Button>
              <Button variant={filter === 'مكتمل' ? 'success' : 'secondary'} size="sm" onClick={() => setFilter('مكتمل')}>مكتمل</Button>
              <Button variant={filter === 'متوقف' ? 'secondary' : 'secondary'} size="sm" onClick={() => setFilter('متوقف')}>متوقف</Button>
            </div>
          </div>
          <Button onClick={() => { setFormData({}); setIsModalOpen(true); }}>+ إضافة مشروع جديد</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
          {filteredProjects.map(project => {
            const budgetUsage = project.budget > 0 ? ((project.actualCost / project.budget) * 100).toFixed(0) : 0;
            const isOverBudget = project.actualCost > project.budget;
            
            return (
              <div key={project.id} style={{ 
                background: '#fff', 
                border: '1px solid #e2e8f0', 
                borderRadius: 12, 
                padding: 20,
                borderTop: `4px solid ${getStatusColor(project.status)}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 16, marginBottom: 4 }}>{project.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{project.code} • {project.customer}</div>
                  </div>
                  <Badge label={project.status} color={getStatusColor(project.status)} />
                </div>

                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px', lineHeight: 1.5 }}>
                  {project.description}
                </p>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <span style={{ color: '#64748b' }}>التقدم</span>
                    <span style={{ fontWeight: 600 }}>{project.progress}%</span>
                  </div>
                  <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${project.progress}%`, 
                      height: '100%', 
                      background: getStatusColor(project.status),
                      borderRadius: 4,
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16, fontSize: 13 }}>
                  <div>
                    <div style={{ color: '#64748b', fontSize: 11 }}>الميزانية</div>
                    <div style={{ fontWeight: 600 }}>{project.budget.toLocaleString()} ر.س</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: 11 }}>المصروف</div>
                    <div style={{ fontWeight: 600, color: isOverBudget ? '#dc2626' : '#059669' }}>
                      {project.actualCost.toLocaleString()} ر.س
                      <span style={{ fontSize: 11, color: '#64748b', fontWeight: 400 }}> ({budgetUsage}%)</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: 11 }}>البداية</div>
                    <div style={{ fontWeight: 500 }}>{project.startDate}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: 11 }}>النهاية</div>
                    <div style={{ fontWeight: 500 }}>{project.endDate}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>👤</span>
                    <span style={{ fontSize: 13, color: '#64748b' }}>{project.manager}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button variant="ghost" size="sm" onClick={() => { setFormData(project); setIsModalOpen(true); }}>✏️</Button>
                    <Button variant="ghost" size="sm" onClick={() => setProjects(projects.filter(p => p.id !== project.id))}>🗑️</Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'تعديل مشروع' : 'إضافة مشروع جديد'} width={700}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="اسم المشروع" value={formData.name || ''} onChange={v => setFormData({ ...formData, name: v })} required />
          <Input label="العميل" value={formData.customer || ''} onChange={v => setFormData({ ...formData, customer: v })} />
          <Input label="مدير المشروع" value={formData.manager || ''} onChange={v => setFormData({ ...formData, manager: v })} />
          <Input label="الميزانية" value={formData.budget || ''} onChange={v => setFormData({ ...formData, budget: parseFloat(v) || 0 })} type="number" />
          <Input label="تاريخ البداية" value={formData.startDate || ''} onChange={v => setFormData({ ...formData, startDate: v })} type="date" />
          <Input label="تاريخ النهاية" value={formData.endDate || ''} onChange={v => setFormData({ ...formData, endDate: v })} type="date" />
        </div>
        <div style={{ marginTop: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>الوصف</label>
          <textarea 
            value={formData.description || ''} 
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            style={{ width: '100%', minHeight: 80, padding: 12, border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }}
            placeholder="وصف المشروع..."
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
