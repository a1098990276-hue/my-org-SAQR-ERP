import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t, i18n } = useTranslation();
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/health')
      .then((res) => res.json())
      .then(setHealth)
      .catch(() => setHealth({ status: 'offline' }));
  }, []);

  const toggleLang = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="app">
      <header className="topbar">
        <h1>{t('appTitle')}</h1>
        <button onClick={toggleLang}>{t('language')}</button>
      </header>
      <nav className="sidebar">
        <button>{t('dashboard')}</button>
        <button>{t('accounts')}</button>
        <button>{t('products')}</button>
        <button>{t('invoices')}</button>
        <button>{t('journal')}</button>
        <button>{t('reports')}</button>
        <button>{t('settings')}</button>
      </nav>
      <main className="content">
        <section className="card">
          <h2>API</h2>
          <p>{health ? health.status : 'loading...'}</p>
        </section>
        <section className="card">
          <h2>Quick Start</h2>
          <p>يمكنك الآن إضافة الحسابات والأصناف والفواتير عبر واجهات API.</p>
        </section>
      </main>
    </div>
  );
}