import { createContext, useContext, useState } from 'react';

const InterviewContext = createContext(null);

export function InterviewProvider({ children }) {
  const [resumeText, setResumeText] = useState('');
  const [resumeData, setResumeData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [interviewId, setInterviewId] = useState('');
  const [domain, setDomain] = useState('');
  const [answers, setAnswers] = useState([]);
  const [report, setReport] = useState(null);
  const [currentStep, setCurrentStep] = useState('home'); // home, resume, interview, report

  const addAnswer = (answer) => setAnswers(prev => [...prev, answer]);

  const resetInterview = () => {
    setQuestions([]);
    setInterviewId('');
    setAnswers([]);
    setReport(null);
    setCurrentStep('home');
  };

  return (
    <InterviewContext.Provider value={{
      resumeText, setResumeText,
      resumeData, setResumeData,
      questions, setQuestions,
      interviewId, setInterviewId,
      domain, setDomain,
      answers, setAnswers, addAnswer,
      report, setReport,
      currentStep, setCurrentStep,
      resetInterview,
    }}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterviewContext() {
  const context = useContext(InterviewContext);
  if (!context) throw new Error('useInterviewContext must be used within InterviewProvider');
  return context;
}
