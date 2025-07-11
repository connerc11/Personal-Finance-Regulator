import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
});

// Mock fetch if needed
global.fetch = jest.fn();

// Suppress console warnings during tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  jest.clearAllMocks();
});

// Mock charts/visualization libraries if used
jest.mock('recharts', () => ({
  LineChart: () => 'MockRechartsLineChart',
  BarChart: () => 'MockRechartsBarChart',
  PieChart: () => 'MockRechartsPieChart',
  ResponsiveContainer: ({ children }: any) => children,
  XAxis: () => 'MockXAxis',
  YAxis: () => 'MockYAxis',
  Tooltip: () => 'MockTooltip',
  Legend: () => 'MockLegend',
  Line: () => 'MockLine',
  Bar: () => 'MockBar',
  Cell: () => 'MockCell',
}));

// Mock Material-UI components if used
jest.mock('@mui/x-date-pickers', () => ({
  DatePicker: () => 'MockDatePicker',
  LocalizationProvider: ({ children }: any) => children,
  AdapterDateFns: jest.fn(),
}));

// Set up global test timeout
jest.setTimeout(10000);
