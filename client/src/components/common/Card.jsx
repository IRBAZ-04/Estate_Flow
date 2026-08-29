import React from 'react';

/**
 * Reusable Card Component
 */
const Card = ({
  children,
  className = '',
  hover = false,
  glass = false,
  padding = 'p-6',
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${
        glass
          ? 'glass-panel'
          : 'bg-white border-slate-200/80 shadow-xs'
      } ${
        hover ? 'hover:shadow-md hover:border-teal-200' : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
