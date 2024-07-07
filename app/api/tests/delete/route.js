import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const testId = searchParams.get('testId');
        const classId = searchParams.get('classId');
        const teacherId = searchParams.get('teacherId');

        console.log('Received params:', { testId, classId, teacherId });

        if (!testId || !classId || !teacherId) {
            return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("DeepTeach");

        // Remove the test document
        const result = await db.collection('Tests').deleteOne({ _id: new ObjectId(testId) });
        if (result.deletedCount === 0) {
            return NextResponse.json({ success: false, error: 'Test not found' }, { status: 404 });
        }

        // Remove the test reference from the related Class document
        await db.collection('Classes').updateOne(
            { _id: new ObjectId(classId) },
            { $pull: { tests: new ObjectId(testId) } }
        );

        // Remove the test reference from the related Teacher document
        await db.collection('Teachers').updateOne(
            { _id: new ObjectId(teacherId) },
            { $pull: { tests: new ObjectId(testId) } }
        );

        // Remove the test reference from the related Students documents
        await db.collection('Students').updateMany(
            { classes: { $in: [new ObjectId(classId)] } },
            { $pull: { testsAssigned: new ObjectId(testId) } }
        );

        return NextResponse.json({ success: true, testId });
    } catch (error) {
        console.error('Error deleting test:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete test' }, { status: 500 });
    }
}