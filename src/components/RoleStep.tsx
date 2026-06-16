import { motion } from 'motion/react';
import { UserRole } from '../types';
import { GraduationCap, School, Users, ShieldAlert, Check } from 'lucide-react';

interface RoleStepProps {
  selectedRole: UserRole | null;
  onChange: (role: UserRole) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function RoleStep({ selectedRole, onChange, onNext, onBack }: RoleStepProps) {
  const roles = [
    {
      id: UserRole.STUDENT,
      title: 'Student',
      description: 'Access video lessons, live classes, assignments, and check your test marks.',
      icon: GraduationCap,
      color: 'blue',
      badge: 'Learn',
    },
    {
      id: UserRole.TEACHER,
      title: 'Teacher',
      description: 'Host interactive classes, set up assignments, and audit children performance.',
      icon: School,
      color: 'indigo',
      badge: 'Educate',
    },
    {
      id: UserRole.PARENT,
      title: 'Parent / Guardian',
      description: 'Track academic progress, stay in touch with mentors, and check homework files.',
      icon: Users,
      color: 'emerald',
      badge: 'Mentor',
    },
    {
      id: UserRole.ADMINISTRATOR,
      title: 'Administrator',
      description: 'Govern institute curriculums, organize directories, and issue permissions.',
      icon: ShieldAlert,
      color: 'purple',
      badge: 'Govern',
    },
  ];

  const handleNext = () => {
    if (selectedRole) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
      id="role-step"
    >
      <div className="text-center md:text-left mb-6">
        <h2 className="text-xl font-bold text-gray-900">Choose Your Platform Role</h2>
        <p className="text-xs text-gray-500 mt-1">
          Select the account profile type that matches your primary objective. This will customize your landing dashboard layout.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((item) => {
          const IconComponent = item.icon;
          const isSelected = selectedRole === item.id;
          
          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onChange(item.id)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between h-[160px] relative overflow-hidden ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/50 shadow-sm'
              }`}
              id={`role-card-${item.id}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2.5 rounded-xl ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  
                  {isSelected ? (
                    <span className="p-1 bg-indigo-600 text-white rounded-full">
                      <Check className="w-3.5 h-3.5 stroke-[3px]" />
                    </span>
                  ) : (
                    <span className="text-[10px] bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-gray-800">{item.title}</h3>
                <p className="text-[11px] text-gray-500 leading-normal mt-1 max-w-xs">
                  {item.description}
                </p>
              </div>

              {/* Selection background accent */}
              {isSelected && (
                <div className="absolute right-0 bottom-0 transform translate-x-3 translate-y-3 opacity-5">
                  <IconComponent className="w-24 h-24" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-xs rounded-xl transition-colors"
          id="btn-back-role"
        >
          Back
        </button>
        <button
          type="button"
          disabled={!selectedRole}
          onClick={handleNext}
          className={`px-6 py-2.5 font-medium text-xs rounded-xl transition-all ${
            selectedRole
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          id="btn-next-role"
        >
          Next Step
        </button>
      </div>
    </motion.div>
  );
}
