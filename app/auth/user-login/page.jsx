"use client";
import React, { useState } from 'react';
import './cmlogin.css';

export default function LoginPage() {
  const [method, setMethod] = useState('password'); 
  const [otpSent, setOtpSent] = useState(false);
  const [identifier, setIdentifier] = useState('');

  const handleSendOtp = (e) => {
    e.preventDefault();
    if(identifier.length > 5) {
      setOtpSent(true);
    } else {
      alert("Please enter a valid Phone or Email");
    }
  };

  return (
    <div className="signup_full_page">
      <div className="signup_form_card">
        
        <div className="point_container">
          <span className="welcome_point_text">Welcome back to Bhopal</span>
        </div>
        <div className="brand_logo_center">RIDO<span>ZO</span></div>

        {/* Login Method Toggle */}
        <div className="method_toggle_container">
          <button 
            type="button"
            className="tab_btn"
            style={{ 
              backgroundColor: method === 'password' ? '#ffcc00' : '#f5f5f5',
              color: method === 'password' ? '#000' : '#888'
            }}
            onClick={() => { setMethod('password'); setOtpSent(false); }}
          >
            Password
          </button>
          <button 
            type="button"
            className="tab_btn"
            style={{ 
              backgroundColor: method === 'otp' ? '#ffcc00' : '#f5f5f5',
              color: method === 'otp' ? '#000' : '#888'
            }}
            onClick={() => setMethod('otp')}
          >
            OTP Login
          </button>
        </div>

        <div className="fade_in">
          {/* Step 1: Email/Phone Input (Common for both) */}
          {!otpSent && (
            <div className="input_group_block">
              <label className="label_text">Email or Phone Number</label>
              <input 
                className="standard_input" 
                placeholder="Enter your details" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required 
              />
            </div>
          )}

          {/* PASSWORD FLOW */}
          {method === 'password' && (
            <form className="fade_in">
              <div className="input_group_block">
                <label className="label_text">Password</label>
                <input type="password" className="standard_input" placeholder="********" required />
              </div>
              <button type="submit" className="btn_finish_reg">Login Now</button>
            </form>
          )}

          {/* OTP FLOW */}
          {method === 'otp' && (
            <div className="fade_in">
              {!otpSent ? (
                <button type="button" className="btn_finish_reg" onClick={handleSendOtp}>
                  Send OTP
                </button>
              ) : (
                <form className="fade_in">
                  <p style={{fontSize: '13px', color: '#666', marginBottom: '15px'}}>
                    OTP sent to <b>{identifier}</b>
                  </p>
                  <div className="input_group_block">
                    <label className="label_text">Enter OTP</label>
                    <input 
                      className="standard_input" 
                      placeholder="000000" 
                      maxLength={6} 
                      style={{textAlign: 'center', letterSpacing: '4px', fontWeight: '800'}}
                      required 
                    />
                  </div>
                  <button type="submit" className="btn_finish_reg">Verify & Login</button>
                  <button 
                    type="button" 
                    onClick={() => setOtpSent(false)}
                    style={{ background: 'none', border: 'none', color: '#888', marginTop: '15px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                  >
                    Change Number / Resend
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        <p style={{marginTop: '30px', fontSize: '14px', color: '#666'}}>
          Dont have an account? <a href="/signup" style={{color: '#000', fontWeight: '800', textDecoration: 'none'}}>Sign Up</a>
        </p>
      </div>
    </div>
  );
}