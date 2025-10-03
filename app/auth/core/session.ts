import { z } from "zod";

import { redisClient } from "@/app/lib/redis";

const SESSION_EXPIRATION = 1000 * 60 * 60 * 7 * 24;
const COOKIE_SESSION_KEY = process.env.COOKIE_SESSION_KEY || "session";

const sessionSchema = z.object({
  user: z.object({
    id: z.string(),
    role: z.enum(["admin", "user"]),
  }),
});

type UserSession = z.infer<typeof sessionSchema>;
export type Cookies = {
  set: (
    name: string,
    value: string,
    options: {
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: "strict" | "lax";
      expires?: Date;
    }
  ) => void;
  get: (name: string) => { value: string } | undefined;
  delete: (name: string) => void;
};

function generateSessionId(bytes = 512): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
    .normalize();
}

export async function getUserFromSession(cookies: Pick<Cookies, "get">) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (!sessionId) return null;
  return getUserSessionById(sessionId);
}

export async function updateUserSessionExpiration(
  cookies: Pick<Cookies, "get" | "set">
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (!sessionId) return null;

  const user = await getUserSessionById(sessionId);
  if (!user) return;

  await redisClient.set(`session:${sessionId}`, user, {
    ex: SESSION_EXPIRATION,
  });
  setCookie(sessionId, cookies);
}

export async function createSession(
  user: UserSession,
  cookies: Pick<Cookies, "set">
) {

  const sessionId = generateSessionId();

  await redisClient.set(`session:${sessionId}`, sessionSchema.parse(user), {
    ex: SESSION_EXPIRATION,
  });

  setCookie(sessionId, cookies);
}

export async function removeFromSession(
  cookies: Pick<Cookies, "get" | "delete">
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (!sessionId) return null;

  await redisClient.del(`session:${sessionId}`);
  cookies.delete(COOKIE_SESSION_KEY);
}

function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
  cookies.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(Date.now() + SESSION_EXPIRATION),
  });
}

export async function getUserSessionById(sessionId: string) {
  try {
    const rawUser = await redisClient.get(`session:${sessionId}`);
    if (!rawUser) return null;

    const { success, data: user } = sessionSchema.safeParse(rawUser);
    return success ? user : null;
  } catch (err) {
    console.error("Redis unreachable:", err);
    // Decide how to behave offline – usually treat as “no session”
    return null;
  }
}
