"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './cmsignup.module.css';
import { authService } from '../../../services/auth.service';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', location: '' });
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
  const [token, setToken] = useState<string>('');
  const [otp, setOtp] = useState({
    mobileOtp: '',
    emailOtp: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePass = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp({ ...otp, [e.target.name]: e.target.value });
  };

  const verifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (otp.mobileOtp.length !== 6 || otp.emailOtp.length !== 6) {
      alert('Please enter valid 6-digit OTPs');
      return;
    }

    try {
      const res = await authService.verifyOtp({
        email: formData.email,
        mobileNo: formData.phone,
        mobileOtp: otp.mobileOtp,
        emailOtp: otp.emailOtp,
      });
      setToken(res.token);
      setStep(3);
    } catch (error) {
      alert("Invalid OTP, please try again.");
    }
  };

  const setpassword = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await authService.setPassword({
        token,
        newPassword: passwords.password,
        confirmPassword: passwords.confirmPassword,
      });
      console.log(res);
      router.push('/auth/user-login');
    } catch (error) {
      alert("Error setting password.");
    }
  };

  const signUp = async () => {
    const payload = {
      fullName: formData.name,
      email: formData.email,
      mobileNo: formData.phone,
      city: formData.location,
      isActive: true,
    }
    await authService.userSignup(payload);
  };

  const isMatch = passwords.password !== '' && passwords.password === passwords.confirmPassword;

  return (
    <div className={styles.signup_full_page}>
      <div className={styles.signup_form_card}>

        <div className={styles.point_container}>
          <span className={styles.welcome_point_text}>Welcome to Bhopal</span>
        </div>

        <div className={styles.brand_logo_center}>
          RIDO<span>ZO</span>
        </div>

        {/* Step 1: Registration Form */}
        {step === 1 && (
          <form
            className={styles.fade_in}
            onSubmit={async (e) => {
              e.preventDefault();
              await signUp();
              setStep(2);
            }}
          >
            <div className={styles.input_group_block}>
              <label className={styles.label_text}>Full Name</label>
              <input name="name" className={styles.standard_input} placeholder="John Doe" required onChange={handleChange} />
            </div>
            <div className={styles.input_group_block}>
              <label className={styles.label_text}>Email Address</label>
              <input name="email" type="email" className={styles.standard_input} placeholder="name@example.com" required onChange={handleChange} />
            </div>
            <div className={styles.input_group_block}>
              <label className={styles.label_text}>Phone Number</label>
              <input name="phone" type="tel" className={styles.standard_input} placeholder="+91 00000 00000" required onChange={handleChange} />
            </div>
            <div className={styles.input_group_block}>
              <label className={styles.label_text}>Location</label>
              <input name="location" className={styles.standard_input} placeholder="e.g. MP Nagar" required onChange={handleChange} />
            </div>
            <button type="submit" className={styles.btn_finish_reg}>Send OTP</button>
            <p className={styles.footer_link_text}>
              Already have an account? <a href="/auth/user-login">Log in</a>
            </p>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form className={styles.fade_in} onSubmit={verifyOtp}>
            <h2 className={styles.welcome_user_msg}>Hello, {formData.name}!</h2>
            <p className={styles.sub_text}>Verify your identity</p>

            <div className={styles.input_group_block}>
              <label className={styles.label_text}>Mobile OTP (Sent to {formData.phone})</label>
              <input
                name="mobileOtp"
                className={styles.standard_input}
                maxLength={6}
                value={otp.mobileOtp}
                onChange={handleOtpChange}
                required
                style={{ textAlign: 'center', letterSpacing: '8px', fontWeight: 'bold' }}
                placeholder="000000"
              />
            </div>

            <div className={styles.input_group_block}>
              <label className={styles.label_text}>Email OTP (Sent to {formData.email})</label>
              <input
                name="emailOtp"
                className={styles.standard_input}
                maxLength={6}
                value={otp.emailOtp}
                onChange={handleOtpChange}
                required
                style={{ textAlign: 'center', letterSpacing: '8px', fontWeight: 'bold' }}
                placeholder="000000"
              />
            </div>

            <button type="submit" className={styles.btn_finish_reg}>Verify OTP</button>
          </form>
        )}

        {/* Step 3: Set Password */}
        {step === 3 && (
          <form className={styles.fade_in} onSubmit={setpassword}>
            <h2 className={styles.welcome_user_msg}>Set Password</h2>

            <div className={styles.input_group_block}>
              <label className={styles.label_text}>New Password</label>
              <input name="password" type="password" className={styles.standard_input} onChange={handlePass} required />
            </div>

            <div className={styles.input_group_block}>
              <label className={styles.label_text}>Confirm Password</label>
              <input name="confirmPassword" type="password" className={styles.standard_input} onChange={handlePass} required />
            </div>

            <button type="submit" className={styles.btn_finish_reg} disabled={!isMatch}>Complete Signup</button>
            {!isMatch && passwords.confirmPassword && (
              <p className={styles.error_msg}>Passwords do not match!</p>
            )}
          </form>
        )}

      </div>
    </div>
  );
}