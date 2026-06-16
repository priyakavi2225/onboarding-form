import { motion } from 'motion/react';
import { Sparkles, ArrowRight, GraduationCap, BookOpen, Compass } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex flex-col items-center text-center space-y-6"
      id="welcome-step-container"
    >
      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-semibold mb-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>Step 1 of 8: Welcome to EduQuest</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Unleash Your Learning Potential
      </h1>
      
      <p className="text-gray-600 max-w-md mx-auto text-sm leading-relaxed">
        Welcome to EduQuest, the enterprise-grade adaptive learning ecosystem. Complete this brief onboarding to tailor your personal study pathways, connect with educators, and reach your goals.
      </p>

      {/* Online Learning Illustration */}
      <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-b from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center p-4">
        <img
          src="/src/assets/images/online_learning_1781606054330.jpg"
          alt="Students learning online illustration"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain mix-blend-multiply transform hover:scale-105 transition-transform duration-500"
          id="welcome-illustration-img"
        />
        <div className="absolute bottom-3 left-3 right-3 bg-white/75 backdrop-blur-md px-3 py-2 rounded-xl text-left border border-white/20 flex items-center gap-3">
          <GraduationCap className="text-indigo-600 shrink-0 w-8 h-8 p-1.5 bg-indigo-50 rounded-lg" />
          <div>
            <div className="text-xs font-bold text-gray-800">Adaptive Curriculum</div>
            <div className="text-[10px] text-gray-500">Curated especially for you</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-md text-left mt-2">
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
          <BookOpen className="w-5 h-5 text-blue-600 mb-1" />
          <h3 className="text-xs font-bold text-gray-800">Interactive</h3>
          <p className="text-[10px] text-gray-500">Live lessons & questions.</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
          <Sparkles className="w-5 h-5 text-emerald-600 mb-1" />
          <h3 className="text-xs font-bold text-gray-800">Adaptive AI</h3>
          <p className="text-[10px] text-gray-500">Custom difficulty matching.</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
          <Compass className="w-5 h-5 text-indigo-600 mb-1" />
          <h3 className="text-xs font-bold text-gray-800">Real-time</h3>
          <p className="text-[10px] text-gray-500">Monitor skill analytics.</p>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        className="mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200"
        id="btn-get-started"
      >
        <span>Get Started</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}
