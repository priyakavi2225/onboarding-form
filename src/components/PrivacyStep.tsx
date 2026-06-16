import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ConsentSettings } from '../types';
import { ShieldCheck, BookOpen, AlertCircle, Check } from 'lucide-react';

interface PrivacyStepProps {
  data: ConsentSettings;
  onChange: (data: Partial<ConsentSettings>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PrivacyStep({ data, onChange, onNext, onBack }: PrivacyStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the Terms of Service to continue.';
    }
    if (!data.privacyPolicy) {
      newErrors.privacyPolicy = 'You must agree to the Privacy Policy to continue.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
      id="privacy-step"
    >
      <div className="text-center md:text-left mb-6">
        <h2 className="text-xl font-bold text-gray-900">Privacy & Consent</h2>
        <p className="text-xs text-gray-500 mt-1">
          Review our simple summaries of service provisions and personal data management policies.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Scrollable Terms Text Box Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl flex flex-col h-[130px]">
            <span className="text-[10px] font-extrabold text-gray-700 mb-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>Terms of Service Snippet</span>
            </span>
            <div className="text-[10px] text-gray-500 overflow-y-auto leading-relaxed pr-1 flex-1">
              EduQuest grants you a personal, non-transferable license to utilize educational services. By creating an account you agree to maintain academic honesty, avoid malicious scripting on educational endpoints, and treat peer students and teachers with polite, constructive feedback. Usage accounts are restricted to single-user allocations.
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl flex flex-col h-[130px]">
            <span className="text-[10px] font-extrabold text-gray-700 mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Data Protection Guidelines</span>
            </span>
            <div className="text-[10px] text-gray-500 overflow-y-auto leading-relaxed pr-1 flex-1">
              We operate strictly in compliance with high-tier privacy procedures. Your collected academic marks, profile photo, and study preferences are stored locally and privately transmitted to secure Firebase containers. We never rent or sell user performance statistics to third-party advertising bodies.
            </div>
          </div>
        </div>

        {/* Checkbox triggers */}
        <div className="space-y-3.5 pt-2">
          {/* Terms checkbox */}
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => onChange({ acceptTerms: !data.acceptTerms })}
              className={`w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                data.acceptTerms
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
              id="checkbox-acceptTerms"
            >
              {data.acceptTerms && <Check className="w-3.5 h-3.5 stroke-[3.5px]" />}
            </button>
            <div className="text-xs">
              <label htmlFor="checkbox-acceptTerms" className="font-semibold text-gray-800 cursor-pointer block">
                I accept the EduQuest Terms & Conditions *
              </label>
              <p className="text-[10px] text-gray-500 mt-0.5">Agreement to standard service provisions and code of conduct.</p>
              {errors.acceptTerms && (
                <span className="text-[9px] text-red-500 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.acceptTerms}
                </span>
              )}
            </div>
          </div>

          {/* Privacy checkbox */}
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => onChange({ privacyPolicy: !data.privacyPolicy })}
              className={`w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                data.privacyPolicy
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
              id="checkbox-privacyPolicy"
            >
              {data.privacyPolicy && <Check className="w-3.5 h-3.5 stroke-[3.5px]" />}
            </button>
            <div className="text-xs">
              <label htmlFor="checkbox-privacyPolicy" className="font-semibold text-gray-800 cursor-pointer block">
                I agree to the personal data Privacy Policy *
              </label>
              <p className="text-[10px] text-gray-500 mt-0.5">Allow secure cloud pipeline storage of my academic preferences.</p>
              {errors.privacyPolicy && (
                <span className="text-[9px] text-red-500 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.privacyPolicy}
                </span>
              )}
            </div>
          </div>

          {/* Marketing checkbox */}
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => onChange({ marketingOptIn: !data.marketingOptIn })}
              className={`w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                data.marketingOptIn
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
              id="checkbox-marketingOptIn"
            >
              {data.marketingOptIn && <Check className="w-3.5 h-3.5 stroke-[3.5px]" />}
            </button>
            <div className="text-xs">
              <label htmlFor="checkbox-marketingOptIn" className="font-semibold text-gray-700 cursor-pointer block">
                Receive weekly educational news & marketing discount tips (Optional)
              </label>
              <p className="text-[10px] text-gray-500 mt-0.5">Emails about free classes, hackathons, and scholarship drives.</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-xs rounded-xl transition-colors"
            id="btn-back-privacy"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-xs rounded-xl shadow-md transition-all duration-150"
            id="btn-next-privacy"
          >
            Submit Application
          </button>
        </div>
      </form>
    </motion.div>
  );
}
