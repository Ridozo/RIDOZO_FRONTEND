"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../../redux/hooks';
// import { setLogin } from '../../../redux/riderSlice';
import styles from './rider-login.module.css';

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Logic: Local states for inputs
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Logic: Form Submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Redux Update: Data goes to store on login
    dispatch(setLogin({
      phone: phone,
      name: "JAT RIDER", 
      vehicle: "HR 26 BK 9922"
    }));

    // 2. Navigation: Redirect to dashboard
    router.push('/rider-dashboard');
  };

  return (
    <div className={styles.container}>
      <div className={styles.login_card}>
        {/* Logo Section */}
        <div className={styles.header}>
          <div className={styles.logo_icon}>R</div>
          <h1 className={styles.brand_name}>RIDO<span>ZO</span></h1>
          <p className={styles.subtitle}>Welcome Back to RIDOZO your (Rider Zone)</p>
          <h1 className={styles.title}>RIDER LOGIN</h1>
        </div>

        {/* Form Logic */}
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.input_group}>
            <label>MOBILE NUMBER</label>
            <input 
              type="tel" 
              placeholder="Enter 10 digit number" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required 
            />
          </div>

          <div className={styles.input_group}>
            <label>PASSWORD</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className={styles.btn_main}>
            LOGIN TO DASHBOARD
          </button>
        </form>

        {/* Navigation to Signup */}
        <div className={styles.footer}>
          <p>New Rider? <span onClick={() => router.push('../rider-signup')} className={styles.gold_text}>Register Now</span></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;