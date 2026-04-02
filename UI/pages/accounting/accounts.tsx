import React, { useState } from 'react';
import AccountingLayout, { Card, Button, Input, Select, Modal, Badge } from '../../components/AccountingLayout';
import { useAccounting, Account, AccountType, ACCOUNT_TYPE_LABELS, ACCOUNT_TYPE_COLORS, formatCurrency } from '../../lib/useAccounting';

const emptyForm = (): Omit<Account, 'id'> => ({
  code: '', name: '', type: 'asset', parentId: undefined, balance: 0, isActive: true,
});

export default function AccountsPage() {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounting();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceAcc, setBalanceAcc] = useState<Account | null>(null);
  const [newBalance, setNewBalance] = useState('');

  const filtered = accounts.filter(a => {
    const matchSearch = a.name.includes(search) || a.code.includes(search);
    const matchType = filterType === 'all' || a.type === filterType;
    return matchSearch && matchType;
  });

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setShowModal(true);
  };

  const openEdit = (acc: Account) => {
    setEditing(acc);
    setForm({ code: acc.code, name: acc.name, type: acc.type, parentId: acc.parentId, balance: acc.balance, isActive: acc.isActive });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!form.code || !form.name) return;
    if (editing) {
      updateAccount(editing.id, form);
    } else {
      addAccount(form);
    }
    setShowModal(false);
  };

  const typeOptions = [
    { value: 'all', label: 'جميع الأنواع' },
    ...Object.entries(ACCOUNT_TYPE_LABELS).map(([k, v]) => ({ value: k, label: v })),
  ];

  const parentOptions = [
    { value: '', label: '-- لا يوجد حساب أب --' },
    ...accounts.filter(a => !a.parentId).map(a => ({ value: a.id.toString(), label: `${a.code} - ${a.name}` })),
  ];

  const typeSummary = (['asset', 'liability', 'equity', 'revenue', 'expense'] as AccountType[]).map(type => ({
    type,
    count: accounts.filter(a => a.type === type && a.parentId !== undefined).length,
    total: accounts.filter(a => a.type === type && a.parentId !== undefined).reduce((s, a) => s + a.balance, 0),
  }));

  return (
    <AccountingLayout title="دليل الحسابات">
      {/* Type Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {typeSummary.map(ts => (
          <div key={ts.type} style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', borderTop: `3px solid ${ACCOUNT_TYPE_COLORS[ts.type]}` }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{ACCOUNT_TYPE_LABELS[ts.type]}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>{formatCurrency(ts.total)}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{ts.count} حساب</div>
          </div>
        ))}
      </div>

      <Card>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button onClick={openAdd} variant="primary">➕ إضافة حساب</Button>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو الرمز..."
            style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', minWidth: 200, outline: 'none' }}
          />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
          >
            {typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <span style={{ marginRight: 'auto', color: '#64748b', fontSize: 13 }}>{filtered.length} حساب</span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['رمز الحساب', 'اسم الحساب', 'النوع', 'الحساب الأب', 'الرصيد', 'الحالة', 'إجراءات'].map(h => (
                  <th key={h} style={{ textAlign: 'right', padding: '12px 14px', color: '#64748b', fontWeight: 600, borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(acc => {
                const parent = accounts.find(a => a.id === acc.parentId);
                return (
                  <tr key={acc.id} style={{ borderBottom: '1px solid #f1f5f9', background: acc.parentId ? '#fff' : '#fafbff' }}>
                    <td style={{ padding: '10px 14px', fontWeight: acc.parentId ? 400 : 700, color: '#1e293b', fontFamily: 'monospace' }}>{acc.code}</td>
                    <td style={{ padding: '10px 14px', color: '#1e293b', fontWeight: acc.parentId ? 400 : 600, paddingRight: acc.parentId ? 28 : 14 }}>
                      {!acc.parentId && '📁 '}{acc.name}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <Badge label={ACCOUNT_TYPE_LABELS[acc.type]} color={ACCOUNT_TYPE_COLORS[acc.type]} />
                    </td>
                    <td style={{ padding: '10px 14px', color: '#64748b' }}>{parent ? `${parent.code} - ${parent.name}` : '-'}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: acc.balance >= 0 ? '#22c55e' : '#ef4444' }}>
                      {formatCurrency(acc.balance)}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <Badge label={acc.isActive ? 'نشط' : 'غير نشط'} color={acc.isActive ? '#22c55e' : '#94a3b8'} />
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Button size="sm" variant="secondary" onClick={() => openEdit(acc)}>تعديل</Button>
                        <Button size="sm" variant="ghost" onClick={() => { setBalanceAcc(acc); setNewBalance(acc.balance.toString()); setShowBalanceModal(true); }}>رصيد</Button>
                        <Button size="sm" variant="danger" onClick={() => { if (confirm('هل تريد حذف هذا الحساب؟')) deleteAccount(acc.id); }}>حذف</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0', fontSize: 15 }}>لا توجد حسابات</div>
          )}
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'تعديل حساب' : 'إضافة حساب جديد'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="رمز الحساب" value={form.code} onChange={v => setForm(f => ({ ...f, code: v }))} required />
          <Input label="اسم الحساب" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
          <Select
            label="نوع الحساب"
            value={form.type}
            onChange={v => setForm(f => ({ ...f, type: v as AccountType }))}
            options={Object.entries(ACCOUNT_TYPE_LABELS).map(([k, v]) => ({ value: k, label: v }))}
            required
          />
          <Select
            label="الحساب الأب"
            value={(form.parentId ?? '').toString()}
            onChange={v => setForm(f => ({ ...f, parentId: v ? parseInt(v) : undefined }))}
            options={parentOptions}
          />
          <Input label="الرصيد الافتتاحي" value={form.balance} onChange={v => setForm(f => ({ ...f, balance: parseFloat(v) || 0 }))} type="number" />
          <Select
            label="الحالة"
            value={form.isActive ? 'active' : 'inactive'}
            onChange={v => setForm(f => ({ ...f, isActive: v === 'active' }))}
            options={[{ value: 'active', label: 'نشط' }, { value: 'inactive', label: 'غير نشط' }]}
          />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>إلغاء</Button>
          <Button variant="primary" onClick={handleSubmit}>💾 حفظ</Button>
        </div>
      </Modal>

      {/* Balance Update Modal */}
      <Modal isOpen={showBalanceModal} onClose={() => setShowBalanceModal(false)} title={`تحديث رصيد: ${balanceAcc?.name}`} width={400}>
        <Input label="الرصيد الجديد" value={newBalance} onChange={setNewBalance} type="number" />
        <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setShowBalanceModal(false)}>إلغاء</Button>
          <Button variant="primary" onClick={() => {
            if (balanceAcc) { updateAccount(balanceAcc.id, { balance: parseFloat(newBalance) || 0 }); }
            setShowBalanceModal(false);
          }}>💾 تحديث</Button>
        </div>
      </Modal>
    </AccountingLayout>
  );
}
