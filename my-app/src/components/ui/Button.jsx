import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "default", 
  disabled = false, 
  loading = false,
  className = "",
  type = "button",
  ...props
}) => {
  const baseClasses = "font-semibold transition rounded-full shadow-lg";
  
  const variants = {
    primary: "text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 hover:shadow-xl",
    secondary: "text-gray-700 bg-gray-200 hover:bg-gray-300",
    outline: "text-pink-600 border border-pink-600 hover:bg-pink-50",
    danger: "text-white bg-red-500 hover:bg-red-600"
  };
  
  const sizes = {
    small: "px-4 py-2 text-sm",
    default: "px-8 py-4 text-lg",
    large: "px-10 py-4 text-lg"
  };
  
  const disabledClasses = disabled || loading ? "opacity-50 cursor-not-allowed" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      {...props}
    >
      {loading ? 'Processing...' : children}
    </button>
  );
};

export default Button;
