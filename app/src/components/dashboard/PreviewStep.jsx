import React, { useState } from 'react';

export default function PreviewStep({ setup, sections, aiPaperData, setStep }) {
  const [chat, setChat] = useState([
    { role: 'ai', text: 'Paper generated successfully! Type below if you need any specific questions changed (e.g. "Replace Q1.c with a harder synthesis question").' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [paperData, setPaperData] = useState(aiPaperData);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput) return;
    setChat([...chat, { role: 'user', text: chatInput }]);
    const currentInput = chatInput;
    setChatInput('');

    setTimeout(() => {
      setChat(prev => [...prev, { role: 'ai', text: `Got it. I've updated the paper to reflect: "${currentInput}".` }]);
      if (paperData) {
        const newPaperData = JSON.parse(JSON.stringify(paperData));
        const firstSection = Object.keys(newPaperData)[0];
        if (firstSection && newPaperData[firstSection].length > 0) {
          newPaperData[firstSection][0] = `[AI Edited] ${currentInput} (Replaced original question)`;
          setPaperData(newPaperData);
        }
      }
    }, 1500);
  };

  const getMarksForSection = (sectionName) => {
    if (!sections || sections.length === 0) return 1;
    const match = sections.find(s =>
      s.name.trim().toLowerCase() === sectionName.trim().toLowerCase()
    );
    return match?.marksPerQ || 1;
  };

  const getSectionConfig = (sectionName) => {
    if (!sections || sections.length === 0) return null;
    return sections.find(s =>
      s.name.trim().toLowerCase() === sectionName.trim().toLowerCase()
    );
  };

  const getAttemptText = (sectionConfig) => {
    if (!sectionConfig) return 'Attempt All';
    if (sectionConfig.attemptType === 'Attempt Any') {
      return `Attempt Any ${sectionConfig.attemptX || '__'} out of ${sectionConfig.attemptY || '__'}`;
    }
    return 'Attempt All';
  };

  const getBloomText = (sectionConfig) => {
    if (!sectionConfig) return '1, 2';
    const bloom = sectionConfig.bloom || '';
    if (bloom.includes('Remember') || bloom.includes('Understand')) return '1, 2';
    if (bloom.includes('Apply') || bloom.includes('Analyze')) return '3, 4';
    if (bloom.includes('Evaluate') || bloom.includes('Create')) return '5, 6';
    return '1, 2';
  };

  const paperSections = paperData ? Object.entries(paperData) : [];

  const renderQuestion = (q, idx, marksPerQ, bloomText) => {
    const label = `(${String.fromCharCode(97 + idx)})`;

    if (typeof q === 'object' && q !== null && q.options) {
      return (
        <tr key={`q-${idx}`}>
          <td style={styles.tdLabel}>{label}</td>
          <td style={styles.tdQuestion}>
            {q.question}
            <div style={styles.mcqOptions}>
              <span>A. {q.options?.A}</span>
              <span>B. {q.options?.B}</span>
              <span>C. {q.options?.C}</span>
              <span>D. {q.options?.D}</span>
            </div>
          </td>
          <td style={styles.tdCenter}>{marksPerQ}</td>
          <td style={styles.tdCenter}>{bloomText}</td>
        </tr>
      );
    }

    return (
      <tr key={`q-${idx}`}>
        <td style={styles.tdLabel}>{label}</td>
        <td style={styles.tdQuestion}>
          {typeof q === 'string' ? q : JSON.stringify(q)}
        </td>
        <td style={styles.tdCenter}>{marksPerQ}</td>
        <td style={styles.tdCenter}>{bloomText}</td>
      </tr>
    );
  };

  const styles = {
    paper: {
      fontFamily: "'Times New Roman', Times, serif",
      fontSize: '13px',
      color: '#000',
      background: '#fff',
      padding: '32px',
      maxWidth: '860px',
    },
    headerTable: {
      width: '100%',
      borderCollapse: 'collapse',
      border: '1px solid #000',
      marginBottom: '0',
    },
    metaTable: {
      width: '100%',
      borderCollapse: 'collapse',
      border: '1px solid #000',
      borderTop: 'none',
      marginBottom: '0',
    },
    examBar: {
      width: '100%',
      borderCollapse: 'collapse',
      border: '1px solid #000',
      borderTop: 'none',
      marginBottom: '0',
    },
    noteBar: {
      border: '1px solid #000',
      borderTop: 'none',
      padding: '6px 10px',
      fontSize: '12px',
      whiteSpace: 'pre-line',
      marginBottom: '0',
    },
    mainTable: {
      width: '100%',
      borderCollapse: 'collapse',
      border: '1px solid #000',
      borderTop: 'none',
    },
    th: {
      border: '1px solid #000',
      padding: '5px 8px',
      textAlign: 'center',
      fontWeight: 'bold',
      background: '#f5f5f5',
      fontSize: '12px',
    },
    tdLabel: {
      border: '1px solid #000',
      padding: '5px 8px',
      textAlign: 'center',
      fontWeight: 'bold',
      width: '40px',
      verticalAlign: 'top',
    },
    tdQuestion: {
      border: '1px solid #000',
      padding: '6px 10px',
      verticalAlign: 'top',
    },
    tdCenter: {
      border: '1px solid #000',
      padding: '5px 8px',
      textAlign: 'center',
      verticalAlign: 'top',
      width: '50px',
    },
    sectionRow: {
      background: '#fafafa',
    },
    mcqOptions: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      marginTop: '4px',
      fontSize: '12px',
      color: '#333',
    },
    logoCell: {
      width: '80px',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '20px',
      borderRight: '1px solid #000',
      padding: '8px',
      verticalAlign: 'middle',
    },
    collegeCell: {
      textAlign: 'center',
      padding: '8px',
      verticalAlign: 'middle',
    },
  };

  return (
    <div className="dashboard-container wide">
      <div className="preview-layout">

        {/* Paper Preview */}
        <div className="paper-container" style={{ padding: '0', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <div style={styles.paper}>

            {/* Header — Logo + College Name */}
            <table style={styles.headerTable}>
              <tbody>
                <tr>
                  <td style={styles.logoCell}>PCE</td>
                  <td style={styles.collegeCell}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      MES's Pillai College of Engineering (Autonomous), New Panvel - 410206
                    </div>
                    <div style={{ fontSize: '13px', marginTop: '2px' }}>
                      {setup?.department || 'Department of Computer Engineering'}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Meta — Course, Faculty, Academic Year, Class/Div/Sem */}
            <table style={styles.metaTable}>
              <tbody>
                <tr>
                  <td style={{ padding: '4px 10px', width: '60%', borderRight: '1px solid #000', fontSize: '12px' }}>
                    <strong>Course Name:</strong> {setup?.subject || '—'}
                  </td>
                  <td style={{ padding: '4px 10px', fontSize: '12px' }}>
                    <strong>Class:</strong> {setup?.class || '—'}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 10px', borderRight: '1px solid #000', borderTop: '1px solid #000', fontSize: '12px' }}>
                    <strong>Faculty Name:</strong> {setup?.teacher || '—'}
                  </td>
                  <td style={{ padding: '4px 10px', borderTop: '1px solid #000', fontSize: '12px' }}>
                    <strong>Div:</strong> {setup?.div || '—'}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 10px', borderRight: '1px solid #000', borderTop: '1px solid #000', fontSize: '12px' }}>
                    <strong>Academic Year:</strong> {setup?.academicYear || '—'}
                  </td>
                  <td style={{ padding: '4px 10px', borderTop: '1px solid #000', fontSize: '12px' }}>
                    <strong>Sem:</strong> {setup?.sem || '—'}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Exam Bar — Type, Duration, Date, Marks */}
            <table style={styles.examBar}>
              <tbody>
                <tr>
                  <td style={{ padding: '5px 10px', fontSize: '12px', borderRight: '1px solid #000' }}>
                    <strong>{setup?.examType || 'Class Test I'}</strong>
                  </td>
                  <td style={{ padding: '5px 10px', fontSize: '12px', borderRight: '1px solid #000' }}>
                    <strong>Duration:</strong> {setup?.duration || '—'}
                  </td>
                  <td style={{ padding: '5px 10px', fontSize: '12px', borderRight: '1px solid #000' }}>
                    <strong>Date:</strong> {setup?.date || '—'}
                  </td>
                  <td style={{ padding: '5px 10px', fontSize: '12px' }}>
                    <strong>Max. Marks:</strong> {setup?.totalMarks || '—'}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Notes */}
            {setup?.notes && (
              <div style={styles.noteBar}>
                <strong>Note: </strong>{setup.notes}
              </div>
            )}

            {/* Main Question Table */}
            {paperSections.length === 0 ? (
              <div style={{ padding: '24px', color: '#737373', textAlign: 'center' }}>
                No paper data available. Please go back and generate again.
              </div>
            ) : (
              <table style={styles.mainTable}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, width: '40px' }}>Q.</th>
                    <th style={styles.th}>Question</th>
                    <th style={{ ...styles.th, width: '50px' }}>Marks</th>
                    <th style={{ ...styles.th, width: '50px' }}>BT</th>
                  </tr>
                </thead>
                <tbody>
                  {paperSections.map(([sectionName, questions], secIdx) => {
                    const sectionConfig = getSectionConfig(sectionName);
                    const marksPerQ = getMarksForSection(sectionName);
                    const bloomText = getBloomText(sectionConfig);
                    const attemptText = getAttemptText(sectionConfig);

                    return (
                      <React.Fragment key={sectionName}>
                        {/* Section Header Row */}
                        <tr style={styles.sectionRow}>
                          <td style={{ ...styles.tdLabel, fontWeight: 'bold' }}>
                            Q.{secIdx + 1}
                          </td>
                          <td
                            colSpan="3"
                            style={{
                              ...styles.tdQuestion,
                              fontWeight: 'bold',
                              background: '#fafafa'
                            }}
                          >
                            {attemptText}
                          </td>
                        </tr>

                        {/* Questions */}
                        {Array.isArray(questions) && questions.map((q, idx) =>
                          renderQuestion(q, idx, marksPerQ, bloomText)
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}

          </div>
        </div>

        {/* Chat / Edit Panel */}
        <div className="edit-panel">
          <div style={{ fontWeight: '700', fontSize: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '16px' }}>
            Edit via AI
          </div>

          <div className="chat-window">
            {chat.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.role}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleChat} style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
            <input
              type="text"
              className="glass-input"
              style={{ flex: 1, padding: '12px' }}
              placeholder="e.g. Make Q1.b a numerical problem..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
            />
            <button type="submit" className="btn-primary"
              style={{ padding: '0 16px', background: '#3b82f6' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" style={{ width: 16, height: 16 }}>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <div className="action-bar">
        <button className="btn-secondary" onClick={() => setStep(2)}
          style={{ padding: '8px 20px' }}>← Restart</button>
        <button className="btn-primary" onClick={() => setStep(5)}>
          Looks Good — Download
        </button>
      </div>
    </div>
  );
}