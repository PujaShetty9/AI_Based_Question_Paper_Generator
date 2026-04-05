import { useEffect, useRef } from 'react';
import './Features.css';

const FEATURES = [
  {
    id: 'balanced',
    tag: '01 — Coverage',
    title: 'Balanced\nSyllabus Coverage',
    desc: 'Input your syllabus. The engine automatically maps every topic and guarantees perfect distribution of marks and weightage — no gaps, no bias.',
    accent: '#7ab4f8',
    accentBg: 'rgba(59,130,246,0.12)',
    visual: 'coverage',
  },
  {
    id: 'blooms',
    tag: '02 — Intelligence',
    title: "Bloom's Taxonomy\nAll Six Levels",
    desc: "Define difficulty tiers and the AI strictly adheres to cognitive levels — from granular recall right up to synthesis and creative evaluation.",
    accent: '#c4b5fd',
    accentBg: 'rgba(139,92,246,0.12)',
    visual: 'blooms',
  },
  {
    id: 'zero',
    tag: '03 — Uniqueness',
    title: 'Zero Repetition.\nEvery Time.',
    desc: 'Continuous question bank analysis compares every past paper. Maximum novelty is guaranteed across every single exam you generate.',
    accent: '#6ee7b7',
    accentBg: 'rgba(16,185,129,0.12)',
    visual: 'zero',
  },
  {
    id: 'format',
    tag: '04 — Flexibility',
    title: 'Every Format\nNatively Supported',
    desc: 'MCQs, short answers, descriptive essays, case-based scenarios — all generated in the same paper, balanced and formatted automatically.',
    accent: '#fde047',
    accentBg: 'rgba(234,179,8,0.12)',
    visual: 'format',
  },
];

function CoverageVisual() {
  return (
    <div className="fv-coverage">
      {[
        { label: 'Unit 1 — Data Types', pct: 92 },
        { label: 'Unit 2 — Algorithms', pct: 78 },
        { label: 'Unit 3 — Complexity', pct: 85 },
        { label: 'Unit 4 — Trees & Graphs', pct: 70 },
      ].map((item, i) => (
        <div className="fv-bar-row" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="fv-bar-label">{item.label}</div>
          <div className="fv-bar-track">
            <div className="fv-bar-fill" style={{ '--w': `${item.pct}%`, background: '#7ab4f8' }} />
          </div>
          <div className="fv-bar-pct" style={{ color: '#7ab4f8' }}>{item.pct}%</div>
        </div>
      ))}
      <div className="fv-badge" style={{ background: 'rgba(59,130,246,0.15)', color: '#7ab4f8' }}>
        ✓ All units covered
      </div>
    </div>
  );
}

function BloomsVisual() {
  const levels = [
    { l: 'Remember', marks: 5, color: '#c4b5fd' },
    { l: 'Understand', marks: 8, color: '#a78bfa' },
    { l: 'Apply', marks: 10, color: '#8b5cf6' },
    { l: 'Analyze', marks: 10, color: '#7c3aed' },
    { l: 'Evaluate', marks: 7, color: '#6d28d9' },
    { l: 'Create', marks: 10, color: '#5b21b6' },
  ];
  return (
    <div className="fv-blooms">
      {levels.map((lv, i) => (
        <div className="fv-bloom-row" key={i}>
          <div className="fv-bloom-label">{lv.l}</div>
          <div className="fv-bloom-bar-track">
            <div
              className="fv-bloom-bar"
              style={{ '--w': `${(lv.marks / 50) * 100}%`, background: lv.color, animationDelay: `${i * 0.07}s` }}
            />
          </div>
          <div className="fv-bloom-marks" style={{ color: lv.color }}>{lv.marks}m</div>
        </div>
      ))}
    </div>
  );
}

function ZeroVisual() {
  return (
    <div className="fv-zero">
      <div className="fv-zero-center">
        <div className="fv-zero-ring fv-ring-1" />
        <div className="fv-zero-ring fv-ring-2" />
        <div className="fv-zero-core">
          <span className="fv-zero-num">0</span>
          <span className="fv-zero-sub">Repeats</span>
        </div>
      </div>
      <div className="fv-zero-tags">
        {['Q1 — Unique ✓', 'Q2 — Unique ✓', 'Q3 — Unique ✓', 'Q4 — Unique ✓', 'Q5 — Unique ✓'].map((t, i) => (
          <div key={i} className="fv-zero-tag" style={{ animationDelay: `${i * 0.12}s` }}>{t}</div>
        ))}
      </div>
    </div>
  );
}

