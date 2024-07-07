import clientPromise from '../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function getQuestions() {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('QuestionBank').find({}).toArray();
}

export async function getQuestionById(id) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('QuestionBank').findOne({ _id: new ObjectId(id) });
}

export async function createQuestion(questionData) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('QuestionBank').insertOne(questionData);
}

export async function updateQuestion(id, questionData) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('QuestionBank').updateOne(
        { _id: new ObjectId(id) },
        { $set: questionData }
    );
}

export async function deleteQuestion(id) {
    const client = await clientPromise;
    return client.db('DeepTeach').collection('QuestionBank').deleteOne({ _id: new ObjectId(id) });
}