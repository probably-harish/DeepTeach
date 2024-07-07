'use client'

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function StudentClasses() {
    const [classes, setClasses] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        const response = await fetch(`/api/classes/student?studentId=${user._id}`);
        if (response.ok) {
            const data = await response.json();
            setClasses(data);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-8">
            <Card className="bg-white shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center">
                        <BookOpen className="mr-2 h-6 w-6" />
                        Your Classes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {classes.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {classes.map(cls => (
                                <Card key={cls._id} className="bg-gray-50 hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-lg">{cls.class_name}</h3>
                                        <p className="text-sm text-gray-600">Teacher: {cls.teacher_name || 'Not assigned'}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-8">You are not enrolled in any classes yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}