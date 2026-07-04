import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../stores/themeStore';
import { useTranslation } from '../../i18n';

const getSlides = (t) => [
  {
    icon: '🏎',
    title: t('appOnboarding.slide1Title'),
    subtitle: t('appOnboarding.slide1Sub'),
    accent: '#E8002D'
  },
  {
    icon: '👥',
    title: t('appOnboarding.slide2Title'),
    subtitle: t('appOnboarding.slide2Sub'),
    accent: '#00D4A0'
  },
  {
    icon: '🏆',
    title: t('appOnboarding.slide3Title'),
    subtitle: t('appOnboarding.slide3Sub'),
    accent: '#C9A84C'
  },
  {
    icon: '🚀',
    title: t('appOnboarding.slide4Title'),
    subtitle: t('appOnboarding.slide4Sub'),
    accent: '#E8002D',
    isFinal: true
  }
];

export default function AppOnboarding() {
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);
  const { t } = useTranslation()
  const SLIDES = getSlides(t);
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goTo = useCallback((index) => {
    if (index >= 0 && index < SLIDES.length) setCurrent(index);
  }, []);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && current < SLIDES.length - 1) goTo(current + 1);
      if (diff < 0 && current > 0) goTo(current - 1);
    }
  }, [current, goTo]);

  const slide = SLIDES[current];

  const CSS_VARS = `
    [data-theme="dark"] {
      --bg: #0A0A0C; --bg2: #111114; --bg3: #18181D;
      --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.13);
      --red: #E8002D; --red-dim: rgba(232,0,45,0.13);
      --white: #F0F0F0; --muted: rgba(240,240,240,0.40);
      --gold: #C9A84C; --green: #00D4A0;
    }
    [data-theme="light"] {
      --bg: #F5F6F8; --bg2: #FFFFFF; --bg3: #E8EAEE;
      --border: rgba(0,0,0,0.10); --border2: rgba(0,0,0,0.18);
      --red: #D40029; --red-dim: rgba(212,0,41,0.08);
      --white: #1A1B1E; --muted: rgba(26,27,30,0.55);
      --gold: #9C6F10; --green: #007F5F;
    }
  `;

  return (
    <div
      data-theme={theme}
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'none'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Skip button */}
      {!slide.isFinal && (
        <button
          onClick={() => goTo(SLIDES.length - 1)}
          style={{
            position: 'absolute', top: 16, right: 16, zIndex: 10,
            background: 'transparent', border: 'none',
            color: 'var(--muted)', fontSize: 'var(--fs-body)', fontWeight: 600,
            cursor: 'pointer', padding: '8px 16px',
            fontFamily: "'Barlow', sans-serif"
          }}
        >
          {t('common.skip')} →
        </button>
      )}

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 32px', textAlign: 'center',
        animation: 'onbFadeIn 0.3s ease-out'
      }} key={current}>

        {/* Animated icon */}
        <div style={{
          width: 120, height: 120, borderRadius: 30,
          background: `${slide.accent}15`,
          border: `2px solid ${slide.accent}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 56, marginBottom: 40,
          boxShadow: `0 8px 40px ${slide.accent}20`,
          animation: 'onbBounce 0.5s ease-out'
        }}>
          {slide.icon}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 'var(--fs-display)', fontWeight: 900, color: 'var(--white)',
          letterSpacing: 1, textTransform: 'uppercase',
          marginBottom: 16, lineHeight: 1.1
        }}>
          {slide.title}
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'var(--fs-subtitle)', color: 'var(--muted)', lineHeight: 1.6,
          maxWidth: 320, marginBottom: 40
        }}>
          {slide.subtitle}
        </p>

        {/* Final slide: action buttons */}
        {slide.isFinal && (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 12,
            width: '100%', maxWidth: 320
          }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                width: '100%', padding: '16px 24px',
                background: 'linear-gradient(135deg, #E8002D, #FF3355)',
                border: 'none', borderRadius: 12, color: 'white',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 'var(--fs-subtitle)', fontWeight: 900, letterSpacing: 2,
                textTransform: 'uppercase', cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 20px rgba(232,0,45,0.3)'
              }}
            >
              {t('appOnboarding.createAccount')}
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                width: '100%', padding: '14px 24px',
                background: 'transparent',
                border: '2px solid var(--border2)',
                borderRadius: 12, color: 'var(--white)',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 'var(--fs-subtitle)', fontWeight: 700, letterSpacing: 1,
                textTransform: 'uppercase', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {t('appOnboarding.haveAccount')}
            </button>
          </div>
        )}
      </div>

      {/* Bottom: dots + next button */}
      <div style={{
        padding: '24px 32px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* Dots */}
        <div style={{ display: 'flex', gap: 8 }}>
          {SLIDES.map((_, i) => (
            <div
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === current ? 24 : 8, height: 8,
                borderRadius: 4, cursor: 'pointer',
                background: i === current ? slide.accent : 'var(--border2)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Next button */}
        {!slide.isFinal && (
          <button
            onClick={() => goTo(current + 1)}
            style={{
              padding: '12px 24px',
              background: `${slide.accent}`,
              border: 'none', borderRadius: 10, color: 'white',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'var(--fs-subtitle)', fontWeight: 800, letterSpacing: 1,
              textTransform: 'uppercase', cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            {t('common.next')} →
          </button>
        )}
      </div>

      <style>{CSS_VARS + `
        @keyframes onbFadeIn {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes onbBounce {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}