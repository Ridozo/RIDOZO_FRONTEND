import React from 'react';
import './Footer.css'; 

const Footer = () => {
  return (
    <footer className="ridozo-footer">
      <div className="footer-container">
        
        {/* Brand Section */}
        <div className="footer-col">
          <h2 className="footer-logo">RIDOZO</h2>
          <p>Traffic ki chinta chhodo, RIDOZO chuno. India's upcoming fastest bike taxi and delivery service.</p>
        </div>

        {/* Services Section */}
        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li><a href="#">Bike Taxi</a></li>
            <li><a href="#">Auto Ride</a></li>
            <li><a href="#">Package Delivery</a></li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Safety</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Download Section */}
        <div className="footer-col">
          <h4>Get the App</h4>
          <div className="app-btns">
            <button className="download-btn">Play Store</button>
            <button className="download-btn">App Store</button>
          </div>
        </div>

      </div>
      
      <div className="footer-copy">
        <p>&copy; 2026 RIDOZO. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;