import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PersonalInfo, COUNTRIES, PRESET_AVATARS } from '../types';
import { User, Mail, Phone, Calendar, Globe, Upload, Camera, Check } from 'lucide-react';

interface PersonalStepProps {
  data: PersonalInfo;
  onChange: (data: Partial<PersonalInfo>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PersonalStep({ data, onChange, onNext, onBack }: PersonalStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.fullName || data.fullName.trim().length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (data.mobile && !/^\+?[0-9\s-]{7,15}$/.test(data.mobile)) {
      newErrors.mobile = 'Please enter a valid phone number (7-15 digits).';
    }
    if (!data.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required.';
    } else {
      // Basic age check (must be a plausible birthdate)
      const year = new Date(data.dateOfBirth).getFullYear();
      const currentYear = new Date().getFullYear();
      if (year > currentYear || year < 1920) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth.';
      }
    }
    if (!data.gender) {
      newErrors.gender = 'Please select a gender.';
    }
    if (!data.country) {
      newErrors.country = 'Please select a country.';
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

  // Handle uploaded profile picture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ profilePic: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ profilePic: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
      id="personal-step"
    >
      <div className="text-center md:text-left mb-6">
        <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-xs text-gray-500 mt-1">Tell us a little bit about yourself to set up your official student card.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Configuration */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full border-2 border-indigo-600 bg-gray-100 flex items-center justify-center overflow-hidden shadow-inner">
              {data.profilePic ? (
                <img
                  src={data.profilePic}
                  alt="Profile Avatar Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  id="avatar-preview-img"
                />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 cursor-pointer shadow-md transition-colors">
              <Camera className="w-3.5 h-3.5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1 w-full text-center md:text-left">
            <label className="block text-xs font-bold text-gray-700 mb-2">Select Avatar or Upload Custom Photo</label>
            <div className="grid grid-cols-6 gap-2 mb-3">
              {PRESET_AVATARS.map((avatar, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange({ profilePic: avatar })}
                  className={`relative w-8 h-8 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                    data.profilePic === avatar ? 'border-indigo-600 ring-2 ring-indigo-100 scale-105' : 'border-transparent'
                  }`}
                >
                  <img src={avatar} alt={`Avatar Preset ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {data.profilePic === avatar && (
                    <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white stroke-[3px]" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom drag zone */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border border-dashed p-3 rounded-xl text-center cursor-pointer transition-all ${
                dragActive ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 bg-white'
              }`}
            >
              <label className="cursor-pointer text-[11px] text-gray-500 block">
                <Upload className="w-3.5 h-3.5 mx-auto text-gray-400 mb-1" />
                <span>Drag photo here or </span>
                <span className="text-indigo-600 font-semibold underline">browse</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Input grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-700 mb-1">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={data.fullName}
                onChange={(e) => onChange({ fullName: e.target.value })}
                className={`w-full pl-10 pr-3 py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                  errors.fullName ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="John Doe"
                id="input-fullName"
              />
            </div>
            {errors.fullName && <span className="text-[10px] text-red-500 mt-1">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-700 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={data.email}
                onChange={(e) => onChange({ email: e.target.value })}
                className={`w-full pl-10 pr-3 py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                  errors.email ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="john.doe@university.com"
                id="input-email"
              />
            </div>
            {errors.email && <span className="text-[10px] text-red-500 mt-1">{errors.email}</span>}
          </div>

          {/* Mobile */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-700 mb-1">Mobile Number (Optional)</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={data.mobile}
                onChange={(e) => onChange({ mobile: e.target.value })}
                className={`w-full pl-10 pr-3 py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                  errors.mobile ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="+1 555-0199"
                id="input-mobile"
              />
            </div>
            {errors.mobile && <span className="text-[10px] text-red-500 mt-1">{errors.mobile}</span>}
          </div>

          {/* DOB */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-700 mb-1">Date of Birth *</label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={data.dateOfBirth}
                onChange={(e) => onChange({ dateOfBirth: e.target.value })}
                className={`w-full pl-10 pr-3 py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                  errors.dateOfBirth ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-blue-500'
                }`}
                id="input-dateOfBirth"
              />
            </div>
            {errors.dateOfBirth && <span className="text-[10px] text-red-500 mt-1">{errors.dateOfBirth}</span>}
          </div>

          {/* Gender */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-700 mb-1">Gender *</label>
            <div className="grid grid-cols-3 gap-2">
              {['Male', 'Female', 'Non-Binary'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => onChange({ gender: g })}
                  className={`py-2 text-xs font-medium border rounded-xl transition-all ${
                    data.gender === g
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-200'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            {errors.gender && <span className="text-[10px] text-red-500 mt-1">{errors.gender}</span>}
          </div>

          {/* Country */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-700 mb-1">Country *</label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <select
                value={data.country}
                onChange={(e) => onChange({ country: e.target.value })}
                className={`w-full pl-10 pr-3 py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none ${
                  errors.country ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-blue-500'
                }`}
                id="input-country"
              >
                <option value="">Select country...</option>
                {COUNTRIES.map((cty) => (
                  <option key={cty} value={cty}>
                    {cty}
                  </option>
                ))}
              </select>
            </div>
            {errors.country && <span className="text-[10px] text-red-500 mt-1">{errors.country}</span>}
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-xs rounded-xl transition-colors"
            id="btn-back-personal"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-xs rounded-xl shadow-md transition-all duration-150"
            id="btn-next-personal"
          >
            Next Step
          </button>
        </div>
      </form>
    </motion.div>
  );
}