function FormatVisual() {
  const formats = [
    { type: 'MCQ', marks: '1m × 10', color: '#fde047' },
    { type: 'Short Answer', marks: '4m × 5', color: '#fbbf24' },
    { type: 'Descriptive', marks: '8m × 2', color: '#f59e0b' },
    { type: 'Case-Based', marks: '15m × 1', color: '#d97706' },
  ];
  return (
    <div className="fv-format">
      {formats.map((f, i) => (
        <div className="fv-format-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="fv-format-type" style={{ color: f.color }}>{f.type}</div>
          <div className="fv-format-marks">{f.marks}</div>
          <div className="fv-format-dot" style={{ background: f.color }} />
        </div>
      ))}
    </div>
  );
}

const VISUALS = { coverage: CoverageVisual, blooms: BloomsVisual, zero: ZeroVisual, format: FormatVisual };

export default function Features() {
  const rowRefs = useRef([]);
  const rubricRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('qf-visible');
          }
        });
      },
      { threshold: 0.18 }
    );
    rowRefs.current.forEach((el) => el && obs.observe(el));
    if (rubricRef.current) obs.observe(rubricRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="qf-section">
      {/* Curved top separator */}
      <div className="qf-curve">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C360,80 1080,80 1440,0 L1440,0 L0,0 Z" fill="#f5f4ef" />
        </svg>
      </div>

      <div className="qf-inner">
        {/* Header */}
        <div className="qf-header">
          <div className="qf-header-tag">
            <span className="qf-tag-dot" />
            Core Features
          </div>
          <h2 className="qf-title">
            Intelligent design for<br />
            <em>every examination.</em>
          </h2>
          <p className="qf-desc">
            Forget manual mark tracking and repeated questions.<br />
            QPG Flow manages every constraint — effortlessly.
          </p>
        </div>

        {/* Feature rows */}
        <div className="qf-rows">
          {FEATURES.map((feat, i) => {
            const Visual = VISUALS[feat.visual];
            const isEven = i % 2 === 1;
            return (
              <div
                key={feat.id}
                className={`qf-row ${isEven ? 'qf-row-flip' : ''}`}
                ref={(el) => (rowRefs.current[i] = el)}
              >
                {/* Text side */}
                <div className="qf-text-side">
                  <div className="qf-feat-tag" style={{ color: feat.accent, background: feat.accentBg }}>
                    {feat.tag}
                  </div>
                  <h3 className="qf-feat-title">
                    {feat.title.split('\n').map((line, j) => (
                      <span key={j}>{line}<br /></span>
                    ))}
                  </h3>
                  <p className="qf-feat-desc">{feat.desc}</p>
                  <div className="qf-feat-line" style={{ background: feat.accent }} />
                </div>

                {/* Visual side */}
                <div className="qf-visual-side">
                  <div className="qf-visual-card" style={{ borderColor: feat.accentBg }}>
                    <div className="qf-visual-glow" style={{ background: feat.accent }} />
                    <Visual />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rubric big card */}
        <div className="qf-rubric-wrap" ref={rubricRef}>
          <div className="qf-rubric-card">
            <div className="qf-rubric-left">
              <div className="qf-feat-tag" style={{ color: '#f87171', background: 'rgba(239,68,68,0.12)' }}>
                05 — Evaluation
              </div>
              <h3 className="qf-feat-title">Automated Rubrics<br />&amp; Model Answers</h3>
              <p className="qf-feat-desc">
                With every paper, QPG Flow simultaneously produces a comprehensive evaluation scheme — distinct marking criteria, expected ideal answers, and partial credit rules. Grading just became as seamless as generation.
              </p>
              <div className="qf-rubric-pills">
                <span className="qf-rpill">Marking Criteria</span>
                <span className="qf-rpill">Model Answers</span>
                <span className="qf-rpill">Partial Credit</span>
                <span className="qf-rpill">PDF Export</span>
              </div>
            </div>
            <div className="qf-rubric-right">
              <div className="qf-rubric-preview">
                <div className="qf-rp-header">
                  <span className="qf-rp-title">Q4: Marketing Strategy Execution</span>
                  <span className="qf-rp-marks">10 Marks</span>
                </div>
                <div className="qf-rp-body">
                  {[
                    { label: 'Identification of 3 core segments', marks: 3 },
                    { label: 'Alignment with Q3 financial constraints', marks: 4 },
                    { label: 'Innovativeness of channel selection', marks: 3 },
                  ].map((item, i) => (
                    <div className="qf-rp-row" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
                      <div className="qf-rp-bar" />
                      <span className="qf-rp-label">{item.label}</span>
                      <span className="qf-rp-m">{item.marks}m</span>
                    </div>
                  ))}
                </div>
                <div className="qf-rp-footer">
                  <span className="qf-rp-status">✓ Rubric generated</span>
                  <span className="qf-rp-ai">AI-verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}