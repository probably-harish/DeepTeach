'use client'
import React, { useState, useEffect } from 'react';
import TestCreationModal from '@/components/TestCreation';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';

const CreateTestPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [classes, setClasses] = useState([]);
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        const response = await fetch(`/api/classes/teacher?teacherId=${user._id}`);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            setClasses(data);
        }
    };

    return (
        <div>
            <TestCreationModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    router.push('/teacher')
                }
                }
                classes={classes}
            />
        </div>
    );
};

export default CreateTestPage;