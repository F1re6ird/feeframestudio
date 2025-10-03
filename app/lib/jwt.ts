import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

// Ensure the secret is a string at runtime
const SECRET = process.env.JWT_SECRET!;
if (!SECRET) throw new Error('Missing JWT_SECRET in environment');

export function signJwt(
  payload: object,
  expiresIn: SignOptions['expiresIn'] = '7d'
): string {
  const options: SignOptions = { expiresIn };
  // ✅ Correct overload: (payload, secret, options)
  return jwt.sign(payload, SECRET, options);
}

export function verifyJwt<T extends JwtPayload>(token: string): T | null {
  try {
    return jwt.verify(token, SECRET) as T;
  } catch {
    return null;
  }
}