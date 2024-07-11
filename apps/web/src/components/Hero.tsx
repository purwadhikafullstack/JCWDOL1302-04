import Image from 'next/image';
import React from 'react';

const Hero = () => {
  return (
    <div className="mt-5 px-6 md:px-10 xl:px-20">
      <div className="relative flex h-fit w-full flex-col gap-5 overflow-hidden rounded-xl md:h-80 md:gap-14">
        <Image
          className="-z-10 h-full w-full object-cover object-center brightness-75"
          src={'/hero.jpg'}
          fill
          priority
          alt="hero"
        />
        <div className="flex h-full w-full items-end justify-center px-6 pt-6">
          <div className="flex w-fit flex-wrap p-4 pb-0 md:mx-10 xl:mx-20">
            <p className="text-wrap text-5xl font-semibold tracking-tight text-white md:text-center">
              Enjoy your fresh day with StayCation
            </p>
          </div>
        </div>

        <div className="mx-6 flex flex-col justify-between gap-6 p-4 pt-0 md:flex-row">
          <p className="w-full text-white/90 md:w-[400px]">
            Menikmati lingkungan yang familiar dan nyaman, menghindari stres
            perjalanan, dan tetap dekat dengan keluarga serta teman-teman
          </p>
          <div className="flex gap-4">
            <div className="flex flex-col items-center justify-center">
              <p className="text-4xl text-white">100</p>
              <p className="text-center text-white/90">property</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-4xl text-white">50</p>
              <p className="text-center text-white/90">pemesanan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
