import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl) {
  console.warn('Warning: SUPABASE_URL environment variable is not defined.');
}
if (!supabaseServiceKey) {
  console.warn('Warning: SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY environment variable is not defined.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Health check endpoint
app.get('/api/health', async (_req, res) => {
  try {
    const start = performance.now();
    // Test connection with a simple query to profiles
    const { error } = await supabase.from('profiles').select('id').limit(1);
    
    // Note: Table not found error still means connection to Supabase worked, so handle gracefully.
    const isConnected = !error || error.code !== 'PGRST301'; // PGRST301 is JWT/Auth error or connection issue
    
    res.status(200).json({
      status: 'healthy',
      database: isConnected ? 'connected' : 'disconnected',
      latencyMs: Math.round(performance.now() - start),
      dbError: error ? { message: error.message, code: error.code } : null
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'error',
      details: err.message || 'Database connection failure'
    });
  }
});

// POST endpoint to save onboarding results
app.post('/api/onboarding', async (req, res) => {
  const data = req.body;
  
  if (!data || !data.personalInfo || !data.personalInfo.email) {
    return res.status(400).json({ error: 'Invalid onboarding payload. Email is required.' });
  }

  try {
    const email = data.personalInfo.email;
    const fullName = data.personalInfo.fullName || 'Anonymous';
    
    // Resolve UUID for this user (either find existing or generate deterministic placeholder)
    let userId: string;
    const { data: existingProfile, error: selectError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is multiple rows or query format issues
      throw selectError;
    }

    if (existingProfile) {
      userId = existingProfile.id;
    } else {
      // Generate v4-style pseudo-random UUID
      userId = '11111111-2222-3333-4444-' + Math.random().toString(16).substring(2, 14).padStart(12, '0');
    }

    // 1. Save Profile Table
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: fullName,
        email: email,
        mobile: data.personalInfo.mobile || null,
        country: data.personalInfo.country || null,
        date_of_birth: data.personalInfo.dateOfBirth || null,
        gender: data.personalInfo.gender || null,
        profile_pic: data.personalInfo.profilePic || null
      });

    if (profileError) throw profileError;

    // 2. Save Role details Table
    const roleDetails = 
      data.role === 'student' ? data.studentInfo.currentAcademicLevel :
      data.role === 'teacher' ? data.teacherInfo.qualification :
      data.role === 'administrator' ? data.adminInfo.accessLevel : 'N/A';
      
    const institutionDetails = 
      data.role === 'student' ? data.studentInfo.schoolCollegeName :
      data.role === 'teacher' ? data.teacherInfo.institutionName :
      data.role === 'administrator' ? data.adminInfo.institutionName : 'N/A';

    const rolePayload: any = {
      profile_id: userId,
      role_name: data.role || 'student',
      academic_level: roleDetails || null,
      institution: institutionDetails || null,
      status: 'pending'
    };

    if (data.role === 'administrator') {
      rolePayload.department = data.adminInfo.department || null;
      rolePayload.role_title = data.adminInfo.roleTitle || null;
      rolePayload.access_level = data.adminInfo.accessLevel || null;
    } else if (data.role === 'student') {
      rolePayload.grade_class = data.studentInfo.gradeClass || null;
      rolePayload.preferred_subjects = data.studentInfo.preferredSubjects?.join(',') || null;
    } else if (data.role === 'teacher') {
      rolePayload.teaching_experience = data.teacherInfo.teachingExperience || null;
      rolePayload.subjects_taught = data.teacherInfo.subjectsTaught?.join(',') || null;
    } else if (data.role === 'parent') {
      rolePayload.child_grade = data.parentInfo.childGrade || null;
      rolePayload.number_of_children = data.parentInfo.numberOfChildren || null;
      rolePayload.learning_goals = data.parentInfo.learningGoals || null;
    }

    let { error: roleError } = await supabase
      .from('roles')
      .upsert(rolePayload, { onConflict: 'profile_id' });

    if (roleError) {
      if (roleError.code === '42703') {
        console.warn('Database does not have the updated schema yet. Falling back to basic role details update.');
        const legacyPayload = {
          profile_id: userId,
          role_name: data.role || 'student',
          academic_level: roleDetails || null,
          institution: institutionDetails || null
        };
        const fallbackResult = await supabase
          .from('roles')
          .upsert(legacyPayload, { onConflict: 'profile_id' });
        roleError = fallbackResult.error;
      }
    }

    if (roleError) throw roleError;

    // 3. Save Preferences details Table
    const { error: prefError } = await supabase
      .from('preferences')
      .upsert({
        profile_id: userId,
        daily_learning_time: data.learningPreferences?.dailyLearningTime || '30m',
        preferred_language: data.learningPreferences?.preferredLanguage || 'English',
        preferences_list: data.learningPreferences?.preferences?.join(',') || '',
        custom_goals: data.learningPreferences?.customGoals || null
      }, { onConflict: 'profile_id' });

    if (prefError) {
      const { error: insertError } = await supabase
        .from('preferences')
        .insert({
          profile_id: userId,
          daily_learning_time: data.learningPreferences?.dailyLearningTime || '30m',
          preferred_language: data.learningPreferences?.preferredLanguage || 'English',
          preferences_list: data.learningPreferences?.preferences?.join(',') || '',
          custom_goals: data.learningPreferences?.customGoals || null
        });
      if (insertError) throw insertError;
    }

    // 4. Save Notifications details Table
    const { error: notifError } = await supabase
      .from('notifications')
      .upsert({
        profile_id: userId,
        email_enabled: data.notifications?.emailNotifications ?? true,
        sms_enabled: data.notifications?.smsAlerts ?? false,
        push_enabled: data.notifications?.pushNotifications ?? true,
        weekly_enabled: data.notifications?.weeklyReports ?? true
      }, { onConflict: 'profile_id' });

    if (notifError) {
      const { error: insertError } = await supabase
        .from('notifications')
        .insert({
          profile_id: userId,
          email_enabled: data.notifications?.emailNotifications ?? true,
          sms_enabled: data.notifications?.smsAlerts ?? false,
          push_enabled: data.notifications?.pushNotifications ?? true,
          weekly_enabled: data.notifications?.weeklyReports ?? true
        });
      if (insertError) throw insertError;
    }

    res.status(200).json({
      success: true,
      message: 'Onboarding transaction completed successfully',
      userId
    });

  } catch (err: any) {
    console.error('Server error during onboarding save:', err);
    res.status(500).json({
      error: 'Backend transactions failed',
      details: err.message || 'Unknown database exception'
    });
  }
});

