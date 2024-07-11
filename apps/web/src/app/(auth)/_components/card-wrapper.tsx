import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import SocialButton from './social-button';
import BackButton from './back-button';
import ForgetButton from './forget-button';

interface CardWrapperProps {
  children: React.ReactNode;
  backButtonLabel: string;
  backButtonLink: string;
  showSocial?: boolean;
  isLogin?: boolean;
}

const CardWrapper = ({
  children,
  backButtonLabel,
  backButtonLink,
  showSocial,
  isLogin,
}: CardWrapperProps) => {
  return (
    <Card className="w-full md:w-[400px]">
      <CardContent className="space-y-2 pt-6">{children}</CardContent>
      {isLogin && (
        <CardFooter>
          <ForgetButton />
        </CardFooter>
      )}
      {showSocial && (
        <>
          <CardFooter>
            <Separator className="flex-1 bg-gray-400" />
            <p className="px-4">Atau</p>
            <Separator className="flex-1 bg-gray-400" />
          </CardFooter>
          <CardFooter>
            <SocialButton />
          </CardFooter>
        </>
      )}
      <CardFooter>
        <BackButton link={backButtonLink} label={backButtonLabel} />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
