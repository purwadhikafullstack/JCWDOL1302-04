import React from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';

const AlertNotVerified = ({ isVerified }: { isVerified?: boolean }) => {
  return (
    <>
      {isVerified === false && (
        <div className="fixed right-1/2 top-24 z-20 max-md:w-[300px] translate-x-1/2">
          <Alert className="bg-white" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Info</AlertTitle>
            <AlertDescription>
              Please check your email to verify your email.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
};

export default AlertNotVerified;
