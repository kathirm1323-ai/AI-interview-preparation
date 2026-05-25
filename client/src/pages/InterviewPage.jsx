import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterviewContext } from '../context/InterviewContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useInterview } from '../hooks/useInterview';

export default function InterviewPage() {
  const navigate = useNavigate();
  const { questions, resumeData, interviewId, domain, setReport, setAnswers } = useInterviewContext();
  const { transcript, interimTranscript, isListening, isSupported, start: startListening, stop: stopListening, reset: resetTranscript } = useSpeechRecognition();
  const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis();
  const { currentIndex, isEvaluating, currentEvaluation, setCurrentEvaluation, evaluateCurrentAnswer, moveToNext, generateReport, isGeneratingReport } = useInterview();

  const [transcriptLog, setTranscriptLog] = useState([]);
  const [phase, setPhase] = useState('intro'); // intro, asking, listening, evaluating, feedback, complete
  const [textInput, setTextInput] = useState('');
  const transcriptEndRef = useRef(null);
  const hasStarted = useRef(false);

  // Redirect if no questions
  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate('/resume');
    }
  }, [questions, navigate]);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcriptLog]);

  // Start interview
  useEffect(() => {
    if (hasStarted.current || !questions?.length) return;
    hasStarted.current = true;
    const greeting = `Hello ${resumeData?.name || 'there'}! Welcome to your mock interview. I'll be asking you ${questions.length} questions. Let's begin.`;
    addLog('ai', greeting);
    speak(greeting).then(() => askQuestion(0));
  }, [questions]);

  const addLog = (speaker, text) => {
    setTranscriptLog(prev => [...prev, { speaker, text, time: new Date() }]);
  };

  const askQuestion = async (index) => {
    if (index >= questions.length) {
      setPhase('complete');
      return;
    }
    const q = questions[index];
    const prefix = `Question ${index + 1} of ${questions.length}.`;
    const fullQ = `${prefix} ${q.question}`;
    addLog('ai', fullQ);
    setPhase('asking');
    await speak(fullQ);
    setPhase('listening');
    resetTranscript();
  };

  const handleSubmitAnswer = async () => {
    const answer = transcript.trim() || textInput.trim();
    if (!answer) return;

    stopListening();
    addLog('user', answer);
    setPhase('evaluating');
    setTextInput('');

    const q = questions[currentIndex];
    const { evaluation, answerRecord } = await evaluateCurrentAnswer(q, answer, resumeData);

    // Speak brief feedback
    const briefFeedback = `Score: ${evaluation.score} out of 10. ${evaluation.feedback}`;
    addLog('ai', briefFeedback);
    setPhase('feedback');
    await speak(briefFeedback);

    resetTranscript();

    if (currentIndex + 1 >= questions.length) {
      setPhase('complete');
      addLog('ai', 'That concludes our interview. Generating your report...');
      await speak('That concludes our interview. Let me generate your performance report.');

      try {
        const report = await generateReport(interviewId, resumeData, resumeData?.name, domain);
        setReport(report);
        setAnswers(prev => [...prev, answerRecord]);
        navigate('/report');
      } catch {
        addLog('ai', 'Error generating report. Please try again.');
      }
    } else {
      moveToNext();
      askQuestion(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    stopListening();
    stopSpeaking();
    resetTranscript();
    addLog('user', '(Skipped)');
    if (currentIndex + 1 >= questions.length) {
      setPhase('complete');
    } else {
      moveToNext();
      askQuestion(currentIndex + 1);
    }
  };

  const currentQ = questions?.[currentIndex];
  const progress = questions?.length ? ((currentIndex) / questions.length) * 100 : 0;

  if (!questions?.length) return null;

  return (
    <div className="page">
      <div className="container">
        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Question {Math.min(currentIndex + 1, questions.length)} of {questions.length}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={handleSkip} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              ⏭️ Skip
            </button>
            <button className="btn btn-danger" onClick={() => navigate('/resume')} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              ✖ End
            </button>
          </div>
        </div>
        <div className="progress-bar"><div className="fill" style={{ width: `${progress}%` }} /></div>

        {/* Interview Layout */}
        <div className="interview-container">
          {/* AI Panel */}
          <div className="ai-panel glass-card">
            <div className={`ai-orb ${isSpeaking ? 'speaking' : isListening ? 'listening' : ''}`}>
              {isSpeaking ? '🗣️' : isListening ? '👂' : isEvaluating ? '🤔' : '🤖'}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {isSpeaking ? '🔊 AI is speaking...' : isListening ? '🎙️ Listening...' : isEvaluating || isGeneratingReport ? '⏳ Analyzing...' : phase === 'feedback' ? '💬 Feedback' : ''}
            </div>

            {currentQ && (
              <div className="question-display">
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 12 }}>
                  <span className={`question-badge badge-${currentQ.category}`}>{currentQ.category}</span>
                  <span className={`question-badge badge-${currentQ.difficulty}`}>{currentQ.difficulty}</span>
                </div>
                <p>{currentQ.question}</p>
              </div>
            )}

            {currentEvaluation && phase === 'feedback' && (
              <div className="glass-card" style={{ padding: 16, maxWidth: 350, textAlign: 'left' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: currentEvaluation.score >= 7 ? 'var(--accent-green)' : currentEvaluation.score >= 5 ? 'var(--accent-orange)' : 'var(--accent-red)' }}>
                  {currentEvaluation.score}/10
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>{currentEvaluation.feedback}</p>
              </div>
            )}
          </div>

          {/* Transcript Panel */}
          <div className="transcript-panel">
            <div className="transcript-header">
              <span>📝 Live Transcript</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {phase === 'complete' ? '✅ Complete' : `Q${currentIndex + 1}`}
              </span>
            </div>

            <div className="transcript-body">
              {transcriptLog.map((entry, i) => (
                <div key={i} className={`transcript-entry ${entry.speaker}`}>
                  <div className="speaker" style={{ color: entry.speaker === 'ai' ? 'var(--accent-blue)' : 'var(--accent-cyan)' }}>
                    {entry.speaker === 'ai' ? '🤖 AI Interviewer' : '👤 You'}
                  </div>
                  <div>{entry.text}</div>
                </div>
              ))}
              {(transcript || interimTranscript) && isListening && (
                <div className="transcript-entry user" style={{ opacity: 0.7 }}>
                  <div className="speaker" style={{ color: 'var(--accent-cyan)' }}>👤 You (live)</div>
                  <div>{transcript}<span style={{ color: 'var(--text-muted)' }}>{interimTranscript}</span></div>
                </div>
              )}
              <div ref={transcriptEndRef} />
            </div>

            {/* Controls */}
            <div className="mic-controls">
              {isSupported ? (
                <button
                  className={`mic-btn ${isListening ? 'active' : ''}`}
                  onClick={() => isListening ? stopListening() : startListening()}
                  disabled={isSpeaking || isEvaluating || phase === 'complete'}
                >
                  {isListening ? '⏹️' : '🎤'}
                </button>
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🎤 Voice not supported</span>
              )}

              <input
                className="interim-text"
                style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: 8, padding: '10px 14px', color: 'var(--text-primary)', fontFamily: 'inherit' }}
                placeholder={isListening ? 'Listening...' : 'Or type your answer here...'}
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmitAnswer()}
                disabled={isSpeaking || isEvaluating || phase === 'complete'}
              />

              <button
                className="btn btn-primary"
                onClick={handleSubmitAnswer}
                disabled={(!transcript.trim() && !textInput.trim()) || isSpeaking || isEvaluating || phase === 'complete'}
                style={{ padding: '10px 20px' }}
              >
                Submit ➤
              </button>
            </div>
          </div>
        </div>

        {isGeneratingReport && (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <div className="loader">
              <div className="spinner" />
              <p>Generating your comprehensive interview report...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
