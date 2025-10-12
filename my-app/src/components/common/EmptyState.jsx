import React from 'react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  onAction, 
  className = "" 
}) => {
  return (
    <div className={`text-center ${className}`}>
      <div className="relative inline-block mb-8">
        <div className="flex items-center justify-center w-64 h-64 mx-auto rounded-full shadow-lg bg-gradient-to-br from-orange-200 to-orange-300">
          <Icon size={80} className="text-orange-600" strokeWidth={1.5} />
        </div>
      </div>
      <h2 className="mb-4 text-4xl font-bold text-gray-900">{title}</h2>
      <p className="max-w-md mx-auto mb-8 text-lg text-gray-600">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-10 py-4 text-lg font-semibold text-white transition rounded-full shadow-lg bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 hover:shadow-xl"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
