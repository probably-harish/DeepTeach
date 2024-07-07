import { NextResponse } from 'next/server';
import * as StudentModel from '@/models/Student';

export async function GET() {
    try {
        const students = await StudentModel.getStudents();
        return NextResponse.json(students);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch Students' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const result = await StudentModel.updateStudent(body);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
    }
}