// GET endpoint to recover onboarding state by email
app.get('/api/onboarding/:email', async (req, res) => {
  const email = req.params.email;
  
  if (!email) {
    return res.status(400).json({ error: 'Email parameter is required.' });
  }

  try {
    // Select profile record
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) throw profileError;
    if (!profile) {
      return res.status(404).json({ error: `No profile registered with email ${email}.` });
    }

    // Load related tables
    const [roleRes, prefRes, notifRes] = await Promise.all([
      supabase.from('roles').select('*').eq('profile_id', profile.id).maybeSingle(),
      supabase.from('preferences').select('*').eq('profile_id', profile.id).maybeSingle(),
      supabase.from('notifications').select('*').eq('profile_id', profile.id).maybeSingle()
    ]);

    if (roleRes.error) throw roleRes.error;
    if (prefRes.error) throw prefRes.error;
    if (notifRes.error) throw notifRes.error;

    // Structure output matching OnboardingData interface
    const reconstructed = {
      personalInfo: {
        fullName: profile.full_name,
        email: profile.email,
        mobile: profile.mobile || '',
        dateOfBirth: profile.date_of_birth || '',
        gender: profile.gender || '',
        country: profile.country || '',
        profilePic: profile.profile_pic || ''
      },
      role: roleRes.data?.role_name || null,
      status: roleRes.data?.status || 'pending',
      studentInfo: {
        gradeClass: roleRes.data?.grade_class || (roleRes.data?.role_name === 'student' ? roleRes.data.academic_level : ''),
        schoolCollegeName: roleRes.data?.role_name === 'student' ? roleRes.data.institution : '',
        preferredSubjects: roleRes.data?.preferred_subjects ? roleRes.data.preferred_subjects.split(',') : [],
        currentAcademicLevel: roleRes.data?.role_name === 'student' ? roleRes.data.academic_level : ''
      },
      teacherInfo: {
        institutionName: roleRes.data?.role_name === 'teacher' ? roleRes.data.institution : '',
        teachingExperience: roleRes.data?.teaching_experience || '',
        subjectsTaught: roleRes.data?.subjects_taught ? roleRes.data.subjects_taught.split(',') : [],
        qualification: roleRes.data?.role_name === 'teacher' ? roleRes.data.academic_level : ''
      },
      parentInfo: {
        childGrade: roleRes.data?.child_grade || '',
        numberOfChildren: roleRes.data?.number_of_children ?? 1,
        learningGoals: roleRes.data?.learning_goals || ''
      },
      adminInfo: {
        department: roleRes.data?.department || '',
        roleTitle: roleRes.data?.role_title || '',
        institutionName: roleRes.data?.role_name === 'administrator' ? roleRes.data.institution : '',
        accessLevel: roleRes.data?.access_level || (roleRes.data?.role_name === 'administrator' ? roleRes.data.academic_level : 'full')
      },
      learningPreferences: {
        preferences: prefRes.data?.preferences_list ? prefRes.data.preferences_list.split(',') : [],
        dailyLearningTime: prefRes.data?.daily_learning_time || '30m',
        preferredLanguage: prefRes.data?.preferred_language || 'English',
        customGoals: prefRes.data?.custom_goals || ''
      },
      notifications: {
        emailNotifications: notifRes.data?.email_enabled ?? true,
        smsAlerts: notifRes.data?.sms_enabled ?? false,
        pushNotifications: notifRes.data?.push_enabled ?? true,
        weeklyReports: notifRes.data?.weekly_enabled ?? true
      },
      completed: true
    };

    res.status(200).json(reconstructed);

  } catch (err: any) {
    console.error('Server error during onboarding read:', err);
    res.status(500).json({
      error: 'Backend lookup failed',
      details: err.message || 'Unknown database exception'
    });
  }
});

