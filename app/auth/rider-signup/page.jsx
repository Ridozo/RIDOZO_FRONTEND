"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link'; // Next.js का Link इस्तेमाल कर रहे हैं
import styles from './rider-signup.module.css';

const RiderSignup = () => {
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(30);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: ''
  });

  const [mobileOtp, setMobileOtp] = useState(['', '', '', '']);
  const [emailOtp, setEmailOtp] = useState(['', '', '', '']);
  const [capturedImg, setCapturedImg] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const mobileRefs = useRef([]);
  const emailRefs = useRef([]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); } }, 150);
    } catch (err) { setIsCameraOpen(false); alert("Camera access denied."); }
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        setCapturedImg(canvas.toDataURL("image/png"));
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
        setIsCameraOpen(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo_header}>RIDO<span className={styles.gold}>ZO</span></div>
        
        <div className={styles.progress_bar}>
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`${styles.dot} ${step >= s ? styles.active : ""}`}>{s}</div>
          ))}
        </div>

        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className={styles.form_step}>
            <h3>Basic Details</h3>
            <div className={styles.input_group}>
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" className={styles.input_f} 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
            </div>
            <div className={styles.input_group}>
              <label>Mobile Number</label>
              <input type="tel" placeholder="+91 00000 00000" className={styles.input_f} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className={styles.input_group}>
              <label>Email Address</label>
              <input type="email" placeholder="name@example.com" className={styles.input_f} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <button className={styles.primary_btn} onClick={() => setStep(2)}>Verify Contacts</button>
          </div>
        )}

        {/* STEP 2: Dual OTP */}
        {step === 2 && (
          <div className={styles.form_step}>
            <h3>Verify Contacts</h3>
            <div className={styles.otp_section}>
              <p className={styles.subtext_small}>OTP sent to <span className={styles.highlight}>{formData.phone || "your phone"}</span></p>
              <div className={styles.otp_container}>
                {mobileOtp.map((d, i) => (
                  <input key={`m-${i}`} ref={el => {mobileRefs.current[i]=el}} type="text" maxLength={1} className={styles.otp_box} 
                    onChange={(e) => {
                      const newOtp = [...mobileOtp]; newOtp[i] = e.target.value; setMobileOtp(newOtp);
                      if(e.target.value && i < 3) mobileRefs.current[i+1]?.focus();
                    }} />
                ))}
              </div>
            </div>
            <div className={styles.otp_section} style={{marginTop: '20px'}}>
              <p className={styles.subtext_small}>OTP sent to <span className={styles.highlight}>{formData.email || "your email"}</span></p>
              <div className={styles.otp_container}>
                {emailOtp.map((d, i) => (
                  <input key={`e-${i}`} ref={el => {emailRefs.current[i]=el}} type="text" maxLength={1} className={styles.otp_box} 
                    onChange={(e) => {
                      const newOtp = [...emailOtp]; newOtp[i] = e.target.value; setEmailOtp(newOtp);
                      if(e.target.value && i < 3) emailRefs.current[i+1]?.focus();
                    }} />
                ))}
              </div>
            </div>
            <button className={styles.primary_btn} style={{marginTop: '25px'}} onClick={() => setStep(3)}>Verify Both</button>
          </div>
        )}

        {/* STEP 3, 4, 5 Logic Remains Same... */}
        {step === 3 && (
          <div className={styles.form_step}>
            <h3>Vehicle Details</h3>
            <select className={styles.input_f}><option>Bike</option><option>Scooter</option></select>
            <input type="text" placeholder="Registration Number" className={styles.input_f} style={{marginTop:'15px'}} />
            <button className={styles.primary_btn} style={{marginTop:'15px'}} onClick={() => setStep(4)}>Next</button>
          </div>
        )}
        {step === 4 && (
          <div className={styles.form_step}>
            <h3>Documents</h3>
            <div className={styles.input_group}><label>Driving License</label><input type="file" className={styles.input_f} /></div>
            <button className={styles.primary_btn} onClick={() => setStep(5)}>Next</button>
          </div>
        )}
        {step === 5 && (
          <div className={styles.form_step}>
            <h3>Live Selfie</h3>
            <div className={styles.camera_box}>
              {capturedImg ? <img src={capturedImg} className={styles.preview} /> : isCameraOpen ? <video ref={videoRef} className={styles.video} autoPlay playsInline /> : <button className={styles.cam_init} onClick={startCamera}>Open Camera</button>}
            </div>
            {!capturedImg && isCameraOpen && <button className={styles.capture_btn} onClick={takePhoto}>Capture</button>}
            <button className={styles.submit_btn} disabled={!capturedImg} onClick={() => alert("Registration Finished!")}>FINISH</button>
          </div>
        )}

        {/* LOGIN SHORTCUT (Visible on all steps) */}
        <div className={styles.login_footer}>
          <p>Already have an account? <Link href="/login" className={styles.login_link}>Login here</Link></p>
        </div>

      </div>
    </div>
  );
};

export default RiderSignup;