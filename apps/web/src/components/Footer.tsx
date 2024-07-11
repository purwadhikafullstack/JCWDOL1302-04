import { cn } from '@/lib/utils';
import LinkBrand from './Link-Brand';

export const Footer = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'bg-gossamer-950 inline-flex w-full flex-col items-center justify-between gap-10 px-6 py-10 text-white md:flex-row md:items-baseline md:px-10 xl:px-20',
        className,
      )}
    >
      <LinkBrand className="text-white" isBigLink />
      <p>© 2024 StayCation, Inc.</p>
    </div>
  );
};
