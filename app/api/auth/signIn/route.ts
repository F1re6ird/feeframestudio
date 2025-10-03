
import { NextRequest, NextResponse } from 'next/server';
import connect from '@/app/utils/mongodb';
import User from '@/app/models/user';
import { hashPassword } from '@/app/auth/core/passwordHasher';
import { createSession } from '@/app/auth/core/session';
import { cookies } from 'next/headers';
import { timingSafeEqual } from 'crypto';



export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        console.log(email, password);
        await connect();
        const existing = await User.findOne({ email });
        if (!existing) {
            return NextResponse.json({ error: 'User does not exist' }, { status: 401 });
        }
        const salt = existing.salt;
        const hashedPassword = await hashPassword(password, salt);
        const passwordBuffer = Buffer.from(existing.password, 'hex');
        const hashedBuffer = Buffer.from(hashedPassword, 'hex');
        if (
            passwordBuffer.length === hashedBuffer.length &&
            timingSafeEqual(passwordBuffer, hashedBuffer)
        ) {
            await createSession(
                { user: { id: existing._id.toString(), role: existing.role } },
                await cookies()
            );
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : error }, { status: 500 });
    }
}