import { Link } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
  return (
    <section className="qpg-hero">
      {/* Background blobs */}
      <div className="qpg-blob qpg-blob-1" />
      <div className="qpg-blob qpg-blob-2" />
      <div className="qpg-blob qpg-blob-3" />
      <div className="qpg-grain" />

      <div className="qpg-inner">
    

        {/* Headline */}
        <h1 className="qpg-title">
          Scale assessments.<br />
          <em>Zero repetition.</em>
        </h1>

        {/* Subtitle */}
        <p className="qpg-subtitle">
          Input your syllabus and difficulty parameters. QPG Flow instantly generates
          perfectly balanced, Bloom's Taxonomy-aligned question papers with automated rubrics.
        </p>

        {/* CTAs */}
        <div className="qpg-ctas">
          <Link to="/login" className="qpg-btn-primary">
            Start Generating — It's Free
          </Link>
          <button className="qpg-btn-secondary">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            See it in action
          </button>
        </div>

        {/* Social proof */}
        <div className="qpg-proof">
          <div className="qpg-avatars">
            <div className="qpg-av qpg-av1">A</div>
            <div className="qpg-av qpg-av2">R</div>
            <div className="qpg-av qpg-av3">S</div>
            <div className="qpg-av qpg-av4">M</div>
          </div>
          <p className="qpg-proof-text">
            <strong>420+ educators</strong> generating papers this week
          </p>
        </div>

        {/* Preview card */}
        <div className="qpg-preview-wrap">
          {/* Floating counter badge */}
          <div className="qpg-counter-badge">
            <span className="qpg-pulse-dot" />
            Generating now...
          </div>

          {/* Floating tag left */}
          <div className="qpg-float-tag qpg-ft-left">
            <div className="qpg-ft-icon" style={{ background: '#f0ffd4' }}>📋</div>
            <div>
              <div className="qpg-ft-meta">Auto-assigned</div>
              <div className="qpg-ft-val">25 marks • 6 questions</div>
            </div>
          </div>

          {/* Floating tag right */}
          <div className="qpg-float-tag qpg-ft-right">
            <div className="qpg-ft-icon" style={{ background: '#fff0d4' }}>🎯</div>
            <div>
              <div className="qpg-ft-meta">Bloom's level</div>
              <div className="qpg-ft-val">Synthesis — L5</div>
            </div>
          </div>

          <div className="qpg-card">
            {/* Chrome bar */}
            <div className="qpg-chrome">
              <div className="qpg-mac-dots">
                <span className="qpg-mac-dot r" />
                <span className="qpg-mac-dot y" />
                <span className="qpg-mac-dot g" />
              </div>
              <div className="qpg-url-bar">
                <span className="qpg-lock">🔒</span> qpgflow.app/dashboard
              </div>
            </div>

            {/* Body */}
            <div className="qpg-card-body">
              {/* Sidebar */}
              <div className="qpg-sidebar">
                <div className="qpg-sidebar-label">Navigation</div>
                <div className="qpg-nav-item active"><span className="qpg-dot" />Dashboard</div>
                <div className="qpg-nav-item"><span className="qpg-dot" />New Paper</div>
                <div className="qpg-nav-item"><span className="qpg-dot" />Rubrics</div>
                <div className="qpg-nav-item"><span className="qpg-dot" />History</div>
                <div className="qpg-nav-item"><span className="qpg-dot" />Settings</div>

                <div className="qpg-sidebar-label" style={{ marginTop: '16px' }}>This Paper</div>
                <div className="qpg-paper-meta">
                  <div className="qpg-meta-label">Subject</div>
                  <div className="qpg-meta-val">Data Structures</div>
                  <div className="qpg-meta-label" style={{ marginTop: '8px' }}>Difficulty</div>
                  <div className="qpg-difficulty-bar">
                    <div className="qpg-dbar-seg" style={{ opacity: 0.9 }} />
                    <div className="qpg-dbar-seg" style={{ opacity: 0.7 }} />
                    <div className="qpg-dbar-seg" style={{ opacity: 0.5 }} />
                    <div className="qpg-dbar-seg qpg-dbar-empty" />
                  </div>
                </div>
              </div>

              {/* Main */}
              <div className="qpg-main">
                <div className="qpg-section-header">
                  <span className="qpg-section-title">Generating Question Paper</span>
                  <span className="qpg-section-badge">3 of 6 done</span>
                </div>

                {/* Gen card */}
                <div className="qpg-gen-card">
                  <div className="qpg-gen-step">
                    <div className="qpg-step-num">4</div>
                    <span className="qpg-step-label">Bloom's "Synthesis" — Case-Based Question</span>
                    <span className="qpg-step-tag">15 Marks</span>
                  </div>
                  <div className="qpg-loading-lines">
                    <div className="qpg-line" style={{ width: '100%' }} />
                    <div className="qpg-line" style={{ width: '88%' }} />
                    <div className="qpg-line" style={{ width: '62%' }} />
                  </div>
                  <div className="qpg-gen-footer">
                    <span className="qpg-footer-meta">Format: Case-Based • Unique</span>
                    <span className="qpg-footer-mark">✓ Rubric ready</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="qpg-stats-grid">
                  <div className="qpg-stat-box">
                    <div className="qpg-stat-num">6</div>
                    <div className="qpg-stat-lbl">Total Qs</div>
                  </div>
                  <div className="qpg-stat-box">
                    <div className="qpg-stat-num">50</div>
                    <div className="qpg-stat-lbl">Total Marks</div>
                  </div>
                  <div className="qpg-stat-box">
                    <div className="qpg-stat-num">0</div>
                    <div className="qpg-stat-lbl">Repeats</div>
                  </div>
                </div>

                {/* Taxonomy pills */}
                <div>
                  <div className="qpg-tax-label">Bloom's Coverage</div>
                  <div className="qpg-tax-row">
                    <span className="qpg-pill tp1">Remember ✓</span>
                    <span className="qpg-pill tp2">Understand ✓</span>
                    <span className="qpg-pill tp3">Apply ✓</span>
                    <span className="qpg-pill tp4">Analyze</span>
                    <span className="qpg-pill tp5">Evaluate</span>
                    <span className="qpg-pill tp6">Create ←</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}