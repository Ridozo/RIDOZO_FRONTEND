"use client";
import React, { useState } from 'react';
import './rider-dashboard.css';

export default function RiderDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [showRideRequest, setShowRideRequest] = useState(false);

  // राइड टेस्ट करने के लिए फंक्शन
  const testRidePopup = () => {
    if (isOnline) {
      setShowRideRequest(true);
    } else {
      alert("Please go online first!");
    }
  };

  return (
    <div className={`dashboard_main ${isOnline ? 'mode_online' : 'mode_offline'}`}>
      
      {/* 1. TOP HEADER: Fixed & Centered */}
      <div className="header_positioner">
        <div className="top_status_nav">
          <div className="status_indicator_group">
            <span className={`pulse_dot ${isOnline ? 'active' : ''}`}></span>
            <span className="status_label">{isOnline ? "ONLINE" : "OFFLINE"}</span>
          </div>
          
          <button 
            className={`duty_btn ${isOnline ? 'btn_gold' : 'btn_black'}`}
            onClick={() => {
              setIsOnline(!isOnline);
              if(isOnline) setShowRideRequest(false);
            }}
          >
            {isOnline ? "Go Offline" : "Go Online"}
          </button>
        </div>
      </div>

      {/* 2. MAP & OVERLAY AREA */}
      <div className="viewport_area">
        {!isOnline && (
          <div className="centered_full_overlay">
            <div className="offline_msg">
              <div className="icon_circle">🌙</div>
              <h2>You are Offline</h2>
              <p>Go online to start receiving ride requests</p>
            </div>
          </div>
        )}

        {/* Mock Map Background */}
        <div className="map_bg">
          <div className="user_location_marker"></div>
          {/* सिर्फ टेस्टिंग के लिए बटन - असली ऐप में ये ऑटोमैटिक आएगा */}
          {isOnline && !showRideRequest && (
            <button className="test_ride_trigger" onClick={testRidePopup}>
              Simulate New Ride
            </button>
          )}
        </div>
      </div>

      {/* 3. NEW RIDE REQUEST POPUP (Centered) */}
      {showRideRequest && (
        <div className="request_overlay_blur">
          <div className="premium_ride_card">
            <div className="card_header">
              <span className="ride_badge">NEW REQUEST</span>
              <h1 className="fare_text">₹185.50</h1>
            </div>

            <div className="route_details">
              <div className="route_point">
                <i className="dot_gold"></i>
                <p>Indrapuri Sector-C, Bhopal</p>
              </div>
              <div className="route_line"></div>
              <div className="route_point">
                <i className="dot_white"></i>
                <p>MP Nagar Zone-1, Bhopal</p>
              </div>
            </div>

            <div className="ride_meta">
              <div className="meta_item">4.2 km</div>
              <div className="meta_item"> 12 min</div>
            </div>

            <div className="action_group">
              <button className="decline_btn" onClick={() => setShowRideRequest(false)}>Decline</button>
              <button className="accept_btn" onClick={() => alert("Ride Accepted!")}>Accept Ride</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. BOTTOM STATS DRAWER */}
      <div className="bottom_stats_panel">
        <div className="pull_handle"></div>
        <div className="stats_grid_centered">
          <div className="stat_unit">
            <small>Today's Pay</small>
            <h2 className="gold_text">₹0.00</h2>
          </div>
          <div className="stat_unit">
            <small>Rides Done</small>
            <h2>0</h2>
          </div>
          <div className="stat_unit">
            <small>Rating</small>
            <h2>5.0 ★</h2>
          </div>
        </div>
      </div>

    </div>
  );
}