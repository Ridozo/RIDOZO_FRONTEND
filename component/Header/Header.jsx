"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './Header.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'

  // थीम चेंज होने पर बॉडी की क्लास बदलें
  useEffect(() => {
    document.body.className = theme + "-theme";
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="ridozo_navbar_master">
      <div className="nav_container">
        
        {/* Left: Brand Logo */}
        <Link href="/" className="logo_brand" onClick={closeMenu}>
          RIDO<span>ZO</span>
        </Link>

        {/* Center: Main Links (Desktop) */}
        <div className="center_links_desktop">
          <Link href="/book-ride" className="nav_link_item">Ride</Link>
          <Link href="/rider-login" className="nav_link_item">Drive</Link>
          <Link href="/about" className="nav_link_item">About</Link>
        </div>

        {/* Right: Actions */}
        <div className="right_actions_desktop">
          {/* Theme Toggle Button */}
          <button className="theme_toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          
          <Link href="/login" className="login_text_btn">Log in</Link>
          <Link href="/rider-signup" className="signup_gold_btn">Join RIDOZO</Link>
        </div>

        {/* Mobile: Hamburger Icon */}
        <div className={`hamburger_icon ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`nav_overlay_mobile ${isMenuOpen ? 'active' : ''}`}>
          <div className="mobile_menu_content">
             {/* Mobile Theme Toggle */}
             <button className="mobile_theme_btn" onClick={() => {toggleTheme(); closeMenu();}}>
              {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
            <hr />
            <Link href="/book-ride" onClick={closeMenu}>Ride</Link>
            <Link href="/rider-login" onClick={closeMenu}>Drive</Link>
            <Link href="/login" onClick={closeMenu}>Log In</Link>
            <Link href="/rider-signup" className="mobile_cta" onClick={closeMenu}>Become a Partner</Link>
          </div>
        </div>

      </div>
    </nav>
  );
}