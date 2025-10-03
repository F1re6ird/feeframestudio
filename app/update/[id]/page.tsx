import React from 'react';
import UpdateModal from '../UpdateModal';
import { getCurrentUser } from '@/app/auth/nextjs/currentUser';
import { redirect } from 'next/navigation';

export default async function page(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params; // ✅ await before accessing

    // full database user
    const fullUser = await getCurrentUser({ withFullUser: true });
    if (!fullUser) redirect("/signIn");

    // session user for id
    const sessionUser = await getCurrentUser({ redirectIfNotFound: true });
    if (!sessionUser) return null;

    // thanks to overloads, TS knows sessionUser.user exists
    const userId = sessionUser.user.id;

    return <UpdateModal id={id} userId={userId} />;
}