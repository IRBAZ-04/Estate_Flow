import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import FieldError from '../components/common/FieldError';
import useForm from '../hooks/useForm';
import { validateName, validateEmail, validateDescription } from '../utils/validators';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const validators = {
    name: (val) => validateName(val, 'Your Name'),
    email: (val) => validateEmail(val, 'Email Address'),
    message: (val) => validateDescription(val, 'Message', { min: 10, max: 2000 }),
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
  } = useForm(
    {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validators
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateAll();
    if (!isValid) return;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      resetForm();
    }, 4000);
  };

  const getInputStyle = (fieldName) => {
    const hasError = touched[fieldName] && Boolean(errors[fieldName]);
    const isValid = touched[fieldName] && !errors[fieldName] && values[fieldName];
    if (hasError) return 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-500';
    if (isValid) return 'border-emerald-400 bg-emerald-50/20 text-slate-800 focus:border-emerald-500';
    return 'border-slate-200 bg-slate-50 text-slate-800 focus:border-teal-500 focus:bg-white';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      <div className="max-w-3xl pb-8 border-b border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Contact & Support
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Have questions about EstateFlow or need assistance with property listings? Reach out to our team.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 text-teal-600 mb-2">
              <Mail className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">Email Inquiries</h3>
            </div>
            <p className="text-xs text-slate-600">support@estateflow.local</p>
            <p className="text-xs text-slate-400 mt-1">Response time: Within 24 hours</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 text-cyan-600 mb-2">
              <Phone className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">Direct Support</h3>
            </div>
            <p className="text-xs text-slate-600">+91 98765 43210</p>
            <p className="text-xs text-slate-400 mt-1">Mon - Sat: 9:00 AM to 6:00 PM</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 text-emerald-600 mb-2">
              <MapPin className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">Campus Location</h3>
            </div>
            <p className="text-xs text-slate-600">EstateFlow Support Centre</p>
            <p className="text-xs text-slate-400 mt-1">Chennai, India</p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xs">
          {submitted ? (
            <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm text-emerald-900">Message Received!</h4>
              <p className="text-xs text-emerald-700">
                Thank you for reaching out. Our team will get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    placeholder="Enter your name"
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs outline-none transition ${getInputStyle(
                      'name'
                    )}`}
                  />
                  <FieldError
                    error={errors.name}
                    touched={touched.name}
                    showSuccess
                    successMessage="Valid name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="name@example.com"
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs outline-none transition ${getInputStyle(
                      'email'
                    )}`}
                  />
                  <FieldError
                    error={errors.email}
                    touched={touched.email}
                    showSuccess
                    successMessage="Valid email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={values.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  placeholder="e.g. Question about Property Listing"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={values.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  onBlur={() => handleBlur('message')}
                  placeholder="Type your message here (min. 10 characters)..."
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-xs outline-none transition resize-none ${getInputStyle(
                    'message'
                  )}`}
                ></textarea>
                <FieldError
                  error={errors.message}
                  touched={touched.message}
                  showSuccess
                  successMessage="Good message length"
                  currentLength={values.message.length}
                  maxLength={2000}
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold rounded-xl shadow-xs transition w-full sm:w-auto"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
