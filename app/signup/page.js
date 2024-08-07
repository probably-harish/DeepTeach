'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Signup = () => {
    const [activeButton, setActiveButton] = useState('admin');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    password,
                    role: activeButton === 'admin' ? 'teacher' : 'student'
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to sign up');
            }

            const data = await response.json();

            // Redirect based on user role
            if (data.user.role === 'teacher') {
                console.log('teacher role');
                router.push('/teacher');
            } else {
                console.log('student role');
                router.push('/student');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div style={styles.loginContainer}>
            <div style={styles.background}>
                <Image src="/Planet-1.svg" alt="Background" style={styles.backgroundImg} fill />
                <Image src="/Planet.svg" alt="Background" style={styles.backgroundImg2} width={500} height={500} />
                <Image src="/Eclipse.svg" alt="Background" style={styles.backgroundImg3} width={700} height={700} />
                <h1 style={styles.welcomeText}>DeepTeach.AI</h1>
            </div>
            <div style={styles.formContainer}>
                <h2 style={styles.header}>Create your account</h2>
                <div style={styles.formContent}>
                    <div style={styles.switchButtons}>
                        <button
                            style={{ ...styles.switchButton, ...(activeButton === 'admin' ? styles.active : {}) }}
                            onClick={() => handleButtonClick('admin')}
                        >
                            Admin
                        </button>
                        <button
                            style={{ ...styles.switchButton, ...(activeButton === 'student' ? styles.active : {}) }}
                            onClick={() => handleButtonClick('student')}
                        >
                            Student
                        </button>
                    </div>

                    <form style={styles.loginForm} onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Username"
                            style={styles.inputField}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            style={styles.inputField}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" style={styles.loginButton}>Sign up to DeepTeach.AI</button>
                        <div style={styles.termsText}>By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const styles = {
    loginContainer: {
        display: 'flex',
        height: '100vh',
    },
    background: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    backgroundImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
        marginRight: '60px',
    },
    backgroundImg2: {
        width: '50%',
        height: '50%',
        marginBottom: '300px',
        marginLeft: '300px',
        position: 'absolute',
    },
    backgroundImg3: {
        width: '80%',
        height: '80%',
        marginTop: '170px',
        marginRight: '190px',
    },
    welcomeText: {
        position: 'absolute',
        fontSize: '4.5rem',
        color: '#000',
        fontWeight: 'bold',
        fontFamily: "'IBM Plex Sans', sans-serif",
    },
    formContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fff',
        padding: '2rem',
    },
    header: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '2rem',
        fontFamily: "'IBM Plex Sans', sans-serif",
        background: 'none',
        border: 'none',
    },
    formContent: {
        width: '100%',
        maxWidth: '400px',
    },
    switchButtons: {
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontWeight: '600',
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1rem',
    },
    switchButton: {
        flex: 1,
        padding: '0.5rem 1rem',
        border: 'none',
        background: '#f0f0f0',
        color: '#333',
        cursor: 'pointer',
        transition: 'background 0.3s, color 0.3s',
        borderRadius: '20px',
        margin: '5px',
    },
    active: {
        background: '#000',
        color: '#fff',
    },
    loginForm: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputField: {
        padding: '0.75rem',
        marginBottom: '1rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    loginButton: {
        padding: '0.75rem',
        marginBottom: '1rem',
        border: 'none',
        background: '#000',
        color: '#fff',
        cursor: 'pointer',
        borderRadius: '4px',
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontWeight: '600',
    },
    divider: {
        textAlign: 'center',
        margin: '1rem 0',
        color: '#888',
    },
    googleButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem',
        border: '0.25px solid #ccc',
        background: '#fff',
        cursor: 'pointer',
        borderRadius: '2px',
        marginBottom: '1rem',
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontWeight: '400',
    },
    googleIcon: {
        marginRight: '20px',
    },
    termsText: {
        textAlign: 'center',
        color: '#888',
    },
    termsTextLink: {
        color: '#000',
        textDecoration: 'none',
    },
};

export default Signup;
