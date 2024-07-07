import clientPromise from '../lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function findTeacherByUsername(username) {
    const client = await clientPromise;
    const db = client.db('DeepTeach');
    return db.collection('Teachers').findOne({ username });
}

export async function createTeacher(teacherData) {
    const client = await clientPromise;
    const db = client.db('DeepTeach');
    const hashedPassword = await bcrypt.hash(teacherData.password, 10);

    const newTeacher = {
        teacher_id: `S${Math.floor(10000 + Math.random() * 90000)}`,
        username: teacherData.username,
        password: hashedPassword,
        classes: [],
        tests: []
    };

    const result = await db.collection('Teachers').insertOne(newTeacher);
    return { ...newTeacher, _id: result.insertedId, password: undefined };
}

export function generateToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
}

export async function getTeachers() {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('Teachers').find({}).toArray();
}

export async function getTeacherById(id) {
    const client = await clientPromise;
    const db = client.db('DeepTeach');
    return db.collection('Teachers').findOne({ _id: new ObjectId(id) });
}

export async function updateTeacher(id, teacherData) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('Teachers').updateOne(
        { _id: new ObjectId(id) },
        { $set: teacherData }
    );
}

export async function deleteTeacher(id) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('Teachers').deleteOne({ _id: new ObjectId(id) });
}

export async function addTestCreated(teacherId, testId) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('Teachers').updateOne(
        { _id: new ObjectId(teacherId) },
        { $addToSet: { tests_created: new ObjectId(testId) } }
    );
}