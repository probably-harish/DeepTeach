import { getClassById } from '@/models/Class';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { id } = params;
    try {
        const classData = await getClassById(id);
        if (!classData) {
            return NextResponse.json({ error: 'Class not found' }, { status: 404 });
        }
        return NextResponse.json(classData);
    } catch (error) {
        console.error('Error fetching class:', error);
        return NextResponse.json({ error: 'Failed to fetch class data' }, { status: 500 });
    }
}

