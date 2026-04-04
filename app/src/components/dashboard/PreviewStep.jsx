import React, { useState } from 'react';

export default function PreviewStep({ setup, aiPaperData, setStep }) {
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

    // Simulate AI Edit for now
    setTimeout(() => {
      setChat(prev => [...prev, { role: 'ai', text: `Got it. I've updated the paper to reflect: "${currentInput}".` }]);

      // Update the paper data locally as a mockup for "it works"
      if (paperData && paperData['Section B'] && paperData['Section B'].length > 0) {
        const newPaperData = JSON.parse(JSON.stringify(paperData));
        newPaperData['Section B'][0] = `[AI Edited] ${currentInput} (Replaced original question)`;
        setPaperData(newPaperData);
      }
    }, 1500);
  };

  const sectionB = paperData?.['Section B'] || [
    "Default question 1. Please add backend logic.",
    "Default question 2."
  ];

  const sectionC = paperData?.['Section C'] || [
    "Long answer question 1.",
    "Long answer question 2."
  ];

  return (
    <div className="dashboard-container wide">
      <div className="preview-layout">
        {/* Actual Paper Preview */}
        <div className="paper-container">
          <div className="academic-paper">
            <div style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>QP CODE 243592</div>
            <div className="academic-header">
              <div className="academic-logo-box">PCE</div>
              <div className="academic-title-box">
                <h1>PILLAI COLLEGE OF ENGINEERING, NEW PANVEL</h1>
                <p>(Autonomous) (Accredited 'A+' by NAAC)<br />END SEMESTER EXAMINATION<br />MAY 2025<br />BRANCH: Computer Engineering</p>
              </div>
            </div>

            <div className="academic-meta-grid">
              <div className="academic-meta-cell">SEM-VI</div>
              <div className="academic-meta-cell">Time: 02.00 Hours</div>
              <div className="academic-meta-cell">Subject: - {setup?.subject || 'Dynamic Subject'}</div>
              <div className="academic-meta-cell">Date: {setup?.date || '09/05/2025'}<br />Subject Code: - CE 320</div>
              <div className="academic-meta-cell" style={{ borderBottom: 'none' }}>Max. Marks: {setup?.totalMarks || 60}</div>
              <div className="academic-meta-cell" style={{ borderBottom: 'none' }}>Teacher: {setup?.teacher || 'N/A'}</div>
            </div>

            <div className="academic-instructions">
              N.B 1. Q.1 is compulsory<br />
              2. Attempt any two from the remaining three questions<br />
              3. Each Question carries 20 marks.<br />
              4. Assume suitable data wherever required
            </div>

            <table className="academic-table">
              <thead>
                <tr>
                  <th colSpan="2">Attempt All</th>
                  <th className="ac-col-m">M</th>
                  <th className="ac-col-bt">BT</th>
                  <th className="ac-col-co">CO</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="ac-col-qno" rowSpan={sectionB.length + 1}>Q.1.</td><td colSpan="4" style={{ padding: 0, border: 'none', height: 0 }}></td></tr>
                {sectionB.map((q, idx) => (
                  <tr key={`secb-${idx}`}>
                    <td className="ac-col-text"><strong>{String.fromCharCode(97 + idx)})</strong> {q}</td>
                    <td className="ac-col-m">5</td><td className="ac-col-bt">1,2</td><td className="ac-col-co">2</td>
                  </tr>
                ))}
              </tbody>
              <tbody>
                <tr><td colSpan="5" className="ac-col-text" style={{ fontWeight: 'bold' }}>Q.2. Attempt All</td></tr>
                {sectionC.map((q, idx) => (
                  <tr key={`secc-${idx}`}>
                    <td className="ac-col-qno">{String.fromCharCode(97 + idx)})</td>
                    <td className="ac-col-text">{q}</td>
                    <td className="ac-col-m">10</td><td className="ac-col-bt">1,3</td><td className="ac-col-co">4</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="academic-footer">
              CO1. Demonstrate understanding of the principles of {setup?.subject || 'the course'}...<br />
              CO2. Acquire expertise in fundamental analysis...<br />
              <strong>BT Levels:</strong> - 1 Remembering, 2 Understanding, 3 Applying, 4 Analyzing, 5 Evaluating, 6 Creating.<br />
              M-Marks, BT- Bloom's Taxonomy, CO-Course Outcomes.
            </div>
          </div>
        </div>

        {/* Chat / Edit Panel */}
        <div className="edit-panel">
          <div style={{ fontWeight: '700', fontSize: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '16px' }}>Edit via AI</div>

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
            <button type="submit" className="btn-primary" style={{ padding: '0 16px', background: '#3b82f6' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <div className="action-bar">
        <button className="btn-secondary" onClick={() => setStep(2)} style={{ padding: '8px 20px' }}>← Restart</button>
        <button className="btn-primary" onClick={() => setStep(5)}>Looks Good — Download</button>
      </div>
    </div>
  );
}
