import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
    const testId = request.nextUrl.searchParams.get('testId');
    try {
        const client = await clientPromise;
        const db = client.db("DeepTeach");

        const tests = await db.collection('Tests')
            .find({ _id: new ObjectId(testId) })
            .toArray();

        return NextResponse.json(tests);
    } catch (error) {
        console.error('Error fetching tests for this particular id:', error);
        return NextResponse.json({ error: 'Failed to fetch tests' }, { status: 500 });
    }
}