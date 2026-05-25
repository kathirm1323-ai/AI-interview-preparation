import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    { icon: '📄', title: 'Smart Resume Parsing', desc: 'AI extracts skills, projects & experience from your PDF resume automatically' },
    { icon: '🎯', title: 'Tailored Questions', desc: 'Questions generated based on YOUR resume — HR, Technical & Project-based' },
    { icon: '🎤', title: 'Voice Interview', desc: 'Real voice-based mock interview — AI speaks questions, you answer by voice' },
    { icon: '📊', title: 'Instant Evaluation', desc: 'Each answer scored in real-time with detailed feedback and suggestions' },
    { icon: '🧠', title: 'AI Feedback Report', desc: 'Comprehensive report with scores, strengths, weaknesses & study recommendations' },
    { icon: '📈', title: 'Track Progress', desc: 'View interview history and track improvement over time' },
  ];

  return (
    <div className="page">
      <div className="container">
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '60px 0 40px' }} className="fade-in">
          <div className="ai-orb" style={{ margin: '0 auto 32px', width: 120, height: 120, fontSize: '2.5rem' }}>
            🎤
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 16, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI Interview Assistant
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 32px' }}>
            Your personal AI interviewer that reads your resume, conducts voice mock interviews, and gives expert feedback.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/resume')}>
              🚀 Start Interview
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginTop: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="glass-card slide-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Workflow */}
        <div className="glass-card" style={{ marginTop: 40, textAlign: 'center' }}>
          <h2 style={{ marginBottom: 24, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>How It Works</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            {['📄 Upload Resume', '🔍 AI Parsing', '🎯 Questions Generated', '🎤 Voice Interview', '📊 Evaluation', '🏆 Score Report'].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ padding: '10px 18px', background: 'rgba(220, 39, 67, 0.15)', borderRadius: 12, fontSize: '0.85rem', fontWeight: 600 }}>
                  {step}
                </div>
                {i < 5 && <span style={{ color: 'var(--text-muted)' }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
