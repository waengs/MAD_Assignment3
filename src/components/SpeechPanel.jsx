import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSpeech } from 'react-use';

const WAVE_BARS = 12;

export default function SpeechPanel() {
  const { t } = useTranslation();

  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [speechState, setSpeechState] = useState('idle'); // idle | speaking | paused
  const utteranceRef = useRef(null);

  // Load available voices
  useEffect(() => {
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) {
        setVoices(v);
        setSelectedVoice(v[0].name);
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const handleSpeak = () => {
    if (!text.trim()) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = volume;

    utterance.onstart   = () => setSpeechState('speaking');
    utterance.onend     = () => setSpeechState('idle');
    utterance.onerror   = () => setSpeechState('idle');
    utterance.onpause   = () => setSpeechState('paused');
    utterance.onresume  = () => setSpeechState('speaking');

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setSpeechState('paused');
  };

  const handleResume = () => {
    window.speechSynthesis.resume();
    setSpeechState('speaking');
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setSpeechState('idle');
  };

  const statusLabel =
    speechState === 'speaking' ? t('speech.speaking') :
    speechState === 'paused'   ? t('speech.paused') :
                                 t('speech.idle');

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <div className="panel-title-icon" style={{ background: 'rgba(6,182,212,0.2)' }}>🔊</div>
          {t('speech.title')}
        </div>
        <div className="panel-subtitle">{t('speech.subtitle')}</div>
      </div>

      {/* Waveform visualization */}
      <div className="waveform" aria-hidden="true">
        {Array.from({ length: WAVE_BARS }).map((_, i) => (
          <div
            key={i}
            className={`wave-bar${speechState === 'speaking' ? ' active' : ''}`}
            style={{
              height: speechState === 'speaking' ? undefined : '6px',
              background: speechState === 'speaking'
                ? `hsl(${260 + i * 8}, 80%, 65%)`
                : 'rgba(255,255,255,0.15)',
              animationDelay: `${(i % 6) * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Status */}
      <div className="speech-status">
        <div className={`status-dot ${speechState}`} />
        <span>{t('speech.status')}: <strong>{statusLabel}</strong></span>
      </div>

      <div className="divider" />

      {/* Text input */}
      <div className="form-group">
        <label htmlFor="speech-input">{t('speech.inputLabel')}</label>
        <textarea
          id="speech-input"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={t('speech.inputPlaceholder')}
          rows={4}
        />
      </div>

      {/* Voice selector */}
      <div className="form-group">
        <label htmlFor="voice-select">{t('speech.voice')}</label>
        {voices.length === 0 ? (
          <p className="text-muted">{t('speech.loadingVoices')}</p>
        ) : (
          <select
            id="voice-select"
            value={selectedVoice || ''}
            onChange={e => setSelectedVoice(e.target.value)}
          >
            {voices.map(v => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Sliders */}
      <div className="grid-3">
        <div className="form-group">
          <label>{t('speech.pitch')}</label>
          <div className="slider-group">
            <input
              id="pitch-slider"
              type="range"
              min="0.5" max="2" step="0.1"
              value={pitch}
              onChange={e => setPitch(parseFloat(e.target.value))}
            />
            <span className="slider-value">{pitch.toFixed(1)}</span>
          </div>
        </div>
        <div className="form-group">
          <label>{t('speech.rate')}</label>
          <div className="slider-group">
            <input
              id="rate-slider"
              type="range"
              min="0.5" max="2" step="0.1"
              value={rate}
              onChange={e => setRate(parseFloat(e.target.value))}
            />
            <span className="slider-value">{rate.toFixed(1)}</span>
          </div>
        </div>
        <div className="form-group">
          <label>{t('speech.volume')}</label>
          <div className="slider-group">
            <input
              id="volume-slider"
              type="range"
              min="0" max="1" step="0.05"
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
            />
            <span className="slider-value">{Math.round(volume * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="btn-group">
        {speechState === 'idle' && (
          <button
            id="speech-play-btn"
            className="btn btn-primary"
            onClick={handleSpeak}
            disabled={!text.trim()}
          >
            ▶ {t('speech.play')}
          </button>
        )}
        {speechState === 'speaking' && (
          <>
            <button id="speech-pause-btn" className="btn btn-warning" onClick={handlePause}>
              ⏸ {t('speech.pause')}
            </button>
            <button id="speech-stop-btn" className="btn btn-danger" onClick={handleStop}>
              ⏹ {t('speech.stop')}
            </button>
          </>
        )}
        {speechState === 'paused' && (
          <>
            <button id="speech-resume-btn" className="btn btn-success" onClick={handleResume}>
              ▶ {t('speech.resume')}
            </button>
            <button id="speech-stop-btn-paused" className="btn btn-danger" onClick={handleStop}>
              ⏹ {t('speech.stop')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
