import clientPromise from '../lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function findStudentByEmail(email) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('Students').findOne({ email });
}

export async function findStudentByUsername(username) {
    const client = await clientPromise;
    const db = client.db('DeepTeach');
    return db.collection('Students').findOne({ username });
}

export function generateToken(user) {
    return jwt.sign(
        { id: user._id, username: user.username, role: 'student' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
}

export async function createStudent(studentData) {
    const client = await clientPromise;
    const db = client.db('DeepTeach');
    const hashedPassword = await bcrypt.hash(studentData.password, 10);

    const newStudent = {
        student_id: `S${Math.floor(10000 + Math.random() * 90000)}`,
        username: studentData.username,
        password: hashedPassword,
        classes: [],
        tests: []
    };

    const result = await db.collection('Students').insertOne(newStudent);
    return { ...newStudent, _id: result.insertedId, password: undefined };
}

export async function getStudents() {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('Students').find({}).toArray();
}

export async function getStudentById(id) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('Students').findOne({ _id: new ObjectId(id) });
}

export async function updateStudent(id, studentData) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('Students').updateOne(
        { _id: new ObjectId(id) },
        { $set: studentData }
    );
}

export async function deleteStudent(id) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('Students').deleteOne({ _id: new ObjectId(id) });
}

export async function addTestToStudent(studentId, testId, status) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('Students').updateOne(
        { _id: new ObjectId(studentId) },
        { $push: { tests: { test_id: new ObjectId(testId), status } } }
    );
}

export async function updateTestStatus(studentId, testId, status) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('Students').updateOne(
        { _id: new ObjectId(studentId), 'tests.test_id': new ObjectId(testId) },
        { $set: { 'tests.$.status': status } }
    );
}