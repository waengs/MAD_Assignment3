import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter as BadWords } from 'bad-words';
import { Profanity, ProfanityOptions } from '@2toad/profanity';
import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from 'obscenity';

// ── Library instances ─────────────────────────────────────────────────────────
const badWordsFilter = new BadWords({ placeHolder: '*' });

const profanityOptions = new ProfanityOptions();
profanityOptions.wholeWord = true;
const toadProfanity = new Profanity(profanityOptions);

const obscenityMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function countAsteriskGroups(str) {
  return (str.match(/\*+/g) || []).length;
}

function runBadWords(text) {
  try {
    const hasProfanity = badWordsFilter.isProfane(text);
    const filtered = hasProfanity ? badWordsFilter.clean(text) : text;
    const matchCount = countAsteriskGroups(filtered);
    return { filtered, hasProfanity, matchCount, error: null };
  } catch (e) {
    return { filtered: text, hasProfanity: false, matchCount: 0, error: e.message };
  }
}

function runToadProfanity(text) {
  try {
    const hasProfanity = toadProfanity.exists(text);
    const filtered = hasProfanity ? toadProfanity.censor(text) : text;
    const matchCount = countAsteriskGroups(filtered);
    return { filtered, hasProfanity, matchCount, error: null };
  } catch (e) {
    return { filtered: text, hasProfanity: false, matchCount: 0, error: e.message };
  }
}

function runObscenity(text) {
  try {
    const matches = obscenityMatcher.getAllMatches(text);
    const hasProfanity = matches.length > 0;
    let filtered = text;
    // Replace matches in reverse order to preserve indices
    if (hasProfanity) {
      const chars = text.split('');
      [...matches].reverse().forEach(match => {
        const startIndex = match.startIndex;
        const endIndex = match.endIndex;
        const len = endIndex - startIndex + 1;
        chars.splice(startIndex, len, '*'.repeat(len));
      });
      filtered = chars.join('');
    }
    return { filtered, hasProfanity, matchCount: matches.length, error: null };
  } catch (e) {
    return { filtered: text, hasProfanity: false, matchCount: 0, error: e.message };
  }
}

// ── Highlight censored asterisk-blocks in filtered text ───────────────────────
function HighlightedText({ text }) {
  const parts = text.split(/(\*+)/g);
  return (
    <span className="result-text">
      {parts.map((part, i) =>
        /^\*+$/.test(part)
          ? <span key={i} className="censored-word">{part}</span>
          : part
      )}
    </span>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function TextFilterPanel() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [results, setResults] = useState(null);

  const charCount = input.length;
  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;

  const handleFilter = () => {
    const bw  = runBadWords(input);
    const tt  = runToadProfanity(input);
    const obs = runObscenity(input);
    setResults({ bw, tt, obs, original: input });
  };

  const handleClear = () => {
    setInput('');
    setResults(null);
  };

  const libraries = results
    ? [
        {
          key: 'bw',
          name: t('textFilter.badWordsLib'),
          desc: t('textFilter.badWordsDesc'),
          badge: 'bw',
          data: results.bw,
        },
        {
          key: 'tt',
          name: t('textFilter.profanityLib'),
          desc: t('textFilter.profanityDesc'),
          badge: 'tt',
          data: results.tt,
        },
        {
          key: 'obs',
          name: t('textFilter.obscenityLib'),
          desc: t('textFilter.obscenityDesc'),
          badge: 'ob',
          data: results.obs,
        },
      ]
    : [];

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <div className="panel-title-icon" style={{ background: 'rgba(124,58,237,0.2)' }}>🔍</div>
          {t('textFilter.title')}
        </div>
        <div className="panel-subtitle">{t('textFilter.subtitle')}</div>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        <div className="stat-chip">
          📝 {t('textFilter.charCount')}: <strong>{charCount}</strong>
        </div>
        <div className="stat-chip">
          🔤 {t('textFilter.wordCount')}: <strong>{wordCount}</strong>
        </div>
      </div>

      {/* Input */}
      <div className="form-group">
        <label htmlFor="filter-input">{t('textFilter.inputLabel')}</label>
        <textarea
          id="filter-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t('textFilter.inputPlaceholder')}
          rows={4}
        />
      </div>

      <div className="btn-group">
        <button
          id="filter-btn"
          className="btn btn-primary"
          onClick={handleFilter}
          disabled={!input.trim()}
        >
          🔍 {t('textFilter.filterBtn')}
        </button>
        <button
          id="filter-clear-btn"
          className="btn btn-secondary"
          onClick={handleClear}
        >
          ✕ {t('textFilter.clearBtn')}
        </button>
      </div>

      {/* Results */}
      {results && (
        <>
          <div className="divider" />

          <div style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t('textFilter.resultsTitle')}
          </div>

          {/* Original */}
          <div className="result-card">
            <div className="result-card-header">
              <span className="lib-badge orig">{t('textFilter.originalLabel')}</span>
            </div>
            <span className="result-text">{results.original}</span>
          </div>

          {/* Library results */}
          {libraries.map(lib => (
            <div className="result-card" key={lib.key}>
              <div className="result-card-header">
                <div>
                  <span className={`lib-badge ${lib.badge}`}>{lib.name}</span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    {lib.desc}
                  </div>
                </div>
                <span className={`detection-count${lib.data.hasProfanity ? ' found' : ''}`}>
                  {lib.data.hasProfanity
                    ? `⚠ ${lib.data.matchCount} ${t('textFilter.wordsFound')}`
                    : `✓ ${t('textFilter.noProf')}`}
                </span>
              </div>
              {lib.data.error
                ? <span style={{ color: 'var(--accent-danger)', fontSize: '0.85rem' }}>Error: {lib.data.error}</span>
                : <HighlightedText text={lib.data.filtered} />}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
