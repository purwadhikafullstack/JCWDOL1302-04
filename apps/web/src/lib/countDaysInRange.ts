import { differenceInDays } from 'date-fns';

export const countDaysInRange = (fromDate?: Date, toDate?: Date) => {
  if (!fromDate || !toDate) return 1;

  const start = new Date(fromDate);
  const end = new Date(toDate);
  // Tambah 1 hari karena perhitungan dimulai dari 0
  return differenceInDays(end, start) + 1;
};
