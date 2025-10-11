import React from 'react';

const FormInput = ({ 
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  label,
  icon: Icon,
  ...props
}) => {
  const baseClasses = "w-full px-6 py-4 text-gray-700 placeholder-gray-400 transition border-0 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:bg-white";
  
  return (
    <div>
      {label && (
        <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
          {Icon && <Icon size={18} />}
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`${baseClasses} ${className}`}
        {...props}
      />
    </div>
  );
};

export default FormInput;
