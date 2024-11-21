
// src/components/LetterheadTemplate.jsx

import React from 'react';

const LetterheadTemplate = ({ children }) => {
  return (
    <div className="relative min-h-[297mm] w-[210mm] mx-auto bg-white">
      {/* Background Letterhead */}
      <div 
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage: 'url("/images/letterhead.jpg")',
          backgroundSize: '210mm 297mm',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
          opacity: 1
        }}
      />
      
      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Add print styles
const printStyles = `
  @page {
    size: A4;
    margin: 0;
  }

  @media print {
    body {
      margin: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .print\\:hidden {
      display: none !important;
    }

    .letterhead-template {
      page-break-after: always;
    }

    .preview-container {
      background: white !important;
      padding: 0 !important;
    }

    .a4-paper {
      box-shadow: none !important;
    }
  }

  .letterhead-template {
    background-color: white;
    position: relative;
  }

  .letterhead-content {
    position: relative;
    z-index: 1;
  }
`;

// Add styles to document
if (typeof document !== 'undefined' && !document.getElementById('letterhead-styles')) {
  const style = document.createElement('style');
  style.id = 'letterhead-styles';
  style.innerHTML = printStyles;
  document.head.appendChild(style);
}

export default LetterheadTemplate;
