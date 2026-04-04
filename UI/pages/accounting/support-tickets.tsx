import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Modal, Badge, Select } from '../../components/AccountingLayout';

interface SupportTicket {
  id: number;
  ticketNumber: string;
  customerName: string;
  customerPhone: string;
  subject: string;
  description: string;
  priority: string;
  category: string;
  status: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

const mockTickets: SupportTicket[] = [
  { id: 1, ticketNumber: 'TKT-2024-001', customerName: 'أحمد محمد', customerPhone: '0501234567', subject: 'مشكلة في الفاتورة', description: 'الفاتورة تظهر مبلغ خاطئ', priority: 'عالي', category: 'فواتير', status: 'مفتوح', assignedTo: 'محمد سعد', createdAt: '2024-01-15 10:30', updatedAt: '2024-01-15 11:00' },
  { id: 2, ticketNumber: 'TKT-2024-002', customerName: 'فهد عبدالله', customerPhone: '0509876543', subject: 'استفسار عن المنتج', description: 'أريد معرفة مواصفات المنتج', priority: 'متوسط', category: 'منتجات', status: 'قيد المعالجة', assignedTo: 'خالد أحمد', createdAt: '2024-01-15 11:45', updatedAt: '2024-01-15 14:30' },
  { id: 3, ticketNumber: 'TKT-2024-003', customerName: 'خالد سعد', customerPhone: '0551234567', subject: 'طلب استرجاع', description: 'أريد استرجاع المنتج', priority: 'عاجل', category: 'مرتجعات', status: 'مفتوح', assignedTo: '', createdAt: '2024-01-15 14:20', updatedAt: '2024-01-15 14:20' },
  { id: 4, ticketNumber: 'TKT-2024-004', customerName: 'محمد سالم', customerPhone: '0561234567', subject: 'شكوى عن التوصيل', description: 'تأخر التوصيل 3 أيام', priority: 'عالي', category: 'توصيل', status: 'تم الحل', assignedTo: 'فيصل علي', createdAt: '2024-01-14 09:15', updatedAt: '2024-01-15 10:00' },
  { id: 5, ticketNumber: 'TKT-2024-005', customerName: 'عبدالله حسن', customerPhone: '0571234567', subject: 'استفسار عام', description: 'أريد معرفة ساعات العمل', priority: 'منخفض', category: 'عام', status: 'مغلق', assignedTo: 'محمد سعد', createdAt: '2024-01-13 16:00', updatedAt: '2024-01-13 16:30' },
];

const categories = ['فواتير', 'منتجات', 'مرتجعات', 'توصيل', 'دفع', 'عام'];
const priorities = ['منخفض', 'متوسط', 'عالي', 'عاجل'];
const statuses = ['مفتوح', 'قيد المعالجة', 'تم الحل', 'مغلق'];

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [formData, setFormData] = useState<Partial<SupportTicket>>({});

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.ticketNumber.includes(searchTerm) || t.customerName.includes(searchTerm) || t.subject.includes(searchTerm);
    const matchesFilter = filter === 'all' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  const openTickets = tickets.filter(t => t.status === 'مفتوح').length;
  const inProgressTickets = tickets.filter(t => t.status === 'قيد المعالجة').length;
  const resolvedTickets = tickets.filter(t => t.status === 'تم الحل').length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عاجل': return '#dc2626';
      case 'عالي': return '#f59e0b';
      case 'متوسط': return '#3b82f6';
      case 'منخفض': return '#22c55e';
      default: return '#64748b';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مفتوح': return '#ef4444';
      case 'قيد المعالجة': return '#f59e0b';
      case 'تم الحل': return '#22c55e';
      case 'مغلق': return '#64748b';
      default: return '#64748b';
    }
  };

  const handleSave = () => {
    const newTicket: SupportTicket = {
      id: tickets.length + 1,
      ticketNumber: `TKT-2024-${String(tickets.length + 1).padStart(3, '0')}`,
      customerName: formData.customerName || '',
      customerPhone: formData.customerPhone || '',
      subject: formData.subject || '',
      description: formData.description || '',
      priority: formData.priority || 'متوسط',
      category: formData.category || 'عام',
      status: 'مفتوح',
      assignedTo: '',
      createdAt: new Date().toLocaleString('ar-SA'),
      updatedAt: new Date().toLocaleString('ar-SA'),
    };
    setTickets([newTicket, ...tickets]);
    setIsModalOpen(false);
    setFormData({});
  };

  const updateTicketStatus = (ticketId: number, newStatus: string) => {
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus, updatedAt: new Date().toLocaleString('ar-SA') } : t));
  };

  return (
    <AccountingLayout title="تذاكر دعم العملاء">
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🎫</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>تذاكر مفتوحة</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#dc2626' }}>{openTickets}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>⏳</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>قيد المعالجة</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#d97706' }}>{inProgressTickets}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>✅</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>تم الحل</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>{resolvedTickets}</div>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📊</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b' }}>إجمالي التذاكر</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6' }}>{tickets.length}</div>
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
              placeholder="بحث برقم التذكرة أو الاسم..."
              style={{ width: 300 }}
            />
            <div style={{ display: 'flex', gap: 4 }}>
              <Button variant={filter === 'all' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('all')}>الكل</Button>
              <Button variant={filter === 'مفتوح' ? 'danger' : 'secondary'} size="sm" onClick={() => setFilter('مفتوح')}>مفتوح</Button>
              <Button variant={filter === 'قيد المعالجة' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('قيد المعالجة')}>قيد المعالجة</Button>
              <Button variant={filter === 'تم الحل' ? 'success' : 'secondary'} size="sm" onClick={() => setFilter('تم الحل')}>تم الحل</Button>
            </div>
          </div>
          <Button onClick={() => { setFormData({}); setIsModalOpen(true); }}>+ تذكرة جديدة</Button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>رقم التذكرة</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>العميل</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الموضوع</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>التصنيف</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الأولوية</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الحالة</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>المسؤول</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map(ticket => (
              <tr key={ticket.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 16px', color: '#3b82f6', fontWeight: 600 }}>{ticket.ticketNumber}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>{ticket.customerName}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{ticket.customerPhone}</div>
                </td>
                <td style={{ padding: '12px 16px', maxWidth: 200 }}>
                  <div style={{ fontWeight: 500, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.subject}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{ticket.createdAt}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge label={ticket.category} color="#6366f1" />
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge label={ticket.priority} color={getPriorityColor(ticket.priority)} />
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge label={ticket.status} color={getStatusColor(ticket.status)} />
                </td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>
                  {ticket.assignedTo || <span style={{ fontStyle: 'italic' }}>غير معين</span>}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <Button variant="ghost" size="sm" onClick={() => { setSelectedTicket(ticket); setIsViewOpen(true); }}>👁️</Button>
                  {ticket.status !== 'مغلق' && (
                    <Button variant="ghost" size="sm" onClick={() => updateTicketStatus(ticket.id, 'تم الحل')}>✅</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* New Ticket Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="إنشاء تذكرة جديدة" width={600}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="اسم العميل" value={formData.customerName || ''} onChange={v => setFormData({ ...formData, customerName: v })} required />
          <Input label="رقم الهاتف" value={formData.customerPhone || ''} onChange={v => setFormData({ ...formData, customerPhone: v })} />
          <Select 
            label="التصنيف" 
            value={formData.category || 'عام'} 
            onChange={v => setFormData({ ...formData, category: v })}
            options={categories.map(c => ({ value: c, label: c }))}
          />
          <Select 
            label="الأولوية" 
            value={formData.priority || 'متوسط'} 
            onChange={v => setFormData({ ...formData, priority: v })}
            options={priorities.map(p => ({ value: p, label: p }))}
          />
        </div>
        <div style={{ marginTop: 16 }}>
          <Input label="الموضوع" value={formData.subject || ''} onChange={v => setFormData({ ...formData, subject: v })} required />
        </div>
        <div style={{ marginTop: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>الوصف</label>
          <textarea 
            value={formData.description || ''} 
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            style={{ width: '100%', minHeight: 100, padding: 12, border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }}
            placeholder="اكتب تفاصيل المشكلة..."
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
          <Button onClick={handleSave}>إنشاء التذكرة</Button>
        </div>
      </Modal>

      {/* View Ticket Modal */}
      {selectedTicket && (
        <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title={`تذكرة ${selectedTicket.ticketNumber}`} width={600}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>العميل</div>
              <div style={{ fontWeight: 600 }}>{selectedTicket.customerName}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{selectedTicket.customerPhone}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>الحالة</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Badge label={selectedTicket.status} color={getStatusColor(selectedTicket.status)} />
                <Badge label={selectedTicket.priority} color={getPriorityColor(selectedTicket.priority)} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>التصنيف</div>
              <Badge label={selectedTicket.category} color="#6366f1" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>المسؤول</div>
              <div style={{ fontWeight: 500 }}>{selectedTicket.assignedTo || 'غير معين'}</div>
            </div>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>الموضوع</div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{selectedTicket.subject}</div>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>الوصف</div>
            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, whiteSpace: 'pre-wrap' }}>
              {selectedTicket.description}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
            <span>تم الإنشاء: {selectedTicket.createdAt}</span>
            <span>آخر تحديث: {selectedTicket.updatedAt}</span>
          </div>

          {selectedTicket.status !== 'مغلق' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              {selectedTicket.status === 'مفتوح' && (
                <Button variant="secondary" onClick={() => { updateTicketStatus(selectedTicket.id, 'قيد المعالجة'); setIsViewOpen(false); }}>
                  بدء المعالجة
                </Button>
              )}
              {selectedTicket.status !== 'تم الحل' && (
                <Button variant="success" onClick={() => { updateTicketStatus(selectedTicket.id, 'تم الحل'); setIsViewOpen(false); }}>
                  تم الحل
                </Button>
              )}
              <Button variant="secondary" onClick={() => { updateTicketStatus(selectedTicket.id, 'مغلق'); setIsViewOpen(false); }}>
                إغلاق التذكرة
              </Button>
            </div>
          )}
        </Modal>
      )}
    </AccountingLayout>
  );
}
