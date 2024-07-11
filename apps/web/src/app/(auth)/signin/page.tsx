import React from 'react';
import AuthHero from '../_components/auth-hero';
import SigninWrapper from '../_components/signin-wrapper';

const page = () => {
  return (
    <main className="bg-gossamer-950 relative flex min-h-screen flex-col md:flex-row">
      <div className=":w-[60%] md:flex-1">
        <AuthHero />
      </div>
      <div className="min-h-screen w-full lg:w-[40%] flex flex-1 justify-center items-center">
        <SigninWrapper />
      </div>
    </main>
  );
};

export default page;
