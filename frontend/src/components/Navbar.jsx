import React from 'react';
import { Scale, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-legal-bg/80 backdrop-blur-md border-b border-legal-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-legal-accent" />
            <span className="font-display font-bold text-2xl text-legal-textMain">LegalEase</span>
          </Link>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-legal-textMain hover:text-legal-accent transition-colors font-medium">Upload</Link>
            <Link to="/history" className="text-legal-textMain hover:text-legal-accent transition-colors font-medium">My Documents</Link>
            <Link to="#" className="text-legal-textMain hover:text-legal-accent transition-colors font-medium">About</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-legal-textMuted hover:text-legal-textMain transition-colors cursor-pointer">
              <Globe className="h-5 w-5" />
              <span className="text-sm font-medium">Language</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-legal-success/20 text-legal-success border border-legal-success/30">
              Beta
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
