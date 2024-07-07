import React from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';
import Link from 'next/link';

function Hero() {
    return (
        <section id="hero" className={styles.hero}>
            <header className={styles.header}>
                <a href="home" className={styles.logoLink}>
                    <div className={styles.logo}>EvaluGATE</div>
                </a>
                <nav className={styles.nav}>
                    <Link href='/login' className={styles.loginButton}>Login</Link>
                </nav>
            </header>
            <div className={styles.heroContent}>
                <Image src="/Eclipse.svg"
                    width="100"
                    height="100"
                    alt="Background" className={styles.backgroundSvg} />
                <div className={styles.textContent}>
                    <h1 className={styles.title}>Welcome to EvaluGATE</h1>
                    <p className={styles.subtitle}>A platform where you seamlessly take and manage all your academic evaluations!</p>
                    <Link href='signup' className={styles.createAccountButton}>Create an account</Link>
                </div>
            </div>
        </section>
    );
}

export default Hero;
