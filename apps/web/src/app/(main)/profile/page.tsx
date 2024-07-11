'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { useSession } from 'next-auth/react';
import DialogUpdatePhoto from './_components/dialog-update-photo';
import { BadgeCheck, BadgeX } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { useEffect } from 'react';
import { getAccountThunk } from '@/redux/slices/settings-thunk';
import { showDateForBirthdate } from '@/lib/formatDate';

const Profile = () => {
  const { data: session } = useSession();
  let avatar;

  if (session?.user.provider === 'google') {
    avatar = session.user.image!;
  } else {
    avatar = session?.user.image
      ? `http://localhost:8000/user-images/${session.user.image}`
      : 'https://github.com/shadcn.png';
  }

  const dispatch = useAppDispatch();

  const defaultValues = useAppSelector(
    (state) => state.settingsReaducer.account,
  );

  useEffect(() => {
    if (session) dispatch(getAccountThunk(session.user.id));
  }, [session]);

  return (
    <main className="min-h-svh w-full pt-[78px]">
      <div className="container lg:max-w-3xl">
        <div className="my-10">
          <h2 className="text-athens-gray-950 text-xl font-bold md:text-3xl">
            Personal profile
          </h2>
        </div>
        <div>
          <div className="flex items-center gap-6 py-6">
            <Avatar className="aspect-square h-20 w-fit">
              <AvatarImage src={avatar} />
              <AvatarFallback>{session?.user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>

            {session?.user.provider !== 'google' && <DialogUpdatePhoto />}
          </div>
          <div className="border-b border-b-slate-300 py-6">
            <p className="text-athens-gray-950">Full Name</p>
            <p className="text-athens-gray-500 mt-1 text-sm">
              {session?.user.name!}
            </p>
          </div>
          <div className="border-b border-b-slate-300 py-6">
            <p className="text-athens-gray-950">Email</p>
            <div className="flex justify-between gap-4">
              <p className="text-athens-gray-500 mt-1 text-sm">
                {session?.user.email!}
              </p>
              {session?.user.isVerified ? (
                <div className="text-gossamer-500 flex gap-2">
                  <p className="self-center text-sm">Verified</p>
                  <BadgeCheck size={20} />
                </div>
              ) : (
                <div className="flex gap-2 text-red-500">
                  <p className="self-center text-sm">Not verified</p>
                  <BadgeX size={20} />
                </div>
              )}
            </div>
          </div>
          {defaultValues.birthdate && (
            <div className="border-b border-b-slate-300 py-6">
              <p className="text-athens-gray-950">Birthdate</p>
              <p className="text-athens-gray-500 mt-1 text-sm">
                {showDateForBirthdate(defaultValues.birthdate)}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Profile;
