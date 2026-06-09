import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText, Users, Calendar, Scale, Heart, AlertTriangle, ArrowRight, MessageSquare } from 'lucide-react';
import { summarizeDocument, translateDocument } from '../api/client';
import AgentProgressTracker from '../components/AgentProgressTracker';

const iconMap = {
  "Document Type & Purpose": FileText,
  "Key Parties": Users,
  "Important Dates & Deadlines": Calendar,
  "Core Legal Points": Scale,
  "What This Means For You": Heart,
  "Red Flags / Things to Watch Out For": AlertTriangle,
  "Recommended Next Steps": ArrowRight
};

const SummaryPage = () => {
  const { docId } = useParams();
  const [searchParams] = useSearchParams();
  const targetLang = searchParams.get('lang') || 'Hindi';
  
  const [progressStep, setProgressStep] = useState(1);
  const [showTranslation, setShowTranslation] = useState(false);

  // Simulate progress
  useEffect(() => {
    let timer;
    if (progressStep < 5) {
      timer = setTimeout(() => setProgressStep(prev => prev + 1), 1500);
    }
    return () => clearTimeout(timer);
  }, [progressStep]);

  const { data: summaryData, isLoading: isLoadingSummary, error: summaryError } = useQuery({
    queryKey: ['summary', docId],
    queryFn: () => summarizeDocument(docId),
    enabled: !!docId && progressStep >= 3,
  });

  const { data: translationData, isLoading: isLoadingTranslation } = useQuery({
    queryKey: ['translation', docId, targetLang],
    queryFn: () => translateDocument(docId, targetLang),
    enabled: !!summaryData && !!targetLang && progressStep >= 4,
  });

  if (progressStep < 5 || isLoadingSummary || isLoadingTranslation) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-legal-bg">
        <AgentProgressTracker currentStep={progressStep} />
      </div>
    );
  }

  if (summaryError) {
    return <div className="text-center text-legal-danger mt-20">Error generating summary.</div>;
  }

  const enSummary = summaryData?.summary_json || {};
  const transSummary = translationData?.translated_text || enSummary;

  const summaryKeys = Object.keys(enSummary);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-legal-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-display font-bold text-legal-textMain">Document Summary</h1>
            <p className="text-legal-textMuted mt-1">Structured analysis of your legal document.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex bg-legal-surface border border-legal-border rounded-lg p-1">
              <button 
                onClick={() => setShowTranslation(false)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${!showTranslation ? 'bg-legal-border text-legal-textMain' : 'text-legal-textMuted hover:text-legal-textMain'}`}
              >
                English
              </button>
              <button 
                onClick={() => setShowTranslation(true)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${showTranslation ? 'bg-legal-border text-legal-textMain' : 'text-legal-textMuted hover:text-legal-textMain'}`}
              >
                {targetLang}
              </button>
            </div>
            
            <Link 
              to={`/qa/${docId}`}
              className="flex items-center px-4 py-2 bg-legal-accent/10 border border-legal-accent/30 text-legal-accent rounded-lg hover:bg-legal-accent hover:text-legal-bg transition-colors font-medium text-sm"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Ask Questions
            </Link>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Summary Cards (60%) */}
          <div className="lg:col-span-7 space-y-6">
            {summaryKeys.map((key, index) => {
              const Icon = iconMap[key] || FileText;
              const content = showTranslation ? transSummary[key] : enSummary[key];
              
              if (!content || (Array.isArray(content) && content.length === 0)) return null;

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-legal-surface border border-legal-border rounded-xl p-6 hover:border-legal-accent/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-2.5 rounded-lg bg-legal-accent/10 border border-legal-accent/20 shrink-0">
                      <Icon className="w-5 h-5 text-legal-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-display font-semibold text-legal-textMain mb-3">{key}</h3>
                      {Array.isArray(content) ? (
                        <ul className="space-y-2">
                          {content.map((item, i) => (
                            <li key={i} className="flex items-start text-legal-textMuted text-sm">
                              <span className="mr-2 mt-1 w-1.5 h-1.5 rounded-full bg-legal-border shrink-0"></span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-legal-textMuted text-sm leading-relaxed">{content}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Document Context Panel (40%) */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24 bg-[#0F1623] border border-legal-border rounded-xl h-[calc(100vh-8rem)] overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-legal-border bg-legal-surface flex items-center justify-between">
                <span className="text-xs font-mono text-legal-textMuted uppercase tracking-wider">Extracted Text Preview</span>
              </div>
              <div className="p-6 overflow-y-auto font-mono text-xs text-legal-textMuted/70 leading-relaxed whitespace-pre-wrap flex-1">
                {/* Mocking the text preview for visual effect since we don't return raw text in summary API */}
                [DOCUMENT PREVIEW UNAVAILABLE VIA API IN THIS DEMO]
                <br/><br/>
                Normally, the full extracted text from the Ingestion Agent would be displayed here with important entities highlighted in the UI. 
                <br/><br/>
                You can use the "Ask Questions" button to interact with the full RAG index of this document.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
