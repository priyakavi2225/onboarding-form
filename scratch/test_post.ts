// Using native global fetch

const mockPayload = {
  personalInfo: {
    fullName: 'Integration Verification',
    email: 'integration.verify@eduquest.org',
    mobile: '+1 999 888 7777',
    country: 'United States',
    dateOfBirth: '1995-10-10',
    gender: 'Male',
    profilePic: ''
  },
  role: 'student',
  studentInfo: {
    gradeClass: 'Grade 12',
    schoolCollegeName: 'Supabase High',
    preferredSubjects: ['Computer Science', 'Mathematics'],
    currentAcademicLevel: 'High School'
  },
  learningPreferences: {
    preferences: ['interactive', 'video'],
    dailyLearningTime: '1h',
    preferredLanguage: 'English',
    customGoals: 'Learn databases'
  },
  notifications: {
    emailNotifications: true,
    smsAlerts: true,
    pushNotifications: false,
    weeklyReports: true
  }
};

async function testPost() {
  try {
    console.log('Sending mock onboarding POST request to http://localhost:5000/api/onboarding...');
    const response = await fetch('http://localhost:5000/api/onboarding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockPayload),
    });

    const result = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', result);
  } catch (err: any) {
    console.error('Error issuing POST request:', err.message);
  }
}

testPost();
