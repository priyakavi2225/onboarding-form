import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OnboardingData, INITIAL_ONBOARDING_DATA, UserRole } from './types';
import WelcomeStep from './components/WelcomeStep';
import PersonalStep from './components/PersonalStep';
import RoleStep from './components/RoleStep';
import EducationalStep from './components/EducationalStep';
import PreferencesStep from './components/PreferencesStep';
import NotificationsStep from './components/NotificationsStep';
import Dashboard from './components/Dashboard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ThemeSwitcher, { ThemeId } from './components/ThemeSwitcher';
import { Sparkles, ArrowRight, User, Check, RefreshCw } from 'lucide-react';

const THEME_KEY = 'eduquest_theme';

const STORAGE_KEY = 'eduquest_onboarding_data_v2';

export default function App() {
  const [theme, setTheme] = useState<ThemeId>(() => {
    return (localStorage.getItem(THEME_KEY) as ThemeId) || 'baby-pink';
  });

  // Apply theme to <html> and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return !!localStorage.getItem('eduquest_admin_token');
  });

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

  // Auto-reset if query parameter reset=true is present (useful for clearing session cache)
  useEffect(() => {
    if (window.location.search.includes('reset=true')) {
      try {
        localStorage.removeItem(STORAGE_KEY);
        setData(INITIAL_ONBOARDING_DATA);
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error('Failed to auto-reset onboarding data:', e);
      }
    }
  }, []);

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

  const handleAdminLoginSuccess = (token: string) => {
    localStorage.setItem('eduquest_admin_token', token);
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('eduquest_admin_token');
    setIsAdminLoggedIn(false);
    setIsAdminMode(false);
  };

  const setStep = (step: number) => {
    setData((prev) => ({ ...prev, step }));
  };

  const handleNext = () => {
    if (data.step < 6) {
      setStep(data.step + 1);
    }
  };

  const handleBack = () => {
    if (data.step > 1) {
      setStep(data.step - 1);
    }
  };

  const fetchOnboardingData = async (email: string) => {
    try {
      const response = await fetch(`/api/onboarding/${encodeURIComponent(email)}`);
      if (response.ok) {
        const fetchedData = await response.json();
        setData(fetchedData);
        return true;
      }
    } catch (e) {
      console.error('Failed to fetch onboarding data from backend:', e);
    }
    return false;
  };

  const handleCompleteOnboarding = async () => {
    // Set completed locally to immediately transition the UI
    setData((prev) => ({ ...prev, completed: true }));
    
    // Save onboarding details to our Express backend which records it in Supabase
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errResult = await response.json();
        console.error('Failed to store onboarding details in backend database:', errResult.error);
      } else {
        console.log('Onboarding data successfully synchronized with backend!');
      }
    } catch (err) {
      console.error('Network failure connecting to the onboarding backend server:', err);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset and start onboarding over? This will clear current session data.')) {
      setData(INITIAL_ONBOARDING_DATA);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Render Admin Workspace if chosen
  if (isAdminMode) {
    if (isAdminLoggedIn) {
      return <AdminDashboard onLogout={handleAdminLogout} />;
    }
    return (
      <AdminLogin
        onLoginSuccess={handleAdminLoginSuccess}
        onBackToOnboarding={() => setIsAdminMode(false)}
      />
    );
  }

  // Skip wizard and render dashboard if already completed
  if (data.completed) {
    return <Dashboard data={data} onReset={handleReset} theme={theme} onThemeChange={setTheme} />;
  }

  // Per-step accent colors used by the "All Colors" themes
  const MULTI_STEP_COLORS = [
    '#e04878', // Step 1 – Welcome    → Rose Pink
    '#d4621a', // Step 2 – Profile   → Warm Peach
    '#c49000', // Step 3 – Role      → Golden Amber
    '#2480b8', // Step 4 – Academic  → Sky Blue
    '#7c4cbe', // Step 5 – Prefs     → Soft Purple
    '#208870', // Step 6 – Alerts    → Teal
  ];
  const isMultiColor = theme.includes('all-colors');

  // Calculate percentage progress (Step 1 -> 0%, Step 6 -> 100%)
  const percentage = Math.round(((data.step - 1) / 5) * 100);

  const stepTitles = [
    'Welcome',
    'Profile',
    'Role',
    'Academic',
    'Preferences',
    'Alerts',
  ];

  return (
    <div className="min-h-screen theme-page-bg flex flex-col justify-between py-6 px-4 font-sans select-none" id="onboarding-root">
      
      {/* Upper header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between mb-4 px-2" id="onboarding-header">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-md shadow-indigo-100 shrink-0" id="eq-logo-badge">
            EQ
          </div>
          <div className="hidden xs:block">
            <h1 className="text-sm font-black text-gray-800 tracking-wide uppercase">EduQuest</h1>
            <p className="text-[9px] text-gray-400 font-semibold tracking-wider">Enterprise Study Pathway</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <ThemeSwitcher theme={theme} onThemeChange={setTheme} compact />

          <button
            onClick={() => setIsAdminMode(true)}
            className="flex items-center gap-1.5 text-[10px] text-indigo-600 hover:text-indigo-800 font-bold bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2 sm:px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer"
            id="btn-goto-admin"
          >
            <User className="w-3 h-3 sm:hidden" />
            <span className="hidden sm:inline">Admin Portal</span>
          </button>
          
          {data.step > 1 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-red-500 font-bold bg-white hover:bg-red-50 border border-gray-200 px-2 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer"
              id="btn-reset-onboarding"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset Form</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Form Center Column */}
      <main className="flex-1 flex items-center justify-center my-4">
        <div className="w-full max-w-2xl bg-white border border-gray-200/70 rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-100/60 overflow-hidden flex flex-col" id="form-container-card" data-step={data.step}>
          
          {/* TOP progress display info bar */}
          <div className="bg-slate-50/50 border-b border-gray-100 px-4 sm:px-6 py-4 sm:py-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="step-color-label font-extrabold text-indigo-600 tracking-wider text-[10px] uppercase">
                Step {data.step} of 6:{' '}
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
            <div className="hidden md:flex justify-between items-center text-[10px] font-bold text-gray-400 pt-1" id="step-progress-indicators">
              {stepTitles.map((title, idx) => {
                const stepNum = idx + 1;
                const isCompleted = data.step > stepNum;
                const isActive = data.step === stepNum;
                const accent = isMultiColor ? MULTI_STEP_COLORS[idx] : null;

                return (
                  <div
                    key={title}
                    data-step={stepNum}
                    onClick={() => {
                      // Allow backtracking dynamically if valid
                      if (stepNum < data.step) {
                        setStep(stepNum);
                      }
                    }}
                    className={`flex items-center gap-1 transition-all ${
                      isCompleted
                        ? accent ? 'cursor-pointer' : 'text-indigo-600 cursor-pointer'
                        : isActive
                        ? 'text-gray-800'
                        : 'text-gray-300'
                    }`}
                    style={accent && isCompleted ? { color: accent } : undefined}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                        accent ? '' : (
                          isCompleted
                            ? 'bg-indigo-600 text-white'
                            : isActive
                            ? 'border-2 border-indigo-600 text-indigo-600 bg-white'
                            : 'bg-gray-100 text-gray-400'
                        )
                      }`}
                      style={accent ? {
                        backgroundColor: isCompleted ? accent : isActive ? 'white' : '#f3f4f6',
                        border: isActive ? `2px solid ${accent}` : 'none',
                        color: isCompleted ? 'white' : isActive ? accent : '#9ca3af',
                      } : undefined}
                    >
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
          <div className="p-4 sm:p-6 md:p-8 flex-1">
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
                    onFetchProfile={fetchOnboardingData}
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
                    onNext={handleCompleteOnboarding}
                    onBack={handleBack}
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
