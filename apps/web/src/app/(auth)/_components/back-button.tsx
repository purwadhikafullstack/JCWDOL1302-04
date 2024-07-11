import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface BackButtonProps {
  label: string;
  link: string;
}

const BackButton = ({
  label,
  link
} : BackButtonProps) => {
  return (
    <Button
      variant='link'
      className='font-normal w-full lg:no-underline underline'
      size='sm'
      asChild
    >
      <Link href={link}>
        {label}
      </Link>
    </Button>
  )
}

export default BackButton