import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PreviewStep from '../components/dashboard/PreviewStep';
import './Dashboard.css';

function Dashboard() {
  const [step, setStep] = useState(1);

  // Step 1 State
  const [setup, setSetup] = useState({
    subject: '',
    teacher: '',
    syllabus: '',
    totalMarks: ''
  });

  // Step 2 State
  const [sections, setSections] = useState([
    { id: 1, name: 'Section A', questions: 4, marksPerQ: 5, bloom: 'Remember/Understand', diff: 'Easy' }
  ]);

  const totalCalculated = sections.reduce((sum, sec) => sum + (sec.questions * sec.marksPerQ), 0);
  const totalExpected = parseInt(setup.totalMarks) || 0;
  const isValid = totalCalculated === totalExpected && totalExpected > 0;

  // AI Loading State
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPaperData, setAiPaperData] = useState(null);

  const addSection = () => {
    const nextLabel = String.fromCharCode(65 + sections.length);
    setSections([...sections, { id: Date.now(), name: `Section ${nextLabel}`, questions: 1, marksPerQ: 10, bloom: 'Apply', diff: 'Medium' }]);
  };

  const updateSection = (id, field, value) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSection = (id) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const handleGenerate = async () => {
    if (!isValid) return;
    setStep(3); // Loading state
    setIsGenerating(true);

    try {
      const response = await fetch('http://localhost:5000/generate-ai-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: setup.subject || 'Natural Language Processing',
          topics: setup.syllabus.split('\n').filter(s => s.trim() !== '') || ['Word Embeddings', 'Pragmatics'],
          difficulty: sections[0]?.diff || 'Medium'
        })
      });

      const data = await response.json();

      if (data.success) {
        setAiPaperData(data.paper);
      }

      setIsGenerating(false);
      setStep(4); // Preview State
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
      alert("Backend connection failed! Is port 5000 running?");
      setStep(4); // Go to preview anyway so UI doesn't completely block
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('http://localhost:5000/download-question-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: setup.subject || 'Natural Language Processing',
          topics: setup.syllabus ? setup.syllabus.split('\n') : ['Word Embeddings', 'Word2Vec'],
          difficulty: 'Medium',
          blooms_level: 'Apply',
          total_marks: parseInt(setup.totalMarks) || 60
        })
      });

      if (!response.ok) throw new Error('Download failed');

      // Handle the PDF blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'question_paper.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Failed to generate PDF. Check backend console.');
    }
  };



  return (
    <div className="dashboard-layout">
      {/* Sidebar Progress */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon" style={{ width: 24, height: 24, fontSize: 10 }}>Q</div>
          QPG Flow
        </div>

        <div className="stepper">
          {[
            { num: 1, label: 'Paper Setup' },
            { num: 2, label: 'Section Builder' },
            { num: 3, label: 'AI Generation' },
            { num: 4, label: 'Preview & Edit' },
            { num: 5, label: 'Export' }
          ].map(s => (
            <div key={s.num} className={`step-item ${step === s.num ? 'active' : step > s.num ? 'completed' : ''}`}>
              <div className="step-circle">{step > s.num ? '✓' : s.num}</div>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Area */}
      <main className="dashboard-main">
        {step === 1 && (
          <div className="dashboard-container">
            <div className="form-header">
              <h2>Paper Setup</h2>
              <p>Define the core parameters for the examination.</p>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label>Subject Name</label>
                <input type="text" className="glass-input" placeholder="e.g. Natural Language Processing" value={setup.subject} onChange={e => setSetup({ ...setup, subject: e.target.value })} />
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Teacher Name (Optional)</label>
                  <input type="text" className="glass-input" placeholder="e.g. Dr. Jane Smith" value={setup.teacher} onChange={e => setSetup({ ...setup, teacher: e.target.value })} />
                </div>
                <div className="input-group">
                  <label>Total Marks Target</label>
                  <input type="number" className="glass-input" placeholder="e.g. 60" value={setup.totalMarks} onChange={e => setSetup({ ...setup, totalMarks: e.target.value })} />
                </div>
              </div>

              <div className="input-group">
                <label>Syllabus / Topics to Cover</label>
                <textarea className="glass-input" placeholder="Paste chapters, modules, or bullet points here..." value={setup.syllabus} onChange={e => setSetup({ ...setup, syllabus: e.target.value })} />
              </div>
            </div>

            <div className="action-bar">
              <div></div>
              <button className="btn-primary" onClick={() => setStep(2)}>Next: Section Builder →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="dashboard-container">
            <div className="form-header">
              <h2>Section Builder</h2>
              <p>Configure the structure, difficulty, and Bloom's Taxonomy limits per section.</p>
            </div>

            <div className="sections-list">
              {sections.map((sec, index) => (
                <div key={sec.id} className="section-card">
                  <div className="section-card-header">
                    <h3>{sec.name}</h3>
                    {sections.length > 1 && (
                      <button className="remove-btn" onClick={() => removeSection(sec.id)}>Remove Section</button>
                    )}
                  </div>

                  <div className="form-grid">
                    <div className="form-row">
                      <div className="input-group">
                        <label>Num of Questions</label>
                        <input type="number" className="glass-input" value={sec.questions} onChange={e => updateSection(sec.id, 'questions', parseInt(e.target.value) || 0)} />
                      </div>
                      <div className="input-group">
                        <label>Marks per Question</label>
                        <input type="number" className="glass-input" value={sec.marksPerQ} onChange={e => updateSection(sec.id, 'marksPerQ', parseInt(e.target.value) || 0)} />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="input-group">
                        <label>Bloom's Taxonomy Level</label>
                        <select className="glass-input" value={sec.bloom} onChange={e => updateSection(sec.id, 'bloom', e.target.value)}>
                          <option>Remember/Understand</option>
                          <option>Apply/Analyze</option>
                          <option>Evaluate/Create</option>
                          <option>Mixed Coverage</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label>Difficulty</label>
                        <select className="glass-input" value={sec.diff} onChange={e => updateSection(sec.id, 'diff', e.target.value)}>
                          <option>Easy</option>
                          <option>Medium</option>
                          <option>Hard</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button className="add-section-btn" onClick={addSection}>
                + Add another section
              </button>
            </div>

            <div className="action-bar">
              <button className="btn-secondary" onClick={() => setStep(1)} style={{ padding: '8px 20px' }}>← Back</button>

              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div className={`validation-pill ${isValid ? 'valid' : 'invalid'}`}>
                  {isValid ? '✓ Marks Validated' : '⚠️ Mark Mismatch'} Output: {totalCalculated} / {totalExpected}
                </div>
                <button className="btn-primary" disabled={!isValid} onClick={handleGenerate} style={{ opacity: isValid ? 1 : 0.5 }}>
                  Generate Paper ✨
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="dashboard-container">
            <div className="loading-view">
              <div className="pulse-ring">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>AI is mapping syllabus to Bloom's taxonomy...</h2>
              <p style={{ color: '#737373' }}>Synthesizing the perfect balanced paper. Please wait.</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <PreviewStep setup={setup} aiPaperData={aiPaperData} setStep={setStep} />
        )}

        {step === 5 && (
          <div className="dashboard-container text-center">
            <div className="pulse-ring" style={{ margin: '0 auto 32px', background: 'rgba(16, 185, 129, 0.1)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px', color: '#0a0a0a' }}>Paper Generation Complete</h2>
            <p style={{ color: '#525252', fontSize: '1.125rem', marginBottom: '48px' }}>Your academically balanced paper and corresponding grading rubric are ready.</p>

            <div className="form-row">
              <div className="section-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>📄</div>
                <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>Question Paper</h3>
                <p style={{ color: '#737373', fontSize: '0.875rem', marginBottom: '24px' }}>Standardized format ready for print.</p>
                <button className="btn-primary" style={{ width: '100%' }} onClick={handleDownload}>Download PDF</button>
              </div>

              <div className="section-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: '#fafafa' }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>Answer Key & Rubrics</h3>
                <p style={{ color: '#737373', fontSize: '0.875rem', marginBottom: '24px' }}>Hidden from students, step-wise grading.</p>
                <button className="btn-primary" style={{ width: '100%', background: '#a855f7' }}>Download Rubric</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Dashboard;
