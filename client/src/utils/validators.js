/**
 * RealEstate360 / EstateFlow - Universal Form Validation Rules & Utilities
 * Conforms strictly to Rule 3 (Field-Level Validation) and Rule 2 (Real-Time Validation)
 */

// Name validation: letters, spaces, apostrophe, hyphen only; no numbers; 2-50 chars
export const validateName = (name, fieldLabel = 'Full Name') => {
  if (!name || !name.trim()) {
    return `${fieldLabel} is required`;
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return `${fieldLabel} must be at least 2 characters long`;
  }
  if (trimmed.length > 50) {
    return `${fieldLabel} cannot exceed 50 characters`;
  }
  if (/\d/.test(trimmed)) {
    return `${fieldLabel} cannot contain numbers`;
  }
  // Allow letters (including unicode), spaces, hyphens, and apostrophes
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
  if (!nameRegex.test(trimmed)) {
    return `${fieldLabel} contains invalid special characters`;
  }
  return null;
};

// Phone validation: Indian 10-digit mobile number, digits only, starting with 6-9
export const validatePhone = (phone, fieldLabel = 'Phone Number') => {
  if (!phone || !phone.toString().trim()) {
    return `${fieldLabel} is required`;
  }
  // Remove spaces, hyphens, +91 prefix
  let cleanPhone = phone.toString().replace(/[\s\-()]/g, '');
  if (cleanPhone.startsWith('+91')) {
    cleanPhone = cleanPhone.slice(3);
  } else if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
    cleanPhone = cleanPhone.slice(2);
  } else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
    cleanPhone = cleanPhone.slice(1);
  }

  if (/[^\d]/.test(cleanPhone)) {
    return `${fieldLabel} must contain numbers only (no letters or symbols)`;
  }
  if (cleanPhone.length !== 10) {
    return `${fieldLabel} must be exactly 10 digits`;
  }
  if (!/^[6-9]/.test(cleanPhone)) {
    return `${fieldLabel} must start with 6, 7, 8, or 9 (valid Indian mobile)`;
  }
  return null;
};

// Email validation: standard RFC 5322 regex check
export const validateEmail = (email, fieldLabel = 'Email Address') => {
  if (!email || !email.trim()) {
    return `${fieldLabel} is required`;
  }
  const trimmed = email.trim();
  if (trimmed.length > 100) {
    return `${fieldLabel} cannot exceed 100 characters`;
  }
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return 'Please enter a valid email address (e.g., name@example.com)';
  }
  return null;
};

// Password validation: minimum 6 characters
export const validatePassword = (password, fieldLabel = 'Password', minLength = 6) => {
  if (!password) {
    return `${fieldLabel} is required`;
  }
  if (password.length < minLength) {
    return `${fieldLabel} must be at least ${minLength} characters long`;
  }
  if (password.length > 128) {
    return `${fieldLabel} cannot exceed 128 characters`;
  }
  return null;
};

// Confirm Password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

// Rupee Amount validation: numeric, positive, max 2 decimals, sensible limit
export const validateRupeeAmount = (
  amount,
  fieldLabel = 'Amount',
  { min = 1, max = 500000000, required = true } = {}
) => {
  if (amount === undefined || amount === null || amount === '') {
    if (!required) return null;
    return `${fieldLabel} is required`;
  }
  const num = Number(amount);
  if (isNaN(num)) {
    return `${fieldLabel} must be a valid number`;
  }
  if (num < min) {
    return `${fieldLabel} must be greater than or equal to ₹${min.toLocaleString('en-IN')}`;
  }
  if (num > max) {
    return `${fieldLabel} cannot exceed ₹${max.toLocaleString('en-IN')}`;
  }
  // Check decimal precision (at most 2 decimals for currency)
  const parts = amount.toString().split('.');
  if (parts.length > 1 && parts[1].length > 2) {
    return `${fieldLabel} cannot have more than 2 decimal places`;
  }
  return null;
};

// Quantity / Room count validation: integer, within range
export const validateQuantity = (
  val,
  fieldLabel,
  { min = 0, max = 20, integer = true, required = true } = {}
) => {
  if (val === undefined || val === null || val === '') {
    if (!required) return null;
    return `${fieldLabel} is required`;
  }
  const num = Number(val);
  if (isNaN(num)) {
    return `${fieldLabel} must be a valid number`;
  }
  if (integer && !Number.isInteger(num)) {
    return `${fieldLabel} must be a whole number`;
  }
  if (num < min) {
    return `${fieldLabel} cannot be less than ${min}`;
  }
  if (num > max) {
    return `${fieldLabel} cannot exceed ${max}`;
  }
  return null;
};

// Area in Sq. Ft. validation: positive number, min 10, max 100,000
export const validateArea = (area, fieldLabel = 'Built-up Area') => {
  if (!area && area !== 0) {
    return `${fieldLabel} is required`;
  }
  const num = Number(area);
  if (isNaN(num) || num <= 0) {
    return `${fieldLabel} must be a positive number`;
  }
  if (num < 10) {
    return `${fieldLabel} must be at least 10 sq ft`;
  }
  if (num > 100000) {
    return `${fieldLabel} cannot exceed 100,000 sq ft`;
  }
  return null;
};

// Date validation: valid date, optional past-date prohibition
export const validateDate = (
  dateStr,
  fieldLabel = 'Date',
  { allowPast = false, required = true } = {}
) => {
  if (!dateStr) {
    if (!required) return null;
    return `${fieldLabel} is required`;
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return `${fieldLabel} is not a valid date`;
  }
  if (!allowPast) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(dateStr);
    inputDate.setHours(0, 0, 0, 0);
    if (inputDate < today) {
      return `${fieldLabel} cannot be in the past`;
    }
  }
  return null;
};

// Date range validation: end date strictly after start date
export const validateDateRange = (startDateStr, endDateStr, startLabel = 'Start date', endLabel = 'End date') => {
  if (!startDateStr || !endDateStr) return null;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
  if (end <= start) {
    return `${endLabel} must be strictly after the ${startLabel.toLowerCase()}`;
  }
  return null;
};

// Description validation: length limits
export const validateDescription = (
  desc,
  fieldLabel = 'Description',
  { min = 10, max = 2000, required = true } = {}
) => {
  if (!desc || !desc.trim()) {
    if (!required) return null;
    return `${fieldLabel} is required`;
  }
  const trimmed = desc.trim();
  if (trimmed.length < min) {
    return `${fieldLabel} must be at least ${min} characters (currently ${trimmed.length})`;
  }
  if (trimmed.length > max) {
    return `${fieldLabel} cannot exceed ${max} characters`;
  }
  return null;
};

// Required text field
export const validateRequired = (val, fieldLabel) => {
  if (val === undefined || val === null || !val.toString().trim()) {
    return `${fieldLabel} is required`;
  }
  return null;
};
