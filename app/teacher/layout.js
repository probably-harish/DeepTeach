'use client'
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const { user, setUser } = useUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const response = await fetch('/api/teacher/data');
                if (!response.ok) {
                    throw new Error('Failed to fetch teacher data');
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching teacher data:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherData();
    }, [setUser, router]);

    const handleLogoutClick = async () => {
        try {
            const response = await fetch('/api/auth/logout', { method: 'POST' });
            if (response.ok) {
                setUser(null);
                router.push('/login');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <section>
            <div>
                <nav className="bg-white shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <Link href='/teacher'>
                                    <span className="text-xl font-semibold text-gray-800">Welcome, {user?.username}</span>
                                </Link>
                            </div>
                            <div className="flex items-center">
                                <Link href='/teacher/classes' title="classes" className="mx-3 text-gray-600 hover:text-gray-800">
                                    Classes
                                </Link>
                                <Link href='/teacher/profile' title="Profile" className="mx-3 text-gray-600 hover:text-gray-800">
                                    Profile
                                </Link>
                                <button onClick={handleLogoutClick} title="logout" className="mx-3 text-gray-600 hover:text-gray-800">
                                    <LogOut className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
            {children}
        </section>
    );
}