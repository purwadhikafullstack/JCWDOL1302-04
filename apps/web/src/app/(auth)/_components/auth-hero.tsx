import Image from 'next/image';

const AuthHero = () => {
  return (
    <div className="relative h-full w-full">
      <Image
        className="rounded-r-3xl object-cover object-[60.5%] brightness-75"
        src={'/hero.jpg'}
        fill
        priority
        sizes="(min-width: 768px) 80vw, 0vw"
        alt="hero"
      />
    </div>
  );
};

export default AuthHero;
