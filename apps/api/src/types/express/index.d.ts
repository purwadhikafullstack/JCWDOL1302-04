export type User = {
  id?: string;
  name?: string;
  email?: string;
  image?: string | null;
  isVerified?: boolean;
  role?: string;
};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
