import { NextResponse } from 'next/server';
import { getStudentById } from '@/models/Student';
import { jwtVerify } from 'jose';

export async function GET(request) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        if (payload.role !== 'student') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const student = await getStudentById(payload.id);
        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        const { password, ...studentData } = student;

        return NextResponse.json(studentData);
    } catch (error) {
        console.error('Error fetching teacher data:', error);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}