'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';  // Changed from 'next/navigation'
import { Search, PlusCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TeacherDashboard = () => {
    const [teacherData, setTeacherData] = useState(null);
    const [tests, setTests] = useState([]);
    const [classNames, setClassNames] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                const fetchedTests = data.tests || [];
                setTests(fetchedTests);

                // // Fetch class names for each test
                // const classNamesMap = {};
                // const fetchClassNamesPromises = fetchedTests.map(async (test) => {
                //     const classId = '668588e46e6f9997fbae8947';
                //     if (!classNamesMap[classId]) {
                //         const response = await fetch(`/api/classes/${classId}`);
                //         if (response.ok) {
                //             const { className } = await response.json();
                //             classNamesMap[classId] = className.class_name;
                //         } else {
                //             classNamesMap[classId] = 'Unknown';
                //         }
                //     }
                // });

                // // Wait for all class name fetches to complete
                // await Promise.all(fetchClassNamesPromises);

                // // Set the classNames state
                // setClassNames(classNamesMap);
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
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search tests..."
                                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
                        {tests.map((test) => (
                            <div key={test.id} className="bg-white overflow-hidden shadow-sm rounded-lg">
                                <Image src={test.image || '/doodle.jpg'} width={300} height={200} alt={test.test_name} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800">{test.name}</h3>
                                    <p className="text-sm text-gray-600">Class: {classNames[test.class_id] || 'Unknown'}</p>
                                    <div className="mt-2">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${test.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            test.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {test.status}
                                        </span>
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
