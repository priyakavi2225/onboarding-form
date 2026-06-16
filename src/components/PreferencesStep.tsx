import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LearningPreferences, LearningPreferenceType } from '../types';
import { PlayCircle, Tv, CheckSquare, FileText, Sparkles, BookOpen, Clock, Globe, Target, Check } from 'lucide-react';

interface PreferencesStepProps {
  data: LearningPreferences;
  onChange: (data: Partial<LearningPreferences>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PreferencesStep({ data, onChange, onNext, onBack }: PreferencesStepProps) {
  const [error, setError] = useState('');

  const PREFERENCE_ITEMS = [
    { id: 'video', title: 'Video Lessons', desc: 'Pre-recorded HD video courses', icon: PlayCircle },
    { id: 'live', title: 'Live Classes', desc: 'Interact live with lecturers', icon: Tv },
    { id: 'quizzes', title: 'Practice Quizzes', desc: 'Standard multiple choice quizzes', icon: CheckSquare },
    { id: 'assignments', title: 'Assignments', desc: 'Real-world coding or essays', icon: FileText },
    { id: 'interactive', title: 'Interactive Activities', desc: 'In-browser puzzles and visual play', icon: Sparkles },
    { id: 'reading', title: 'Reading Materials', desc: 'EPUB ebooks and notes', icon: BookOpen },
  ];

  const handleToggle = (id: LearningPreferenceType) => {
    setError('');
    const current = data.preferences;
    if (current.includes(id)) {
      onChange({ preferences: current.filter((item) => item !== id) });
    } else {
      onChange({ preferences: [...current, id] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.preferences.length === 0) {
      setError('Please select at least one preferred learning style.');
      return;
    }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
      id="preferences-step"
    >
      <div className="text-center md:text-left mb-6">
        <h2 className="text-xl font-bold text-gray-900">Learning Preferences</h2>
        <p className="text-xs text-gray-500 mt-1">
          Tell us how you study best. We customize recommendation engines based on these choices.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Preference Multi-Grid Card */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 block">Preferred Study Methods (Select one or more) *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PREFERENCE_ITEMS.map((item) => {
              const IconComponent = item.icon;
              const isSelected = data.preferences.includes(item.id as LearningPreferenceType);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleToggle(item.id as LearningPreferenceType)}
                  className={`p-4 border rounded-2xl flex items-start gap-3.5 text-left transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 text-gray-800'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-gray-800">{item.title}</p>
                      {isSelected && (
                        <span className="p-0.5 bg-indigo-600 text-white rounded-full">
                          <Check className="w-2.5 h-2.5 stroke-[3px]" />
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 leading-normal mt-0.5">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
        </div>

        {/* STUDY TIME & LANGUAGE CONFIGURATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5Packed">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Daily Target Learning Habit *</span>
            </label>
            <select
              value={data.dailyLearningTime}
              onChange={(e) => onChange({ dailyLearningTime: e.target.value })}
              className="px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none"
              id="select-dailyLearningTime"
            >
              <option value="15m">⚡ Quick Sparks (15 mins/day)</option>
              <option value="30m">🔥 Steady Climb (30 mins/day)</option>
              <option value="1h">🚀 Deep Concentration (1 hour/day)</option>
              <option value="2h+">🎓 Master Academic (2+ hours/day)</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <span>Preferred Instruction Language *</span>
            </label>
            <select
              value={data.preferredLanguage}
              onChange={(e) => onChange({ preferredLanguage: e.target.value })}
              className="px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none"
              id="select-preferredLanguage"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="German">German (Deutsch)</option>
              <option value="French">French (Français)</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="Japanese">Japanese (日本語)</option>
              <option value="Portuguese">Portuguese (Português)</option>
            </select>
          </div>
        </div>

        {/* LEARNING GOALS TEXTAREA */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-gray-400" />
            <span>Describe custom goals or exams you are preparing for (Optional)</span>
          </label>
          <textarea
            value={data.customGoals}
            onChange={(e) => onChange({ customGoals: e.target.value })}
            placeholder="e.g. 'I want to score in the highest percentile on the SAT exam', 'Learn React frontend to build my personal SaaS website...'"
            className="w-full p-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 h-20 resize-none transition-all"
            id="textarea-customGoals"
          />
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-xs rounded-xl transition-colors"
            id="btn-back-preferences"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-xs rounded-xl shadow-md transition-all duration-150"
            id="btn-next-preferences"
          >
            Next Step
          </button>
        </div>
      </form>
    </motion.div>
  );
}
