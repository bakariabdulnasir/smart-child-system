import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose,
  className = ''
}) => {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-500',
      titleColor: 'text-green-800',
      messageColor: 'text-green-700',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-500',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'text-amber-500',
      titleColor: 'text-amber-800',
      messageColor: 'text-amber-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-500',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700',
    },
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
  };

  const config = types[type];
  const Icon = icons[type];

  return (
    <div className={`
      ${config.bg} ${config.border} border rounded-2xl p-4
      flex items-start gap-3
      ${className}
    `}>
      <Icon className={`${config.icon} flex-shrink-0 mt-0.5`} size={20} />
      <div className="flex-1">
        {title && (
          <h4 className={`font-semibold ${config.titleColor}`}>{title}</h4>
        )}
        {message && (
          <p className={`${config.messageColor} ${title ? 'mt-1' : ''}`}>{message}</p>
        )}
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className={`${config.icon} hover:opacity-70 transition-opacity`}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;
