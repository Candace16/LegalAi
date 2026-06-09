import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FileText, UploadCloud, File as FileIcon, X, CheckCircle, AlertCircle, Scale, ScrollText, Gavel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { uploadDocument } from '../api/client';

const languages = [
  'Hindi', 'Bengali', 'Tamil', 'Telugu', 
  'Marathi', 'Gujarati', 'Kannada', 'Malayalam'
];

const floatingBadges = [
  { label: 'FIR', delay: 0, duration: 4, top: '10%', left: '-10%' },
  { label: 'RTI', delay: 1, duration: 5, top: '40%', right: '-15%' },
  { label: 'Court Order', delay: 0.5, duration: 4.5, bottom: '20%', left: '-12%' },
  { label: 'Property Deed', delay: 2, duration: 3.5, top: '15%', right: '-5%' },
  { label: 'Rental Agreement', delay: 1.5, duration: 6, bottom: '10%', right: '-10%' }
];

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [targetLang, setTargetLang] = useState('Hindi');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 20971520, // 20MB
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError('');
    
    try {
      const response = await uploadDocument(file);
      navigate(`/summary/${response.id}?lang=${targetLang}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process document. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden flex items-center justify-center bg-legal-bg py-12 px-4 sm:px-6 lg:px-8">
      {/* Background drifting icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <Scale className="absolute top-20 left-20 w-64 h-64 animate-float-slow" />
        <Gavel className="absolute bottom-20 right-20 w-64 h-64 animate-float-med" />
        <ScrollText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 animate-float-fast" />
      </div>

      <div className="max-w-3xl w-full space-y-12 relative z-10">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-legal-textMain mb-4"
          >
            Understand your legal documents.<br/>
            <span className="text-legal-accent">In your language.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-legal-textMuted max-w-2xl mx-auto font-body"
          >
            AI-powered summarization for FIR, RTI, court orders, property deeds & more — in 8 Indian languages.
          </motion.p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          {/* Floating Badges */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            {floatingBadges.map((badge, i) => (
              <motion.div
                key={i}
                className="absolute px-3 py-1 bg-legal-surface border border-legal-border rounded-full text-xs font-medium text-legal-textMuted shadow-lg backdrop-blur-sm"
                style={{ top: badge.top, left: badge.left, right: badge.right, bottom: badge.bottom }}
                animate={{
                  y: [-10, 10, -10],
                }}
                transition={{
                  duration: badge.duration,
                  repeat: Infinity,
                  delay: badge.delay,
                  ease: "easeInOut"
                }}
              >
                {badge.label}
              </motion.div>
            ))}
          </div>

          {/* Upload Box */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative bg-legal-surface rounded-3xl p-1 shadow-2xl group"
          >
            <div className="absolute inset-0 bg-legal-accent/20 rounded-3xl blur-xl transition-opacity opacity-0 group-hover:opacity-100 duration-500"></div>
            
            <div className={`relative h-full w-full rounded-[23px] bg-legal-surface border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 sm:p-12
                ${isDragActive ? 'border-legal-accent bg-legal-accent/5' : 'border-legal-border hover:border-legal-accent/50'}`}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              
              {!file ? (
                <>
                  <div className="w-20 h-20 mb-6 rounded-full bg-legal-bg border border-legal-border flex items-center justify-center shadow-inner group-hover:shadow-legal-accent/20 transition-all duration-300">
                    <FileText className={`w-10 h-10 ${isDragActive ? 'text-legal-accent' : 'text-legal-textMuted group-hover:text-legal-accent'}`} />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-legal-textMain mb-2">
                    {isDragActive ? 'Drop your document here' : 'Drag & drop your legal document'}
                  </h3>
                  <p className="text-legal-textMuted text-sm font-medium">
                    PDF, JPG, PNG supported &middot; Max 20MB
                  </p>
                  <button className="mt-6 px-6 py-2.5 rounded-full bg-legal-bg border border-legal-border text-legal-textMain text-sm font-medium hover:border-legal-accent/50 transition-colors">
                    Browse Files
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-center w-full">
                  <div className="w-16 h-16 mb-4 rounded-xl bg-legal-accent/10 flex items-center justify-center border border-legal-accent/30">
                    <FileIcon className="w-8 h-8 text-legal-accent" />
                  </div>
                  <h4 className="text-lg font-medium text-legal-textMain mb-1 truncate w-full max-w-xs">{file.name}</h4>
                  <p className="text-sm text-legal-textMuted mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="flex items-center text-sm text-legal-danger hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4 mr-1" /> Remove file
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Language Selector */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <p className="text-sm font-medium text-legal-textMuted mb-3 text-center">Select target language for summary</p>
            <div className="flex flex-wrap justify-center gap-2">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => setTargetLang(lang)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                    targetLang === lang 
                      ? 'bg-legal-accent text-legal-bg border-legal-accent shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                      : 'bg-transparent text-legal-textMuted border-legal-border hover:border-legal-textMuted hover:text-legal-textMain'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-legal-danger/10 border border-legal-danger/30 rounded-xl flex items-start">
              <AlertCircle className="w-5 h-5 text-legal-danger mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-legal-danger/90">{error}</p>
            </motion.div>
          )}

          {/* Upload Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className={`w-full relative overflow-hidden group py-4 rounded-xl font-medium text-lg transition-all duration-300 ${
                !file ? 'bg-legal-surface border border-legal-border text-legal-textMuted cursor-not-allowed' : 'bg-legal-accent text-legal-bg hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
              }`}
            >
              <div className="absolute inset-0 w-full h-full transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-legal-bg/30 border-t-legal-bg rounded-full animate-spin"></div>
                  <span>Processing Document...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  Analyze & Summarize <UploadCloud className="ml-2 w-5 h-5" />
                </span>
              )}
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default UploadPage;
