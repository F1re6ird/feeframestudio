"use client"

import { logOut } from "../auth/nextjs/action"

export function LogOutButton() {
  return (
    <button
      className="bg-red-500 text-brand-light px-4 py-2 rounded hover:scale-105 duration-200 transition-all"
      onClick={async () => await logOut()}
    >
      Log Out
    </button>
  )
}