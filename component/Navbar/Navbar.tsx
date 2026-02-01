"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  return (
    <nav className={styles.navbar_container}>
      {/* मोबाइल हैमबर्गर आइकॉन */}
      <div 
        className={`${styles.hamburger} ${isMenuOpen ? styles.ham_active : ""}`} 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* लोगो सेक्शन */}
      <div className={styles.logo_section}>
        RIDO<span className={styles.gold_text}>ZO</span>
      </div>

      {/* नेविगेशन लिंक्स (डेस्कटॉप + मोबाइल स्लाइडर) */}
      <div className={`${styles.nav_links} ${isMenuOpen ? styles.nav_active : ""}`}>
        <Link href="/" className={styles.nav_item} onClick={() => setIsMenuOpen(false)}>
          Home
        </Link>
        {isLoggedIn && (
          <>
            <Link href="/dashboard" className={styles.nav_item} onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
            <Link href="/rides" className={styles.nav_item} onClick={() => setIsMenuOpen(false)}>
              My Rides
            </Link>
            <Link href="/earnings" className={styles.nav_item} onClick={() => setIsMenuOpen(false)}>
              Earnings
            </Link>
          </>
        )}
      </div>

      {/* प्रोफाइल और लॉगिन बटन */}
      <div className={styles.nav_actions}>
        {!isLoggedIn ? (
          <button className={styles.login_btn} onClick={() => setIsLoggedIn(true)}>
            LOGIN
          </button>
        ) : (
          <div className={styles.profile_wrapper}>
            <div 
              className={styles.profile_trigger} 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Pankaj" 
                alt="Profile" 
                className={styles.profile_img}
              />
            </div>

            {isDropdownOpen && (
              <div className={styles.profile_dropdown}>
                <div className={styles.dropdown_header}>
                  <strong>Pankaj Choudhary</strong>
                  <small>ID: #RIDER9920</small>
                </div>
                <hr className={styles.divider} />
                <Link href="/profile" className={styles.dropdown_link}>My Profile</Link>
                <Link href="/settings" className={styles.dropdown_link}>Settings</Link>
                <hr className={styles.divider} />
                <button 
                  className={styles.logout_btn} 
                  onClick={() => {setIsLoggedIn(false); setIsDropdownOpen(false)}}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;