import React, { useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useVideo } from 'react-use';

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VideoPanel() {
  const { t } = useTranslation();
  const [videoSrc, setVideoSrc] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // useVideo hook from react-use
  const [video, state, controls, videoRef] = useVideo(
    videoSrc
      ? <video src={videoSrc} style={{ width: '100%', display: 'block', maxHeight: 420, objectFit: 'contain' }} />
      : <video style={{ display: 'none' }} />
  );

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('video/')) return;
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const seekPercent = state.duration ? (state.time / state.duration) * 100 : 0;

  const handleSeek = (e) => {
    const pct = parseFloat(e.target.value);
    controls.seek((pct / 100) * state.duration);
  };

  const handleVolume = (e) => {
    controls.volume(parseFloat(e.target.value));
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <div className="panel-title-icon" style={{ background: 'rgba(245,158,11,0.2)' }}>🎬</div>
          {t('video.title')}
        </div>
        <div className="panel-subtitle">{t('video.subtitle')}</div>
      </div>

      {/* Upload zone */}
      {!videoSrc && (
        <div
          id="video-drop-zone"
          className={`drop-zone${dragOver ? ' dragover' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="drop-zone-icon">🎬</div>
          <h3>{t('video.dragDrop')}</h3>
          <p>{t('video.formats')}</p>
          <input
            id="video-file-input"
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
        </div>
      )}

      {/* Video element from useVideo */}
      {videoSrc && (
        <>
          <div className="video-container">
            {video}
          </div>

          {/* Custom controls */}
          <div className="video-controls">
            {/* Seek bar */}
            <input
              id="video-seek-bar"
              type="range"
              className="seek-bar"
              min="0" max="100" step="0.1"
              value={seekPercent}
              onChange={handleSeek}
            />

            <div className="btn-group" style={{ marginTop: 0, marginBottom: 12 }}>
              {state.paused ? (
                <button id="video-play-btn" className="btn btn-primary" onClick={controls.play}>
                  ▶ {t('video.play')}
                </button>
              ) : (
                <button id="video-pause-btn" className="btn btn-warning" onClick={controls.pause}>
                  ⏸ {t('video.pause')}
                </button>
              )}

              {state.muted ? (
                <button id="video-unmute-btn" className="btn btn-secondary" onClick={controls.unmute}>
                  🔈 {t('video.unmute')}
                </button>
              ) : (
                <button id="video-mute-btn" className="btn btn-secondary" onClick={controls.mute}>
                  🔇 {t('video.mute')}
                </button>
              )}

              <button
                id="video-upload-new-btn"
                className="btn btn-secondary"
                onClick={() => { setVideoSrc(null); }}
              >
                📁 {t('video.upload')}
              </button>
            </div>

            {/* Volume control */}
            <div className="form-group">
              <label>{t('video.volume')}</label>
              <div className="slider-group">
                <input
                  id="video-volume-slider"
                  type="range"
                  min="0" max="1" step="0.05"
                  value={state.volume}
                  onChange={handleVolume}
                />
                <span className="slider-value">{Math.round(state.volume * 100)}%</span>
              </div>
            </div>

            {/* State display */}
            <div className="video-state-grid">
              <div className="state-chip">
                <div className="state-label">{t('video.time')}</div>
                <div className="state-value">{formatTime(state.time)}</div>
              </div>
              <div className="state-chip">
                <div className="state-label">{t('video.duration')}</div>
                <div className="state-value">{formatTime(state.duration)}</div>
              </div>
              <div className="state-chip">
                <div className="state-label">{t('video.status')}</div>
                <div className="state-value" style={{
                  color: state.paused ? 'var(--accent-warning)' : 'var(--accent-success)',
                  fontSize: '0.8rem',
                }}>
                  {state.paused ? t('video.paused') : t('video.playing')}
                </div>
              </div>
              <div className="state-chip">
                <div className="state-label">{t('video.mute')}</div>
                <div className="state-value" style={{ fontSize: '0.8rem' }}>
                  {state.muted ? '🔇 ' + t('video.muted') : '🔊'}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
