import React, { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="w-full pt-[78px] min-h-screen">{children}</div>
    </>
  );
};

export default layout;
