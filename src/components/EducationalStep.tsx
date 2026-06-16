import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserRole, StudentInfo, TeacherInfo, ParentInfo, AdminInfo, SUBJECT_OPTIONS } from '../types';
import { Book, Plus, Minus, School, Award, Briefcase, UserCheck } from 'lucide-react';

interface EducationalStepProps {
  role: UserRole | null;
  studentData: StudentInfo;
  teacherData: TeacherInfo;
  parentData: ParentInfo;
  adminData: AdminInfo;
  onChangeStudent: (data: Partial<StudentInfo>) => void;
  onChangeTeacher: (data: Partial<TeacherInfo>) => void;
  onChangeParent: (data: Partial<ParentInfo>) => void;
  onChangeAdmin: (data: Partial<AdminInfo>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function EducationalStep({
  role,
  studentData,
  teacherData,
  parentData,
  adminData,
  onChangeStudent,
  onChangeTeacher,
  onChangeParent,
  onChangeAdmin,
  onNext,
  onBack,
}: EducationalStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (role === UserRole.STUDENT) {
      if (!studentData.schoolCollegeName || studentData.schoolCollegeName.trim().length < 2) {
        newErrors.schoolCollegeName = 'Please enter a valid school/college name.';
      }
      if (!studentData.gradeClass) {
        newErrors.gradeClass = 'Please enter your grade or class (e.g. Grade 11, Sophomore).';
      }
      if (studentData.preferredSubjects.length === 0) {
        newErrors.preferredSubjects = 'Please select at least one preferred subject.';
      }
      if (!studentData.currentAcademicLevel) {
        newErrors.currentAcademicLevel = 'Please select your current academic level.';
      }
    } else if (role === UserRole.TEACHER) {
      if (!teacherData.institutionName || teacherData.institutionName.trim().length < 2) {
        newErrors.institutionName = 'Please enter a valid institution name.';
      }
      if (!teacherData.teachingExperience) {
        newErrors.teachingExperience = 'Please select teaching experience years.';
      }
      if (teacherData.subjectsTaught.length === 0) {
        newErrors.subjectsTaught = 'Please select at least one subject taught.';
      }
      if (!teacherData.qualification) {
        newErrors.qualification = 'Please select your qualification.';
      }
    } else if (role === UserRole.PARENT) {
      if (!parentData.childGrade) {
        newErrors.childGrade = "Please specify your child's grade level.";
      }
      if (!parentData.learningGoals || parentData.learningGoals.trim().length < 5) {
        newErrors.learningGoals = 'Please write a brief description of learning goals.';
      }
    } else if (role === UserRole.ADMINISTRATOR) {
      if (!adminData.institutionName || adminData.institutionName.trim().length < 2) {
        newErrors.institutionName = 'Please enter your institution name.';
      }
      if (!adminData.department) {
        newErrors.department = 'Please specify your department (e.g. Registrar, IT).';
      }
      if (!adminData.roleTitle) {
        newErrors.roleTitle = 'Please specify your role title.';
      }
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

  const toggleSubject = (subject: string, type: 'student' | 'teacher') => {
    if (type === 'student') {
      const current = studentData.preferredSubjects;
      if (current.includes(subject)) {
        onChangeStudent({ preferredSubjects: current.filter((s) => s !== subject) });
      } else {
        onChangeStudent({ preferredSubjects: [...current, subject] });
      }
    } else {
      const current = teacherData.subjectsTaught;
      if (current.includes(subject)) {
        onChangeTeacher({ subjectsTaught: current.filter((s) => s !== subject) });
      } else {
        onChangeTeacher({ subjectsTaught: [...current, subject] });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
      id="educational-step"
    >
      <div className="text-center md:text-left mb-6">
        <h2 className="text-xl font-bold text-gray-900">Educational Information</h2>
        <p className="text-xs text-gray-500 mt-1">
          Customize your dashboard filters by sharing your background details as a <span className="text-indigo-600 font-semibold capitalize">{role || 'user'}</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STUDENT SECTION */}
        {role === UserRole.STUDENT && (
          <div className="space-y-4" id="student-subform">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-700 mb-1">School / College Name *</label>
                <div className="relative">
                  <School className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={studentData.schoolCollegeName}
                    onChange={(e) => onChangeStudent({ schoolCollegeName: e.target.value })}
                    placeholder="Warton High or MIT"
                    className={`w-full pl-10 pr-3 py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                      errors.schoolCollegeName ? 'border-red-400' : 'border-gray-200 focus:border-blue-500'
                    }`}
                    id="input-schoolCollegeName"
                  />
                </div>
                {errors.schoolCollegeName && <span className="text-[10px] text-red-500 mt-1">{errors.schoolCollegeName}</span>}
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-700 mb-1">Grade or Year *</label>
                <input
                  type="text"
                  value={studentData.gradeClass}
                  onChange={(e) => onChangeStudent({ gradeClass: e.target.value })}
                  placeholder="e.g. Sophmore, 12th Grade"
                  className={`w-full px-3.5 py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                    errors.gradeClass ? 'border-red-400' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  id="input-gradeClass"
                />
                {errors.gradeClass && <span className="text-[10px] text-red-500 mt-1">{errors.gradeClass}</span>}
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="text-xs font-bold text-gray-700 mb-1">Academic Level *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Middle School', 'High School', 'Undergraduate', 'Postgraduate'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => onChangeStudent({ currentAcademicLevel: level })}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                        studentData.currentAcademicLevel === level
                          ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                {errors.currentAcademicLevel && <span className="text-[10px] text-red-500 mt-1">{errors.currentAcademicLevel}</span>}
              </div>
            </div>

            {/* PREFERRED SUBJECTS (MULTI-PILL) */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-700 mb-2">Preferred Study Subjects (Select many) *</label>
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100 max-h-[160px] overflow-y-auto">
                {SUBJECT_OPTIONS.map((sub) => {
                  const isChecked = studentData.preferredSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSubject(sub, 'student')}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                        isChecked
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-sm'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Book className="w-3 h-3" />
                      <span>{sub}</span>
                    </button>
                  );
                })}
              </div>
              {errors.preferredSubjects && <span className="text-[10px] text-red-500 mt-1">{errors.preferredSubjects}</span>}
            </div>
          </div>
        )}

        {/* TEACHER SECTION */}
        {role === UserRole.TEACHER && (
          <div className="space-y-4" id="teacher-subform">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-700 mb-1">School / Institute Name *</label>
                <div className="relative">
                  <School className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={teacherData.institutionName}
                    onChange={(e) => onChangeTeacher({ institutionName: e.target.value })}
                    placeholder="e.g. Stanford University"
                    className={`w-full pl-10 pr-3 py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                      errors.institutionName ? 'border-red-400' : 'border-gray-200 focus:border-blue-500'
                    }`}
                    id="input-institutionName"
                  />
                </div>
                {errors.institutionName && <span className="text-[10px] text-red-500 mt-1">{errors.institutionName}</span>}
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-700 mb-1">Primary Qualification *</label>
                <div className="relative">
                  <Award className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <select
                    value={teacherData.qualification}
                    onChange={(e) => onChangeTeacher({ qualification: e.target.value })}
                    className={`w-full pl-10 pr-3 py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none ${
                      errors.qualification ? 'border-red-400' : 'border-gray-200 focus:border-blue-500'
                    }`}
                    id="input-qualification"
                  >
                    <option value="">Select Qualification...</option>
                    <option value="Bachelor's">Bachelor's Degree</option>
                    <option value="Master's">Master's Degree</option>
                    <option value="Ph.D.">Doctoral / Ph.D.</option>
                    <option value="Licensed Educator">Licensed Professional Educator</option>
                  </select>
                </div>
                {errors.qualification && <span className="text-[10px] text-red-500 mt-1">{errors.qualification}</span>}
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="text-xs font-bold text-gray-700 mb-1">Teaching Experience *</label>
                <div className="grid grid-cols-4 gap-2">
                  {['1-2 Years', '3-5 Years', '5-10 Years', '10+ Years'].map((exp) => (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => onChangeTeacher({ teachingExperience: exp })}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                        teacherData.teachingExperience === exp
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-200'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-600'
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
                {errors.teachingExperience && <span className="text-[10px] text-red-500 mt-1">{errors.teachingExperience}</span>}
              </div>
            </div>

            {/* SUBJECTS TAUGHT */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-700 mb-2">Subject(s) You Teach *</label>
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                {SUBJECT_OPTIONS.map((sub) => {
                  const isChecked = teacherData.subjectsTaught.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSubject(sub, 'teacher')}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                        isChecked
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-sm'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Award className="w-3 h-3" />
                      <span>{sub}</span>
                    </button>
                  );
                })}
              </div>
              {errors.subjectsTaught && <span className="text-[10px] text-red-500 mt-1">{errors.subjectsTaught}</span>}
            </div>
          </div>
        )}

        {/* PARENT SECTION */}
        {role === UserRole.PARENT && (
          <div className="space-y-4" id="parent-subform">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-700 mb-1">Number of Children *</label>
                <div className="flex items-center gap-4 bg-gray-50 p-2 border border-gray-200 rounded-xl max-w-[160px]">
                  <button
                    type="button"
                    onClick={() => onChangeParent({ numberOfChildren: Math.max(1, parentData.numberOfChildren - 1) })}
                    className="p-1.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-lg shadow-sm transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold text-gray-800 w-8 text-center">{parentData.numberOfChildren}</span>
                  <button
                    type="button"
                    onClick={() => onChangeParent({ numberOfChildren: Math.min(10, parentData.numberOfChildren + 1) })}
                    className="p-1.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-lg shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-700 mb-1">Child's Primary Grade Level *</label>
                <select
                  value={parentData.childGrade}
                  onChange={(e) => onChangeParent({ childGrade: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none ${
                    errors.childGrade ? 'border-red-400' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  id="input-childGrade"
                >
                  <option value="">Select Preschool to Grade 12...</option>
                  <option value="Preschool">Preschool / Kindergarten</option>
                  <option value="Elementary (Grades 1-5)">Elementary School (Grade 1-5)</option>
                  <option value="Middle School (Grades 6-8)">Middle School (Grade 6-8)</option>
                  <option value="High School (Grades 9-12)">High School (Grade 9-12)</option>
                  <option value="College Undergraduate">College Prep / Undergraduate</option>
                </select>
                {errors.childGrade && <span className="text-[10px] text-red-500 mt-1">{errors.childGrade}</span>}
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="text-xs font-bold text-gray-700 mb-1">Custom Learning Goals for Your Children *</label>
                <textarea
                  value={parentData.learningGoals}
                  onChange={(e) => onChangeParent({ learningGoals: e.target.value })}
                  placeholder="Describe your children's target study objectives e.g., 'Enhance coding skills, secure good exam marks in chemistry, make creative projects...'"
                  className={`w-full p-3.5 bg-gray-50/50 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 h-24 resize-none transition-all ${
                    errors.learningGoals ? 'border-red-400' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  id="textarea-learningGoals"
                />
                {errors.learningGoals && <span className="text-[10px] text-red-500 mt-1">{errors.learningGoals}</span>}
              </div>
            </div>
          </div>
        )}

        {/* ADMINISTRATOR SECTION */}
        {role === UserRole.ADMINISTRATOR && (
          <div className="space-y-4" id="admin-subform">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-700 mb-1">Institution Name *</label>
                <div className="relative">
                  <School className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={adminData.institutionName}
                    onChange={(e) => onChangeAdmin({ institutionName: e.target.value })}
                    placeholder="e.g. City Academy Schools"
                    className={`w-full pl-10 pr-3 py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                      errors.institutionName ? 'border-red-400' : 'border-gray-200 focus:border-blue-500'
                    }`}
                    id="input-admin-institution"
                  />
                </div>
                {errors.institutionName && <span className="text-[10px] text-red-500 mt-1">{errors.institutionName}</span>}
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-700 mb-1">Department *</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={adminData.department}
                    onChange={(e) => onChangeAdmin({ department: e.target.value })}
                    placeholder="e.g. Academic Registry"
                    className={`w-full pl-10 pr-3 py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                      errors.department ? 'border-red-400' : 'border-gray-200 focus:border-blue-500'
                    }`}
                    id="input-admin-dept"
                  />
                </div>
                {errors.department && <span className="text-[10px] text-red-500 mt-1">{errors.department}</span>}
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-700 mb-1">Role Title *</label>
                <div className="relative">
                  <UserCheck className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={adminData.roleTitle}
                    onChange={(e) => onChangeAdmin({ roleTitle: e.target.value })}
                    placeholder="e.g. Chief Registrar, Principal, IT Admin"
                    className={`w-full pl-10 pr-3 py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                      errors.roleTitle ? 'border-red-400' : 'border-gray-200 focus:border-blue-500'
                    }`}
                    id="input-admin-roleTitle"
                  />
                </div>
                {errors.roleTitle && <span className="text-[10px] text-red-500 mt-1">{errors.roleTitle}</span>}
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-700 mb-1">Access Authorization Level *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'full', label: 'Full Root' },
                    { id: 'restricted', label: 'Restricted' },
                    { id: 'read-only', label: 'Audit Read' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => onChangeAdmin({ accessLevel: lvl.id as any })}
                      className={`py-2 px-1 text-[11px] font-bold rounded-xl border transition-all ${
                        adminData.accessLevel === lvl.id
                          ? 'bg-purple-100 border-purple-500 text-purple-700 ring-1 ring-purple-200'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-600'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-xs rounded-xl transition-colors"
            id="btn-back-education"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-xs rounded-xl shadow-md transition-all duration-150"
            id="btn-next-education"
          >
            Next Step
          </button>
        </div>
      </form>
    </motion.div>
  );
}
