"use client";
import React, { useState } from 'react';
import styles from './RiderDashboard.module.css';

const RiderDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showDetails, setShowDetails] = useState<boolean>(false); // डिटेल्स दिखाने के लिए

  return (
    <div className={styles.main_wrapper}>
      {/* 1. TOP HEADER */}
      <header className={styles.header}>
        <div className={styles.status_pill}>
          <div className={isOnline ? styles.dot_online : styles.dot_offline}></div>
          <span className={styles.status_text}>YOU ARE {isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          <button className={styles.toggle_btn} onClick={() => setIsOnline(!isOnline)}>
            {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
          </button>
        </div>
      </header>

      {/* 2. MAP AREA */}
      <div className={styles.map_section}>
        <div className={styles.map_mock}></div>
      </div>

      {/* 3. BOTTOM PANEL */}
      <div className={styles.bottom_panel}>
        <div className={styles.drag_handle}></div>
        <div className={styles.stats_grid}>
          <div className={styles.stat_box}>
            <small>Today</small>
            <h2 className={styles.gold_text}>₹1,540</h2>
          </div>
          <div className={styles.stat_box}>
            <small>Rides</small>
            <h2>14</h2>
          </div>
          <div className={styles.stat_box}>
            <small>Rating</small>
            <h2>4.9 ★</h2>
          </div>
        </div>

        <div className={styles.action_container}>
          <button className={styles.main_action_btn} onClick={() => setShowDetails(true)}>
            VIEW DETAILED REPORT <span>→</span>
          </button>
        </div>
      </div>

      {/* 4. VIEW DETAILS MODAL (यह रहा वो डेटा जो गायब था) */}
      {showDetails && (
        <div className={styles.details_overlay}>
          <div className={styles.details_modal}>
            <div className={styles.modal_header}>
              <h3>Earnings Overview</h3>
              <button className={styles.close_btn} onClick={() => setShowDetails(false)}>×</button>
            </div>
            
           
            
            <div className={styles.earnings_list}>
               <div className={styles.total_earnings}>
              <p>Total Balance</p>
              <h4 className={styles.gold_text}>₹2065.00</h4>
              <button className={styles.withdraw_btn} onClick={() => setShowDetails(false)}>Withdraw</button>
            </div>
              <div className={styles.earning_card}>
                <p>Weekly Earnings</p>
                <h4 className={styles.gold_text}>₹8,450.00</h4>
                <small>26 Jan - 01 Feb</small>
              </div>
              <div className={styles.earning_card}>
                <p>Monthly Earnings</p>
                <h4>₹32,120.00</h4>
                <small>January 2026</small>
              </div>
            </div>

            <div className={styles.history_section}>
              <p className={styles.section_title}>Recent Activity</p>
              <div className={styles.activity_item}>
                <span>31 Jan - 12:40 PM</span>
                <strong>+ ₹120.00</strong>
              </div>
              <div className={styles.activity_item}>
                <span>31 Jan - 11:15 AM</span>
                <strong>+ ₹95.00</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderDashboard;