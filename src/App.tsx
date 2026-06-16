import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OnboardingData, INITIAL_ONBOARDING_DATA, UserRole } from './types';
import WelcomeStep from './components/WelcomeStep';
import PersonalStep from './components/PersonalStep';
import RoleStep from './components/RoleStep';
import EducationalStep from './components/EducationalStep';
import PreferencesStep from './components/PreferencesStep';
import NotificationsStep from './components/NotificationsStep';
import PrivacyStep from './components/PrivacyStep';
import CompletionStep from './components/CompletionStep';
import Dashboard from './components/Dashboard';
import { Sparkles, ArrowRight, User, Check, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'eduquest_onboarding_data_v2';

export default function App() {
  const [data, setData] = useState<OnboardingData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to recover onboarding data:', e);
    }
    return INITIAL_ONBOARDING_DATA;
  });

  // Persist state updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save onboarding data:', e);
    }
  }, [data]);

  const updatePersonalInfo = (info: Partial<OnboardingData['personalInfo']>) => {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  };

  const updateRole = (role: UserRole) => {
    setData((prev) => ({ ...prev, role }));
  };

  const updateStudentInfo = (info: Partial<OnboardingData['studentInfo']>) => {
    setData((prev) => ({
      ...prev,
      studentInfo: { ...prev.studentInfo, ...info },
    }));
  };

  const updateTeacherInfo = (info: Partial<OnboardingData['teacherInfo']>) => {
    setData((prev) => ({
      ...prev,
      teacherInfo: { ...prev.teacherInfo, ...info },
    }));
  };

  const updateParentInfo = (info: Partial<OnboardingData['parentInfo']>) => {
    setData((prev) => ({
      ...prev,
      parentInfo: { ...prev.parentInfo, ...info },
    }));
  };

  const updateAdminInfo = (info: Partial<OnboardingData['adminInfo']>) => {
    setData((prev) => ({
      ...prev,
      adminInfo: { ...prev.adminInfo, ...info },
    }));
  };

  const updateLearningPreferences = (info: Partial<OnboardingData['learningPreferences']>) => {
    setData((prev) => ({
      ...prev,
      learningPreferences: { ...prev.learningPreferences, ...info },
    }));
  };

  const updateNotifications = (info: Partial<OnboardingData['notifications']>) => {
    setData((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...info },
    }));
  };

  const updateConsent = (info: Partial<OnboardingData['consent']>) => {
    setData((prev) => ({
      ...prev,
      consent: { ...prev.consent, ...info },
    }));
  };

  const setStep = (step: number) => {
    setData((prev) => ({ ...prev, step }));
  };

  const handleNext = () => {
    if (data.step < 8) {
      setStep(data.step + 1);
    }
  };

  const handleBack = () => {
    if (data.step > 1) {
      setStep(data.step - 1);
    }
  };

  const handleCompleteOnboarding = () => {
    setData((prev) => ({ ...prev, completed: true }));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset and start onboarding over? This will clear current session data.')) {
      setData(INITIAL_ONBOARDING_DATA);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Skip wizard and render dashboard if already completed
  if (data.completed) {
    return <Dashboard data={data} onReset={handleReset} />;
  }

  // Calculate percentage progress (Step 1 -> 0%, Step 8 -> 100%)
  const percentage = Math.round(((data.step - 1) / 7) * 100);

  const stepTitles = [
    'Welcome',
    'Profile',
    'Role',
    'Academic',
    'Preferences',
    'Alerts',
    'Consent',
    'Success',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50 flex flex-col justify-between py-6 px-4 font-sans select-none" id="onboarding-root">
      
      {/* Upper header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between mb-4 px-2" id="onboarding-header">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-md shadow-indigo-100">
            EQ
          </div>
          <div>
            <h1 className="text-sm font-black text-gray-800 tracking-wide uppercase">EduQuest</h1>
            <p className="text-[9px] text-gray-400 font-semibold tracking-wider">Enterprise Study Pathway</p>
          </div>
        </div>
        
        {data.step > 1 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-red-500 font-bold bg-white hover:bg-red-50 border border-gray-200 px-3 py-1.5 rounded-lg transition-all shadow-sm"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Form</span>
          </button>
        )}
      </header>

      {/* Main Form Center Column */}
      <main className="flex-1 flex items-center justify-center my-4">
        <div className="w-full max-w-2xl bg-white border border-gray-150/70 rounded-3xl shadow-xl shadow-gray-100/60 overflow-hidden flex flex-col" id="form-container-card">
          
          {/* TOP progress display info bar */}
          <div className="bg-slate-50/50 border-b border-gray-100 px-6 py-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-indigo-600 tracking-wider text-[10px] uppercase">
                Step {data.step} of 8:{' '}
                <span className="text-gray-700 font-normal">{stepTitles[data.step - 1]}</span>
              </span>
              <span className="font-black text-gray-800 text-[11px] bg-white px-2 py-0.5 rounded-full border shadow-sm">
                {percentage}% Completed
              </span>
            </div>

            {/* Simulated interactive linear progress bar */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                id="progress-trail-bar"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>

            {/* Bullet List Progress Indicators displayed on Desktop */}
            <div className="hidden md:flex justify-between items-center text-[10px] font-bold text-gray-400 pt-1">
              {stepTitles.map((title, idx) => {
                const stepNum = idx + 1;
                const isCompleted = data.step > stepNum;
                const isActive = data.step === stepNum;

                return (
                  <div
                    key={title}
                    onClick={() => {
                      // Allow backtracking dynamically if valid
                      if (stepNum < data.step) {
                        setStep(stepNum);
                      }
                    }}
                    className={`flex items-center gap-1 transition-all ${
                      isCompleted
                        ? 'text-indigo-600 cursor-pointer'
                        : isActive
                        ? 'text-gray-800'
                        : 'text-gray-300'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                      isCompleted 
                        ? 'bg-indigo-600 text-white' 
                        : isActive 
                        ? 'border-2 border-indigo-600 text-indigo-600 bg-white' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? <Check className="w-2.5 h-2.5 stroke-[3px]" /> : stepNum}
                    </span>
                    <span className={isActive ? 'underline decoration-indigo-600 underline-offset-2' : ''}>
                      {title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core step router */}
          <div className="p-6 md:p-8 flex-1">
            <AnimatePresence mode="wait">
              {data.step === 1 && (
                <div key="step1">
                  <WelcomeStep onNext={handleNext} />
                </div>
              )}
              {data.step === 2 && (
                <div key="step2">
                  <PersonalStep
                    data={data.personalInfo}
                    onChange={updatePersonalInfo}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                </div>
              )}
              {data.step === 3 && (
                <div key="step3">
                  <RoleStep
                    selectedRole={data.role}
                    onChange={updateRole}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                </div>
              )}
              {data.step === 4 && (
                <div key="step4">
                  <EducationalStep
                    role={data.role}
                    studentData={data.studentInfo}
                    teacherData={data.teacherInfo}
                    parentData={data.parentInfo}
                    adminData={data.adminInfo}
                    onChangeStudent={updateStudentInfo}
                    onChangeTeacher={updateTeacherInfo}
                    onChangeParent={updateParentInfo}
                    onChangeAdmin={updateAdminInfo}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                </div>
              )}
              {data.step === 5 && (
                <div key="step5">
                  <PreferencesStep
                    data={data.learningPreferences}
                    onChange={updateLearningPreferences}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                </div>
              )}
              {data.step === 6 && (
                <div key="step6">
                  <NotificationsStep
                    data={data.notifications}
                    onChange={updateNotifications}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                </div>
              )}
              {data.step === 7 && (
                <div key="step7">
                  <PrivacyStep
                    data={data.consent}
                    onChange={updateConsent}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                </div>
              )}
              {data.step === 8 && (
                <div key="step8">
                  <CompletionStep
                    fullName={data.personalInfo.fullName}
                    role={data.role}
                    onComplete={handleCompleteOnboarding}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer credits */}
      <footer className="text-center text-[10px] text-gray-400 font-semibold uppercase tracking-wider" id="onboarding-footer">
        © 2026 EduQuest Learning Platform • Private & Secure
      </footer>
    </div>
  );
}
