import { cn } from '@/lib/utils';
import { Vegan } from 'lucide-react';
import Link, { LinkProps } from 'next/link';
import React from 'react';

interface LinkBrandProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
  href?: string;
  isBigLink?: boolean;
}

const LinkBrand = ({ className, href = '/', isBigLink }: LinkBrandProps) => {
  return (
    <Link
      href={href}
      className={cn(
        'text-gossamer-500 inline-flex items-center',
        isBigLink ? 'gap-3' : 'gap-1',

        className,
      )}
    >
      <Vegan strokeWidth={4} size={isBigLink ? 32 : 24} />
      <span
        className={cn(
          'font-extrabold tracking-tighter',
          isBigLink ? 'text-3xl' : 'text-xl',
        )}
      >
        StayCation
      </span>
    </Link>
  );
};

export default LinkBrand;
