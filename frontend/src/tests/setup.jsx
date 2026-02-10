import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// 1. Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 2. Mock Observers
class IntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}
Object.defineProperty(window, 'IntersectionObserver', { value: IntersectionObserver });

class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
Object.defineProperty(window, 'ResizeObserver', { value: ResizeObserver });

// 3. Mock Storage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// 4. Global Fetch Mock
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

// 5. Framer Motion Mock
vi.mock('framer-motion', () => {
  const mockComponent = (tag) => {
    return React.forwardRef(({ children, ...props }, ref) => {
      // Strip out motion-specific props so they don't leak to DOM
      const {
        layout,
        whileHover,
        whileTap,
        initial,
        animate,
        exit,
        transition,
        variants,
        ...rest
      } = props;

      return React.createElement(tag, { ...rest, ref }, children);
    });
  };

  return {
    motion: {
      div: mockComponent('div'),
      span: mockComponent('span'),
      button: mockComponent('button'),
      h1: mockComponent('h1'),
      h2: mockComponent('h2'),
      h3: mockComponent('h3'),
      p: mockComponent('p'),
      nav: mockComponent('nav'),
      section: mockComponent('section'),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
    useInView: () => [vi.fn(), true],
    useIsPresent: () => true,
  };
});


// 6. Lucide React Partial Mock (covers all icons from grep)
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal();
  const MockIcon = (name) => () => <svg data-testid={`icon-${name}`} />;
  console.log('Lucide-react mock loaded icons:', Object.keys(actual));

  return {
    ...actual,
    Bell: MockIcon('bell'),
    BellOff: MockIcon('belloff'),
    Clock: MockIcon('clock'),
    AlertCircle: MockIcon('alertcircle'),
    CheckCircle: MockIcon('checkcircle'),
    ShieldCheck: MockIcon('shieldcheck'),
    ShieldAlert: MockIcon('shieldalert'),
    X: MockIcon('x'),
    Trash2: MockIcon('trash2'),
    Circle: MockIcon('circle'),
    Repeat: MockIcon('repeat'),
    ChevronDown: MockIcon('chevrondown'),
    ChevronRight: MockIcon('chevronright'),
    Calendar: MockIcon('calendar'),
    Info: MockIcon('info'),
    Edit2: MockIcon('edit2'),
    Star: MockIcon('star'),
    LayoutGrid: MockIcon('layoutgrid'),
    Keyboard: MockIcon('keyboard'),
    Tag: MockIcon('tag'),
    AlertTriangle: MockIcon('alerttriangle'),
    SlidersHorizontal: MockIcon('slidershorizontal'),
    Plus: MockIcon('plus'),
    Folder: MockIcon('folder'),
    CalendarIcon: MockIcon('calendaricon'),
    User: MockIcon('user'),
    Eye: MockIcon('eye'),
    EyeOff: MockIcon('eyeoff'),
    LogOut: MockIcon('logout'),
    SettingsIcon: MockIcon('settingsicon'),
    Sun: MockIcon('sun'),
    Moon: MockIcon('moon'),
    BarChart2: MockIcon('barchart2'),
    BarChart3: MockIcon('barchart3'),
    Save: MockIcon('save'),
    Loader: MockIcon('loader'),
    Loader2: MockIcon('loader2'),
    FolderOpen: MockIcon('folderopen'),
    WifiOff: MockIcon('wifioff'),
    Wifi: MockIcon('wifi'),
    Check: MockIcon('check'),
    ChevronLeft: MockIcon('chevronleft'),
    CheckCircle2: MockIcon('checkcircle2'),
    Share: MockIcon('share'),
    CalIcon: MockIcon('calicon'),
    Home: MockIcon('home'),
    CheckSquare: MockIcon('checksquare'),
    Users: MockIcon('users'),
    List: MockIcon('list'),
    ListTodo: MockIcon('listtodo'),
    Mail: MockIcon('mail'),
    Lock: MockIcon('lock'),
    Settings: MockIcon('settings'),
    Archive: MockIcon('archive'),
    TrendingUp: MockIcon('trendingup'),
    Download: MockIcon('download'),
    ChevronUp: MockIcon('chevronup'),
  };
});

// 7. Suppress "act" warnings
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) return;
  originalError.call(console, ...args);
};
