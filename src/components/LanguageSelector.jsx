import { useState, useEffect } from 'react'
import { translations } from '../translations'

const LanguageSelector = ({ lang, setLang, isTransparent }) => {
  const t = translations[lang]

  const languages = [
    { code: 'az', name: 'Azerbaijan (AZ)' },
    { code: 'tr', name: 'Türkçe (TR)' },
    { code: 'en', name: 'English (EN)' }
  ]

  return (
    <div className={`language-selector ${isTransparent ? 'timer-active' : ''}`}>
      <div className="lang-btn">
        <i className="fas fa-globe"></i>
        <span>{lang.toUpperCase()}</span>
        <i className="fas fa-chevron-down"></i>
      </div>
      <div className="lang-dropdown">
        {languages.map(l => (
          <div
            key={l.code}
            className="lang-option"
            onClick={() => setLang(l.code)}
          >
            {l.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LanguageSelector
