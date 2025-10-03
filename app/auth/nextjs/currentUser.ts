import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserFromSession } from "../core/session";
import connect from "@/app/utils/mongodb";
import User from "@/app/models/user";

export type DbUser = {
  _id: string;
  email: string;
  role: "admin" | "user";
  name: string;
};

export type SessionUser = {
  user: {
    id: string;
    role: "admin" | "user";
  };
};

async function getUserFromDb(id: string): Promise<DbUser | null> {
  await connect();
  return User.findById(id, "email role name").lean<DbUser>().exec();
}

/* ---------- Overload signatures ---------- */
async function _getCurrentUser(opts: { withFullUser: true; redirectIfNotFound?: boolean }): Promise<DbUser | null>;
async function _getCurrentUser(opts?: { withFullUser?: false; redirectIfNotFound?: boolean }): Promise<SessionUser | null>;

/* ---------- Implementation ---------- */
async function _getCurrentUser({
  withFullUser = false,
  redirectIfNotFound = false,
}: {
  withFullUser?: boolean;
  redirectIfNotFound?: boolean;
} = {}): Promise<DbUser | SessionUser | null> {
  const sessionUser = await getUserFromSession(await cookies());

  if (!sessionUser) {
    if (redirectIfNotFound) redirect("/");
    return null;
  }

  if (withFullUser) {
    const fullUser = await getUserFromDb(sessionUser.user.id);
    if (!fullUser) throw new Error("User not found in database");
    return fullUser;
  }

  return sessionUser;
}

export const getCurrentUser = cache(_getCurrentUser);
