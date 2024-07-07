export async function createStudentTest(testId, studentId, questions) {
    const client = await clientPromise;
    const db = client.db('DeepTeach');
    const studentTest = {
        test_id: new ObjectId(testId),
        student_id: new ObjectId(studentId),
        questions: questions.map(q => ({ question_id: q._id, student_answer: null, marks_awarded: 0 })),
        total_marks_obtained: 0,
        start_time: new Date(),
        status: 'in_progress'
    };
    return db.collection('StudentTest').insertOne(studentTest);
}

export async function gradeTest(studentTestId, answers) {
    // Implement grading logic here
}

// models/question.js
export async function selectRandomQuestions(count, difficultyDistribution) {
    const client = await clientPromise;
    const db = client.db('DeepTeach');
    // Implement logic to select random questions based on count and difficulty distribution
}