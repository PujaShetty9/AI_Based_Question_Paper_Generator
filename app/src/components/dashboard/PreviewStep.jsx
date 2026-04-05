import React, { useState, useEffect, useRef } from 'react';
import pceLogo from '../../assets/PCE.png';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function PreviewStep({ setup, sections, aiPaperData, setStep, onPaperChange }) {
  const [chat, setChat] = useState([
    { role: 'ai', text: 'Paper generated! You can ask me to modify questions, change difficulty, or type "Add this image to Q1 a" after uploading an image.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [pendingImage, setPendingImage] = useState(null); // base64
  const [pendingImageName, setPendingImageName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  // Normalize paper data — convert all questions to objects
  const normalizePaper = (paper) => {
    if (!paper) return {};
    const normalized = {};
    for (const [sectionName, questions] of Object.entries(paper)) {
      normalized[sectionName] = questions.map(q => {
        if (typeof q === 'string') {
          return { question: q, image: null };
        }
        if (typeof q === 'object' && q !== null) {
          return { ...q, image: q.image || null };
        }
        return { question: String(q), image: null };
      });
    }
    return normalized;
  };

  const [paperData, setPaperData] = useState(() => normalizePaper(aiPaperData));

  useEffect(() => {
  if (onPaperChange) onPaperChange(paperData);
}, [paperData]);

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

  // Parse which question the teacher is referring to
  // e.g. "Q1 a" -> { sectionIndex: 0, questionIndex: 0 }
  const parseQuestionRef = (instruction) => {
    const match = instruction.match(/[Qq]\.?\s*(\d+)\s*([a-zA-Z])/);
    if (!match) return null;
    return {
      sectionIndex: parseInt(match[1]) - 1,
      questionIndex: match[2].toLowerCase().charCodeAt(0) - 97
    };
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPendingImage(reader.result); // base64
      setPendingImageName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() && !pendingImage) return;

    const userMessage = chatInput.trim();
    const imageToSend = pendingImage;

    // Add user message to chat
    setChat(prev => [...prev, {
      role: 'user',
      text: userMessage,
      image: imageToSend
    }]);
    setChatInput('');
    setPendingImage(null);
    setPendingImageName('');
    setIsEditing(true);

    // Check if this is an image attachment instruction
    if (imageToSend) {
  const ref = parseQuestionRef(userMessage);
  if (ref) {
    const sectionKeys = Object.keys(paperData);
    const sectionName = sectionKeys[ref.sectionIndex];

    if (sectionName && paperData[sectionName]?.[ref.questionIndex] !== undefined) {
      const newPaperData = JSON.parse(JSON.stringify(paperData));
      newPaperData[sectionName][ref.questionIndex].image = imageToSend;
      setPaperData(newPaperData);
      setChat(prev => [...prev, {
        role: 'ai',
        text: `✅ Image attached to Q${ref.sectionIndex + 1} (${String.fromCharCode(97 + ref.questionIndex)}) successfully.`
      }]);
    } else {
      setChat(prev => [...prev, {
        role: 'ai',
        text: `I couldn't find that question. Please specify like "Add this image to Q1 a".`
      }]);
    }
  } else {
    setChat(prev => [...prev, {
      role: 'ai',
      text: `Please tell me where to add the image. e.g. "Add this image to Q1 a"`
    }]);
  }
  setIsEditing(false); // ← always reset here
  return;
}

    // Otherwise send to backend for AI edit
    try {
      const response = await fetch('${API_BASE_URL}/edit-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction: userMessage,
          paper: paperData,
          subject: setup?.subject || '',
          sections: sections || []
        })
      });

      const data = await response.json();

      if (data.success) {
        const normalized = normalizePaper(data.paper);

        // Preserve images from current paper
        for (const [sectionName, questions] of Object.entries(paperData)) {
          if (normalized[sectionName]) {
            questions.forEach((q, idx) => {
              if (q.image && normalized[sectionName][idx]) {
                normalized[sectionName][idx].image = q.image;
              }
            });
          }
        }

        setPaperData(normalized);
        setChat(prev => [...prev, {
          role: 'ai',
          text: `Done! I've applied your changes to the paper.`
        }]);
      } else {
        setChat(prev => [...prev, {
          role: 'ai',
          text: `Sorry, something went wrong: ${data.message}`
        }]);
      }
    } catch (err) {
      setChat(prev => [...prev, {
        role: 'ai',
        text: `Backend connection failed. Is the server running?`
      }]);
    }

    setIsEditing(false);
  };

  const paperSections = paperData ? Object.entries(paperData) : [];

  const renderQuestion = (q, idx, marksPerQ, bloomText) => {
    const label = `(${String.fromCharCode(97 + idx)})`;
    const isMCQ = q.options && typeof q.options === 'object';

    return (
      <React.Fragment key={`q-${idx}`}>
        <tr>
          <td style={styles.tdLabel}>{label}</td>
          <td style={styles.tdQuestion}>
            {isMCQ ? (
              <>
                {q.question}
                <div style={styles.mcqOptions}>
                  <span>A. {q.options?.A}</span>
                  <span>B. {q.options?.B}</span>
                  <span>C. {q.options?.C}</span>
                  <span>D. {q.options?.D}</span>
                </div>
              </>
            ) : (
              q.question || String(q)
            )}
            {/* Image if attached */}
            {q.image && (
              <div style={{ marginTop: '8px' }}>
                <img
                  src={q.image}
                  alt="Question diagram"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            )}
          </td>
          <td style={styles.tdCenter}>{marksPerQ}</td>
          <td style={styles.tdCenter}>{bloomText}</td>
        </tr>
      </React.Fragment>
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

            {/* Header */}
            <table style={styles.headerTable}>
              <tbody>
                <tr>
                  <td style={styles.logoCell}>
  <img 
    src={pceLogo} 
    alt="PCE Logo"
    style={{ width: '60px', height: '60px', objectFit: 'contain' }}
  />
</td>
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

            {/* Meta */}
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

            {/* Exam Bar */}
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

            {/* Questions Table */}
            {paperSections.length === 0 ? (
              <div style={{ padding: '24px', color: '#737373', textAlign: 'center' }}>
                No paper data. Please go back and generate again.
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
                        <tr style={styles.sectionRow}>
                          <td style={{ ...styles.tdLabel, fontWeight: 'bold' }}>
                            Q.{secIdx + 1}
                          </td>
                          <td colSpan="3" style={{ ...styles.tdQuestion, fontWeight: 'bold', background: '#fafafa' }}>
                            {attemptText}
                          </td>
                        </tr>
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

        {/* Chat Panel */}
        <div className="edit-panel">
          <div style={{ fontWeight: '700', fontSize: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '16px' }}>
            Edit via AI
          </div>

          <div className="chat-window">
            {chat.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.role}`}>
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="uploaded"
                    style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '6px' }}
                  />
                )}
                {msg.text}
              </div>
            ))}
            {isEditing && (
              <div className="chat-bubble ai">
                ✏️ Applying changes...
              </div>
            )}
          </div>

          {/* Image preview if pending */}
          {pendingImage && (
            <div style={{
              padding: '8px 12px',
              background: 'rgba(59,130,246,0.05)',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <img src={pendingImage} alt="preview"
                style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
              <span>{pendingImageName} — ready to attach</span>
              <button
                onClick={() => { setPendingImage(null); setPendingImageName(''); }}
                style={{ marginLeft: 'auto', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
              >✕</button>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleChat} style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
            {/* Image upload button */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              style={{
                padding: '0 12px',
                background: pendingImage ? 'rgba(59,130,246,0.1)' : '#f5f5f5',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
              title="Upload image"
            >
              🖼️
            </button>

            <input
              type="text"
              className="glass-input"
              style={{ flex: 1, padding: '12px' }}
              placeholder={pendingImage
                ? 'e.g. Add this image to Q1 a'
                : 'e.g. Make Q1 b harder or Replace Q2 a...'}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              disabled={isEditing}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '0 16px', background: isEditing ? '#94a3b8' : '#3b82f6' }}
              disabled={isEditing}
            >
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