import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getHistory } from '../api/client';
import { FileText, Calendar, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const typeColors = {
  'FIR': 'text-red-400 bg-red-400/10 border-red-400/20',
  'RTI Application': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'Court Order': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'Property Deed': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'Rental Agreement': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'Other': 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  'Unknown': 'text-gray-400 bg-gray-400/10 border-gray-400/20',
};

const HistoryPage = () => {
  const { data: documents, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: getHistory,
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-legal-bg py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-legal-textMain">My Documents</h1>
          <p className="text-legal-textMuted mt-1 font-body">View and manage your previously analyzed legal documents.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-legal-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !documents || documents.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 mb-6 rounded-full bg-legal-surface border border-legal-border flex items-center justify-center">
              <FileText className="w-10 h-10 text-legal-textMuted opacity-50" />
            </div>
            <h3 className="font-display italic text-2xl text-legal-textMuted mb-2">No documents yet.</h3>
            <p className="text-sm text-legal-textMuted/70 mb-6">Upload your first legal document to get started.</p>
            <Link to="/" className="px-6 py-2.5 rounded-full bg-legal-surface border border-legal-border text-legal-textMain text-sm hover:border-legal-accent/50 hover:text-legal-accent transition-colors">
              Upload Document
            </Link>
          </motion.div>
        ) : (
          <div className="bg-[#111827] border border-legal-border rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-legal-textMuted">
                <thead className="text-xs text-legal-textMuted uppercase bg-[#0F1623] border-b border-legal-border">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold">Document Name</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Type</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Detected Language</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Date</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                    <th scope="col" className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={doc.id} 
                      className="group border-b border-legal-border hover:bg-[#1A2333] transition-colors relative"
                    >
                      {/* Left border highlight on hover */}
                      <td className="absolute left-0 top-0 bottom-0 w-0.5 bg-legal-accent scale-y-0 group-hover:scale-y-100 transition-transform origin-center"></td>
                      
                      <td className="px-6 py-4 font-medium text-legal-textMain whitespace-nowrap flex items-center">
                        <FileText className="w-4 h-4 mr-3 text-legal-textMuted group-hover:text-legal-accent transition-colors" />
                        {doc.filename}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${typeColors[doc.doc_type] || typeColors['Other']}`}>
                          {doc.doc_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">{doc.language}</td>
                      <td className="px-6 py-4 flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-2 opacity-60" />
                        {new Date(doc.upload_time).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${doc.status === 'Ready' ? 'bg-legal-success' : 'bg-legal-accent'}`}></div>
                          {doc.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          to={`/summary/${doc.id}`}
                          className="inline-flex items-center text-legal-textMuted hover:text-legal-accent font-medium text-xs transition-colors"
                        >
                          View Summary <LinkIcon className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