// Admin login authentication endpoint
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // 1. Try master credential check
    if (email === 'admin@eduquest.com' && password === 'admin123') {
      return res.status(200).json({
        success: true,
        token: 'master-admin-token',
        user: { email, fullName: 'System Admin', role: 'administrator' }
      });
    }

    // 2. Try looking up in database profiles & roles
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('email', email)
      .maybeSingle();

    if (profileErr) throw profileErr;
    if (!profile) {
      return res.status(401).json({ error: 'Invalid credentials or unauthorized account.' });
    }

    const { data: role, error: roleErr } = await supabase
      .from('roles')
      .select('role_name')
      .eq('profile_id', profile.id)
      .maybeSingle();

    if (roleErr) throw roleErr;

    // Standard credential fallback check: if role is administrator, allow password 'admin123'
    if (role && role.role_name === 'administrator' && password === 'admin123') {
      return res.status(200).json({
        success: true,
        token: `token-${profile.id}`,
        user: { email: profile.email, fullName: profile.full_name, role: 'administrator' }
      });
    }

    return res.status(401).json({ error: 'Invalid credentials or unauthorized administrative role.' });

  } catch (err: any) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Server authentication exception', details: err.message });
  }
});

// GET endpoint to fetch all registered users for administration dashboard
app.get('/api/admin/onboarding', async (_req, res) => {
  try {
    const { data: profiles, error: profilesErr } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesErr) throw profilesErr;

    const [rolesRes, prefsRes, notifsRes] = await Promise.all([
      supabase.from('roles').select('*'),
      supabase.from('preferences').select('*'),
      supabase.from('notifications').select('*')
    ]);

    if (rolesRes.error) throw rolesRes.error;
    if (prefsRes.error) throw prefsRes.error;
    if (notifsRes.error) throw notifsRes.error;

    const onboardingRecords = profiles.map((profile) => {
      const roleRow = rolesRes.data?.find((r) => r.profile_id === profile.id);
      const prefRow = prefsRes.data?.find((p) => p.profile_id === profile.id);
      const notifRow = notifsRes.data?.find((n) => n.profile_id === profile.id);

      return {
        id: profile.id,
        personalInfo: {
          fullName: profile.full_name,
          email: profile.email,
          mobile: profile.mobile || '',
          dateOfBirth: profile.date_of_birth || '',
          gender: profile.gender || '',
          country: profile.country || '',
          profilePic: profile.profile_pic || ''
        },
        role: roleRow?.role_name || null,
        status: roleRow?.status || 'pending',
        studentInfo: {
          gradeClass: roleRow?.grade_class || (roleRow?.role_name === 'student' ? roleRow.academic_level : ''),
          schoolCollegeName: roleRow?.role_name === 'student' ? roleRow.institution : '',
          preferredSubjects: roleRow?.preferred_subjects ? roleRow.preferred_subjects.split(',') : [],
          currentAcademicLevel: roleRow?.role_name === 'student' ? roleRow.academic_level : ''
        },
        teacherInfo: {
          institutionName: roleRow?.role_name === 'teacher' ? roleRow.institution : '',
          teachingExperience: roleRow?.teaching_experience || '',
          subjectsTaught: roleRow?.subjects_taught ? roleRow.subjects_taught.split(',') : [],
          qualification: roleRow?.role_name === 'teacher' ? roleRow.academic_level : ''
        },
        parentInfo: {
          childGrade: roleRow?.child_grade || '',
          numberOfChildren: roleRow?.number_of_children ?? 1,
          learningGoals: roleRow?.learning_goals || ''
        },
        adminInfo: {
          department: roleRow?.department || '',
          roleTitle: roleRow?.role_title || '',
          institutionName: roleRow?.role_name === 'administrator' ? roleRow.institution : '',
          accessLevel: roleRow?.access_level || (roleRow?.role_name === 'administrator' ? roleRow.academic_level : 'full')
        },
        learningPreferences: {
          preferences: prefRow?.preferences_list ? prefRow.preferences_list.split(',') : [],
          dailyLearningTime: prefRow?.daily_learning_time || '30m',
          preferredLanguage: prefRow?.preferred_language || 'English',
          customGoals: prefRow?.custom_goals || ''
        },
        notifications: {
          emailNotifications: notifRow?.email_enabled ?? true,
          smsAlerts: notifRow?.sms_enabled ?? false,
          pushNotifications: notifRow?.push_enabled ?? true,
          weeklyReports: notifRow?.weekly_enabled ?? true
        },
        completed: true,
        createdAt: profile.created_at
      };
    });

    res.status(200).json(onboardingRecords);

  } catch (err: any) {
    console.error('Error fetching onboarding records:', err);
    res.status(500).json({ error: 'Failed to retrieve onboarding profiles', details: err.message });
  }
});

