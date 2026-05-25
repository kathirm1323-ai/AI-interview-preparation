import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHistory()
      .then(res => setInterviews(res.data || []))
      .catch(err => console.error('Failed to load history:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this interview?')) return;
    try {
      await api.deleteInterview(id);
      setInterviews(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const ratingColors = {
    excellent: 'var(--accent-green)',
    good: 'var(--accent-blue)',
    average: 'var(--accent-orange)',
    needs_improvement: 'var(--accent-red)',
  };

  return (
    <div className="page">
      <div className="container fade-in">
        <div className="page-header">
          <h1>📊 Interview History</h1>
          <p>Track your progress and review past interview performances</p>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner" /><p>Loading history...</p></div>
        ) : interviews.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Interviews Yet</h3>
            <p>Complete your first mock interview to see it here</p>
            <button className="btn btn-primary" onClick={() => navigate('/resume')} style={{ marginTop: 16 }}>
              🎤 Start First Interview
            </button>
          </div>
        ) : (
          <div className="history-list">
            {interviews.map(interview => (
              <div key={interview.id} className="glass-card history-item" onClick={() => navigate(`/history/${interview.id}`)}>
                <div>
                  <h3 style={{ marginBottom: 4 }}>{interview.candidate_name || 'Interview'}</h3>
                  <div className="history-meta">
                    <span>{interview.domain || 'General'}</span>
                    <span style={{ margin: '0 8px' }}>•</span>
                    <span>{interview.total_questions} questions</span>
                    <span style={{ margin: '0 8px' }}>•</span>
                    <span>{new Date(interview.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div className="history-score">{Math.round(interview.overall_score || 0)}</div>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                      color: ratingColors[interview.overall_rating] || 'var(--text-muted)',
                    }}>
                      {interview.overall_rating?.replace('_', ' ') || 'N/A'}
                    </span>
                  </div>
                  <button className="btn btn-danger" onClick={(e) => handleDelete(interview.id, e)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
