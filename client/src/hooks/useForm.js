import { useState, useCallback } from 'react';

/**
 * useForm - Universal real-time form validation hook
 * Enforces Rule 2:
 * - Validate on input/change
 * - Validate on blur
 * - Revalidate immediately when value changes
 * - Clear error immediately when input becomes valid
 * - Show errors on untouched fields only upon validateAll()
 */
export function useForm(initialValues, validators = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Real-time field validation
  const validateField = useCallback(
    (name, value, currentValues) => {
      if (validators[name]) {
        return validators[name](value, currentValues || values) || null;
      }
      return null;
    },
    [validators, values]
  );

  // Handle value change with immediate real-time revalidation
  const handleChange = useCallback(
    (name, value) => {
      setValues((prev) => {
        const nextValues = { ...prev, [name]: value };
        // Validate immediately upon change
        if (validators[name]) {
          const err = validators[name](value, nextValues);
          setErrors((prevErr) => ({
            ...prevErr,
            [name]: err || null,
          }));
        }
        return nextValues;
      });
    },
    [validators]
  );

  // Handle blur event
  const handleBlur = useCallback(
    (name) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      if (validators[name]) {
        const err = validators[name](values[name], values);
        setErrors((prevErr) => ({
          ...prevErr,
          [name]: err || null,
        }));
      }
    },
    [validators, values]
  );

  // Validate entire form for submission
  const validateAll = useCallback(() => {
    const newErrors = {};
    const newTouched = {};
    let isValid = true;

    Object.keys(validators).forEach((key) => {
      newTouched[key] = true;
      const err = validators[key](values[key], values);
      if (err) {
        newErrors[key] = err;
        isValid = false;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);
    return isValid;
  }, [validators, values]);

  const resetForm = useCallback(
    (newInitial = initialValues) => {
      setValues(newInitial);
      setErrors({});
      setTouched({});
    },
    [initialValues]
  );

  return {
    values,
    setValues,
    errors,
    setErrors,
    touched,
    setTouched,
    handleChange,
    handleBlur,
    validateField,
    validateAll,
    resetForm,
  };
}

export default useForm;
