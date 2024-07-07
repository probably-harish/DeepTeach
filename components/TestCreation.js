"use client"

import React, { useState } from 'react';
import { PlusCircle, Trash2, Clock, Users, CheckSquare, X } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const availableSubjects = [
    'QuestionBank',
    'MACHINE-LEARNING',
    'AI',
    'DS',
    'LinearAlgebra' // Add the exact name of the database collection here for adding more subjects
]
const TestCreationModal = ({ isOpen, onClose, classes }) => {
    const { user } = useUser();
    const [testDetails, setTestDetails] = useState({
        title: '',
        class: '',
        startTime: '',
        endTime: '',
        questionCount: 10,
        questionCountCoding: 0,
        subject: ''
    });

    const handleInputChange = (field, value) => {
        setTestDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleCreateTest = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/tests/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                testName: testDetails.title,
                classId: testDetails.class,
                teacherId: user._id,
                startTime: testDetails.startTime,
                endTime: testDetails.endTime,
                questionCount: testDetails.questionCount,
                questionCountCoding: testDetails.questionCountCoding,
                subject: testDetails.subject
            }),
        });

        if (response.ok) {
            console.log('Test created successfully');
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Test</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateTest} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Test Title</Label>
                        <Input
                            id="title"
                            value={testDetails.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Enter test title"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Select onValueChange={(value) => handleInputChange('class', value)} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {classes.map(cls => (
                                    <SelectItem key={cls._id} value={cls._id}>{cls.class_name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select onValueChange={(value) => handleInputChange('subject', value)} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Subject" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {availableSubjects.map(cls => (
                                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startTime">Start Time</Label>
                            <Input
                                type="datetime-local"
                                id="startTime"
                                value={testDetails.startTime}
                                onChange={(e) => handleInputChange('startTime', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endTime">End Time</Label>
                            <Input
                                type="datetime-local"
                                id="endTime"
                                value={testDetails.endTime}
                                onChange={(e) => handleInputChange('endTime', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="questionCount">Number of Questions</Label>
                        <Input
                            type="number"
                            id="questionCount"
                            value={testDetails.questionCount}
                            onChange={(e) => handleInputChange('questionCount', parseInt(e.target.value))}
                            min="1"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="questionCountCoding">Number of Coding Questions</Label>
                        <Input
                            type="number"
                            id="questionCountCoding"
                            value={testDetails.questionCountCoding}
                            onChange={(e) => handleInputChange('questionCountCoding', parseInt(e.target.value))}
                            min="1"
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        <CheckSquare className="mr-2 h-4 w-4" /> Create Test
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TestCreationModal;