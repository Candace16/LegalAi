import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import UploadPage from './pages/UploadPage';
import SummaryPage from './pages/SummaryPage';
import HistoryPage from './pages/HistoryPage';
import QAPage from './pages/QAPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col pt-16">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<UploadPage />} />
              <Route path="/summary/:docId" element={<SummaryPage />} />
              <Route path="/qa/:docId" element={<QAPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
