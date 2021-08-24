export type BreakPoint = {
  name: string
  color: string
  maxWidth?: number
};

export const tailWindBreakPoints: BreakPoint[] = [
  { name: 'XS', maxWidth: 640, color: '#7C3AED' },
  { name: 'SM', maxWidth: 768, color: '#10B981' },
  { name: 'MD', maxWidth: 1024, color: '#2563EB' },
  { name: 'LG', maxWidth: 1280, color: '#9e648d' },
  { name: 'XL', maxWidth: 1536, color: '#374151' },
  { name: '2X', color: '#DB2777' },
];

export const bootstrapBreakpoints: BreakPoint[] = [
  { name: 'XS', maxWidth: 576, color: '#7C3AED' },
  { name: 'SM', maxWidth: 768, color: '#10B981' },
  { name: 'MD', maxWidth: 992, color: '#2563EB' },
  { name: 'LG', maxWidth: 1200, color: '#9e648d' },
  { name: 'XL', maxWidth: 1400, color: '#374151' },
  { name: '2X', color: '#DB2777' },
];

export default {
  tailWindBreakPoints,
  bootstrapBreakpoints,
};
