"use client";
import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'; 
import { toggleStatus, updateProfile } from '../../redux/riderSlice'; 
import { clearRequest } from '../../redux/rideRequestSlice';
import { acceptRide, updateStatus, finishRide } from '../../redux/activeRideSlice';
import styles from './RiderDashboard.module.css';

const RiderDashboard = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('home');
  const [showEditPopup, setShowEditPopup] = useState(false);

  // Redux States
  const { isOnline, walletBalance, profile } = useAppSelector((state) => state.rider);
  const { incomingRequest } = useAppSelector((state) => state.riderRequest);
  const { isActive, rideData, status: tripStatus } = useAppSelector((state) => state.activeRide);

  // Local States for Profile Inputs
  const [tempName, setTempName] = useState(profile?.name);
  const [tempVehicle, setTempVehicle] = useState(profile?.vehicle);

  // Sync temp state with redux when popup opens
  useEffect(() => {
    if (showEditPopup) {
      setTempName(profile?.name);
      setTempVehicle(profile?.vehicle);
    }
  }, [showEditPopup, profile]);

  return (
    <div className={styles.container}>
      
      {/* 1. TOP HEADER (Fixed Across Tabs) */}
      <header className={styles.top_ui}>
        <div className={styles.glass_header}>
          <div className={styles.profile_min} onClick={() => setActiveTab('account')}>
            <div className={styles.avatar_circle}>{profile?.name.charAt(0)}</div>
            <div className={styles.header_txt}>
              <strong>{profile?.name}</strong>
              <p>WALLET: <span>₹{walletBalance}</span></p>
            </div>
          </div>
          <div className={styles.status_box}>
            <span className={isOnline ? styles.txt_green : styles.txt_red}>
              {isOnline ? "ONLINE" : "OFFLINE"}
            </span>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={isOnline} 
                onChange={() => dispatch(toggleStatus())} 
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </header>

      {/* 2. MAIN SCROLLABLE CONTENT */}
      <main className={styles.main_content}>
        
        {/* TAB: HOME (Map & Active Trip) */}
        {activeTab === 'home' && (
          <div className={styles.map_view}>
            {isActive ? (
              <div className={styles.trip_overlay_card}>
                <span className={styles.trip_badge}>TRIP IN PROGRESS</span>
                <h2>{tripStatus === 'PICKUP' ? 'PICKUP CLIENT' : 'DROP OFF'}</h2>
                <div className={styles.trip_location}>
                  <strong>{tripStatus === 'PICKUP' ? rideData?.pickup : rideData?.drop}</strong>
                </div>
                <button 
                  className={styles.action_btn_black}
                  onClick={() => tripStatus === 'PICKUP' ? dispatch(updateStatus('DROPOFF')) : dispatch(finishRide())}
                >
                  {tripStatus === 'PICKUP' ? 'ARRIVED AT PICKUP' : 'COMPLETE TRIP'}
                </button>
              </div>
            ) : (
              <div className={styles.searching_area}>
                <div className={isOnline ? styles.pulse_green : styles.pulse_red}></div>
                <p>{isOnline ? "SEARCHING FOR NEARBY RIDES..." : "SYSTEM IS CURRENTLY OFFLINE"}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: WALLET */}
        {activeTab === 'wallet' && (
          <div className={styles.tab_padding}>
            <h1 className={styles.page_title}>WALLET</h1>
            <div className={styles.earnings_card}>
              <small>TOTAL EARNINGS</small>
              <h1 className={styles.gold_val}>₹{walletBalance}</h1>
              <button className={styles.small_btn_gold}>CASH OUT</button>
            </div>
          </div>
        )}

        {/* TAB: PROFILE (Updated UI) */}
        {activeTab === 'account' && (
          <div className={styles.tab_padding}>
            <h1 className={styles.page_title}>PROFILE</h1>
            <div className={styles.user_main_card}>
              <div className={styles.big_avatar}>{profile?.name.charAt(0)}</div>
              <h3>{profile?.name}</h3>
              <p>{profile?.rating} ⭐ Rider Rating</p>
            </div>
            <div className={styles.details_list}>
              <div className={styles.detail_item}>
                <small>VEHICLE INFO</small>
                <strong>{profile?.vehicle}</strong>
              </div>
              <div className={styles.detail_item}>
                <small>CONTACT</small>
                <strong>{profile?.phone}</strong>
              </div>
              <button className={styles.edit_text_btn} onClick={() => setShowEditPopup(true)}>
                EDIT PROFILE INFO
              </button>
            </div>
            <button className={styles.logout_outline}>LOGOUT SYSTEM</button>
          </div>
        )}
      </main>

      {/* 3. MODALS & POPUPS (Redux Linked) */}

      {/* RIDE REQUEST POPUP */}
      {isOnline && incomingRequest && !isActive && (
        <div className={styles.modal_backdrop}>
          <div className={styles.request_modal}>
            <span className={styles.new_req_tag}>NEW RIDE FOUND</span>
            <h1 className={styles.fare_display}>₹{incomingRequest.fare}</h1>
            <div className={styles.route_info_box}>
              <p><strong>FROM:</strong> {incomingRequest.pickup}</p>
              <p><strong>TO:</strong> {incomingRequest.drop}</p>
            </div>
            <div className={styles.modal_actions}>
              <button className={styles.btn_grey} onClick={() => dispatch(clearRequest())}>IGNORE</button>
              <button className={styles.btn_gold} onClick={() => {
                dispatch(acceptRide(incomingRequest));
                dispatch(clearRequest());
                setActiveTab('home');
              }}>ACCEPT RIDE</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE POPUP */}
      {showEditPopup && (
        <div className={styles.modal_backdrop}>
          <div className={styles.edit_modal}>
            <h2 className={styles.modal_header}>EDIT PROFILE</h2>
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

      {/* 4. BOTTOM NAVIGATION */}
      <nav className={styles.bottom_navbar}>
        {['home', 'wallet', 'history', 'account'].map((item) => (
          <div 
            key={item} 
            className={activeTab === item ? styles.nav_item_active : styles.nav_item}
            onClick={() => setActiveTab(item)}
          >
            {item.toUpperCase()}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default RiderDashboard;