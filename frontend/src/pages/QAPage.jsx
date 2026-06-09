import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Bot, User, Mic } from 'lucide-react';
import { askQuestion } from '../api/client';

const QAPage = () => {
  const { docId } = useParams();
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: 'Hello. I am your legal assistant. You can ask me any specific questions about the document you just uploaded.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "What are the key deadlines?",
    "Who are the parties involved?",
    "What are my rights?",
    "What should I do next?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (q = input) => {
    if (!q.trim() || isTyping) return;
    
    const userMsg = { id: Date.now(), role: 'user', content: q };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await askQuestion(docId, q);
      const aiMsg = { 
        id: Date.now() + 1, 
        role: 'ai', 
        content: response.answer,
        citation: response.citation 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: 'Sorry, I encountered an error answering that question.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-legal-bg overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-legal-border bg-legal-surface px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <Link to={`/summary/${docId}`} className="p-2 hover:bg-legal-bg rounded-lg text-legal-textMuted hover:text-legal-textMain transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="font-display font-semibold text-legal-textMain">Document Q&A</h2>
            <p className="text-xs text-legal-success flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-legal-success mr-1.5 animate-pulse"></span>
              Agent 5 Active
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'ml-3 bg-legal-accent/20' : 'mr-3 bg-legal-surface border border-legal-border'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-legal-accent" /> : <Bot className="w-4 h-4 text-legal-textMuted" />}
                </div>

                <div className={`rounded-2xl p-4 ${
                  msg.role === 'user' 
                    ? 'bg-legal-accent text-legal-bg font-medium rounded-tr-sm' 
                    : 'bg-legal-surface border border-legal-border text-legal-textMain rounded-tl-sm shadow-md'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  
                  {msg.citation && (
                    <div className="mt-4 pt-3 border-t border-legal-border/50 border-l-2 border-l-legal-success pl-3">
                      <p className="text-[10px] uppercase tracking-wider text-legal-textMuted mb-1 font-semibold">Source Citation</p>
                      <p className="font-mono text-xs text-legal-textMuted/80 italic">"{msg.citation}"</p>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex flex-row max-w-[85%]">
                <div className="shrink-0 w-8 h-8 rounded-full mr-3 bg-legal-surface border border-legal-border flex items-center justify-center">
                  <Bot className="w-4 h-4 text-legal-textMuted" />
                </div>
                <div className="bg-legal-surface border border-legal-border rounded-2xl rounded-tl-sm p-4 px-5 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-legal-textMuted/40 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-legal-textMuted/40 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-legal-textMuted/40 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="shrink-0 bg-legal-bg border-t border-legal-border p-4">
        <div className="max-w-3xl mx-auto">
          
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestedQuestions.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sq)}
                  className="px-4 py-1.5 rounded-full border border-legal-border text-xs text-legal-textMuted hover:border-legal-accent hover:text-legal-accent transition-colors bg-legal-surface"
                >
                  {sq}
                </button>
              ))}
            </div>
          )}

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-center"
          >
            <div className="absolute left-4 text-legal-textMuted">
              <Mic className="w-5 h-5 cursor-not-allowed opacity-50" title="Voice input coming soon" />
            </div>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your document..."
              className="w-full bg-legal-surface border border-legal-border rounded-full pl-12 pr-14 py-3.5 text-sm text-legal-textMain focus:outline-none focus:border-legal-accent/50 focus:ring-1 focus:ring-legal-accent/50 transition-all shadow-inner"
            />
            
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className={`absolute right-2 p-2 rounded-full transition-colors ${
                !input.trim() || isTyping 
                  ? 'bg-transparent text-legal-textMuted' 
                  : 'bg-legal-accent text-legal-bg hover:bg-amber-400 shadow-md'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QAPage;
