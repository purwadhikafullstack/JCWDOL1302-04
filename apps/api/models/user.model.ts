import { User } from '@prisma/client';

export type AddUserReq = {
  name: string;
  email: string;
  password?: string | null;
  provider?: string | null;
  image?: string | null;
  role: string;
  isVerified: boolean;
};

export type UpdateAccountUserReq = {
  name: string;
  birthdate?: Date | null;
  gender?: string | null;
};

export type GetUserReq = {
  email: string;
  password?: string;
};

export type GetAccountUserReq = {
  name: string;
  birthdate?: Date | null;
  gender?: string | null;
};

export type UpdateUserToNotVerifiedAndPasswordReq = {
  email: string;
  password: string;
};

export type UpdateImageUserReq = {
  email: string;
  image: string;
}

export const toAddUserRes = (user: User) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    isVerified: user.isVerified,
    provider: user.provider
  };
};

export const toUpdateAccountUserRes = (user: User) => {
  return {
    name: user.name,
    gender: user.gender,
    birthdate: user.birthdate,
  };
};

export const toUserRes = (user: User) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    provider: user.provider,
    image: user.image,
    role: user.role,
    isVerified: user.isVerified,
  };
};

export const toAccountUserRes = (user: User) => {
  return {
    name: user.name,
    gender: user.gender,
    birthdate: user.birthdate,
  };
};
