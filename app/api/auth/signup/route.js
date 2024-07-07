import { NextResponse } from 'next/server';
import { createStudent, findStudentByUsername, generateToken } from '@/models/Student';
import { findTeacherByUsername, createTeacher } from '@/models/Teacher';

export async function POST(request) {
    try {
        const { username, password, role } = await request.json();

        // Check if user already exists
        const existingUser = role === 'student'
            ? await findStudentByUsername(username)
            : await findTeacherByUsername(username);

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Create new user
        let newUser;
        if (role === 'student') {
            newUser = await createStudent({ username, password });
        } else if (role === 'teacher') {
            newUser = await createTeacher({ username, password });
        } else {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        console.log(newUser);

        const token = generateToken(newUser);

        return NextResponse.json({ token, user: { ...newUser, password: undefined } });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}