"use client";
import React, { useState } from 'react';
import './rider-login.css';

export default function RiderLogin() {
  const [method, setMethod] = useState('password');
  const [isOtpSent, setIsOtpSent] = useState(false); // ओटीपी भेजा गया या नहीं
  const [identifier, setIdentifier] = useState('');
  const [secret, setSecret] = useState('');

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Handles login submission
 * If identifier is empty, alerts the user to enter phone or email
 * Otherwise, alerts the user with a success message
 * @returns {void}
 */
/*******  7e3fc964-2fce-40bd-b3f2-9ea156a760d6  *******/  const handleSendOtp = () => {
    if (!identifier) return alert("Please enter mobile number");
    // यहाँ ओटीपी भेजने का लॉजिक आएगा
    setIsOtpSent(true);
    alert("OTP sent successfully to " + identifier);
  };

  const handleLogin = () => {
    alert(`RIDOZO: Logging in via ${method.toUpperCase()}`);
  };

  return (
    <div className="ridozo_container">
      <div className="login_card fade_in">
        
        <div className="brand_logo">RIDO<span>ZO</span></div>
        <p className="partner_text">Partner Portal</p>

        {/* TOP TAB SWITCHER */}
        <div className="tab_container">
          <button 
            className={`tab_btn ${method === 'password' ? 'active' : ''}`}
            onClick={() => { setMethod('password'); setSecret(''); setIsOtpSent(false); }}
          >
            Password
          </button>
          <button 
            className={`tab_btn ${method === 'otp' ? 'active' : ''}`}
            onClick={() => { setMethod('otp'); setSecret(''); setIsOtpSent(false); }}
          >
            OTP Login
          </button>
        </div>

        <div className="form_wrapper fade_in" key={method}>
          {/* Mobile / Email Input */}
          <div className="input_group">
            <label>Mobile Number / Email</label>
            <input 
              type="text" 
              placeholder="Enter details" 
              className="main_input"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={method === 'otp' && isOtpSent} // ओटीपी भेजने के बाद नंबर लॉक कर दिया
            />
          </div>

          {/* Logic for Password Method */}
          {method === 'password' && (
            <div className="fade_in">
              <div className="input_group">
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="main_input"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                />
              </div>
              <div className="forgot_link_container">
                <button className="forgot_btn">Forgot Password?</button>
              </div>
              <button className="btn_login" onClick={handleLogin}>Login Now</button>
            </div>
          )}

          {/* Logic for OTP Method */}
          {method === 'otp' && (
            <div className="fade_in">
              {!isOtpSent ? (
                // Step 1: Only Send OTP Button
                <button className="btn_login" onClick={handleSendOtp}>Send OTP</button>
              ) : (
                // Step 2: Show OTP Input after sending
                <div className="fade_in">
                  <div className="input_group">
                    <label>Enter 4-Digit OTP</label>
                    <input 
                      type="text" 
                      placeholder="0 0 0 0" 
                      maxLength={4} 
                      className="main_input otp_field"
                      value={secret}
                      onChange={(e) => setSecret(e.target.value)}
                    />
                  </div>
                  <button className="btn_login" onClick={handleLogin}>Verify & Login</button>
                  <div style={{textAlign:'center', marginTop:'15px'}}>
                    <button className="forgot_btn" onClick={() => setIsOtpSent(false)}>Change Number</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="login_footer">
          <p>Dont have an account? <a href="/rider-signup">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
}