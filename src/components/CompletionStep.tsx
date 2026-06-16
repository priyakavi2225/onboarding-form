import { motion } from 'motion/react';
import { Sparkles, Trophy, CheckCircle, ArrowRight } from 'lucide-react';

interface CompletionStepProps {
  fullName: string;
  role: string | null;
  onComplete: () => void;
}

export default function CompletionStep({ fullName, role, onComplete }: CompletionStepProps) {
  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Member';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="text-center space-y-6 py-4"
      id="completion-step"
    >
      <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-semibold mb-2">
        <CheckCircle className="w-4 h-4 animate-bounce text-emerald-500" />
        <span>Setup Complete!</span>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">
        Welcome Aboard, {fullName || 'Learner'}!
      </h1>

      <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
        Your customized account as a <span className="font-bold text-indigo-600">{displayRole}</span> has been successfully initialized. We have streamlined your learning channels and compiled a primary subject layout tailored to you.
      </p>

      {/* Celebration Illustration */}
      <div className="relative w-full max-w-xs mx-auto aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-b from-emerald-50 to-indigo-50 border border-emerald-100 flex items-center justify-center p-4">
        <img
          src="/src/assets/images/success_onboarding_1781606070661.jpg"
          alt="Onboarding success and celebration"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain mix-blend-multiply transform hover:scale-105 transition-transform duration-500 animate-pulse"
          id="success-illustration-img"
        />
        
        {/* Absolute floating element */}
        <div className="absolute top-2 right-2 p-1.5 bg-yellow-400 text-white rounded-xl shadow-md rotate-12 flex items-center gap-1 text-[10px] font-extrabold">
          <Trophy className="w-3.5 h-3.5 text-white animate-spin-slow" />
          <span>Level 1 unlocked</span>
        </div>
      </div>

      {/* Quick summary of the features configured */}
      <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl max-w-sm mx-auto text-left space-y-2.5">
        <div className="flex items-start gap-2.5 text-xs">
          <Sparkles className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-gray-800">Dynamic UI Configured</p>
            <p className="text-[10px] text-gray-500">Your portal now displays courses aligned with your academic level.</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5 text-xs">
          <CheckCircle className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-gray-800">Auto-Save Active</p>
            <p className="text-[10px] text-gray-500">All configurations are locked and synchronized in local secure storage.</p>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onComplete}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-250 cursor-pointer mx-auto"
        id="btn-completion-dashboard"
      >
        <span>Enter Dashboard Workspace</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}
