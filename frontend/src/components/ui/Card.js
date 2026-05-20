import React from 'react';

const Card = ({ 
  children, 
  title,
  subtitle,
  className = '',
  padding = 'lg',
  hover = false,
  onClick
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div 
      onClick={onClick}
      className={`
        bg-white rounded-3xl shadow-soft
        ${paddings[padding]}
        ${hover ? 'hover:shadow-lg transition-shadow duration-300 cursor-pointer' : ''}
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h3 className="text-xl font-bold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
