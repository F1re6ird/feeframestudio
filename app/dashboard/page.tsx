import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '../auth/nextjs/currentUser';
import DashBoard from './DashBoard';
import { LogOutButton } from '../components/LogOut';
import SignInForm from '../auth/SignInForm';

export default async function App() {


    // full database user
    const fullUser = await getCurrentUser({ withFullUser: true });
    if (!fullUser) redirect("/signIn");

    // session user for id
    const sessionUser = await getCurrentUser({ redirectIfNotFound: true });
    if (!sessionUser) return null;

    // thanks to overloads, TS knows sessionUser.user exists
    const userId = sessionUser.user.id;
    return (

        <div className="min-h-screen">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {
                    fullUser == null ? (
                        <div><SignInForm /></div>
                    ) : (
                        <>
                            <div className='flex flex-col gap-4 mb-4'>
                                <h1 className="text-3xl font-bold">Dashboard</h1>
                                <p className="mt-1 font-semibold ">Welcome back, {fullUser.name}!</p>
                                <div className='flex gap-4 items-center'>
                                    <Link href="/">
                                        <button
                                            className="inline-flex items-center px-4 py-2 bg-brand-secondary text-white text-sm font-medium rounded-md hover:scale-105 transition-all duration-200"
                                        >
                                            Home
                                        </button>
                                    </Link>

                                    <LogOutButton />
                                </div>
                            </div>
                            <DashBoard userId={userId} /></>
                    )
                }

            </main>
        </div>
    );
}
