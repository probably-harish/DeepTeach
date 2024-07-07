import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
    try {
        const { testName, classId, teacherId, startTime, endTime, questionCount, questionCountCoding, subject } = await request.json();
        console.log("Subject is:", subject)
        const client = await clientPromise;
        const db = client.db("DeepTeach");

        const result = await db.collection('Tests').insertOne({
            test_name: testName,
            class_id: new ObjectId(classId),
            teacher_id: new ObjectId(teacherId),
            start_time: new Date(startTime),
            end_time: new Date(endTime),
            question_count: questionCount,
            question_count_coding: questionCountCoding,
            collectionName: subject
        });

        await db.collection('Classes').updateOne(
            { _id: new ObjectId(classId) },
            { $addToSet: { tests: result.insertedId } }
        );

        await db.collection('Teachers').updateOne(
            { _id: new ObjectId(teacherId) },
            { $push: { tests: result.insertedId } }
        )

        await db.collection('Students').updateMany(
            { classes: { $in: [new ObjectId(classId)] } },
            { $push: { testsAssigned: result.insertedId } }
        );

        return NextResponse.json({ success: true, testId: result.insertedId });

    } catch (error) {
        console.error('Error creating test:', error);
        return NextResponse.json({ success: false, error: 'Failed to create test' }, { status: 500 });
    }
}