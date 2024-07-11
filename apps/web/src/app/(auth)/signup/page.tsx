import React from 'react'
import AuthLayout from '../layout'
import AuthHero from '../_components/auth-hero'
import SignupTab from '../_components/signup-tab'

const page = () => {
  return (
    <main className='min-h-svh relative flex md:flex-row flex-col bg-gossamer-950'>
      <div className='md:flex-1'>
        <AuthHero />
      </div>
      <div className='flex-1'>
        <SignupTab />
      </div>
    </main>
  )
}

export default page
