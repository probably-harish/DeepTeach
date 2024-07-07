'use client'
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const { user, setUser } = useUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await fetch('/api/student/data');
                if (!response.ok) {
                    throw new Error('Failed to fetch student data');
                }
                const data = await response.json();
                setUser(data);
                console.log('this is student data form student/layout.js', data)
            } catch (error) {
                console.error('Error fetching student data:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
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
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href='/student'>
                                <span className="text-xl font-semibold text-gray-800">Welcome, {user?.username}</span>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href='/student/classes' className="text-gray-600 hover:text-gray-800 transition-colors">
                                Classes
                            </Link>
                            <Link href='/student/profile' className="text-gray-600 hover:text-gray-800 transition-colors">
                                Profile
                            </Link>
                            <Button variant="ghost" onClick={handleLogoutClick} title="logout">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}