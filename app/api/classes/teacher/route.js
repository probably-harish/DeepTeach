import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
    const teacherId = request.nextUrl.searchParams.get('teacherId');
    try {
        const client = await clientPromise;
        const db = client.db("DeepTeach");

        const classes = await db.collection('Classes')
            .find({ teacher_id: new ObjectId(teacherId) })
            .toArray();

        return NextResponse.json(classes);
    } catch (error) {
        console.error('Error fetching classes:', error);
        return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
    }
}