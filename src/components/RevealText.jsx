import { useEffect, useRef, useState } from 'react';
import '../styles/RevealText.css';

export function RevealFilters() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
      <defs>
        {/* 0: fade in */}
        <filter id="rt-0" colorInterpolationFilters="sRGB" x="-5%" y="-20%" width="110%" height="140%">
          <feGaussianBlur stdDeviation="0" />
        </filter>
        {/* 1: unblur */}
        <filter id="rt-1" colorInterpolationFilters="sRGB" x="-5%" y="-20%" width="110%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4 0" result="blur" />
          <feBlend in="SourceGraphic" in2="blur" mode="normal" />
        </filter>
        {/* 2: unblur & fade */}
        <filter id="rt-2" colorInterpolationFilters="sRGB" x="-5%" y="-20%" width="110%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        {/* 3: grow */}
        <filter id="rt-3" colorInterpolationFilters="sRGB" x="-5%" y="-30%" width="110%" height="160%">
          <feGaussianBlur stdDeviation="2 4" />
        </filter>
        {/* 4: unshear */}
        <filter id="rt-4" colorInterpolationFilters="sRGB" x="-5%" y="-20%" width="110%" height="140%">
          <feGaussianBlur stdDeviation="5 1" />
        </filter>
        {/* 5: dissolve */}
        <filter id="rt-5" colorInterpolationFilters="sRGB" x="-5%" y="-20%" width="110%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* 6: wave */}
        <filter id="rt-6" colorInterpolationFilters="sRGB" x="-5%" y="-30%" width="110%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

export default function RevealText({ text, filterId = 0, as: Tag = 'p', className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`rt-wrap ${className}`}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className={`rt-char rt-char--${filterId} ${visible ? 'rt-char--visible' : ''}`}
          style={{ animationDelay: `${i * 0.03}s` }}
          aria-hidden={char === ' ' ? undefined : 'true'}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
      {/* screen reader text */}
      <span className="rt-sr">{text}</span>
    </Tag>
  );
}
