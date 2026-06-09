import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Layers, FileText, Globe2, Brain, CheckCircle } from 'lucide-react';

const steps = [
  { id: 1, label: 'Ingesting Document', icon: FileSearch },
  { id: 2, label: 'Legal Classification', icon: Layers },
  { id: 3, label: 'AI Summarization', icon: FileText },
  { id: 4, label: 'Multilingual Translation', icon: Globe2 },
  { id: 5, label: 'RAG Q&A Setup', icon: Brain },
];

const AgentProgressTracker = ({ currentStep }) => {
  return (
    <div className="max-w-md mx-auto w-full py-12">
      <h2 className="text-2xl font-display font-semibold text-center mb-8 text-legal-textMain">
        Processing Document
      </h2>
      <div className="relative">
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-legal-border" />
        
        <div className="space-y-8 relative">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isPending = currentStep < step.id;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex items-center space-x-6 relative">
                <div className={`relative w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-500 bg-legal-bg z-10
                  ${isCompleted ? 'border-legal-success text-legal-success' : 
                    isCurrent ? 'border-legal-accent text-legal-accent shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 
                    'border-legal-border text-legal-textMuted'}`}
                >
                  {isCompleted ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                  {isCurrent && (
                    <span className="absolute -right-1 -top-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-legal-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-legal-accent"></span>
                    </span>
                  )}
                </div>
                
                <div className={`flex-1 transition-opacity duration-500 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                  <h4 className={`text-lg font-medium ${isCurrent ? 'text-legal-accent' : 'text-legal-textMain'}`}>
                    {step.label}
                  </h4>
                  <p className="text-sm text-legal-textMuted">
                    {isCompleted ? 'Completed' : isCurrent ? 'Running...' : 'Pending'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AgentProgressTracker;
