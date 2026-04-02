import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/accounting');
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🦅</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>نظام صقر للمحاسبة</h1>
        <p style={{ color: '#94a3b8', fontSize: 16 }}>جارٍ التحميل...</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '48px',
    marginBottom: '10px',
    textAlign: 'center' as const,
  },
  subtitle: {
    fontSize: '24px',
    marginBottom: '40px',
    opacity: 0.9,
  },
  features: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '30px',
    borderRadius: '10px',
    marginBottom: '30px',
    backdropFilter: 'blur(10px)',
    minWidth: '300px',
  },
  status: {
    background: 'rgba(0, 0, 0, 0.2)',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center' as const,
  },
};