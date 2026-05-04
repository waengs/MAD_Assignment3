import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

export default function Navbar({ activeTab, onTabChange }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    setOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const tabs = [
    { id: 'textFilter', icon: '🔍', label: t('nav.textFilter') },
    { id: 'speech',     icon: '🔊', label: t('nav.speech') },
    { id: 'video',      icon: '🎬', label: t('nav.video') },
  ];

  return (
    <nav className="navbar">
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="lang-switcher" ref={dropRef}>
        <button
          id="lang-switcher-btn"
          className="lang-btn"
          onClick={() => setOpen(v => !v)}
          aria-label="Switch language"
        >
          <span>{currentLang.flag}</span>
          <span>{currentLang.label}</span>
          <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>▼</span>
        </button>

        {open && (
          <div className="lang-dropdown" role="menu">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                id={`lang-opt-${lang.code}`}
                className={`lang-option${i18n.language === lang.code ? ' selected' : ''}`}
                onClick={() => changeLanguage(lang.code)}
                role="menuitem"
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
