import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findStudentByUsername } from '@/models/Student';
import { findTeacherByUsername } from '@/models/Teacher';
import { SignJWT } from 'jose';

export async function POST(request) {
    try {
        const { username, password, role } = await request.json();

        const user = role === 'student'
            ? await findStudentByUsername(username)
            : await findTeacherByUsername(username);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({ id: user._id, username: user.username, role: role })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1d')
            .sign(secret);

        const response = NextResponse.json({
            user: { ...user, password: undefined, role: role }
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 86400,
            path: '/'
        });

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to authenticate' }, { status: 500 });
    }
}