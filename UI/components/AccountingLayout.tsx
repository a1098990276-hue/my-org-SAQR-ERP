import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NAV_ITEMS = [
  { path: '/accounting', label: 'لوحة التحكم', icon: '📊' },
  { path: '/accounting/accounts', label: 'دليل الحسابات', icon: '📋' },
  { path: '/accounting/journal', label: 'القيود اليومية', icon: '📝' },
  { path: '/accounting/invoices', label: 'فواتير المبيعات', icon: '🧾' },
  { path: '/accounting/purchases', label: 'فواتير المشتريات', icon: '🛒' },
  { path: '/accounting/customers', label: 'العملاء', icon: '👥' },
  { path: '/accounting/suppliers', label: 'الموردون', icon: '🏭' },
  { path: '/accounting/items', label: 'الأصناف والمنتجات', icon: '📦' },
  { path: '/accounting/reports', label: 'التقارير المالية', icon: '📈' },
];

interface Props {
  children: React.ReactNode;
  title: string;
}

export default function AccountingLayout({ children, title }: Props) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div dir="rtl" style={{ display: 'flex', height: '100vh', fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif", background: '#f1f5f9', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 60 : 240,
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        color: '#e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s',
        flexShrink: 0,
        boxShadow: '2px 0 8px rgba(0,0,0,0.3)',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '16px 10px' : '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>🦅</span>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>نظام صقر</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>للمحاسبة والأعمال</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {NAV_ITEMS.map(item => {
            const isActive = router.pathname === item.path;
            return (
              <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: collapsed ? '10px 0' : '10px 16px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  margin: '2px 8px',
                  borderRadius: 8,
                  background: isActive ? 'rgba(59,130,246,0.25)' : 'transparent',
                  borderRight: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                  color: isActive ? '#60a5fa' : '#94a3b8',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Collapse button */}
        <div
          onClick={() => setCollapsed(c => !c)}
          style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end', color: '#64748b', fontSize: 18 }}
        >
          {collapsed ? '→' : '←'}
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <header style={{
          background: '#fff',
          padding: '0 24px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e2e8f0',
          flexShrink: 0,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: 0 }}>{title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
              م
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// Reusable UI components
export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: 24, ...style }}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 56, height: 56, borderRadius: 12, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>{value}</div>
      </div>
    </div>
  );
}

export function Button({ children, onClick, variant = 'primary', size = 'md', disabled, style }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const colors = {
    primary: { bg: '#3b82f6', hover: '#2563eb', text: '#fff' },
    secondary: { bg: '#e2e8f0', hover: '#cbd5e1', text: '#334155' },
    danger: { bg: '#ef4444', hover: '#dc2626', text: '#fff' },
    success: { bg: '#22c55e', hover: '#16a34a', text: '#fff' },
    ghost: { bg: 'transparent', hover: '#f1f5f9', text: '#64748b' },
  };
  const sizes = { sm: { padding: '5px 12px', fontSize: 13 }, md: { padding: '8px 16px', fontSize: 14 }, lg: { padding: '12px 24px', fontSize: 16 } };
  const c = colors[variant];
  const s = sizes[size];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: c.bg,
        color: c.text,
        border: 'none',
        borderRadius: 8,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s',
        fontFamily: 'inherit',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Input({ label, value, onChange, type = 'text', placeholder, required, style }: {
  label?: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          border: '1px solid #d1d5db',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: 14,
          outline: 'none',
          fontFamily: 'inherit',
          color: '#1e293b',
          background: '#fff',
          width: '100%',
        }}
      />
    </div>
  );
}

export function Select({ label, value, onChange, options, required, style }: {
  label?: string;
  value: string | number;
  onChange: (v: string) => void;
  options: { value: string | number; label: string }[];
  required?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          border: '1px solid #d1d5db',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: 14,
          outline: 'none',
          fontFamily: 'inherit',
          color: '#1e293b',
          background: '#fff',
          width: '100%',
        }}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, width = 600 }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
}) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, width: Math.min(width, window.innerWidth - 32), maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#64748b', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

export function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ background: `${color}20`, color: color, border: `1px solid ${color}40`, borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>
      {label}
    </span>
  );
}
