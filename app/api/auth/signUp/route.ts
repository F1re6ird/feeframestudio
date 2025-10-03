
import { NextRequest, NextResponse } from 'next/server';
import connect from '@/app/utils/mongodb';
import User from '@/app/models/user';
import { hashPassword, generateSalt } from '@/app/auth/core/passwordHasher';
import { createSession } from '@/app/auth/core/session';
import { cookies } from 'next/headers';



export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        console.log(name, email, password);

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'All fields required' }, { status: 400 });
        }

        await connect();

        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
        }

        const role = 'admin';
        const salt = generateSalt();
        const hashedPassword = await hashPassword(password, salt);

        const user = await User.create({ name, email, password: hashedPassword, salt, role });

        if (!user) {
            return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
        }

        await createSession(
            { user: { id: user._id.toString(), role } },
                await cookies()
        );

        await user.save();



        // never return password hash
        return NextResponse.json(
            { message: 'User created', user: { id: user._id, name: user.name, email: user.email } },
            { status: 201 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
