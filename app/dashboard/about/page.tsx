import React from 'react'
import UpdateAboutUs from './UpdateAboutUs';
import { getCurrentUser } from '../../auth/nextjs/currentUser'

async function page() {
    const user = await getCurrentUser({ redirectIfNotFound: true })
    if (!user) return null;

    // Handle case where user is an array or an object
    const userId =
        Array.isArray(user)
            ? user[0]?.user?.id
            : user.user?.id;

    if (!userId) return null;

    return (
        <UpdateAboutUs userId={userId} />
    )
}

export default page