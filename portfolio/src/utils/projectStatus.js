export const PROJECT_STATUS_OPTIONS = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export const getProjectStatusMeta = (status) => {
  switch (status) {
    case 'in_progress':
      return {
        label: 'In Progress',
        cardClass: 'bg-[rgba(255,200,0,0.15)] text-[#facc15] border border-[#facc15]/25 shadow-[0_0_12px_rgba(250,204,21,0.2)]',
        adminClass: 'bg-amber-500/15 text-amber-300 border border-amber-400/25',
      };
    case 'completed':
      return {
        label: 'Completed',
        cardClass: 'bg-[rgba(34,197,94,0.15)] text-[#22c55e] border border-[#22c55e]/30 shadow-[0_0_12px_rgba(34,197,94,0.2)]',
        adminClass: 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/25',
      };
    case 'not_started':
    default:
      return {
        label: 'Not Started',
        cardClass: 'bg-[rgba(255,255,255,0.1)] text-white/80 border border-white/20',
        adminClass: 'bg-white/10 text-gray-300 border border-white/20',
      };
  }
};

