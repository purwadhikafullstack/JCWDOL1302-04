import LinkBrand from '@/components/Link-Brand';
import { ToastProvider } from '@/components/ui/toast';
import { Toaster } from '@/components/ui/toaster';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <SessionProvider session={session}>
        <header className="fixed z-10 w-full bg-black bg-opacity-20 md:bg-none">
          <div className="container py-4">
            <LinkBrand className="text-white" />
          </div>
        </header>
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </SessionProvider>
    </>
  );
}
