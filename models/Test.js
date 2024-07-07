import clientPromise from '../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function createTest(testData) {
    const client = await clientPromise;
    const db = client.db('DeepTeach');
    return db.collection('Tests').insertOne(testData);
}

export async function getTestById(testId) {
    const client = await clientPromise;
    const db = client.db('DeepTeach');
    return db.collection('Tests').findOne({ _id: new ObjectId(testId) });
}

export async function updateTest(id, testData) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('Tests').updateOne(
        { _id: new ObjectId(id) },
        { $set: testData }
    );
}

export async function deleteTest(id) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('Tests').deleteOne({ _id: new ObjectId(id) });
}
