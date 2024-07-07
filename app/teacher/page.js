'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, PlusCircle, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TeacherDashboard = () => {
    const [teacherData, setTeacherData] = useState(null);
    const [tests, setTests] = useState([]);
    const [classNames, setClassNames] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const response = await fetch('/api/teacher/data');
                if (!response.ok) {
                    throw new Error('Failed to fetch teacher data');
                }
                const data = await response.json();
                setTeacherData(data);

                // Fetch tests data
                const testsIds = data.tests || [];
                const testsPromises = testsIds.map(id =>
                    fetch(`/api/tests?testId=${id}`).then(res => res.json())
                );

                const testsData = await Promise.all(testsPromises);
                setTests(testsData.flat());

                // Fetch class names (if needed)
                // This is a placeholder. You may need to implement this API
                const classPromises = testsData.flat().map(test =>
                    fetch(`/api/classes/${test.class_id}`).then(res => res.json())
                );
                const classData = await Promise.all(classPromises);
                const classNamesMap = {};
                classData.forEach(classInfo => {
                    classNamesMap[classInfo._id] = classInfo.class_name;
                });
                setClassNames(classNamesMap);

            } catch (err) {
                console.error('Error fetching teacher data:', err);
                setError('Failed to load teacher data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherData();
    }, []);

    function handleNewTest() {
        router.push('/teacher/create-test');
    }

    const handleDeleteTest = async (testId, classId, teacherId) => {
        try {
            const response = await fetch(`/api/test/delete?testId=${testId}&classId=${classId}&teacherId=${teacherId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete test');
            }

            const responseData = await response.json();
            console.log(`Deleted test: ${testId}, class: ${classId}, teacher: ${teacherId}`);
            // Update your UI here
            setTests(prevTests => prevTests.filter(test => test._id !== testId));
        } catch (err) {
            console.error('Error deleting test:', err);
            setError('Failed to delete test. Please try again later.');
        }
    };

    const filteredTests = tests.filter(test =>
        test.test_name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    if (loading) {
        return <div className='flex-row mx-auto font-serif font-bold justify-center'>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="max-w-7xl mx-auto py-3 sm:px-6 lg:px-8">
                <div className="px-2 py-1 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
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
                        <div className="space-x-4">
                            <Button onClick={handleNewTest} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                <PlusCircle className="h-5 w-5 inline-block mr-2" />
                                Create New Test
                            </Button>
                            <Button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                                <Upload className="h-5 w-5 inline-block mr-2" />
                                Import Test
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTests.map((test) => (
                            <div key={test._id} className="bg-white overflow-hidden shadow-sm rounded-lg">
                                <Image src={test.image || '/doodle.jpg'} width={300} height={200} alt={test.test_name} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800">{test.test_name}</h3>
                                    <p className="text-sm text-gray-600">Class: {classNames[test.class_id] || 'Unknown'}</p>
                                    <p className="text-sm text-gray-600">Questions: {test.question_count}</p>
                                    <p className="text-sm text-gray-600">Coding Questions: {test.question_count_coding}</p>
                                    <p className="text-sm text-gray-600">Start: {new Date(test.start_time).toLocaleString()}</p>
                                    <p className="text-sm text-gray-600">End: {new Date(test.end_time).toLocaleString()}</p>
                                    <div className="mt-2 flex justify-between items-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${new Date() < new Date(test.start_time) ? 'bg-yellow-100 text-yellow-800' :
                                            new Date() > new Date(test.end_time) ? 'bg-gray-100 text-gray-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                            {new Date() < new Date(test.start_time) ? 'Upcoming' :
                                                new Date() > new Date(test.end_time) ? 'Completed' :
                                                    'Active'}
                                        </span>
                                        <Button
                                            className="text-red-500 hover:text-red-700 focus:outline-none"
                                            onClick={() => handleDeleteTest(test._id, test.class_id, test.teacher_id)}
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;
