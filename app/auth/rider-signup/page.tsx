"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './rider-signup.module.css';

const SignupPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showOtpOverlay, setShowOtpOverlay] = useState(false);

  // Single state for all 5 steps
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '',
    vehicleType: '', vehicleNo: '',
    aadharNo: '', dlNo: '', rcNo: '',
    bankName: '', accountNo: '', ifsc: '',
    password: ''
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className={styles.container}>
      {/* --- DUAL OTP OVERLAY --- */}
      {showOtpOverlay && (
        <div className={styles.otp_overlay}>
          <div className={styles.otp_box}>
            <h2>Verify Account</h2>
            <p>Enter codes sent to your phone and email</p>
            <div className={styles.otp_inputs}>
              <input type="text" placeholder="Mobile OTP" maxLength={4} />
              <input type="text" placeholder="Email OTP" maxLength={4} />
            </div>
            <button className={styles.btn_primary} onClick={() => {setShowOtpOverlay(false); nextStep();}}>
              VERIFY & CONTINUE
            </button>
          </div>
        </div>
      )}

      <div className={styles.signup_card}>
        {/* BRAND LOGO */}
        <div className={styles.logo_wrapper}>
          <div className={styles.logo_icon}>R</div>
          <h1 className={styles.brand_name}>RIDO<span>ZO</span></h1>
          <p className={styles.subtitle}>Welcome to RIDOZO your (Rider Zone)</p>
          <p className={styles.subtitle}>We are here to make your life easier</p>
          <h1 className={styles.title}>RIDER SIGNUP</h1>
        </div>

        {/* PROGRESS BAR */}
        <div className={styles.progress_container}>
          <div className={styles.progress_bar} style={{ width: `${(step / 5) * 100}%` }}></div>
          <span className={styles.step_indicator}>STEP {step} OF 5</span>
        </div>

        {/* --- STEP 1: PERSONAL --- */}
        {step === 1 && (
          <div className={styles.step_view}>
            <h2>Personal Details</h2>
            <div className={styles.input_group}>
              <label>Full Name</label>
              <input type="text" placeholder="Full Name" required />
              <label>Mobile Number</label>
              <input type="tel" placeholder="Mobile Number" required />
              <label>Email Address</label>
              <input type="email" placeholder="Email Address" required />
            </div>
            <button className={styles.btn_primary} onClick={() => setShowOtpOverlay(true)}>
              SEND OTP
            </button>
          </div>
        )}

        {/* --- STEP 2: VEHICLE --- */}
        {step === 2 && (
          <div className={styles.step_view}>
            <h2>Vehicle Info</h2>
            <div className={styles.input_group}>
              <select>
                <option>Select Vehicle</option>
                <option>Bike</option>
                <option>Auto</option>
                <option>Car</option>
              </select>
              <input type="text" placeholder="Vehicle Number" />
            </div>
            <div className={styles.btn_row}>
              <button className={styles.btn_secondary} onClick={prevStep}>BACK</button>
              <button className={styles.btn_primary} onClick={nextStep}>NEXT</button>
            </div>
          </div>
        )}

        {/* --- STEP 3: DOCUMENTS --- */}
        {step === 3 && (
          <div className={styles.step_view}>
            <h2>Documents</h2>
            <div className={styles.doc_list}>
              <div className={styles.doc_item}>
                <input type="text" placeholder="Aadhar Number" />
                <input className={styles.upload_label} type="file" name="Driving License" id=""  placeholder='+ UPLOAD AADHAR'/>
                <button className={styles.btn_primary}>+ UPLOAD AADHAR</button>
                
              </div>
              <div className={styles.doc_item}>
                <input type="text" placeholder="Driving License" />
                <input className={styles.upload_label} type="file" name="Driving License" id=""  placeholder='+ UPLOAD LICENSE'/>
                <button className={styles.btn_primary}>+ UPLOAD LICENSE</button>
              </div>
              <div className={styles.doc_item}>
                <input type="text" placeholder="Vehicle RC" />
                <input className={styles.upload_label} type="file" name="Driving License" id=""  placeholder='+ UPLOAD RC'/>
                <button className={styles.btn_primary}>+ UPLOAD RC</button>
              </div>
            </div>
            <div className={styles.btn_row}>
              <button className={styles.btn_secondary} onClick={prevStep}>BACK</button>
              <button className={styles.btn_primary} onClick={nextStep}>NEXT</button>
            </div>
          </div>
        )}

        {/* --- STEP 4: BANK --- */}
        {step === 4 && (
          <div className={styles.step_view}>
            <h2>Bank Details</h2>
            <div className={styles.input_group}>
              <input type="text" placeholder="Bank Name" />
              <input type="text" placeholder="Account Number" />
              <input type="text" placeholder="IFSC Code" />
            </div>
            <div className={styles.btn_row}>
              <button className={styles.btn_secondary} onClick={prevStep}>BACK</button>
              <button className={styles.btn_primary} onClick={nextStep}>NEXT</button>
            </div>
          </div>
        )}

        {/* --- STEP 5: SECURITY --- */}
        {step === 5 && (
          <div className={styles.step_view}>
            <h2>Security</h2>
            <div className={styles.input_group}>
              <input type="password" placeholder="Create Password" />
              <input type="password" placeholder="Confirm Password" />
            </div>
            <button className={styles.btn_finish} onClick={() => router.push('../rider-login')}>
              FINISH REGISTRATION
            </button>
          </div>
        )}

        {/* --- ALWAYS VISIBLE LOGIN SHORTCUT --- */}
        <div className={styles.footer_link}>
          Already have an account? 
          <span onClick={() => router.push('../rider-login')}> Login Here</span>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;