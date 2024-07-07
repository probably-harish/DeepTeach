import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link'

const quizzes = [
    { id: 1, title: 'Mathematics for Intelligent Systems 5', marks: 50, duration: '1hr' },
    { id: 2, title: 'Mock Quiz for GATE - CS core', marks: 50, duration: '1hr' },
    { id: 3, title: 'Python Programming Basics', marks: 50, duration: '1hr' },
    { id: 4, title: 'Mock Quiz for GATE- ML1', marks: 50, duration: '1hr' },
    { id: 4, title: 'Mock Quiz for GATE- ML2', marks: 50, duration: '1hr' },
    { id: 4, title: 'Mock Quiz for GATE- ML3', marks: 50, duration: '1hr' },
];

const StudentDashboard = () => {
    return (
        <div className="p-6">
            <div className="mb-6">
                <Input type="search" placeholder="Search using ExamID" className="max-w-sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quizzes.map((quiz) => (
                    <Link href={`/student/test/${quiz.id}`} key={quiz.id}>
                        <Card key={quiz.id}>
                            <CardHeader>{quiz.title}</CardHeader>
                            <CardContent>
                                <img src="/doodle.jpg" alt="Quiz" className="w-full h-32 object-cover mb-4" />
                                <p>{quiz.marks} Marks</p>
                                <p>Duration: {quiz.duration}</p>
                                <Button className="w-full mt-4">Take Quiz</Button>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

        </div>
    );
};

export default StudentDashboard;