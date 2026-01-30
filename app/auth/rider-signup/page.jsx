"use client";
import React, { useState } from 'react';
import './rider-signup.css';

export default function RiderSignup() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="signup_full_page">
      <div className="signup_form_card">
        
        <div className="partner_badge">
          <span className="badge_icon">🚕</span>
          <span className="badge_text">Step {step} of 5: RIDOZO Partner</span>
        </div>

        <div className="brand_logo_center">RIDO<span>ZO</span></div>

        <div className="fade_in">
          
          {/* STEP 1: PERSONAL INFO */}
          {step === 1 && (
            <div className="fade_in">
              <h2 className="step_title">Registration</h2>
              <p className="step_subtitle">Enter your contact details to receive OTP</p>
              
              <div className="input_group_block">
                <label className="label_text">Full Name</label>
                <input className="standard_input" placeholder="e.g. Rahul Sharma" />
              </div>
              
              <div className="input_group_block">
                <label className="label_text">Phone Number</label>
                <input className="standard_input" placeholder="10-digit mobile number" type="tel" />
              </div>

              <div className="input_group_block">
                <label className="label_text">Email Address</label>
                <input className="standard_input" placeholder="name@example.com" type="email" />
              </div>

              <button className="btn_finish_reg" onClick={nextStep}>Send Verification Codes</button>
            </div>
          )}

          {/* STEP 2: DOUBLE OTP VERIFICATION */}
          {step === 2 && (
            <div className="fade_in">
              <h2 className="step_title">Verify Identity</h2>
              <p className="step_subtitle">Check your Phone and Email for OTPs</p>
              
              <div className="input_group_block">
                <label className="label_text">Mobile OTP</label>
                <input className="standard_input otp_input" placeholder="0 0 0 0 0 0" maxLength={6} />
              </div>

              <div className="input_group_block">
                <label className="label_text">Email OTP</label>
                <input className="standard_input otp_input" placeholder="0 0 0 0 0 0" maxLength={6} />
              </div>

              <button className="btn_finish_reg" onClick={nextStep}>Verify & Continue</button>
              <button className="btn_back" onClick={prevStep}>Edit Details</button>
            </div>
          )}

          {/* STEP 3: VEHICLE INFO */}
          {step === 3 && (
            <div className="fade_in">
              <h2 className="step_title">Vehicle Details</h2>
              <p className="step_subtitle">Information about your vehicle</p>
              <div className="input_group_block">
                <label className="label_text">Vehicle Number</label>
                <input className="standard_input" placeholder="MP 04 AB 1234" />
              </div>
              <div className="input_group_block">
                <label className="label_text">Vehicle Type</label>
                <select className="standard_input">
                  <option>Bike (Moto)</option>
                  <option>Auto Rickshaw</option>
                  <option>Economy Car</option>
                </select>
              </div>
              <button className="btn_finish_reg" onClick={nextStep}>Next: Document Scan</button>
              <button className="btn_back" onClick={prevStep}>Back</button>
            </div>
          )}

          {/* STEP 4: DOCUMENT SCAN */}
          {step === 4 && (
            <div className="fade_in">
              <h2 className="step_title">Scan Documents</h2>
              <p className="step_subtitle">Use camera to scan original documents</p>
              {["Driving License", "Aadhar Card", "Vehicle RC"].map((doc) => (
                <div className="doc_upload_container" key={doc}>
                  <span className="doc_label">{doc}</span>
                  <div className="upload_actions">
                    <label className="icon_btn">
                      <input type="file" accept="image/*" capture="environment" className="hidden_input" />
                      <b>📸</b><small>Scan</small>
                    </label>
                    <label className="icon_btn">
                      <input type="file" accept="image/*" className="hidden_input" />
                      <b>📁</b><small>Files</small>
                    </label>
                  </div>
                </div>
              ))}
              <button className="btn_finish_reg" onClick={nextStep}>Next: Secure Account</button>
              <button className="btn_back" onClick={prevStep}>Back</button>
            </div>
          )}

          {/* STEP 5: SET PASSWORD */}
          {step === 5 && (
            <div className="fade_in">
              <h2 className="step_title">Set Password</h2>
              <p className="step_subtitle">Create a password for your RIDOZO account</p>
              
              <div className="input_group_block">
                <label className="label_text">New Password</label>
                <input className="standard_input" type="password" placeholder="At least 8 characters" />
              </div>

              <div className="input_group_block">
                <label className="label_text">Confirm Password</label>
                <input className="standard_input" type="password" placeholder="Repeat your password" />
              </div>

              <button className="btn_finish_reg" onClick={() => alert("Registration Submitted! Our team will verify your docs.")}>
                Complete Registration
              </button>
              <button className="btn_back" onClick={prevStep}>Back</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}