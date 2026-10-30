import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * FieldError - Standardized inline validation display component
 * Renders below any form input with error icon, animation, and optional success/char-count.
 */
const FieldError = ({
  error,
  touched,
  showSuccess = false,
  successMessage = '',
  currentLength = null,
  maxLength = null,
  className = '',
}) => {
  const hasError = touched && Boolean(error);
  const isSuccess = touched && !error && showSuccess;

  if (!hasError && !isSuccess && currentLength === null) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between text-[11px] mt-1.5 transition-all duration-150 ${className}`}>
      {hasError ? (
        <span className="flex items-center gap-1 text-rose-600 font-medium animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </span>
      ) : isSuccess ? (
        <span className="flex items-center gap-1 text-emerald-600 font-medium animate-fadeIn">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{successMessage || 'Looks good'}</span>
        </span>
      ) : (
        <span />
      )}

      {currentLength !== null && maxLength !== null && (
        <span
          className={`text-[10px] ml-auto shrink-0 ${
            currentLength > maxLength
              ? 'text-rose-600 font-bold'
              : currentLength >= maxLength * 0.9
              ? 'text-amber-600'
              : 'text-slate-400'
          }`}
        >
          {currentLength} / {maxLength}
        </span>
      )}
    </div>
  );
};

export default FieldError;
