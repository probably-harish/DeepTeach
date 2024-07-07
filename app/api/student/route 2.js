import { NextResponse } from 'next/server';
import { getStudents } from '@/models/Student';
import { jwtVerify } from 'jose';

export async function GET(request) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        const students = await getStudents();
        if (!students) {
            return NextResponse.json({ error: 'No students found' }, { status: 404 });
        }


        const sanitizedStudents = students.map(student => {
            const { password, ...studentData } = student;
            return studentData;
        });

        return NextResponse.json(sanitizedStudents);
    } catch (error) {
        console.error('Error fetching students data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}