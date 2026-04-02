import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Modal, Badge } from '../../components/AccountingLayout';
import { useAccounting, JournalEntry, JournalLine, formatCurrency } from '../../lib/useAccounting';

const emptyLine = (): JournalLine => ({ accountId: 0, accountCode: '', accountName: '', debit: 0, credit: 0, description: '' });

export default function JournalPage() {
  const { journalEntries, accounts, addJournalEntry, deleteJournalEntry } = useAccounting();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [viewEntry, setViewEntry] = useState<JournalEntry | null>(null);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], reference: '', description: '', lines: [emptyLine(), emptyLine()] });

  const filtered = journalEntries.filter(e =>
    e.description.includes(search) || e.reference.includes(search)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const setLine = (idx: number, field: keyof JournalLine, value: string | number) => {
    setForm(f => {
      const lines = [...f.lines];
      lines[idx] = { ...lines[idx], [field]: value };
      if (field === 'accountId') {
        const acc = accounts.find(a => a.id === parseInt(value as string));
        if (acc) lines[idx] = { ...lines[idx], accountCode: acc.code, accountName: acc.name };
      }
      return { ...f, lines };
    });
  };

  const addLine = () => setForm(f => ({ ...f, lines: [...f.lines, emptyLine()] }));
  const removeLine = (idx: number) => {
    if (form.lines.length <= 2) return;
    setForm(f => ({ ...f, lines: f.lines.filter((_, i) => i !== idx) }));
  };

  const totalDebit = form.lines.reduce((s, l) => s + (l.debit || 0), 0);
  const totalCredit = form.lines.reduce((s, l) => s + (l.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const handleSubmit = () => {
    if (!form.date || !form.description) return;
    if (!isBalanced) { alert('القيد غير متوازن! مجموع المدين يجب أن يساوي مجموع الدائن'); return; }
    const lines = form.lines.filter(l => l.accountId && (l.debit > 0 || l.credit > 0));
    if (lines.length < 2) { alert('يجب إضافة سطرين على الأقل'); return; }
    addJournalEntry({ ...form, lines, totalDebit, totalCredit });
    setShowModal(false);
    setForm({ date: new Date().toISOString().split('T')[0], reference: '', description: '', lines: [emptyLine(), emptyLine()] });
  };

  const accountOptions = accounts.filter(a => a.parentId !== undefined).map(a => ({
    value: a.id, label: `${a.code} - ${a.name}`,
  }));

  return (
    <AccountingLayout title="القيود اليومية">
      <Card>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <Button onClick={() => setShowModal(true)} variant="primary">➕ قيد جديد</Button>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث في القيود..."
            style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', minWidth: 250, outline: 'none' }}
          />
          <span style={{ marginRight: 'auto', color: '#64748b', fontSize: 13 }}>{filtered.length} قيد</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['#', 'التاريخ', 'المرجع', 'البيان', 'إجمالي المدين', 'إجمالي الدائن', 'الحالة', 'إجراءات'].map(h => (
                <th key={h} style={{ textAlign: 'right', padding: '12px 14px', color: '#64748b', fontWeight: 600, borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry, idx) => {
              const balanced = Math.abs(entry.totalDebit - entry.totalCredit) < 0.01;
              return (
                <tr key={entry.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', color: '#94a3b8', fontSize: 12 }}>{filtered.length - idx}</td>
                  <td style={{ padding: '10px 14px', color: '#374151' }}>{entry.date}</td>
                  <td style={{ padding: '10px 14px', color: '#1e293b', fontWeight: 600, fontFamily: 'monospace' }}>{entry.reference || '-'}</td>
                  <td style={{ padding: '10px 14px', color: '#374151', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.description}</td>
                  <td style={{ padding: '10px 14px', color: '#3b82f6', fontWeight: 600 }}>{formatCurrency(entry.totalDebit)}</td>
                  <td style={{ padding: '10px 14px', color: '#8b5cf6', fontWeight: 600 }}>{formatCurrency(entry.totalCredit)}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <Badge label={balanced ? 'متوازن' : 'غير متوازن'} color={balanced ? '#22c55e' : '#ef4444'} />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Button size="sm" variant="secondary" onClick={() => setViewEntry(entry)}>عرض</Button>
                      <Button size="sm" variant="danger" onClick={() => { if (confirm('حذف هذا القيد؟')) deleteJournalEntry(entry.id); }}>حذف</Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>لا توجد قيود</div>
        )}
      </Card>

      {/* Add Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="إضافة قيد يومي جديد" width={900}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 14, marginBottom: 20 }}>
          <Input label="التاريخ" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} type="date" required />
          <Input label="رقم المرجع" value={form.reference} onChange={v => setForm(f => ({ ...f, reference: v }))} placeholder="J001" />
          <Input label="البيان" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} required placeholder="وصف القيد المحاسبي" />
        </div>

        {/* Lines */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h4 style={{ margin: 0, color: '#374151' }}>بنود القيد</h4>
            <Button size="sm" variant="secondary" onClick={addLine}>➕ إضافة سطر</Button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['الحساب', 'البيان', 'مدين', 'دائن', ''].map(h => (
                  <th key={h} style={{ textAlign: 'right', padding: '8px 10px', color: '#64748b', fontWeight: 600, borderBottom: '2px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {form.lines.map((line, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '6px 6px' }}>
                    <select
                      value={line.accountId || ''}
                      onChange={e => setLine(idx, 'accountId', parseInt(e.target.value))}
                      style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 8px', fontSize: 13, fontFamily: 'inherit', width: '100%', outline: 'none' }}
                    >
                      <option value="">-- اختر الحساب --</option>
                      {accountOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '6px 6px' }}>
                    <input
                      value={line.description}
                      onChange={e => setLine(idx, 'description', e.target.value)}
                      placeholder="بيان اختياري"
                      style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 8px', fontSize: 13, fontFamily: 'inherit', width: '100%', outline: 'none' }}
                    />
                  </td>
                  <td style={{ padding: '6px 6px' }}>
                    <input
                      type="number"
                      value={line.debit || ''}
                      onChange={e => setLine(idx, 'debit', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 8px', fontSize: 13, fontFamily: 'inherit', width: 100, outline: 'none', color: '#3b82f6' }}
                    />
                  </td>
                  <td style={{ padding: '6px 6px' }}>
                    <input
                      type="number"
                      value={line.credit || ''}
                      onChange={e => setLine(idx, 'credit', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 8px', fontSize: 13, fontFamily: 'inherit', width: 100, outline: 'none', color: '#8b5cf6' }}
                    />
                  </td>
                  <td style={{ padding: '6px 6px' }}>
                    <button onClick={() => removeLine(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 18 }}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                <td colSpan={2} style={{ padding: '10px 14px', textAlign: 'right', color: '#374151' }}>الإجمالي</td>
                <td style={{ padding: '10px 10px', color: '#3b82f6' }}>{formatCurrency(totalDebit)}</td>
                <td style={{ padding: '10px 10px', color: '#8b5cf6' }}>{formatCurrency(totalCredit)}</td>
                <td />
              </tr>
              <tr>
                <td colSpan={5} style={{ padding: '8px 14px', textAlign: 'center' }}>
                  {isBalanced
                    ? <span style={{ color: '#22c55e', fontWeight: 600 }}>✅ القيد متوازن</span>
                    : <span style={{ color: '#ef4444', fontWeight: 600 }}>⚠️ الفرق: {formatCurrency(Math.abs(totalDebit - totalCredit))}</span>
                  }
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>إلغاء</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!isBalanced}>💾 حفظ القيد</Button>
        </div>
      </Modal>

      {/* View Entry Modal */}
      {viewEntry && (
        <Modal isOpen={!!viewEntry} onClose={() => setViewEntry(null)} title={`قيد رقم: ${viewEntry.reference || viewEntry.id}`} width={700}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20, fontSize: 14 }}>
            <div><span style={{ color: '#64748b' }}>التاريخ: </span><strong>{viewEntry.date}</strong></div>
            <div><span style={{ color: '#64748b' }}>المرجع: </span><strong>{viewEntry.reference || '-'}</strong></div>
            <div><span style={{ color: '#64748b' }}>تاريخ الإنشاء: </span><strong>{viewEntry.createdAt}</strong></div>
          </div>
          <div style={{ marginBottom: 16, background: '#f8fafc', borderRadius: 8, padding: '10px 14px', fontSize: 14 }}>
            <span style={{ color: '#64748b' }}>البيان: </span><strong>{viewEntry.description}</strong>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['الحساب', 'البيان', 'مدين', 'دائن'].map(h => (
                  <th key={h} style={{ textAlign: 'right', padding: '10px 12px', color: '#64748b', fontWeight: 600, borderBottom: '2px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {viewEntry.lines.map((line, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px' }}><strong>{line.accountCode}</strong> - {line.accountName}</td>
                  <td style={{ padding: '8px 12px', color: '#64748b' }}>{line.description || '-'}</td>
                  <td style={{ padding: '8px 12px', color: '#3b82f6', fontWeight: 600 }}>{line.debit > 0 ? formatCurrency(line.debit) : '-'}</td>
                  <td style={{ padding: '8px 12px', color: '#8b5cf6', fontWeight: 600 }}>{line.credit > 0 ? formatCurrency(line.credit) : '-'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                <td colSpan={2} style={{ padding: '10px 12px' }}>الإجمالي</td>
                <td style={{ padding: '10px 12px', color: '#3b82f6' }}>{formatCurrency(viewEntry.totalDebit)}</td>
                <td style={{ padding: '10px 12px', color: '#8b5cf6' }}>{formatCurrency(viewEntry.totalCredit)}</td>
              </tr>
            </tfoot>
          </table>
        </Modal>
      )}
    </AccountingLayout>
  );
}
