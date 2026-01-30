"use client";
import React, { useState } from 'react';
import './cmsignup.css';

export default function SignupPage() {
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', location: '' });
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePass = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
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
          <form className="fade_in" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
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
            <button type="submit" className="btn_finish_reg">Send OTP</button>
            <p style={{marginTop: '25px', fontSize: '14px', color: '#666'}}>
            Already have an account? <a href="/signup" style={{color: '#000', fontWeight: '700', textDecoration: 'none'}}>Log in</a>
          </p>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="fade_in">
            <h2 className="welcome_user_msg">Hello, {formData.name}!</h2>
            <p style={{color: '#777', fontSize: '14px', marginBottom: '20px'}}>Verify your identity</p>
            
            <div className="input_group_block">
              <label className="label_text">Mobile OTP (Sent to {formData.phone})</label>
              <input className="standard_input" maxLength={6} style={{textAlign: 'center', letterSpacing: '4px'}} placeholder="000000" />
            </div>
            <div className="input_group_block">
              <label className="label_text">Email OTP (Sent to {formData.email})</label>
              <input className="standard_input" maxLength={6} style={{textAlign: 'center', letterSpacing: '4px'}} placeholder="000000" />
            </div>
            <button className="btn_finish_reg" onClick={() => setStep(3)}>Verify OTP</button>
          </div>
        )}

        {/* Step 3: Password Setup */}
        {step === 3 && (
          <div className="fade_in">
            <h2 className="welcome_user_msg">Set Password</h2>
            <p style={{color: '#777', fontSize: '14px', marginBottom: '20px'}}>Create a secure password</p>
            
            <div className="input_group_block">
              <label className="label_text">New Password</label>
              <input name="password" type="password" className="standard_input" placeholder="Min. 8 characters" onChange={handlePass} />
            </div>
            <div className="input_group_block">
              <label className="label_text">Confirm Password</label>
              <input name="confirmPassword" type="password" className="standard_input" placeholder="Repeat password" onChange={handlePass} />
            </div>
            <button className="btn_finish_reg" disabled={!isMatch} onClick={() => alert("Registration Successful!")}>
              Complete Signup
            </button>
            {!isMatch && passwords.confirmPassword !== '' && (
              <p style={{color: '#ff4d4d', fontSize: '12px', marginTop: '10px', fontWeight: '600'}}>Passwords do not match!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}