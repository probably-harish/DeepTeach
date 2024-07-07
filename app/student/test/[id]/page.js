'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Save, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';

export default function TestPage({ params }) {
    const [test, setTest] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState({});
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetchTest();
    }, []);

    const fetchTest = async () => {
        try {
            const response = await fetch(`/api/tests/${params.id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTest(data);
            setResponses(data.responses || {});
        } catch (error) {
            console.error('Error fetching test:', error);
            setError(`Failed to fetch test: ${error.message}`);
        }
    };

    const handleAnswer = (questionId, answer) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const saveProgress = async () => {
        try {
            await fetch(`/api/tests/${params.id}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ responses, state: 'in_progress' })
            });
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    const submitTest = async () => {
        try {
            await fetch(`/api/tests/${params.id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ responses, state: 'completed' })
            });
            router.push('/student/');
        } catch (error) {
            console.error('Error submitting test:', error);
        }
    };

    if (!test) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    const currentQuestion = test.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <Card className="bg-white shadow-lg">
                <CardHeader className="border-b">
                    <CardTitle className="text-2xl font-bold">{test.test_name}</CardTitle>
                    <Progress value={progress} className="mt-2" />
                </CardHeader>
                <CardContent className="p-6">
                    <ScrollArea className="h-[calc(80vh-200px)]">
                        <h2 className="text-xl font-semibold mb-4">Question {currentQuestionIndex + 1}</h2>
                        <p className="mb-6 text-gray-700">{currentQuestion.question_text}</p>
                        {currentQuestion.question_type === 'coding' ? (
                            <CodeMirror
                                value={responses[currentQuestion._id] || ''}
                                height="300px"
                                extensions={[python()]}
                                onChange={(value) => handleAnswer(currentQuestion._id, value)}
                                theme="dark"
                                className="border rounded-md"
                            />
                        ) : (
                            <div className="space-y-2">
                                {currentQuestion.options.map((option, index) => (
                                    <Button
                                        key={index}
                                        variant={responses[currentQuestion._id] === option ? "default" : "outline"}
                                        className={`w-full justify-start text-left ${responses[currentQuestion._id] === option ? "bg-blue-600 text-white" : ""}`}
                                        onClick={() => handleAnswer(currentQuestion._id, option)}
                                    >
                                        {option}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={() => setCurrentQuestionIndex(prev => Math.min(test.questions.length - 1, prev + 1))}
                        disabled={currentQuestionIndex === test.questions.length - 1}
                    >
                        Next
                    </Button>
                </CardFooter>
            </Card>

            <div className="mt-6">
                <Pagination>
                    <PaginationContent>
                        {test.questions.map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    onClick={() => setCurrentQuestionIndex(index)}
                                    isActive={currentQuestionIndex === index}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                    </PaginationContent>
                </Pagination>
            </div>

            <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={saveProgress}>
                    <Save className="mr-2 h-4 w-4" /> Save Progress
                </Button>
                <Button onClick={submitTest} className="bg-green-600 hover:bg-green-700">
                    <Send className="mr-2 h-4 w-4" /> Submit Test
                </Button>
            </div>

            {error && (
                <Alert variant="destructive" className="mt-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}