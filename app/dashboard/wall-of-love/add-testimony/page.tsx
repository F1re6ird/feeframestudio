import React from 'react'
import AddTestimony from './AddTestimony'
import { getCurrentUser } from '@/app/auth/nextjs/currentUser'

export default async function page() {

    const sessionUser = await getCurrentUser({ redirectIfNotFound: true });
    if (!sessionUser) return null;

    // thanks to overloads, TS knows sessionUser.user exists
    const userId = sessionUser.user.id;

    return (
        <AddTestimony userId={userId} />
    )
}