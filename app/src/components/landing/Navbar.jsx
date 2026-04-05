import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');

  .qpg-nav-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    padding: 18px 24px;
    pointer-events: none;
  }

  .qpg-nav {
    pointer-events: all;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(245, 244, 239, 0.82);
    border: 1px solid rgba(184, 240, 105, 0.35);
    border-radius: 18px;
    padding: 10px 16px 10px 20px;
    box-shadow:
      0 4px 24px rgba(0,0,0,0.07),
      0 1px 0 rgba(255,255,255,0.9) inset;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    max-width: 1100px;
    width: 100%;
    gap: 8px;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .qpg-nav.scrolled {
    background: rgba(245, 244, 239, 0.95);
    border-color: rgba(184, 240, 105, 0.5);
    box-shadow:
      0 8px 36px rgba(0,0,0,0.09),
      0 1px 0 rgba(255,255,255,0.9) inset;
  }

  /* ---- Brand ---- */
  .qpg-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    flex-shrink: 0;
  }

  .qpg-logo-mark {
    width: 34px;
    height: 34px;
    background: #1a1a18;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Instrument Serif', serif;
    font-style: italic;
    font-size: 17px;
    color: #b8f069;
    flex-shrink: 0;
    box-shadow: 0 3px 10px rgba(26,26,24,0.22);
    transition: transform 0.2s ease;
  }

  .qpg-brand:hover .qpg-logo-mark {
    transform: rotate(-4deg) scale(1.05);
  }

  .qpg-brand-text {
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 16px;
    color: #141410;
    letter-spacing: -0.3px;
    white-space: nowrap;
  }

  .qpg-brand-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #b8f069;
    margin-left: 2px;
    vertical-align: middle;
    margin-bottom: 2px;
  }

  /* ---- Desktop Links ---- */
  .qpg-links {
    display: flex;
    align-items: center;
    gap: 2px;
    flex: 1;
    justify-content: center;
  }

  .qpg-item { position: relative; }

  .qpg-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 7px 14px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #4a4a44;
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
    transition: color 0.18s, background 0.18s;
    letter-spacing: -0.1px;
  }

  .qpg-link:hover,
  .qpg-link.open {
    color: #141410;
    background: rgba(26, 26, 24, 0.06);
  }

  .qpg-chevron {
    width: 12px;
    height: 12px;
    opacity: 0.45;
    transition: transform 0.2s, opacity 0.2s;
    flex-shrink: 0;
    color: #4a4a44;
  }

  .qpg-link.open .qpg-chevron {
    transform: rotate(180deg);
    opacity: 0.75;
  }

  /* ---- Dropdown ---- */
  .qpg-drop {
    position: absolute;
    top: calc(100% + 14px);
    left: 50%;
    transform: translateX(-50%) translateY(8px);
    background: rgba(250, 249, 245, 0.98);
    border: 1px solid rgba(184, 240, 105, 0.3);
    border-radius: 16px;
    padding: 10px;
    box-shadow:
      0 16px 48px rgba(0,0,0,0.1),
      0 4px 12px rgba(0,0,0,0.05);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
    z-index: 200;
    backdrop-filter: blur(20px);
  }

  .qpg-drop::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 10px;
    background: rgba(250,249,245,0.98);
    border-left: 1px solid rgba(184,240,105,0.3);
    border-top: 1px solid rgba(184,240,105,0.3);
    transform: translateX(-50%) rotate(45deg);
  }

  .qpg-drop.open {
    opacity: 1;
    pointer-events: all;
    transform: translateX(-50%) translateY(0);
  }

  .qpg-drop.wide {
    min-width: 460px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
  }

  .qpg-drop.wide .qpg-drop-header { grid-column: 1 / -1; }
  .qpg-drop.narrow { min-width: 260px; }

  .qpg-drop-header {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #a0a090;
    padding: 6px 10px 8px;
    font-family: 'DM Sans', sans-serif;
  }

  .qpg-drop-item {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 9px 10px;
    border-radius: 11px;
    text-decoration: none;
    transition: background 0.15s;
    cursor: pointer;
  }

  .qpg-drop-item:hover {
    background: rgba(184, 240, 105, 0.12);
  }

  .qpg-drop-icon {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: rgba(26, 26, 24, 0.06);
    border: 1px solid rgba(26, 26, 24, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
    transition: all 0.15s;
  }

  .qpg-drop-item:hover .qpg-drop-icon {
    background: rgba(184, 240, 105, 0.2);
    border-color: rgba(184, 240, 105, 0.4);
  }

  .qpg-drop-texts { display: flex; flex-direction: column; gap: 1px; }

  .qpg-drop-title {
    font-size: 13.5px;
    font-weight: 600;
    color: #141410;
    font-family: 'DM Sans', sans-serif;
    line-height: 1.2;
  }

  .qpg-drop-sub {
    font-size: 11.5px;
    color: #7a7a6e;
    font-family: 'DM Sans', sans-serif;
    line-height: 1.3;
  }

  /* ---- Actions ---- */
  .qpg-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .qpg-login {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 15px;
    font-size: 13.5px;
    font-weight: 500;
    color: #3a3a34;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    border-radius: 10px;
    border: 1px solid rgba(26, 26, 24, 0.15);
    background: rgba(255, 255, 255, 0.7);
    transition: all 0.2s ease;
    white-space: nowrap;
    cursor: pointer;
    letter-spacing: -0.1px;
  }

  .qpg-login:hover {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(26, 26, 24, 0.25);
    color: #141410;
  }

  .qpg-login svg {
    width: 13px;
    height: 13px;
    opacity: 0.5;
    transition: opacity 0.2s;
  }
  .qpg-login:hover svg { opacity: 0.8; }

  .qpg-cta {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 18px;
    background: #1a1a18;
    color: #f0ffd4;
    border-radius: 10px;
    font-size: 13.5px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    text-decoration: none;
    letter-spacing: -0.2px;
    white-space: nowrap;
    transition: all 0.2s ease;
    flex-shrink: 0;
    border: none;
    cursor: pointer;
    box-shadow: 0 3px 12px rgba(26, 26, 24, 0.2);
    position: relative;
    overflow: hidden;
  }

  .qpg-cta::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(184,240,105,0.15) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .qpg-cta:hover {
    background: #2a3a10;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(26, 26, 24, 0.26);
  }
  .qpg-cta:hover::after { opacity: 1; }
  .qpg-cta:active { transform: translateY(0); }

  .qpg-cta-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #b8f069;
    flex-shrink: 0;
  }

  /* ---- Hamburger ---- */
  .qpg-burger {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 38px;
    height: 38px;
    background: rgba(26, 26, 24, 0.06);
    border: 1px solid rgba(26, 26, 24, 0.1);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .qpg-burger:hover {
    background: rgba(26, 26, 24, 0.1);
    border-color: rgba(26, 26, 24, 0.16);
  }

  .qpg-burger span {
    display: block;
    width: 15px;
    height: 1.5px;
    background: #3a3a34;
    border-radius: 2px;
    transition: transform 0.25s, opacity 0.25s;
  }

  .qpg-burger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .qpg-burger.open span:nth-child(2) { opacity: 0; }
  .qpg-burger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  /* ---- Mobile Drawer ---- */
  .qpg-drawer {
    position: fixed;
    inset: 0;
    z-index: 999;
    pointer-events: none;
  }

  .qpg-drawer-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(26, 26, 18, 0.25);
    backdrop-filter: blur(6px);
    opacity: 0;
    transition: opacity 0.25s;
  }

  .qpg-drawer.open .qpg-drawer-backdrop {
    opacity: 1;
    pointer-events: all;
  }

  .qpg-drawer-panel {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: #f5f4ef;
    border-bottom: 1px solid rgba(184, 240, 105, 0.3);
    padding: 84px 18px 24px;
    transform: translateY(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
    box-shadow: 0 12px 40px rgba(0,0,0,0.1);
  }

  .qpg-drawer.open .qpg-drawer-panel {
    transform: translateY(0);
    pointer-events: all;
  }

  .qpg-drawer-label {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #a0a090;
    padding: 8px 10px 6px;
    font-family: 'DM Sans', sans-serif;
  }

  .qpg-drawer-link {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 10px 10px;
    border-radius: 11px;
    text-decoration: none;
    transition: background 0.15s;
    cursor: pointer;
  }

  .qpg-drawer-link:hover { background: rgba(184, 240, 105, 0.15); }

  .qpg-drawer-icon {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: rgba(26, 26, 24, 0.06);
    border: 1px solid rgba(26, 26, 24, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
  }

  .qpg-drawer-texts { display: flex; flex-direction: column; gap: 1px; }
  .qpg-drawer-title { font-size: 14px; font-weight: 600; color: #141410; font-family: 'DM Sans', sans-serif; }
  .qpg-drawer-sub   { font-size: 11.5px; color: #7a7a6e; font-family: 'DM Sans', sans-serif; }

  .qpg-drawer-divider {
    height: 1px;
    background: rgba(26, 26, 24, 0.08);
    margin: 10px 0;
  }

  .qpg-drawer-actions { display: flex; gap: 9px; padding-top: 6px; }

  .qpg-drawer-login {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 11px;
    border-radius: 11px;
    border: 1px solid rgba(26, 26, 24, 0.15);
    font-size: 14px;
    font-weight: 600;
    color: #141410;
    background: rgba(255,255,255,0.8);
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  .qpg-drawer-login:hover { background: #fff; border-color: rgba(26,26,24,0.25); }
  .qpg-drawer-login svg { width: 13px; height: 13px; opacity: 0.5; }

  .qpg-drawer-cta {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 11px;
    border-radius: 11px;
    background: #1a1a18;
    font-size: 14px;
    font-weight: 600;
    color: #f0ffd4;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
  }
  .qpg-drawer-cta:hover { background: #2a3a10; }
  .qpg-drawer-cta-dot { width: 6px; height: 6px; border-radius: 50%; background: #b8f069; flex-shrink: 0; }

  /* ---- Responsive ---- */
  @media (max-width: 820px) {
    .qpg-links { display: none; }
    .qpg-desktop-actions { display: none; }
    .qpg-burger { display: flex; }
  }

  @media (max-width: 480px) {
    .qpg-nav-wrapper { padding: 12px 14px; }
    .qpg-nav { padding: 9px 14px; border-radius: 14px; }
    .qpg-logo-mark { width: 30px; height: 30px; font-size: 15px; }
    .qpg-brand-text { font-size: 15px; }
    .qpg-drawer-panel { padding: 76px 14px 20px; }
  }
`;

const featuresItems = [
  { icon: '⚡', title: 'AI Generation',      sub: 'Papers in seconds with Gemini' },
  { icon: '🧠', title: "Bloom's Engine",     sub: 'Cognitive level targeting' },
  { icon: '📊', title: 'Difficulty Control', sub: 'Easy, medium, hard mixing' },
  { icon: '✏️', title: 'Live Preview & Edit',sub: 'Tweak before you export' },
  { icon: '🗂️', title: 'Question Bank',      sub: 'Save & reuse questions' },
  { icon: '🔄', title: 'Regenerate',         sub: 'Instant refresh per section' },
];

const formatsItems = [
  { icon: '📄', title: 'PDF Export',      sub: 'Clean print-ready output' },
  { icon: '🗝️', title: 'Answer Key',      sub: 'Auto-generated with paper' },
  { icon: '📐', title: 'Custom Sections', sub: 'Section A, B, C — your way' },
];

export default function Navbar() {
  const [scrolled,    setScrolled]   = useState(false);
  const [openMenu,    setOpenMenu]   = useState(null);
  const [mobileOpen,  setMobileOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const toggle   = (n) => setOpenMenu(p => p === n ? null : n);
  const closeAll = () => { setOpenMenu(null); setMobileOpen(false); };

  return (
    <>
      <style>{navStyles}</style>

      <div className="qpg-nav-wrapper">
        <nav className={`qpg-nav ${scrolled ? 'scrolled' : ''}`} ref={navRef}>

          {/* Brand */}
          <Link to="/" className="qpg-brand" onClick={closeAll}>
            <div className="qpg-logo-mark">Q</div>
            <span className="qpg-brand-text">
              QPG Flow<span className="qpg-brand-dot" />
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="qpg-links">

            <div className="qpg-item">
              <button
                className={`qpg-link ${openMenu === 'features' ? 'open' : ''}`}
                onClick={() => toggle('features')}
              >
                Features
                <svg className="qpg-chevron" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className={`qpg-drop wide ${openMenu === 'features' ? 'open' : ''}`}>
                <div className="qpg-drop-header">Capabilities</div>
                {featuresItems.map(item => (
                  <a key={item.title} href="#features" className="qpg-drop-item" onClick={closeAll}>
                    <div className="qpg-drop-icon">{item.icon}</div>
                    <div className="qpg-drop-texts">
                      <span className="qpg-drop-title">{item.title}</span>
                      <span className="qpg-drop-sub">{item.sub}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <a href="#taxonomy" className="qpg-link" onClick={closeAll}>Taxonomy</a>

            <div className="qpg-item">
              <button
                className={`qpg-link ${openMenu === 'formats' ? 'open' : ''}`}
                onClick={() => toggle('formats')}
              >
                Formats
                <svg className="qpg-chevron" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className={`qpg-drop narrow ${openMenu === 'formats' ? 'open' : ''}`}>
                <div className="qpg-drop-header">Export Options</div>
                {formatsItems.map(item => (
                  <a key={item.title} href="#formats" className="qpg-drop-item" onClick={closeAll}>
                    <div className="qpg-drop-icon">{item.icon}</div>
                    <div className="qpg-drop-texts">
                      <span className="qpg-drop-title">{item.title}</span>
                      <span className="qpg-drop-sub">{item.sub}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <a href="#how" className="qpg-link" onClick={closeAll}>How it works</a>

          </div>

          {/* Desktop actions */}
          <div className="qpg-actions qpg-desktop-actions">
            <Link to="/login" className="qpg-login" onClick={closeAll}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Log in
            </Link>
            <Link to="/generate" className="qpg-cta" onClick={closeAll}>
              <span className="qpg-cta-dot" />
              Generate Free
            </Link>
          </div>

          {/* Mobile burger */}
          <div className="qpg-actions">
            <button
              className={`qpg-burger ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(p => !p)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>

        </nav>
      </div>

      {/* Mobile drawer */}
      <div className={`qpg-drawer ${mobileOpen ? 'open' : ''}`}>
        <div className="qpg-drawer-backdrop" onClick={closeAll} />
        <div className="qpg-drawer-panel">

          <div className="qpg-drawer-label">Features</div>
          {featuresItems.slice(0, 4).map(item => (
            <a key={item.title} href="#features" className="qpg-drawer-link" onClick={closeAll}>
              <div className="qpg-drawer-icon">{item.icon}</div>
              <div className="qpg-drawer-texts">
                <span className="qpg-drawer-title">{item.title}</span>
                <span className="qpg-drawer-sub">{item.sub}</span>
              </div>
            </a>
          ))}

          <div className="qpg-drawer-divider" />

          <div className="qpg-drawer-label">Export</div>
          {formatsItems.map(item => (
            <a key={item.title} href="#formats" className="qpg-drawer-link" onClick={closeAll}>
              <div className="qpg-drawer-icon">{item.icon}</div>
              <div className="qpg-drawer-texts">
                <span className="qpg-drawer-title">{item.title}</span>
                <span className="qpg-drawer-sub">{item.sub}</span>
              </div>
            </a>
          ))}

          <div className="qpg-drawer-divider" />

          <div className="qpg-drawer-actions">
            <Link to="/login" className="qpg-drawer-login" onClick={closeAll}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Log in
            </Link>
            <Link to="/generate" className="qpg-drawer-cta" onClick={closeAll}>
              <span className="qpg-drawer-cta-dot" />
              Generate Free
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}