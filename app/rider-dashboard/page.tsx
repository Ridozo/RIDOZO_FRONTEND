"use client";
import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { toggleStatus, updateProfile, logout } from '../../redux/riderSlice';
import { clearRequest } from '../../redux/rideRequestSlice';
import { acceptRide, updateStatus, finishRide } from '../../redux/activeRideSlice';
import { addRideToHistory, setSearchTerm } from '../../redux/rideHistorySlice';
import styles from './RiderDashboard.module.css';

const RiderDashboard = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('home');
  const [showEditPopup, setShowEditPopup] = useState(false);

  // Redux States (Connecting to 'rider' slice)
  const riderData = useAppSelector((state) => state.rider);
  const { isOnline, walletBalance, profile } = riderData;

  const { incomingRequest } = useAppSelector((state) => state.riderRequest);
  const { isActive, rideData, status: tripStatus } = useAppSelector((state) => state.activeRide);
  const { rides, weeklyTotal, monthlyTotal, searchTerm } = useAppSelector((state) => state.rideHistory);

  // Local States for Profile Editing
  const [tempName, setTempName] = useState(profile?.name || '');
  const [tempVehicle, setTempVehicle] = useState(profile?.vehicle || '');

  useEffect(() => {
    if (profile) {
      setTempName(profile.name);
      setTempVehicle(profile.vehicle);
    }
  }, [profile, showEditPopup]);

  const handleFinishRide = () => {
    const historyData = {
      id: `RIDE_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pickup: rideData?.pickup || "Unknown",
      drop: rideData?.drop || "Unknown",
      amount: rideData?.fare || 0,
      status: 'COMPLETED' as const
    };
    dispatch(addRideToHistory(historyData));
    dispatch(finishRide());
  };

  return (
    <div className={styles.container}>
      {/* 1. TOP HEADER - Yahan se balance/name check hota hai */}
      <header className={styles.top_ui}>
        <div className={styles.glass_header}>
          <div className={styles.profile_min} onClick={() => setActiveTab('account')}>
            <div className={styles.avatar_circle}>
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className={styles.header_txt}>
              <strong>{profile?.name || "Loading..."}</strong>
              <p>WALLET: <span>₹{walletBalance}</span></p>
            </div>
          </div>
          <div className={styles.status_box}>
            <span className={isOnline ? styles.txt_green : styles.txt_red}>
              {isOnline ? "ONLINE" : "OFFLINE"}
            </span>
            <label className={styles.switch}>
              <input type="checkbox" checked={isOnline} onChange={() => dispatch(toggleStatus())} />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <main className={styles.main_content}>
        
        {/* HOME VIEW */}
        {activeTab === 'home' && (
          <div className={styles.map_view}>
            {isActive ? (
              <div className={styles.trip_overlay_card}>
                <span className={styles.trip_badge}>TRIP IN PROGRESS</span>
                <h2>{tripStatus === 'PICKUP' ? 'PICKUP CLIENT' : 'DROP OFF'}</h2>
                <div className={styles.trip_location}>
                  <strong>{tripStatus === 'PICKUP' ? rideData?.pickup : rideData?.drop}</strong>
                </div>
                <button className={styles.action_btn_black} onClick={() => tripStatus === 'PICKUP' ? dispatch(updateStatus('DROPOFF')) : handleFinishRide()}>
                  {tripStatus === 'PICKUP' ? 'ARRIVED AT PICKUP' : 'COMPLETE TRIP'}
                </button>
              </div>
            ) : (
              <div className={styles.searching_area}>
                <div className={isOnline ? styles.pulse_green : styles.pulse_red}></div>
                <p>{isOnline ? "SEARCHING FOR NEARBY RIDES..." : "SYSTEM IS OFFLINE"}</p>
              </div>
            )}
          </div>
        )}

        {/* ACCOUNT TAB */}
        {activeTab === 'account' && (
          <div className={styles.tab_padding}>
            <h1 className={styles.page_title}>MY PROFILE</h1>
            <div className={styles.user_main_card}>
              <div className={styles.big_avatar}>{profile?.name?.charAt(0).toUpperCase()}</div>
              <div className={styles.user_info_box}>
                <h3>{profile?.name}</h3>
                <span className={styles.rating_badge}>{profile?.rating} ⭐ Rating</span>
              </div>
            </div>
            
            <div className={styles.section_label}>PERSONAL DETAILS</div>
            <div className={styles.details_list}>
              <div className={styles.detail_item}><small>CONTACT</small><strong>{profile?.phone}</strong></div>
              <div className={styles.detail_item}><small>VEHICLE</small><strong>{profile?.vehicle}</strong></div>
            </div>

            <div className={styles.section_label}>VERIFIED DOCUMENTS</div>
            <div className={styles.docs_grid}>
              <div className={styles.doc_card}>🪪 Driving License <span className={styles.status_verified}>VERIFIED</span></div>
              <div className={styles.doc_card}>📄 Vehicle RC <span className={styles.status_verified}>VERIFIED</span></div>
            </div>

            <button className={styles.edit_full_btn} onClick={() => setShowEditPopup(true)}>EDIT PROFILE INFO</button>
            <button className={styles.logout_outline} onClick={() => dispatch(logout())}>LOGOUT SYSTEM</button>
          </div>
        )}

        {/* Baki Wallet aur History Tabs yahan add honge... */}
      </main>

      {/* POPUP: EDIT PROFILE */}
      {showEditPopup && (
        <div className={styles.modal_backdrop}>
          <div className={styles.edit_modal}>
            <h2 className={styles.page_title}>EDIT PROFILE</h2>
            <div className={styles.input_stack}>
              <div className={styles.input_field}>
                <label>Rider Name</label>
                <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} />
              </div>
              <div className={styles.input_field}>
                <label>Vehicle Number</label>
                <input type="text" value={tempVehicle} onChange={(e) => setTempVehicle(e.target.value)} />
              </div>
            </div>
            <div className={styles.modal_actions}>
              <button className={styles.btn_grey} onClick={() => setShowEditPopup(false)}>CANCEL</button>
              <button className={styles.btn_black} onClick={() => {
                dispatch(updateProfile({ name: tempName, vehicle: tempVehicle }));
                setShowEditPopup(false);
              }}>SAVE CHANGES</button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <nav className={styles.bottom_navbar}>
        {['home', 'wallet', 'history', 'account'].map((item) => (
          <div key={item} className={activeTab === item ? styles.nav_item_active : styles.nav_item} onClick={() => setActiveTab(item)}>
            {item.toUpperCase()}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default RiderDashboard;