"use client";
import React, { useState } from 'react';
import './cmsignup.css';
import { authService } from '../../../services/auth.service';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', location: '' });
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
  const[token, setToken] = useState('');
  const [otp, setOtp] = useState({
  mobileOtp: '',
  emailOtp: '',
});


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePass = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
  setOtp({ ...otp, [e.target.name]: e.target.value });
};


const verifyOtp = async (e) => {
  e.preventDefault();

  if (otp.mobileOtp.length !== 6 || otp.emailOtp.length !== 6) {
    alert('Please enter valid OTPs');
    return;
  }

  console.log(otp);
 const res =   await authService.verifyOtp({
    email:formData.email,
    mobileNo: formData.phone,
    mobileOtp: otp.mobileOtp,
    emailOtp: otp.emailOtp,
  });

  setToken(res.resetToken);
console.log(token);


  setStep(3);
};

const setpassword = async () => {
  const res = await authService.setPassword({
    token,
    newPassword: passwords.password,
    confirmPassword: passwords.confirmPassword,
  });
  console.log(res);
 navigator.push('/auth/user-login');
};


  const signUp = async () => {

    const payload = {
      fullName: formData.name,
      email: formData.email,
      mobileNo: formData.phone,
      city: formData.location,
      isActive: true,
    }
    const response = await authService.userSignup(payload);
    console.log(response);
  };

  const isMatch = passwords.password !== '' && passwords.password === passwords.confirmPassword;

  return (
    <div className="signup_full_page">
      <div className="signup_form_card">

        <div className="point_container">
          <span className="welcome_point_text">Welcome to Bhopal</span>
        </div>

        <div className="brand_logo_center">
          RIDO<span>ZO</span>
        </div>

        {/* Step 1: Registration Form */}
        {step === 1 && (
          <form
            className="fade_in"
            onSubmit={async (e) => {
              e.preventDefault();
              await signUp();
              setStep(2);
            }}
          >
            <div className="input_group_block">
              <label className="label_text">Full Name</label>
              <input name="name" className="standard_input" placeholder="John Doe" required onChange={handleChange} />
            </div>
            <div className="input_group_block">
              <label className="label_text">Email Address</label>
              <input name="email" type="email" className="standard_input" placeholder="name@example.com" required onChange={handleChange} />
            </div>
            <div className="input_group_block">
              <label className="label_text">Phone Number</label>
              <input name="phone" type="tel" className="standard_input" placeholder="+91 00000 00000" required onChange={handleChange} />
            </div>
            <div className="input_group_block">
              <label className="label_text">Location</label>
              <input name="location" className="standard_input" placeholder="e.g. MP Nagar" required onChange={handleChange} />
            </div>
            <button type="submit" className="btn_finish_reg" onSubmit={(e) => { e.preventDefault(); signUp(); }}>Send OTP</button>
            <p style={{ marginTop: '25px', fontSize: '14px', color: '#666' }}>
              Already have an account? <a href="/signup" style={{ color: '#000', fontWeight: '700', textDecoration: 'none' }}>Log in</a>
            </p>
          </form>
        )}

       {/* Step 2: OTP Verification */}
{step === 2 && (
  <form className="fade_in" onSubmit={verifyOtp}>
    <h2 className="welcome_user_msg">Hello, {formData.name}!</h2>
    <p style={{ color: '#777', fontSize: '14px', marginBottom: '20px' }}>
      Verify your identity
    </p>

    <div className="input_group_block">
      <label className="label_text">
        Mobile OTP (Sent to {formData.phone})
      </label>
      <input
        name="mobileOtp"
        className="standard_input"
        maxLength={6}
        value={otp.mobileOtp}
        onChange={handleOtpChange}
        required
        style={{ textAlign: 'center', letterSpacing: '4px' }}
        placeholder="000000"
      />
    </div>

    <div className="input_group_block">
      <label className="label_text">
        Email OTP (Sent to {formData.email})
      </label>
      <input
        name="emailOtp"
        className="standard_input"
        maxLength={6}
        value={otp.emailOtp}
        onChange={handleOtpChange}
        required
        style={{ textAlign: 'center', letterSpacing: '4px' }}
        placeholder="000000"
      />
    </div>

    <button type="submit" className="btn_finish_reg">
      Verify OTP
    </button>
  </form>
)}


       {step === 3 && (
  <form className="fade_in" onSubmit={setpassword}>
    <h2 className="welcome_user_msg">Set Password</h2>

    <div className="input_group_block">
      <label className="label_text">New Password</label>
      <input
        name="password"
        type="password"
        className="standard_input"
        onChange={handlePass}
        required
      />
    </div>

    <div className="input_group_block">
      <label className="label_text">Confirm Password</label>
      <input
        name="confirmPassword"
        type="password"
        className="standard_input"
        onChange={handlePass}
        required
      />
    </div>

    <button
      type="submit"
      className="btn_finish_reg"
      disabled={!isMatch}
    >
      Complete Signup
    </button>

    {!isMatch && passwords.confirmPassword && (
      <p style={{ color: '#ff4d4d', fontSize: '12px' }}>
        Passwords do not match!
      </p>
    )}
  </form>
)}

      </div>
    </div>
  );
}