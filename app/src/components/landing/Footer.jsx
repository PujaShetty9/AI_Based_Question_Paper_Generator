import { Link } from 'react-router-dom';

const footerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');

  .f {
    background: #e8e6d9;
    font-family: 'Geist', sans-serif;
    position: relative;
  }

  .f-top-bar {
    padding: 0 60px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }

  .f-top-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(0,0,0,0.35);
  }

  .f-top-links {
    display: flex;
    gap: 32px;
  }

  .f-top-link {
    font-size: 12px;
    font-weight: 400;
    color: rgba(0,0,0,0.4);
    text-decoration: none;
    letter-spacing: 0.02em;
    transition: color 0.15s;
  }
  .f-top-link:hover { color: #000; }

  .f-mid {
    padding: 56px 60px 0;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 60px;
    align-items: start;
  }

  .f-brand { display: flex; flex-direction: column; gap: 18px; }

  .f-logo-row { display: flex; align-items: center; gap: 11px; text-decoration: none; }

  .f-logo-mark {
    width: 34px; height: 34px;
    background: #1a1a1a;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .f-logo-mark span {
    font-family: 'Geist', sans-serif;
    font-weight: 600;
    font-size: 14px;
    color: #e8e6d9;
    letter-spacing: -0.5px;
  }

  .f-logo-name {
    font-size: 15px;
    font-weight: 600;
    color: #1a1a1a;
    letter-spacing: -0.3px;
  }

  .f-logo-sub {
    font-size: 11px;
    color: rgba(0,0,0,0.38);
    margin-top: 2px;
  }

  .f-desc {
    font-size: 13px;
    color: rgba(0,0,0,0.45);
    line-height: 1.75;
    font-weight: 300;
    max-width: 300px;
  }

  .f-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 80px;
    align-items: start;
  }

  .f-col-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(0,0,0,0.3);
    margin-bottom: 20px;
  }

  .f-nav { display: flex; flex-direction: column; }

  .f-nav-link {
    font-size: 13px;
    color: rgba(0,0,0,0.5);
    text-decoration: none;
    padding: 8px 0;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: color 0.15s;
    letter-spacing: -0.01em;
  }
  .f-nav-link:last-child { border-bottom: none; }
  .f-nav-link:hover { color: #1a1a1a; }
  .f-nav-link:hover .f-arr { opacity: 1; transform: translate(2px, -2px); }

  .f-arr {
    opacity: 0;
    font-size: 10px;
    color: rgba(0,0,0,0.4);
    transition: opacity 0.15s, transform 0.15s;
  }

  .f-contact { display: flex; flex-direction: column; gap: 16px; }

  .f-crow { display: flex; flex-direction: column; gap: 3px; }

  .f-ck {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(0,0,0,0.28);
  }

  .f-cv {
    font-size: 12.5px;
    color: rgba(0,0,0,0.5);
    line-height: 1.65;
    font-weight: 300;
  }

  .f-cv a {
    color: rgba(0,0,0,0.6);
    text-decoration: none;
    border-bottom: 1px solid rgba(0,0,0,0.2);
    transition: all 0.15s;
  }
  .f-cv a:hover { color: #000; border-color: rgba(0,0,0,0.5); }

  .f-hero {
    margin-top: 32px;
    padding: 0 60px;
    overflow: hidden;
    border-top: 1px solid rgba(0,0,0,0.08);
  }

  .f-hero-text {
    font-family: 'Instrument Serif', serif;
    font-style: italic;
    font-size: clamp(80px, 13vw, 180px);
    color: #1a1a1a;
    line-height: 0.85;
    letter-spacing: -0.04em;
    user-select: none;
    padding: 20px 0 14px;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  .f-bottom {
    padding: 18px 60px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(0,0,0,0.08);
    flex-wrap: wrap;
    gap: 8px;
  }

  .f-copy {
    font-size: 11.5px;
    color: rgba(0,0,0,0.3);
    letter-spacing: 0.01em;
  }

  .f-pce {
    font-size: 11.5px;
    color: rgba(0,0,0,0.3);
    font-weight: 300;
  }

  .f-pce a {
    color: rgba(0,0,0,0.55);
    text-decoration: none;
    font-weight: 500;
    border-bottom: 1px solid rgba(0,0,0,0.18);
    transition: all 0.15s;
  }
  .f-pce a:hover { color: #000; border-color: rgba(0,0,0,0.45); }

  .f-badge {
    font-size: 11px;
    color: rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    gap: 6px;
    letter-spacing: 0.04em;
    font-weight: 400;
  }

  .f-badge::before {
    content: '';
    width: 4px; height: 4px;
    border-radius: 50%;
    background: rgba(0,0,0,0.25);
  }

  @media (max-width: 860px) {
    .f-top-bar { padding: 0 32px; }
    .f-mid { padding: 48px 32px 0; grid-template-columns: 1fr; gap: 40px; }
    .f-hero { padding: 0 32px; }
    .f-bottom { padding: 18px 32px 28px; }
  }

  @media (max-width: 560px) {
    .f-top-bar { padding: 0 20px; }
    .f-top-links { gap: 20px; }
    .f-mid { padding: 40px 20px 0; }
    .f-info-grid { grid-template-columns: 1fr; gap: 36px; }
    .f-hero { padding: 0 20px; }
    .f-hero-text { font-size: clamp(48px, 11vw, 80px); }
    .f-bottom { padding: 16px 20px 24px; flex-direction: column; align-items: flex-start; }
  }
`;

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Features', href: '#features' },
  { label: 'Taxonomy Engine', href: '#taxonomy' },
  { label: 'Supported Formats', href: '#formats' },
  { label: 'Generate Paper', to: '/generate' },
];

export default function Footer() {
  return (
    <>
      <style>{footerStyles}</style>
      <footer className="f">

        

        {/* Mid section */}
        <div className="f-mid">

          {/* Brand */}
          <div className="f-brand">
            <Link to="/" className="f-logo-row">
              <div className="f-logo-mark"><span>Q</span></div>
              <div>
                <div className="f-logo-name">QPG Flow</div>
                <div className="f-logo-sub">AI Question Paper Generator</div>
              </div>
            </Link>
            <p className="f-desc">
              Intelligent question paper generation with Bloom's Taxonomy targeting — built for educators who care about quality.
            </p>
          </div>

          {/* Nav + Contact */}
          <div className="f-info-grid">

            <div>
              <p className="f-col-label">Navigation</p>
              <nav className="f-nav">
                {navLinks.map(({ label, to, href }) =>
                  to ? (
                    <Link key={label} to={to} className="f-nav-link">
                      {label}<span className="f-arr">↗</span>
                    </Link>
                  ) : (
                    <a key={label} href={href} className="f-nav-link">
                      {label}<span className="f-arr">↗</span>
                    </a>
                  )
                )}
              </nav>
            </div>

            <div>
              <p className="f-col-label">Contact</p>
              <div className="f-contact">
                <div className="f-crow">
                  <span className="f-ck">Institution</span>
                  <span className="f-cv">Pillai College of Engineering</span>
                </div>
                <div className="f-crow">
                  <span className="f-ck">Address</span>
                  <span className="f-cv">
                    Dr. K.M. Vasudevan Pillai Campus<br />
                    New Panvel, Navi Mumbai
                  </span>
                </div>
                <div className="f-crow">
                  <span className="f-ck">Support</span>
                  <span className="f-cv">
                    <a href="mailto:support@pillai.edu">support@pillai.edu</a>
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Big hero text */}
        <div className="f-hero">
          <div className="f-hero-text">Generate Smarter.</div>
        </div>

        {/* Bottom bar */}
        <div className="f-bottom">
          <span className="f-copy">© 2026 QPG Flow — All rights reserved</span>
          <p className="f-pce">
            Developed at{' '}
            <a href="https://www.pce.ac.in" target="_blank" rel="noopener noreferrer">
              Pillai College of Engineering
            </a>
          </p>
          <div className="f-badge">AI Based Question Paper Generator</div>
        </div>

      </footer>
    </>
  );
}