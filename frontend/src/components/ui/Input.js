import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  name, 
  placeholder, 
  value, 
  onChange, 
  icon: Icon,
  error,
  required,
  className = '',
  disabled,
  autoComplete
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`
            w-full px-4 py-3 ${Icon ? 'pl-12' : ''} pr-4 
            bg-white border rounded-xl text-gray-900 
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all duration-200
            ${error ? 'border-error focus:ring-error' : 'border-gray-200'}
            ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''}
          `}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default Input;
