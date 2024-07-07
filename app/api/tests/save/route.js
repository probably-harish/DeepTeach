import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request, { params }) {
    try {
        const { responses, state } = await request.json();
        const client = await clientPromise;
        const db = client.db("DeepTeach");

        await db.collection('StudentTest').updateOne(
            { _id: new ObjectId(params.id) },
            { $set: { responses, state } }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving progress:', error);
        return NextResponse.json({ success: false, error: 'Failed to save progress' }, { status: 500 });
    }
}