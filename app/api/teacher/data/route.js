import { NextResponse } from 'next/server';
import { getTeacherById } from '@/models/Teacher';
import { jwtVerify } from 'jose';

export async function GET(request) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        if (payload.role !== 'teacher') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const teacher = await getTeacherById(payload.id);
        if (!teacher) {
            return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
        }

        const { password, ...teacherData } = teacher;

        return NextResponse.json(teacherData);
    } catch (error) {
        console.error('Error fetching teacher data:', error);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}