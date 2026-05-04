import React, { useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar.jsx';
import TextFilterPanel from './components/TextFilterPanel.jsx';
import SpeechPanel from './components/SpeechPanel.jsx';
import VideoPanel from './components/VideoPanel.jsx';

const TECH_BADGES = [
  { label: 'react-use', color: '#7c3aed' },
  { label: 'bad-words', color: '#4f46e5' },
  { label: '@2toad/profanity', color: '#0891b2' },
  { label: 'obscenity', color: '#d97706' },
  { label: 'i18next', color: '#059669' },
];

export default function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('textFilter');

  return (
    <>
      <div className="app-bg" />

      <div className="app-wrapper">
        {/* Hero */}
        <header className="hero">
          <div className="hero-badge">
            ✦ Feature Showcase
          </div>
          <h1>{t('appTitle')}</h1>
          <p>{t('appSubtitle')}</p>

          {/* Tech badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 20 }}>
            {TECH_BADGES.map(b => (
              <span
                key={b.label}
                style={{
                  padding: '4px 12px',
                  borderRadius: '99px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  background: `${b.color}22`,
                  border: `1px solid ${b.color}55`,
                  color: b.color,
                  letterSpacing: '0.03em',
                }}
              >
                {b.label}
              </span>
            ))}
          </div>
        </header>

        {/* Navigation */}
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Panels */}
        <main>
          <Suspense fallback={<div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading...</div>}>
            {activeTab === 'textFilter' && <TextFilterPanel />}
            {activeTab === 'speech'     && <SpeechPanel />}
            {activeTab === 'video'      && <VideoPanel />}
          </Suspense>
        </main>

        {/* Footer */}
        <footer style={{ textAlign: 'center', marginTop: 48, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <p>Built with React · react-use · i18next · bad-words · @2toad/profanity · obscenity</p>
        </footer>
      </div>
    </>
  );
}
