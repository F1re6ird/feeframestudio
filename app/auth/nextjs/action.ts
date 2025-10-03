"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { removeFromSession } from "../core/session"

export async function logOut() {
  await removeFromSession(await cookies())
  redirect("/")
}