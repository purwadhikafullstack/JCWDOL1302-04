import { TOKEN_SECRET_KEY } from '../src/config';
import { User } from "@/types/express";
import { sign, verify } from 'jsonwebtoken'

const TokenManager = {
  generateToken: (payload: User) => sign(payload, TOKEN_SECRET_KEY!, { expiresIn: '30d' }),
  verifyToken: (token: string) => verify(token, TOKEN_SECRET_KEY!)
}

export default TokenManager;
