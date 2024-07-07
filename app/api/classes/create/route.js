import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
    try {
        const { className, teacherId } = await request.json();
        const client = await clientPromise;
        const db = client.db("DeepTeach");

        const result = await db.collection('Classes').insertOne({
            class_name: className,
            teacher_id: new ObjectId(teacherId),
            students: [],
            tests: []
        });

        const teacherResult = await db.collection('Teachers').updateOne(
            { _id: new ObjectId(teacherId) },
            { $push: { classes: result.insertedId } }
        );

        return NextResponse.json({ success: true, classId: result.insertedId });

    } catch (error) {
        console.error('Error creating class:', error);
        return NextResponse.json({ success: false, error: 'Failed to create class' }, { status: 500 });
    }
}