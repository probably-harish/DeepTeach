"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { Search, Book, Code, Calendar } from 'lucide-react';

const StudentDashboard = () => {
    const router = useRouter();
    const { user, setUser } = useUser();
    const [loading, setLoading] = useState(true);
    const [tests, setTests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await fetch('/api/student/data');
                if (!response.ok) {
                    throw new Error('Failed to fetch student data');
                }
                const data = await response.json();
                setUser(data);
                const testsAssignedIds = data.testsAssigned;
                const testsPromises = testsAssignedIds.map(id =>
                    fetch(`/api/tests?testId=${id}`).then(res => res.json())
                );
                const testsData = await Promise.all(testsPromises);
                setTests(testsData.flat());
            } catch (error) {
                console.error('Error fetching student data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudentData();
    }, [setUser, router]);

    const handleTakeQuiz = async (testId, testSubject) => {
        try {
            const response = await fetch('/api/tests/assign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ testId, studentId: user._id, subject: testSubject })
            });
            const data = await response.json();
            if (data.success) {
                router.push(`/student/test/${data.testInstanceId}`);
            } else {
                console.error('Failed to create test instance');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const filteredTests = tests.filter(test =>
        test.test_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center space-x-2 mb-8">
                <Search className="text-gray-400" />
                <Input
                    type="search"
                    placeholder="Search tests..."
                    className="max-w-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTests.map((test) => (
                    <Card key={test._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <img src="/doodle.jpg" alt="Quiz" className="w-full h-48 object-cover" />
                        <CardHeader>
                            <CardTitle>{test.test_name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Book className="mr-2 h-4 w-4" />
                                    <span>Questions: {test.question_count}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Code className="mr-2 h-4 w-4" />
                                    <span>Coding Questions: {test.question_count_coding}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>Start: {new Date(test.start_time).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>End: {new Date(test.end_time).toLocaleString()}</span>
                                </div>
                            </div>
                            <Button
                                className="w-full"
                                onClick={() => handleTakeQuiz(test._id, test.subject)}
                            >
                                Take Quiz
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default StudentDashboard;