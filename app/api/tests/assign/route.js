// app/api/tests/assign/route.js

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

async function createRandomTest(question_count, question_count_coding, collectionName) {
    const client = await clientPromise;
    const db = client.db("DeepTeach");

    const regularQuestions = await db.collection(collectionName)
        .aggregate([
            { $match: { question_type: { $ne: "coding" } } },
            { $sample: { size: question_count - question_count_coding } }
        ]).toArray();

    const codingQuestions = await db.collection(collectionName)
        .aggregate([
            { $match: { question_type: "coding" } },
            { $sample: { size: question_count_coding } }
        ]).toArray();

    return [...regularQuestions, ...codingQuestions];
}

export async function POST(request) {
    try {
        const { testId, studentId, collectionName } = await request.json();
        console.log(testId, studentId)
        const client = await clientPromise;
        const db = client.db("DeepTeach");

        // Check if a test instance already exists
        const existingTest = await db.collection('StudentTest').findOne({
            testTemplateId: new ObjectId(testId),
            'studentId': new ObjectId(studentId)
        });

        if (existingTest) {
            return NextResponse.json({ success: true, testInstanceId: existingTest._id });
        }

        // Fetch test template details
        const testTemplate = await db.collection('Tests').findOne({ _id: new ObjectId(testId) });

        // Create random test
        const questions = await createRandomTest(testTemplate.question_count, testTemplate.question_count_coding, testTemplate.collectionName);

        console.log(questions)

        // Create new test instance
        const result = await db.collection('StudentTest').insertOne({
            testTemplateId: new ObjectId(testId),
            studentId: new ObjectId(studentId),
            test_name: testTemplate.test_name,
            question_count: testTemplate.question_count,
            question_count_coding: testTemplate.question_count_coding,
            questions: questions,
            responses: [],
            state: 'in_progress'
        });

        return NextResponse.json({ success: true, testInstanceId: result.insertedId });
    } catch (error) {
        console.error('Error creating test:', error);
        return NextResponse.json({ success: false, error: 'Failed to create test' }, { status: 500 });
    }
}