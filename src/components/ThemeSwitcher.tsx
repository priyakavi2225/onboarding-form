import { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';

export type ThemeId =
  | 'baby-pink'
  | 'baby-peach'
  | 'pastel-yellow'
  | 'powder-blue'
  | 'baby-pink-dark'
  | 'powder-blue-dark'
  | 'all-colors'
  | 'all-colors-dark';

export const THEMES: {
  id: ThemeId;
  name: string;
  type: 'Light' | 'Dark';
  primary: string;
  secondary: string;
  bg: string;
}[] = [
  {
    id: 'baby-pink',
    name: 'Baby Pink',
    type: 'Light',
    primary: '#c8224e',
    secondary: '#ffd6e0',
    bg: '#fff0f4',
  },
  {
    id: 'baby-peach',
    name: 'Baby Peach',
    type: 'Light',
    primary: '#d4621a',
    secondary: '#ffe8d0',
    bg: '#fff8f0',
  },
  {
    id: 'pastel-yellow',
    name: 'Pastel Yellow',
    type: 'Light',
    primary: '#a88200',
    secondary: '#fef8c0',
    bg: '#fefce8',
  },
  {
    id: 'powder-blue',
    name: 'Powder Blue',
    type: 'Light',
    primary: '#2480b8',
    secondary: '#d8ecf8',
    bg: '#f0f8ff',
  },
  {
    id: 'all-colors',
    name: 'All Colors',
    type: 'Light',
    primary: '#e04878',
    secondary: '#2490d0',
    bg: '#ffd0dc',
  },
  {
    id: 'baby-pink-dark',
    name: 'Baby Pink Dark',
    type: 'Dark',
    primary: '#f070a8',
    secondary: '#580f28',
    bg: '#140810',
  },
  {
    id: 'powder-blue-dark',
    name: 'Powder Blue Dark',
    type: 'Dark',
    primary: '#52a4d8',
    secondary: '#0c2038',
    bg: '#081018',
  },
  {
    id: 'all-colors-dark',
    name: 'All Colors Dark',
    type: 'Dark',
    primary: '#f070a8',
    secondary: '#4e9cd4',
    bg: '#090510',
  },
];

interface ThemeSwitcherProps {
  theme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  /** compact = icon-only trigger button (for headers). default = false */
  compact?: boolean;
}

export default function ThemeSwitcher({ theme, onThemeChange, compact = false }: ThemeSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentTheme = THEMES.find((t) => t.id === theme) ?? THEMES[0];
  const isDark = currentTheme.type === 'Dark';

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const lightThemes = THEMES.filter((t) => t.type === 'Light');
  const darkThemes = THEMES.filter((t) => t.type === 'Dark');

  return (
    <div className="relative" ref={ref}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all shadow-sm cursor-pointer text-[10px] font-bold ${
          isDark
            ? 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100'
            : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100'
        }`}
        title="Change Theme"
        id="btn-theme-switcher"
        aria-label="Open theme switcher"
      >
        {/* Current theme color dot */}
        <span
          className="w-3 h-3 rounded-full border border-white shadow-sm shrink-0"
          style={{
            background:
              theme.includes('all-colors')
                ? 'linear-gradient(135deg, #ff88a8, #ffa868, #ffd858, #80c8f0)'
                : currentTheme.primary,
          }}
        />
        {!compact && <span>Theme</span>}
        <Palette className="w-3 h-3" />
      </button>

      {/* Popover – right-anchored on desktop, left-anchored on mobile */}
      {open && (
        <div
          className="absolute right-0 sm:right-0 top-full mt-2 z-50 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 w-[min(260px,calc(100vw-1rem))]"
          style={{ backdropFilter: 'blur(8px)' }}
          id="theme-switcher-popover"
        >
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-3">
            Choose Theme
          </p>

          {/* Light themes */}
          <div className="mb-3">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              ☀️ Light
            </p>
            <div className="grid grid-cols-2 gap-2">
              {lightThemes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onThemeChange(t.id);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                    theme === t.id
                      ? 'border-indigo-600 ring-1 ring-indigo-200 bg-indigo-50/50'
                      : 'border-gray-100 hover:border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                  }`}
                  id={`theme-option-${t.id}`}
                  aria-label={`Select ${t.name} theme`}
                >
                  {/* Swatch pill */}
                  <span
                    className="w-8 h-5 rounded-md shrink-0 border border-black/5"
                    style={{
                      background:
                        t.id === 'all-colors'
                          ? 'linear-gradient(to right, #ff88a8, #ffa868, #ffd858, #80c8f0)'
                          : `linear-gradient(135deg, ${t.bg} 40%, ${t.primary} 100%)`,
                    }}
                  />
                  <span className="text-[10px] font-semibold text-gray-700 leading-tight">
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Dark themes */}
          <div>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              🌙 Dark
            </p>
            <div className="grid grid-cols-2 gap-2">
              {darkThemes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onThemeChange(t.id);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                    theme === t.id
                      ? 'border-indigo-600 ring-1 ring-indigo-200 bg-indigo-50/50'
                      : 'border-gray-100 hover:border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                  }`}
                  id={`theme-option-${t.id}`}
                  aria-label={`Select ${t.name} theme`}
                >
                  <span
                    className="w-8 h-5 rounded-md shrink-0 border border-white/10"
                    style={{
                      background:
                        t.id === 'all-colors-dark'
                          ? 'linear-gradient(to right, #f070a8, #e08040, #c8a800, #4e9cd4)'
                          : `linear-gradient(135deg, ${t.bg} 40%, ${t.primary} 100%)`,
                    }}
                  />
                  <span className="text-[10px] font-semibold text-gray-700 leading-tight">
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
