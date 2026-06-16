export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  PARENT = 'parent',
  ADMINISTRATOR = 'administrator',
}

export interface StudentInfo {
  gradeClass: string;
  schoolCollegeName: string;
  preferredSubjects: string[];
  currentAcademicLevel: string;
}

export interface TeacherInfo {
  institutionName: string;
  teachingExperience: string;
  subjectsTaught: string[];
  qualification: string;
}

export interface ParentInfo {
  childGrade: string;
  numberOfChildren: number;
  learningGoals: string;
}

export interface AdminInfo {
  department: string;
  roleTitle: string;
  institutionName: string;
  accessLevel: 'full' | 'restricted' | 'read-only';
}

export type LearningPreferenceType =
  | 'video'
  | 'live'
  | 'quizzes'
  | 'assignments'
  | 'interactive'
  | 'reading';

export interface LearningPreferences {
  preferences: LearningPreferenceType[];
  dailyLearningTime: string;
  preferredLanguage: string;
  customGoals: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsAlerts: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
}

export interface ConsentSettings {
  acceptTerms: boolean;
  privacyPolicy: boolean;
  marketingOptIn: boolean;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  profilePic: string; // Base64 or standard avatar URL
}

export interface OnboardingData {
  step: number;
  personalInfo: PersonalInfo;
  role: UserRole | null;
  studentInfo: StudentInfo;
  teacherInfo: TeacherInfo;
  parentInfo: ParentInfo;
  adminInfo: AdminInfo;
  learningPreferences: LearningPreferences;
  notifications: NotificationSettings;
  consent: ConsentSettings;
  completed: boolean;
}

export const INITIAL_ONBOARDING_DATA: OnboardingData = {
  step: 1,
  personalInfo: {
    fullName: '',
    email: '',
    mobile: '',
    dateOfBirth: '',
    gender: '',
    country: '',
    profilePic: '',
  },
  role: null,
  studentInfo: {
    gradeClass: '',
    schoolCollegeName: '',
    preferredSubjects: [],
    currentAcademicLevel: '',
  },
  teacherInfo: {
    institutionName: '',
    teachingExperience: '',
    subjectsTaught: [],
    qualification: '',
  },
  parentInfo: {
    childGrade: '',
    numberOfChildren: 1,
    learningGoals: '',
  },
  adminInfo: {
    department: '',
    roleTitle: '',
    institutionName: '',
    accessLevel: 'full',
  },
  learningPreferences: {
    preferences: [],
    dailyLearningTime: '30m',
    preferredLanguage: 'English',
    customGoals: '',
  },
  notifications: {
    emailNotifications: true,
    smsAlerts: false,
    pushNotifications: true,
    weeklyReports: true,
  },
  consent: {
    acceptTerms: false,
    privacyPolicy: false,
    marketingOptIn: false,
  },
  completed: false,
};

export const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'India',
  'Japan',
  'Singapore',
  'Brazil',
  'South Africa',
  'South Korea',
  'New Zealand',
  'Ireland',
  'Switzerland',
  'Netherlands',
];

export const SUBJECT_OPTIONS = [
  'Mathematics',
  'Science (Physics/Chemistry/Biology)',
  'English Literature',
  'Computer Science',
  'World History',
  'Art & Creative Design',
  'Business & Economics',
  'Music Theory',
  'Foreign Languages',
  'Environmental Science',
];

export const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200', // Female student
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200', // Male student / teacher
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200', // Professional woman
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200', // Young man
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200', // Playful student
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200', // Senior educator / parent
];
