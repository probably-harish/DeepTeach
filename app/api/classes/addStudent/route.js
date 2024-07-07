import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
    try {
        const { classId, studentId } = await request.json();
        const client = await clientPromise;
        const db = client.db("DeepTeach");

        await db.collection('Classes').updateOne(
            { _id: new ObjectId(classId) },
            { $addToSet: { students: new ObjectId(studentId) } }
        );

        await db.collection('Students').updateOne(
            { _id: new ObjectId(studentId) },
            { $addToSet: { classes: new ObjectId(classId) } }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error adding student to class:', error);
        return NextResponse.json({ success: false, error: 'Failed to add student to class' }, { status: 500 });
    }
}