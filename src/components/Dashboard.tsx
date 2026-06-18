import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OnboardingData, UserRole } from '../types';
import ThemeSwitcher, { ThemeId } from './ThemeSwitcher';
import {
  GraduationCap,
  Calendar,
  Layers,
  Sparkles,
  Trophy,
  Activity,
  Bell,
  Settings,
  RefreshCw,
  Clock,
  BookOpen,
  Award,
  Globe,
  BookMarked,
  User,
  ShieldCheck,
  CheckCircle,
  Play,
  ClipboardList,
  Flame,
  Users2
} from 'lucide-react';

interface DashboardProps {
  data: OnboardingData;
  onReset: () => void;
  theme: ThemeId;
  onThemeChange: (t: ThemeId) => void;
}

export default function Dashboard({ data, onReset, theme, onThemeChange }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'quizzes' | 'settings'>('overview');
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [notificationBanner, setNotificationBanner] = useState<string | null>(
    data.notifications.emailNotifications ? 'Welcome! An onboarding verification email has been sent to ' + data.personalInfo.email : null
  );

  const mockQuestions = [
    {
      id: 1,
      q: 'Which cognitive style prioritizes learning via physical touch and spatial layout?',
      options: ['Kinesthetic', 'Visual Design', 'Auditory', 'Rote Reading'],
      answer: 'Kinesthetic',
    },
    {
      id: 2,
      q: 'What is the standard educational metric evaluated using adaptive AI algorithms?',
      options: ['Spaced Repetition', 'Z-Score Analytics', 'Zone of Proximal Development', 'Double Loop Feedback'],
      answer: 'Zone of Proximal Development',
    },
  ];

  const handleQuizSubmit = () => {
    let score = 0;
    mockQuestions.forEach((item) => {
      if (selectedAnswers[item.id] === item.answer) {
        score++;
      }
    });
    setQuizScore(score);
  };

  const getTargetLabel = (time: string) => {
    if (time === '15m') return '15 mins/day';
    if (time === '30m') return '30 mins/day';
    if (time === '1h') return '1 hour/day';
    return '2+ hours/day';
  };

  const getSubjects = () => {
    if (data.role === UserRole.STUDENT) {
      return data.studentInfo.preferredSubjects.length > 0 ? data.studentInfo.preferredSubjects : ['Mathematics', 'Computer Science'];
    } else if (data.role === UserRole.TEACHER) {
      return data.teacherInfo.subjectsTaught.length > 0 ? data.teacherInfo.subjectsTaught : ['Professional Curriculum'];
    }
    return ['General Academics', 'Modern Skills'];
  };

  const personalSubjects = getSubjects();

  return (
    <div className="min-h-screen theme-page-bg p-4 md:p-6" id="dashboard-main-container">
      {/* Alert banner */}
      <AnimatePresence>
        {notificationBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-center justify-between text-xs text-indigo-700"
            id="notification-alert-banner"
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600 animate-swing" />
              <span>{notificationBanner}</span>
            </div>
            <button
              onClick={() => setNotificationBanner(null)}
              className="text-indigo-400 hover:text-indigo-600 font-bold px-1"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation / Left Rail */}
        <div className="lg:col-span-3 space-y-6">
          {/* User Profile Card */}
          <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 rounded-full border-2 border-indigo-600 overflow-hidden bg-gray-100 flex items-center justify-center shadow-md">
                {data.personalInfo.profilePic ? (
                  <img
                    src={data.personalInfo.profilePic}
                    alt="Active User Profile"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    id="dashboard-avatar-img"
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
                <div className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-emerald-500 border border-white rounded-full flex items-center justify-center text-[8px] text-white">
                  ✓
                </div>
              </div>

              <h2 className="text-sm font-bold text-gray-900 mt-3">{data.personalInfo.fullName || 'Edu Learner'}</h2>
              <p className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-full capitalize mt-1.5">
                {data.role || 'Member'}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">{data.personalInfo.email}</p>
            </div>

            <hr className="border-gray-100" />

            {/* Quick Badges */}
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1.5Packed">
                  <Globe className="w-3.5 h-3.5 text-gray-400" />
                  <span>Country</span>
                </span>
                <span className="font-semibold text-gray-800">{data.personalInfo.country || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Daily Goal</span>
                </span>
                <span className="font-semibold text-gray-800">{getTargetLabel(data.learningPreferences.dailyLearningTime)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                  <span>Language</span>
                </span>
                <span className="font-semibold text-gray-800">{data.learningPreferences.preferredLanguage}</span>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Navigation options */}
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                id="tab-btn-overview"
              >
                <Layers className="w-4 h-4" />
                <span>Overview Workspace</span>
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'courses'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                id="tab-btn-courses"
              >
                <GraduationCap className="w-4 h-4" />
                <span>My Courses</span>
              </button>
              <button
                onClick={() => setActiveTab('quizzes')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'quizzes'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                id="tab-btn-quizzes"
              >
                <ClipboardList className="w-4 h-4" />
                <span>Interactive Quiz</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                id="tab-btn-settings"
              >
                <Settings className="w-4 h-4" />
                <span>Privacy & Settings</span>
              </button>
            </div>

            {/* Theme switcher */}
            <div className="pt-2">
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-2 px-1">Theme</p>
              <ThemeSwitcher theme={theme} onThemeChange={onThemeChange} />
            </div>

            {/* Reset Onboarding triggering */}
            <button
              onClick={onReset}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2 border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl text-[11px] font-bold transition-all"
              id="btn-edit-onboarding"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset & Edit Onboarding</span>
            </button>
          </div>
        </div>

        {/* Workspace Display Area */}
        <div className="lg:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Greeting banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-3xl relative overflow-hidden shadow-md">
                  <div className="relative z-10 max-w-md">
                    <div className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full text-[10px] font-bold text-white mb-3 uppercase">
                      <Sparkles className="w-3 h-3 text-yellow-300" />
                      <span>Adaptive Track Online</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                      Ready to excel today, {data.personalInfo.fullName.split(' ')[0] || 'Learner'}?
                    </h2>
                    <p className="text-xs text-blue-100 mt-1.5">
                      Your personalized curriculum consists of <strong>{personalSubjects.length} core subject areas</strong> designed for your specific background.
                    </p>
                  </div>
                  <div className="absolute right-4 bottom-0 opacity-10 transform translate-y-4">
                    <Trophy className="w-48 h-48" />
                  </div>
                </div>

                {/* Statistics Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-150 p-4 rounded-2xl flex items-center gap-3">
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                      <Flame className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Daily Streak</div>
                      <div className="text-base font-extrabold text-gray-800">1 Day</div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-150 p-4 rounded-2xl flex items-center gap-3">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Study Target</div>
                      <div className="text-sm font-extrabold text-gray-800">{getTargetLabel(data.learningPreferences.dailyLearningTime)}</div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-150 p-4 rounded-2xl flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                      <BookMarked className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase font-sans">Active Subject</div>
                      <div className="text-xs font-bold text-gray-700 truncate max-w-[120px]">{personalSubjects[0]}</div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-150 p-4 rounded-2xl flex items-center gap-3">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase font-sans">Level</div>
                      <div className="text-xs font-extrabold text-gray-800">Level 1 - Novice</div>
                    </div>
                  </div>
                </div>

                {/* Interactive Dynamic Layout Based On Selected Role */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Role Details Card */}
                  <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-sm space-y-4 md:col-span-2">
                    <h3 className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5 uppercase">
                      <Activity className="w-4 h-4 text-indigo-600" />
                      <span>Role Actions & Configuration</span>
                    </h3>

                    {/* STUDENT VIEW */}
                    {data.role === UserRole.STUDENT && (
                      <div className="space-y-4 leading-relaxed">
                        <div className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-gray-800">Academic Registration Card</p>
                            <p className="text-[10px] text-gray-400">School: {data.studentInfo.schoolCollegeName}</p>
                            <p className="text-[10px] text-gray-400">Grade: {data.studentInfo.gradeClass || 'N/A'}</p>
                          </div>
                          <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold">
                            {data.studentInfo.currentAcademicLevel}
                          </span>
                        </div>

                        <div className="space-y-2.5 text-xs">
                          <p className="font-bold text-gray-700">What's Next For You:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center gap-2">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-[11px] text-gray-700 font-medium">Verify class registry</span>
                            </div>
                            <div className="p-2.5 bg-amber-50/50 border border-amber-100 rounded-xl flex items-center gap-2">
                              <Play className="w-3.5 h-3.5 text-amber-600" />
                              <span className="text-[11px] text-gray-700 font-medium">Start orientation module</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TEACHER VIEW */}
                    {data.role === UserRole.TEACHER && (
                      <div className="space-y-4 text-xs leading-relaxed">
                        <div className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-800">Assigned Campus Directory</p>
                            <p className="text-[10px] text-gray-400">Institution: {data.teacherInfo.institutionName}</p>
                            <p className="text-[10px] text-gray-400">Registered Level: {data.teacherInfo.qualification}</p>
                          </div>
                          <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold">
                            {data.teacherInfo.teachingExperience} Exp
                          </span>
                        </div>

                        <div className="space-y-2">
                          <p className="font-bold text-gray-700">Educator Portal Quicklinks:</p>
                          <div className="grid grid-cols-2 gap-2">
                            <button className="p-2.5 border rounded-xl hover:bg-gray-50 text-left font-semibold">
                              📝 Create Assignment
                            </button>
                            <button className="p-2.5 border rounded-xl hover:bg-gray-50 text-left font-semibold">
                              📹 Stream Live Event
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PARENT VIEW */}
                    {data.role === UserRole.PARENT && (
                      <div className="space-y-4 text-xs leading-relaxed">
                        <div className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-800">Child Progress Tracker</p>
                            <p className="text-[10px] text-gray-400">Total Children Linked: {data.parentInfo.numberOfChildren}</p>
                            <p className="text-[10px] text-gray-400">Target Grade: {data.parentInfo.childGrade}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="font-bold text-gray-700">Specified Learning Goals:</p>
                          <div className="p-3 bg-indigo-50/20 border border-indigo-100 rounded-xl text-[11px] text-gray-600 italic">
                            "{data.parentInfo.learningGoals}"
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ADMIN VIEW */}
                    {data.role === UserRole.ADMINISTRATOR && (
                      <div className="space-y-4 text-xs leading-relaxed">
                        <div className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-800">Govern Administrative Node</p>
                            <p className="text-[10px] text-gray-400">Institution: {data.adminInfo.institutionName}</p>
                            <p className="text-[10px] text-gray-400">Department: {data.adminInfo.department} / {data.adminInfo.roleTitle}</p>
                          </div>
                          <span className="px-2.5 py-1 bg-purple-50 border border-purple-100 text-purple-700 rounded-lg text-[10px] font-bold uppercase">
                            {data.adminInfo.accessLevel} Mode
                          </span>
                        </div>

                        <div className="space-y-2">
                          <p className="font-bold text-gray-700">Authorized Actions:</p>
                          <div className="grid grid-cols-2 gap-2">
                            <button className="p-2.5 border rounded-xl hover:bg-gray-50 text-left font-bold text-purple-700">
                              🛡️ System Access Controls
                            </button>
                            <button className="p-2.5 border rounded-xl hover:bg-gray-50 text-left font-semibold">
                              📊 Platform Audit Log
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Study Material Panel */}
                  <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-extrabold text-gray-800 uppercase flex items-center gap-1.5 mb-2">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        <span>Style Preferences</span>
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {data.learningPreferences.preferences.map((style) => (
                          <span key={style} className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase font-bold">
                            {style}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-left text-xs">
                        <p className="font-bold text-gray-800">Adaptive AI Recommendation</p>
                        <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                          We recommend starting with {data.learningPreferences.preferences[0] || 'video'} path on {personalSubjects[0]} for <strong>{data.learningPreferences.dailyLearningTime === '15m' ? '15 minutes' : '30 minutes'}</strong> today.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'courses' && (
              <motion.div
                key="courses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm"
              >
                <div className="mb-4">
                  <h3 className="text-base font-bold text-gray-800">Your Tailored Study Pathways</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Below are modules curated automatically based on onboarding input.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personalSubjects.map((sub, index) => (
                    <div key={index} className="p-4 border rounded-xl bg-gray-50/50 hover:bg-indigo-50/10 transition-colors flex flex-col justify-between h-[150px]">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-full">
                            Module {index + 1}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-medium">Ready to begin</span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-800 mt-1.5">{sub}</h4>
                        <p className="text-[10px] text-gray-400 mt-1">Foundational principles and advanced custom questions with solutions.</p>
                      </div>

                      <div className="flex items-center justify-between text-xs mt-3 select-none">
                        <span className="text-[10px] text-gray-400">Language: {data.learningPreferences.preferredLanguage}</span>
                        <button className="flex items-center gap-1 bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] hover:bg-indigo-700 transition-all">
                          <Play className="w-3 h-3 fill-white" />
                          <span>Launch</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'quizzes' && (
              <motion.div
                key="quizzes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-6"
              >
                <div>
                  <h3 className="text-base font-bold text-gray-800">Adaptive Mini Knowledge Check</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Let's check your learning styles awareness. Respond to the questions below.</p>
                </div>

                <div className="space-y-4">
                  {mockQuestions.map((item, idx) => (
                    <div key={item.id} className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 space-y-3">
                      <p className="text-xs font-bold text-gray-800">
                        {idx + 1}. {item.q}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.options.map((opt) => {
                          const isSelected = selectedAnswers[item.id] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setSelectedAnswers({ ...selectedAnswers, [item.id]: opt })}
                              className={`py-2 px-3 border rounded-lg text-left text-xs font-medium cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t flex justify-between items-center">
                  <div>
                    {quizScore !== null && (
                      <p className="text-sm font-extrabold text-emerald-600 flex items-center gap-1">
                        <Award className="w-4.5 h-4.5" />
                        <span>Your Score: {quizScore} / {mockQuestions.length}</span>
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(selectedAnswers).length < mockQuestions.length}
                    className="px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                  >
                    Submit Answers
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-5"
              >
                <div>
                  <h3 className="text-base font-bold text-gray-800">Settings & Security</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Verify your communication channels and critical authorization metrics.</p>
                </div>

                <div className="space-y-3.5">
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Security Consent status</p>
                      <p className="text-[10px] text-gray-400">Accepted terms of service and standard legal disclosures.</p>
                    </div>
                    <span className="text-emerald-600 font-extrabold text-xs flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Compliant</span>
                    </span>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                    <p className="text-xs font-bold text-gray-800">Alerts Toggled</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                      <div>📧 Email Reports: <strong className={data.notifications.emailNotifications ? 'text-emerald-600':'text-gray-400'}>{data.notifications.emailNotifications ? 'ON' : 'OFF'}</strong></div>
                      <div>💬 SMS Alerts: <strong className={data.notifications.smsAlerts ? 'text-emerald-600':'text-gray-400'}>{data.notifications.smsAlerts ? 'ON' : 'OFF'}</strong></div>
                      <div>🔔 Push Notifications: <strong className={data.notifications.pushNotifications ? 'text-emerald-600':'text-gray-400'}>{data.notifications.pushNotifications ? 'ON' : 'OFF'}</strong></div>
                      <div>📊 Weekly Analytics: <strong className={data.notifications.weeklyReports ? 'text-emerald-600':'text-gray-400'}>{data.notifications.weeklyReports ? 'ON' : 'OFF'}</strong></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
