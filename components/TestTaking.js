"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

const TestTaking = ({ testName = 'Sample Test', duration = 3600 }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            const response = await fetch('/api/questions');
            const data = await response.json();
            setQuestions(data);
        };
        fetchQuestions();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className="p-6">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{testName}</h1>
                <div className="text-xl font-semibold">Time Left: {formatTime(timeLeft)}</div>
            </header>

            {questions.length > 0 && (
                <Tabs defaultValue="1" className="mb-6">
                    <TabsList>
                        {questions.map((q) => (
                            <TabsTrigger key={q._id} value={q._id.toString()}>{q._id}</TabsTrigger>
                        ))}
                    </TabsList>
                    {questions.map((q) => (
                        <TabsContent key={q._id} value={q._id.toString()}>
                            <Card>
                                <CardHeader>Question {q._id}</CardHeader>
                                <CardContent>
                                    <p className="mb-4">{q.question_text}</p>
                                    {q.options.map((option, index) => (
                                        <div key={index} className="mb-2">
                                            <label className="flex items-center">
                                                <input type="radio" name={`question-${q._id}`} value={option} className="mr-2" />
                                                {option}
                                            </label>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            )}

            <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentQuestion((prev) => Math.max(1, prev - 1))}>Previous</Button>
                <Button variant="outline" onClick={() => setCurrentQuestion((prev) => Math.min(questions.length, prev + 1))}>Next</Button>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
                <Link href='/student'><Button variant="outline">Save and Exit</Button></Link>
                <Button variant="default">Submit</Button>
            </div>
        </div>
    );
};

export default TestTaking;