// PUT endpoint to update user status/details inside admin portal
app.put('/api/admin/onboarding/:profileId', async (req, res) => {
  const profileId = req.params.profileId;
  const updateData = req.body;

  if (!profileId || !updateData) {
    return res.status(400).json({ error: 'Profile ID and update fields are required.' });
  }

  try {
    if (updateData.personalInfo) {
      const p = updateData.personalInfo;
      const { error: pErr } = await supabase
        .from('profiles')
        .update({
          full_name: p.fullName,
          mobile: p.mobile || null,
          date_of_birth: p.dateOfBirth || null,
          gender: p.gender || null,
          country: p.country || null,
          profile_pic: p.profilePic || null
        })
        .eq('id', profileId);

      if (pErr) throw pErr;
    }

    const { data: currentRoleRow, error: roleGetErr } = await supabase
      .from('roles')
      .select('*')
      .eq('profile_id', profileId)
      .maybeSingle();

    if (roleGetErr) throw roleGetErr;

    if (currentRoleRow) {
      const roleName = updateData.role || currentRoleRow.role_name;
      
      const roleDetails = 
        roleName === 'student' ? updateData.studentInfo?.currentAcademicLevel :
        roleName === 'teacher' ? updateData.teacherInfo?.qualification :
        roleName === 'administrator' ? updateData.adminInfo?.accessLevel : 'N/A';
        
      const institutionDetails = 
        roleName === 'student' ? updateData.studentInfo?.schoolCollegeName :
        roleName === 'teacher' ? updateData.teacherInfo?.institutionName :
        roleName === 'administrator' ? updateData.adminInfo?.institutionName : 'N/A';

      const updatePayload: any = {
        role_name: roleName,
        academic_level: roleDetails || currentRoleRow.academic_level,
        institution: institutionDetails || currentRoleRow.institution,
        status: updateData.status || currentRoleRow.status || 'pending'
      };

      if (roleName === 'administrator' && updateData.adminInfo) {
        updatePayload.department = updateData.adminInfo.department || null;
        updatePayload.role_title = updateData.adminInfo.roleTitle || null;
        updatePayload.access_level = updateData.adminInfo.accessLevel || null;
      } else if (roleName === 'student' && updateData.studentInfo) {
        updatePayload.grade_class = updateData.studentInfo.gradeClass || null;
        updatePayload.preferred_subjects = updateData.studentInfo.preferredSubjects?.join(',') || null;
      } else if (roleName === 'teacher' && updateData.teacherInfo) {
        updatePayload.teaching_experience = updateData.teacherInfo.teachingExperience || null;
        updatePayload.subjects_taught = updateData.teacherInfo.subjectsTaught?.join(',') || null;
      } else if (roleName === 'parent' && updateData.parentInfo) {
        updatePayload.child_grade = updateData.parentInfo.childGrade || null;
        updatePayload.number_of_children = updateData.parentInfo.numberOfChildren || null;
        updatePayload.learning_goals = updateData.parentInfo.learningGoals || null;
      }

      const { error: rErr } = await supabase
        .from('roles')
        .update(updatePayload)
        .eq('profile_id', profileId);

      if (rErr) {
        if (rErr.code === '42703') {
          console.warn('Falling back to basic role details update (legacy columns only).');
          const legacyPayload = {
            role_name: roleName,
            academic_level: roleDetails || currentRoleRow.academic_level,
            institution: institutionDetails || currentRoleRow.institution,
            status: updateData.status || currentRoleRow.status || 'pending'
          };
          const { error: fbErr } = await supabase
            .from('roles')
            .update(legacyPayload)
            .eq('profile_id', profileId);
          if (fbErr) throw fbErr;
        } else {
          throw rErr;
        }
      }
    }

    res.status(200).json({ success: true, message: 'Profile details updated successfully.' });

  } catch (err: any) {
    console.error(`Error updating profile ${profileId}:`, err);
    res.status(500).json({ error: 'Failed to update user profile', details: err.message });
  }
});

// DELETE endpoint to remove onboarding registration from the database
app.delete('/api/admin/onboarding/:profileId', async (req, res) => {
  const profileId = req.params.profileId;
  if (!profileId) {
    return res.status(400).json({ error: 'Profile ID is required.' });
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', profileId);

    if (error) throw error;

    res.status(200).json({ success: true, message: 'Profile deleted successfully.' });

  } catch (err: any) {
    console.error(`Error deleting profile ${profileId}:`, err);
    res.status(500).json({ error: 'Failed to delete user profile', details: err.message });
  }
});

// Export the app for serverless/Vercel support
export default app;

// Start the server listener
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend server successfully listening on port ${PORT}`);
  });
}
