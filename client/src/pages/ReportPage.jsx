import { useNavigate } from 'react-router-dom';
import { useInterviewContext } from '../context/InterviewContext';

export default function ReportPage() {
  const navigate = useNavigate();
  const { report, resumeData, resetInterview } = useInterviewContext();

  if (!report) {
    return (
      <div className="page"><div className="container">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No Report Available</h3>
          <p>Complete an interview to see your report</p>
          <button className="btn btn-primary" onClick={() => navigate('/resume')} style={{ marginTop: 16 }}>Start Interview</button>
        </div>
      </div></div>
    );
  }

  const cs = report.categoryScores || {};
  const categories = [
    { key: 'communication', label: 'Communication', icon: '🗣️', color: '#667eea' },
    { key: 'technicalKnowledge', label: 'Technical Knowledge', icon: '💻', color: '#764ba2' },
    { key: 'problemSolving', label: 'Problem Solving', icon: '🧩', color: '#06d6a0' },
    { key: 'confidence', label: 'Confidence', icon: '💪', color: '#f472b6' },
    { key: 'projectUnderstanding', label: 'Project Understanding', icon: '🚀', color: '#fb923c' },
  ];

  const readinessColors = {
    interview_ready: 'var(--accent-green)',
    almost_ready: 'var(--accent-blue)',
    needs_practice: 'var(--accent-orange)',
    not_ready: 'var(--accent-red)',
  };

  const readinessLabels = {
    interview_ready: '🏆 Interview Ready!',
    almost_ready: '👍 Almost Ready',
    needs_practice: '📚 Needs Practice',
    not_ready: '🔄 Keep Practicing',
  };

  return (
    <div className="page">
      <div className="container fade-in">
        <div className="page-header">
          <h1>📊 Interview Performance Report</h1>
          <p>{resumeData?.name ? `Report for ${resumeData.name}` : 'Your interview results'}</p>
        </div>

        {/* Overall Score */}
        <div className="glass-card" style={{ textAlign: 'center', marginBottom: 24, padding: 40 }}>
          <div className="overall-score">
            <div className="score-circle" style={{ '--score-pct': `${report.overallScore || 0}%` }}>
              <span className="score-num">{report.overallScore || 0}</span>
            </div>
            <div>
              <h2 style={{ marginBottom: 8 }}>Overall Score</h2>
              <span style={{
                display: 'inline-block', padding: '6px 20px', borderRadius: 20,
                background: readinessColors[report.readinessLevel] || 'var(--accent-blue)',
                color: 'white', fontWeight: 700, fontSize: '0.9rem'
              }}>
                {readinessLabels[report.readinessLevel] || report.readinessLevel}
              </span>
            </div>
          </div>
          {report.summary && <p style={{ marginTop: 20, color: 'var(--text-secondary)', maxWidth: 600, margin: '20px auto 0' }}>{report.summary}</p>}
        </div>

        {/* Category Scores */}
        <div className="score-grid" style={{ marginBottom: 24 }}>
          {categories.map(cat => {
            const data = cs[cat.key];
            if (!data) return null;
            return (
              <div key={cat.key} className="glass-card score-card">
                <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{cat.icon}</div>
                <div className="score-value">{data.score}/10</div>
                <div className="score-label">{cat.label}</div>
                <div className="score-bar">
                  <div className="fill" style={{ width: `${data.score * 10}%`, background: cat.color }} />
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>{data.feedback}</p>
              </div>
            );
          })}
        </div>

        {/* Strengths & Weaknesses */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <div className="glass-card">
            <h3 style={{ marginBottom: 16, color: 'var(--accent-green)' }}>💪 Strengths</h3>
            <div className="feedback-list">
              {report.strengths?.map((s, i) => (
                <div key={i} className="feedback-item strength-item">
                  <span className="icon">✅</span> <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card">
            <h3 style={{ marginBottom: 16, color: 'var(--accent-orange)' }}>📈 Areas to Improve</h3>
            <div className="feedback-list">
              {report.weaknesses?.map((w, i) => (
                <div key={i} className="feedback-item weakness-item">
                  <span className="icon">🔶</span> <span>{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Topics */}
        {report.recommendedTopics?.length > 0 && (
          <div className="glass-card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16, color: 'var(--accent-cyan)' }}>📚 Recommended Study Topics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
              {report.recommendedTopics.map((t, i) => (
                <div key={i} className="glass-card" style={{ padding: 16 }}>
                  <h4 style={{ marginBottom: 4 }}>📖 {t.topic}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{t.reason}</p>
                  {t.resources && <p style={{ fontSize: '0.8rem', color: 'var(--accent-blue)' }}>💡 {t.resources}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interview Tips */}
        {report.interviewTips?.length > 0 && (
          <div className="glass-card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16 }}>💡 Interview Tips</h3>
            {report.interviewTips.map((tip, i) => (
              <div key={i} className="feedback-item" style={{ marginBottom: 8 }}>
                <span className="icon">💎</span> <span>{tip}</span>
              </div>
            ))}
          </div>
        )}

        {/* Next Steps */}
        {report.nextSteps && (
          <div className="glass-card" style={{ marginBottom: 24, borderLeft: '4px solid var(--accent-blue)' }}>
            <h3 style={{ marginBottom: 8 }}>🎯 Next Steps</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{report.nextSteps}</p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', padding: '20px 0' }}>
          <button className="btn btn-primary btn-lg" onClick={() => { resetInterview(); navigate('/resume'); }}>
            🔄 Retake Interview
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/history')}>
            📊 View History
          </button>
        </div>
      </div>
    </div>
  );
}
