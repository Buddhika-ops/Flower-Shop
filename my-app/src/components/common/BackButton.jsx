import React from 'react';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ onClick, children = "Go Back to Shop", className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 mb-6 text-sm text-gray-500 hover:text-pink-600 ${className}`}
    >
      <ArrowLeft size={18} /> {children}
    </button>
  );
};

export default BackButton;
