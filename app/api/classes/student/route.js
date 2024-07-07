import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
    const studentId = request.nextUrl.searchParams.get('studentId');
    try {
        const client = await clientPromise;
        const db = client.db("DeepTeach");

        const classes = await db.collection('Classes')
            .find({ students: new ObjectId(studentId) })
            .toArray();

        return NextResponse.json(classes);
    } catch (error) {
        console.error('Error fetching classes:', error);
        return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
    }
}