import clientPromise from '../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function getClasses() {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('Classes').find({}).toArray();
}

export async function getClassById(classId) {
    try {
        const objectId = new ObjectId(classId);
        const client = await clientPromise;
        const classData = await client.db('DeepTeach').collection('Classes').findOne({ _id: objectId });
        return classData;
    } catch (error) {
        console.error('Error fetching class data:', error);
        throw error; // Propagate the error to handle it in the API route
    }
}

export async function createClass(classData) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('Classes').insertOne(classData);
}

export async function updateClass(id, classData) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('Classes').updateOne(
        { _id: new ObjectId(id) },
        { $set: classData }
    );
}

export async function deleteClass(id) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('Classes').deleteOne({ _id: new ObjectId(id) });
}

export async function addStudentToClass(classId, studentId) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('Classes').updateOne(
        { _id: new ObjectId(classId) },
        { $addToSet: { students: new ObjectId(studentId) } }
    );
}

export async function removeStudentFromClass(classId, studentId) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('Classes').updateOne(
        { _id: new ObjectId(classId) },
        { $pull: { students: new ObjectId(studentId) } }
    );
}