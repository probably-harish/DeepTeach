import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
    try {
        const client = await clientPromise;
        const db = client.db("DeepTeach");

        const test = await db.collection('StudentTest').findOne(
            { _id: new ObjectId(params.id) }
        );

        if (!test) {
            return NextResponse.json({ error: 'Test not found' }, { status: 404 });
        }

        return NextResponse.json(test);
    } catch (error) {
        console.error('Error fetching test:', error);
        return NextResponse.json({ error: 'Failed to fetch test' }, { status: 500 });
    }
}