'use client'

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ClassesManagement() {
    const [classes, setClasses] = useState([]);
    const [newClassName, setNewClassName] = useState('');
    const { user } = useUser();

    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        fetchClasses();
        fetchStudents();
    }, []);

    const fetchClasses = async () => {
        const response = await fetch(`/api/classes/teacher?teacherId=${user._id}`);
        if (response.ok) {
            const data = await response.json();
            setClasses(data);
        }
    };

    const fetchStudents = async () => {
        const response = await fetch('/api/student');
        if (response.ok) {
            const data = await response.json();
            setStudents(data);
        }
    };

    const handleCreateClass = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/classes/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ className: newClassName, teacherId: user._id }),
        });
        if (response.ok) {
            setNewClassName('');
            fetchClasses();
        }
    };

    const handleAddStudent = async () => {
        if (!selectedClass || !selectedStudent) return;

        const response = await fetch('/api/classes/addStudent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ classId: selectedClass, studentId: selectedStudent }),
        });

        if (response.ok) {
            fetchClasses();
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-8">
            <Card className="bg-white shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Create New Class</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateClass} className="flex gap-4">
                        <Input
                            type="text"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                            placeholder="New Class Name"
                            className="flex-grow"
                        />
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            <PlusCircle className="mr-2 h-4 w-4" /> Create Class
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Your Classes</CardTitle>
                </CardHeader>
                <CardContent>
                    {classes.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {classes.map(cls => (
                                <Card key={cls._id} className="bg-gray-50 hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-lg">{cls.class_name}</h3>
                                        <p className="text-sm text-gray-600">Students: {cls.students?.length || 0}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No classes created yet.</p>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Add Student to Class</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Select onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                                {classes.map(cls => (
                                    <SelectItem key={cls._id} value={cls._id}>{cls.class_name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={setSelectedStudent}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Student" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                                {students.map(student => (
                                    <SelectItem key={student._id} value={student._id}>{student.username}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleAddStudent} className="bg-green-600 hover:bg-green-700">
                            <UserPlus className="mr-2 h-4 w-4" /> Add Student
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}