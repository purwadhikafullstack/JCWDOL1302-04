import React from 'react';
import {
  BedSingle,
  BookA,
  Building2,
  Calendar,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  NotebookText,
  Settings,
  User,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signout } from '@/actions/auth';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const HeaderAccountDropdown = () => {
  const { data: session } = useSession();
  let avatar;

  if (session?.user.provider === 'google') {
    avatar = session.user.image!;
  } else {
    avatar = session?.user.image
      ? `http://localhost:8000/user-images/${session.user.image}`
      : 'https://github.com/shadcn.png';
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-athens-gray-50 hover:bg-athens-gray-50/90 text-athens-gray-950 flex h-fit rounded-full p-2"
        >
          <div className="px-2">
            <Menu size={16} />
          </div>
          <Avatar className="aspect-square h-9 w-fit">
            <AvatarImage src={avatar} />
            <AvatarFallback>{session?.user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {session?.user.role !== 'USER' && (
          <DropdownMenuGroup>
            <Link href={'/tenant/dashboard'}>
              <DropdownMenuItem>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
            </Link>
            <Link href={'/tenant/property'}>
              <DropdownMenuItem>
                <Building2 className="mr-2 h-4 w-4" />
                <span>Property</span>
              </DropdownMenuItem>
            </Link>
            <Link href={'/tenant/room-availability'}>
              <DropdownMenuItem>
                <BedSingle className="mr-2 h-4 w-4" />
                <span>Room Availability</span>
              </DropdownMenuItem>
            </Link>
            <Link href={'/tenant/special-price'}>
              <DropdownMenuItem>
                <DollarSign className="mr-2 h-4 w-4" />
                <span>Special Price</span>
              </DropdownMenuItem>
            </Link>
            <Link href={'/tenant/order'}>
              <DropdownMenuItem>
                <NotebookText className="mr-2 h-4 w-4" />
                <span>Order</span>
              </DropdownMenuItem>
            </Link>
            <Link href={'/tenant/calendar'}>
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Calendar</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        )}
        {session?.user.role === 'USER' && (
          <>
            <DropdownMenuGroup>
              <Link href={'/order'}>
                <DropdownMenuItem>
                  <BookA className="mr-2 h-4 w-4" />
                  <span>Booking Order</span>
                </DropdownMenuItem>
              </Link>
           
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuGroup>
          <Link href={'/profile'}>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href={'/settings'}>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signout();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderAccountDropdown;
