import { motion } from 'motion/react';
import { NotificationSettings } from '../types';
import { Mail, MessageSquare, Bell, BarChart2 } from 'lucide-react';

interface NotificationsStepProps {
  data: NotificationSettings;
  onChange: (data: Partial<NotificationSettings>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function NotificationsStep({ data, onChange, onNext, onBack }: NotificationsStepProps) {
  const options = [
    {
      key: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Get key platform emails about newly released course paths, events, and mentor assignments.',
      icon: Mail,
      color: 'text-blue-500',
    },
    {
      key: 'smsAlerts',
      title: 'SMS Alerts',
      description: 'Receive text reminders 15 minutes before any booked Live Classes or critical system events.',
      icon: MessageSquare,
      color: 'text-indigo-500',
    },
    {
      key: 'pushNotifications',
      title: 'Browser Push Notifications',
      description: 'Instantly notify me about direct feedback from teachers or classmates when working online.',
      icon: Bell,
      color: 'text-amber-500',
    },
    {
      key: 'weeklyReports',
      title: 'Weekly Progress Analytics',
      description: 'Receive weekly consolidated PDF charts summarizing study hours, test marks, and recommendations.',
      icon: BarChart2,
      color: 'text-emerald-500',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
      id="notifications-step"
    >
      <div className="text-center md:text-left mb-6">
        <h2 className="text-xl font-bold text-gray-900">Communication Channels</h2>
        <p className="text-xs text-gray-500 mt-1">
          Set up your alerts. You have full granular control over where of how we send scheduled messages.
        </p>
      </div>

      <div className="space-y-3.5">
        {options.map((opt) => {
          const IconComponent = opt.icon;
          const isActive = !!(data as any)[opt.key];

          return (
            <div
              key={opt.key}
              onClick={() => onChange({ [opt.key]: !isActive })}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 ${
                isActive ? 'border-indigo-100 bg-indigo-50/10' : 'border-gray-200 bg-white'
              }`}
              id={`notifications-row-${opt.key}`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl bg-gray-50 shrink-0 ${opt.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-800">{opt.title}</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-normal max-w-md">{opt.description}</p>
                </div>
              </div>

              {/* iOS Toggle Switch */}
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isActive ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
                id={`toggle-${opt.key}`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-xs rounded-xl transition-colors"
          id="btn-back-notifications"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-xs rounded-xl shadow-md transition-all duration-150"
          id="btn-next-notifications"
        >
          Next Step
        </button>
      </div>
    </motion.div>
  );
}
