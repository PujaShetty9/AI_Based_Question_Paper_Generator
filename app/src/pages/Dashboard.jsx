import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../config/authUtils';
import PreviewStep from '../components/dashboard/PreviewStep';
import './Dashboard.css';
import API_BASE_URL from '../config/api';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);

  // Step 1 State
  const [setup, setSetup] = useState({
  subject: '',
  teacher: '',
  department: '',
  academicYear: '',
  class: '',
  div: '',
  sem: '',
  examType: '',
  duration: '',
  date: '',
  notes: '',
  syllabus: '',
  totalMarks: '',
  paperType: 'MCQ+Subjective'
});
  // Step 2 State
  const [sections, setSections] = useState([
  { 
    id: 1, name: 'Section A', questions: 4, marksPerQ: 5, 
    bloom: 'Remember/Understand', diff: 'Easy', type: 'Subjective',
    attemptType: 'Attempt All', attemptX: '', attemptY: ''
  }
]);

  const totalCalculated = sections.reduce((sum, sec) => sum + (sec.questions * sec.marksPerQ), 0);
  const totalExpected = parseInt(setup.totalMarks) || 0;
  const isValid = totalCalculated === totalExpected && totalExpected > 0;

  // AI Loading State
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPaperData, setAiPaperData] = useState(null);
  const [finalPaperData, setFinalPaperData] = useState(null);

  const addSection = () => {
  const nextLabel = String.fromCharCode(65 + sections.length);
  const defaultType = setup.paperType === 'MCQ' ? 'MCQ'
    : setup.paperType === 'Subjective' ? 'Subjective'
    : 'Subjective';
  setSections([...sections, {
    id: Date.now(),
    name: `Section ${nextLabel}`,
    questions: 1,
    marksPerQ: 10,
    bloom: 'Apply/Analyze',
    diff: 'Medium',
    type: defaultType,
    attemptType: 'Attempt All',
    attemptX: '',
    attemptY: ''
  }]);
};

  const updateSection = (id, field, value) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSection = (id) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const handlePaperTypeChange = (type) => {
    setSetup({ ...setup, paperType: type });
    if (type === 'MCQ') {
      setSections(sections.map(s => ({ ...s, type: 'MCQ' })));
    } else if (type === 'Subjective') {
      setSections(sections.map(s => ({ ...s, type: 'Subjective' })));
    }
    // MCQ+Subjective: teacher decides per section
  };

  const handleGenerate = async () => {
    if (!isValid) return;
    setStep(3);
    setIsGenerating(true);

    const topics = setup.syllabus
      .split('\n')
      .map(s => s.trim())
      .filter(s => s !== '');

    try {
      const response = await fetch(`${API_BASE_URL}/generate-ai-paper`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: setup.subject,
          topics: topics.length > 0 ? topics : [setup.subject],
          sections: sections,
          paper_type: setup.paperType
        })
      });

      const data = await response.json();

      if (data.success) {
        setAiPaperData(data.paper);
      }

      setIsGenerating(false);
      setStep(4);
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
      alert("Backend connection failed! Is port 5000 running?");
      setStep(4);
    }
  };

  const handleDownload = async () => {
  if (!aiPaperData) { alert('No paper generated yet.'); return; }
  try {
    const response = await fetch(`${API_BASE_URL}/download-question-paper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: setup.subject,
        total_marks: parseInt(setup.totalMarks) || 60,
        teacher: setup.teacher || 'N/A',
        date: setup.date || new Date().toLocaleDateString('en-GB'),
        department: setup.department || '',
        academic_year: setup.academicYear || '',
        class_name: setup.class || '',
        div: setup.div || '',
        sem: setup.sem || '',
        exam_type: setup.examType || '',
        duration: setup.duration || '',
        notes: setup.notes || '',
        paper_data: finalPaperData || aiPaperData,
        sections: sections
      })
    });
    console.log("Response status:", response.status);
    console.log("Response content-type:", response.headers.get('content-type'));
    if (!response.ok) throw new Error('Download failed');
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
    alert('Failed to generate PDF.');
  }
};

const handleDownloadAnswerKey = async () => {
  if (!aiPaperData) { alert('No paper generated yet.'); return; }
  try {
    const response = await fetch(`${API_BASE_URL}/download-answer-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: setup.subject,
        paper: finalPaperData || aiPaperData,
        sections: sections,
        teacher: setup.teacher || '',
        date: setup.date || '',
        department: setup.department || '',
        academic_year: setup.academicYear || '',
        class_name: setup.class || '',
        div: setup.div || '',
        sem: setup.sem || '',
        exam_type: setup.examType || '',
        duration: setup.duration || '',
        notes: setup.notes || '',
        total_marks: setup.totalMarks || ''
      })
    });
    if (!response.ok) throw new Error('Download failed');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'answer_key.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.error(e);
    alert('Failed to generate answer key.');
  }
};

  return (
    <div className="dashboard-layout">
      {/* Sidebar Progress */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon" style={{ width: 28, height: 28 }}>Q</div>
          QPG Flow
        </div>

        <div className="sidebar-section-label">Progress</div>

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

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={async () => {
            const result = await logoutUser();
            if (result.success) {
              navigate('/login');
            }
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            Log out
          </button>
          {user && (
            <div style={{
              fontSize: '0.75rem',
              color: '#737373',
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(0,0,0,0.1)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user.email}
            </div>
          )}
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

      {/* College Info */}
      <div className="input-group">
        <label>Department</label>
        <input type="text" className="glass-input"
          placeholder="e.g. Department of Computer Engineering"
          value={setup.department}
          onChange={e => setSetup({ ...setup, department: e.target.value })}
        />
      </div>

      <div className="form-row">
        <div className="input-group">
          <label>Subject Name</label>
          <input type="text" className="glass-input"
            placeholder="e.g. Database Management System"
            value={setup.subject}
            onChange={e => setSetup({ ...setup, subject: e.target.value })}
          />
        </div>
        <div className="input-group">
          <label>Faculty Name</label>
          <input type="text" className="glass-input"
            placeholder="e.g. Prof. Manasi Kulkarni"
            value={setup.teacher}
            onChange={e => setSetup({ ...setup, teacher: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="input-group">
          <label>Academic Year</label>
          <input type="text" className="glass-input"
            placeholder="e.g. 2024-25"
            value={setup.academicYear}
            onChange={e => setSetup({ ...setup, academicYear: e.target.value })}
          />
        </div>
        <div className="input-group">
          <label>Class</label>
          <input type="text" className="glass-input"
            placeholder="e.g. SY"
            value={setup.class}
            onChange={e => setSetup({ ...setup, class: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="input-group">
          <label>Division</label>
          <input type="text" className="glass-input"
            placeholder="e.g. ALL"
            value={setup.div}
            onChange={e => setSetup({ ...setup, div: e.target.value })}
          />
        </div>
        <div className="input-group">
          <label>Semester</label>
          <input type="text" className="glass-input"
            placeholder="e.g. III"
            value={setup.sem}
            onChange={e => setSetup({ ...setup, sem: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="input-group">
          <label>Exam Type</label>
          <input type="text" className="glass-input"
            placeholder="e.g. Class Test I / Mid Sem / End Sem"
            value={setup.examType}
            onChange={e => setSetup({ ...setup, examType: e.target.value })}
          />
        </div>
        <div className="input-group">
          <label>Duration</label>
          <input type="text" className="glass-input"
            placeholder="e.g. 1.5 Hours"
            value={setup.duration}
            onChange={e => setSetup({ ...setup, duration: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="input-group">
          <label>Date</label>
          <input type="text" className="glass-input"
            placeholder="e.g. 26th August 2024"
            value={setup.date}
            onChange={e => setSetup({ ...setup, date: e.target.value })}
          />
        </div>
        <div className="input-group">
          <label>Total Marks</label>
          <input type="number" className="glass-input"
            placeholder="e.g. 40"
            value={setup.totalMarks}
            onChange={e => setSetup({ ...setup, totalMarks: e.target.value })}
          />
        </div>
      </div>

      {/* Paper Type Selector */}
      <div className="input-group">
        <label>Type of Paper</label>
        <div className="paper-type-selector">
          {['MCQ', 'Subjective', 'MCQ+Subjective'].map(type => (
            <button
              key={type}
              className={`paper-type-btn ${setup.paperType === type ? 'active' : ''}`}
              onClick={() => handlePaperTypeChange(type)}
              type="button"
            >
              {type === 'MCQ' && '🔘 MCQ Only'}
              {type === 'Subjective' && '📝 Subjective Only'}
              {type === 'MCQ+Subjective' && '⚡ MCQ + Subjective'}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="input-group">
        <label>Notes / Instructions</label>
        <textarea className="glass-input"
          placeholder={"e.g.\nQ1 is compulsory.\nAttempt any 2 from the remaining 3 questions.\nAssume suitable data wherever necessary."}
          value={setup.notes}
          onChange={e => setSetup({ ...setup, notes: e.target.value })}
        />
      </div>

      {/* Syllabus */}
      <div className="input-group">
        <label>Syllabus / Topics to Cover</label>
        <textarea className="glass-input"
          placeholder="Enter each topic on a new line..."
          value={setup.syllabus}
          onChange={e => setSetup({ ...setup, syllabus: e.target.value })}
        />
      </div>

    </div>

    <div className="action-bar">
      <div></div>
      <button
        className="btn-primary"
        onClick={() => setStep(2)}
        disabled={!setup.subject || !setup.totalMarks}
        style={{ opacity: setup.subject && setup.totalMarks ? 1 : 0.5 }}
      >
        Next: Section Builder →
      </button>
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

                    {/* Attempt Instruction */}
<div className="input-group">
  <label>Attempt Instruction</label>
  <div className="paper-type-selector">
    {['Attempt All', 'Attempt Any'].map(type => (
      <button
        key={type}
        className={`paper-type-btn ${sec.attemptType === type ? 'active' : ''}`}
        onClick={() => updateSection(sec.id, 'attemptType', type)}
        type="button"
      >
        {type}
      </button>
    ))}
  </div>
</div>

{/* Show X out of Y inputs only if Attempt Any */}
{sec.attemptType === 'Attempt Any' && (
  <div className="form-row">
    <div className="input-group">
      <label>Attempt Any (X)</label>
      <input type="number" className="glass-input"
        placeholder="e.g. 3"
        value={sec.attemptX || ''}
        onChange={e => updateSection(sec.id, 'attemptX', e.target.value)}
      />
    </div>
    <div className="input-group">
      <label>Out of (Y)</label>
      <input type="number" className="glass-input"
        placeholder="e.g. 4"
        value={sec.attemptY || ''}
        onChange={e => updateSection(sec.id, 'attemptY', e.target.value)}
      />
    </div>
  </div>
)}

                    {/* Section Type — only show if MCQ+Subjective — NEW */}
                    {setup.paperType === 'MCQ+Subjective' && (
                      <div className="input-group">
                        <label>Section Type</label>
                        <div className="paper-type-selector">
                          {['MCQ', 'Subjective'].map(type => (
                            <button
                              key={type}
                              className={`paper-type-btn ${sec.type === type ? 'active' : ''}`}
                              onClick={() => updateSection(sec.id, 'type', type)}
                              type="button"
                            >
                              {type === 'MCQ' ? '🔘 MCQ' : '📝 Subjective'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
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
              <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                AI is generating your {setup.paperType} paper...
              </h2>
              <p style={{ color: '#737373' }}>Synthesizing the perfect balanced paper. Please wait.</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <PreviewStep
    setup={setup}
    sections={sections}
    aiPaperData={aiPaperData}
    setStep={setStep}
    onPaperChange={setFinalPaperData}
  />
        )}

        {step === 5 && (
          <div className="export-page">
            {/* Success Badge */}
            <div className="export-success-badge">
              <div className="export-check-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="export-badge-title">Ready to Export</div>
                <div className="export-badge-sub">Your question paper has been generated successfully</div>
              </div>
            </div>

            {/* Paper Metadata Strip */}
            <div className="export-meta-strip">
              {setup.subject && <div className="export-meta-chip"><span>Subject</span>{setup.subject}</div>}
              {setup.examType && <div className="export-meta-chip"><span>Type</span>{setup.examType}</div>}
              {setup.totalMarks && <div className="export-meta-chip"><span>Marks</span>{setup.totalMarks}</div>}
              {setup.duration && <div className="export-meta-chip"><span>Duration</span>{setup.duration}</div>}
              <div className="export-meta-chip"><span>Sections</span>{sections.length}</div>
            </div>

            {/* Download Cards */}
            <div className="export-cards-grid">

              {/* Question Paper Card */}
              <div className="export-card">
                <div className="export-card-icon export-card-icon--paper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="export-card-body">
                  <h3>Question Paper</h3>
                  <p>Print-ready PDF formatted to university standards. Includes all sections, Bloom's taxonomy levels, and attempt instructions.</p>
                  <ul className="export-card-features">
                    <li>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Academic header with college branding
                    </li>
                    <li>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Marks & BT level per question
                    </li>
                    <li>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Formatted for A4 print
                    </li>
                  </ul>
                </div>
                <button className="export-download-btn export-download-btn--primary" onClick={handleDownload}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Question Paper
                </button>
              </div>

              {/* Answer Key Card */}
              <div className="export-card">
                <div className="export-card-icon export-card-icon--key">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                </div>
                <div className="export-card-body">
                  <h3>Answer Key & Rubric</h3>
                  <p>Detailed marking scheme with model answers and step-wise grading rubric. Strictly for faculty use only.</p>
                  <ul className="export-card-features">
                    <li>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Model answers for all questions
                    </li>
                    <li>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Step-wise marking breakdown
                    </li>
                    <li>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Faculty-only confidential doc
                    </li>
                  </ul>
                </div>
                <button className="export-download-btn export-download-btn--secondary" onClick={handleDownloadAnswerKey}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Answer Key
                </button>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="export-footer-actions">
              <button className="export-restart-btn" onClick={() => { setStep(1); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Create another paper
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Dashboard;