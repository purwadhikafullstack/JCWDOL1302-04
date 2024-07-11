'use client'

import { signIn } from "next-auth/react"
import { Button } from '@/components/ui/button'
import { DEFAULT_LOGIN_REDIRECT_AS_USER } from "@/routes"
import { Chrome } from 'lucide-react'

const SocialButton = () => {
  const onClick = (provider: string) => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT_AS_USER,
    });
  }

  return (
    <div className='w-full flex flex-col gap-2'>
      <Button
        size='lg'
        className='w-full rounded-full font-semibold'
        variant='outline'
        onClick={() => onClick("google")}
      >
        <Chrome />
        <p className='flex-1'>
          Continue with Google
        </p>
      </Button>
    </div>
  )
}

export default SocialButton
