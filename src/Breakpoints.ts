import { Breakpoint, CssRule } from '@/types';

export const tailWindBreakpoints: Breakpoint[] = [
  { name: 'XS', maxWidth: 640, color: '#7C3AED' },
  { name: 'SM', maxWidth: 768, color: '#10B981' },
  { name: 'MD', maxWidth: 1024, color: '#2563EB' },
  { name: 'LG', maxWidth: 1280, color: '#9e648d' },
  { name: 'XL', maxWidth: 1536, color: '#374151' },
  { name: '2X', color: '#DB2777' },
];

export const bootstrapBreakpoints: Breakpoint[] = [
  { name: 'XS', maxWidth: 576, color: '#7C3AED' },
  { name: 'SM', maxWidth: 768, color: '#10B981' },
  { name: 'MD', maxWidth: 992, color: '#2563EB' },
  { name: 'LG', maxWidth: 1200, color: '#9e648d' },
  { name: 'XL', maxWidth: 1400, color: '#374151' },
  { name: '2X', color: '#DB2777' },
];

export const getBuiltInBreakPoint = (id: number): Breakpoint[] => {
  if (id === -1) return bootstrapBreakpoints;
  if (id === -2) return tailWindBreakpoints;
  throw Error('Unknown id');
};

export const initializeBreakpoints = (
  customBreakpoints: Record<number, CssRule>,
): Record<number, CssRule> => ({
  [-1]: {
    id: -1,
    name: 'Bootstrap',
    breakpoints: bootstrapBreakpoints,
  },
  [-2]: {
    id: -2,
    name: 'Tailwind',
    breakpoints: tailWindBreakpoints,
  },
  ...customBreakpoints,
});
