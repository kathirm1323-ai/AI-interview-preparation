import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterviewContext } from '../context/InterviewContext';
import { extractTextFromPDF } from '../services/pdfParser';
import { api } from '../services/api';

export default function ResumePage() {
  const navigate = useNavigate();
  const { setResumeText, setResumeData, resumeData, setQuestions, setInterviewId, setDomain } = useInterviewContext();
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [parsing, setParsing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file) => {
    if (!file || !file.name.endsWith('.pdf')) {
      setError('Please upload a PDF file');
      return;
    }
    setError('');
    setFileName(file.name);
    setParsing(true);
    try {
      const text = await extractTextFromPDF(file);
      setResumeText(text);
      const result = await api.parseResume(text);
      setResumeData(result.data);
    } catch (e) {
      setError('Failed to parse resume: ' + e.message);
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const startInterview = async () => {
    if (!resumeData) return;
    setGenerating(true);
    setError('');
    // Setting domain to "resume-based" silently for backend compatibility if needed
    setDomain('resume-based');
    try {
      const result = await api.generateQuestions(resumeData, 'resume-based');
      setQuestions(result.data.questions);
      setInterviewId(result.data.interviewId);
      navigate('/interview');
    } catch (e) {
      setError('Failed to generate questions: ' + e.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header fade-in">
          <h1>📄 Upload Your Resume</h1>
          <p>Upload your resume to get tailored interview questions based entirely on your profile</p>
        </div>

        {/* Upload Zone */}
        {!resumeData && (
          <div
            className={`upload-zone ${dragOver ? 'dragover' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept=".pdf" hidden onChange={e => handleFile(e.target.files[0])} />
            {parsing ? (
              <div className="loader">
                <div className="spinner" />
                <p>Parsing resume with AI...</p>
              </div>
            ) : (
              <>
                <div className="icon">📄</div>
                <h3>{fileName || 'Drop your resume here'}</h3>
                <p>or click to browse • PDF files only</p>
              </>
            )}
          </div>
        )}

        {error && <p style={{ color: 'var(--accent-red)', marginTop: 16, textAlign: 'center' }}>{error}</p>}

        {/* Parsed Resume Data */}
        {resumeData && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2>✅ Resume Parsed Successfully</h2>
                <button className="btn btn-secondary" onClick={() => { setResumeData(null); setFileName(''); }}>
                  🔄 Upload New
                </button>
              </div>
              {resumeData.name && <h3 style={{ marginBottom: 8 }}>{resumeData.name}</h3>}
              {resumeData.summary && <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: '0.9rem' }}>{resumeData.summary}</p>}

              <h4 style={{ marginBottom: 12, color: 'var(--accent-blue)' }}>🛠️ Skills Extracted ({resumeData.skills?.length || 0})</h4>
              <div className="skills-grid" style={{ marginBottom: 20 }}>
                {resumeData.skills?.map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>

              {resumeData.projects?.length > 0 && (
                <>
                  <h4 style={{ marginBottom: 12, color: 'var(--accent-cyan)' }}>🚀 Projects ({resumeData.projects.length})</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
                    {resumeData.projects.map((p, i) => (
                      <div key={i} className="glass-card" style={{ padding: 16 }}>
                        <h5 style={{ marginBottom: 6 }}>{p.name}</h5>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{p.description}</p>
                        <div className="skills-grid">
                          {p.techStack?.map((t, j) => <span key={j} className="skill-tag" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>{t}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Start Button */}
            <div style={{ textAlign: 'center' }}>
              <button className="btn btn-primary btn-lg" onClick={startInterview} disabled={generating}>
                {generating ? (
                  <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Generating Questions...</>
                ) : (
                  '🎤 Start Voice Interview'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
