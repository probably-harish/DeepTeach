import { NextResponse } from 'next/server';
import * as ClassModel from '@/models/Class';

export async function GET(request, { params }) {
    const { id } = params;
    try {
        const classes = await ClassModel.getClasses();
        return NextResponse.json(classes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const result = await ClassModel.createClass(body);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
    }
}