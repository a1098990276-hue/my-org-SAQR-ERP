import React from 'react';

export default function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to SAQR ERP System</h1>
      <p style={styles.subtitle}>نظام إدارة الموارد البشرية والعمليات المتكامل</p>
      
      <div style={styles.features}>
        <h2>المميزات الرئيسية:</h2>
        <ul>
          <li>✅ إدارة الموارد البشرية</li>
          <li>✅ إدارة المالية والحسابات</li>
          <li>✅ إدارة المشاريع</li>
          <li>✅ إدارة المخزون</li>
          <li>✅ التقارير والتحليلات</li>
        </ul>
      </div>

      <div style={styles.status}>
        <p>🚀 التطبيق جاهز للاستخدام</p>
        <p>📱 الواجهة الأمامية تعمل على: <code>http://localhost:3001</code></p>
        <p>⚙️ الخادم الخلفي يعمل على: <code>http://localhost:3000</code></p>
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