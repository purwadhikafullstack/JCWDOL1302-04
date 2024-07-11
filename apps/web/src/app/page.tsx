import Hero from '@/components/Hero';
import ListTopRateProperty from '@/components/List-TopRateProperty';
import MainLayout from './(main)/layout';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const Home = async () => {
  const session = await auth();

  if (session?.user.role === 'TENANT') return redirect('/tenant/dashboard');

  return (
    <MainLayout>
      <main className="relative mb-10 flex min-h-svh flex-col gap-10 pt-[78px]">
        <Hero />
        <ListTopRateProperty />
      </main>
    </MainLayout>
  );
};

export default Home;
