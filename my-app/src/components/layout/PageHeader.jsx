import React from 'react';

const PageHeader = ({ 
  title, 
  description, 
  breadcrumb,
  className = "" 
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      {breadcrumb && (
        <div className="mb-6 text-sm text-gray-500">
          {breadcrumb}
        </div>
      )}
      <h1 className="text-5xl font-bold text-gray-900">{title}</h1>
      {description && (
        <p className="mt-2 text-lg text-gray-600">{description}</p>
      )}
    </div>
  );
};

export default PageHeader;
