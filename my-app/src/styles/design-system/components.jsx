import React, { memo, forwardRef } from 'react';
import { COMMON_PROPS } from './theme';

// 🎯 Optimized Button Component
const Button = memo(forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = "",
  type = "button",
  onClick,
  ...props 
}, ref) => {
  const baseClasses = COMMON_PROPS.button.base;
  const sizeClasses = COMMON_PROPS.button.sizes[size];
  const variantClasses = COMMON_PROPS.button.variants[variant];
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${disabledClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : children}
    </button>
  );
}));

Button.displayName = 'Button';

// 🎯 Optimized Input Component
const Input = memo(forwardRef(({ 
  type = "text",
  size = 'md',
  className = "",
  error = false,
  ...props 
}, ref) => {
  const baseClasses = COMMON_PROPS.input.base;
  const sizeClasses = COMMON_PROPS.input.sizes[size];
  const errorClasses = error ? 'ring-red-500 bg-red-50' : '';
  
  return (
    <input
      ref={ref}
      type={type}
      className={`${baseClasses} ${sizeClasses} ${errorClasses} ${className}`}
      {...props}
    />
  );
}));

Input.displayName = 'Input';

// 🎯 Optimized Card Component
const Card = memo(({ 
  children, 
  padding = 'md',
  className = "",
  hover = true,
  ...props 
}) => {
  const baseClasses = COMMON_PROPS.card.base;
  const paddingClasses = COMMON_PROPS.card.padding[padding];
  const hoverClasses = hover ? 'hover:shadow-lg' : '';
  
  return (
    <div
      className={`${baseClasses} ${paddingClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// 🎯 Optimized Container Component
const Container = memo(({ 
  children, 
  maxWidth = '7xl',
  className = "",
  ...props 
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };
  
  return (
    <div
      className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Container.displayName = 'Container';

// 🎯 Optimized Section Component
const Section = memo(({ 
  children, 
  padding = 'lg',
  background = 'white',
  className = "",
  ...props 
}) => {
  const paddingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-20',
    '2xl': 'py-24',
  };
  
  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-gradient-to-br from-pink-50 to-rose-50',
  };
  
  return (
    <section
      className={`${paddingClasses[padding]} ${backgroundClasses[background]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
});

Section.displayName = 'Section';

// 🎯 Optimized Grid Component
const Grid = memo(({ 
  children, 
  cols = 1,
  gap = 'md',
  className = "",
  ...props 
}) => {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };
  
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10',
  };
  
  return (
    <div
      className={`grid ${colsClasses[cols]} ${gapClasses[gap]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Grid.displayName = 'Grid';

// 🎯 Optimized Flex Component
const Flex = memo(({ 
  children, 
  direction = 'row',
  justify = 'start',
  align = 'start',
  gap = 'md',
  className = "",
  ...props 
}) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  };
  
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };
  
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };
  
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };
  
  return (
    <div
      className={`flex ${directionClasses[direction]} ${justifyClasses[justify]} ${alignClasses[align]} ${gapClasses[gap]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Flex.displayName = 'Flex';

export {
  Button,
  Input,
  Card,
  Container,
  Section,
  Grid,
  Flex,
};
