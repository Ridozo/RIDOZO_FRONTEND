"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';

// Redux Actions
import { toggleStatus, addMoney, withdrawBalance, logout } from '../../redux/riderSlice';
import { acceptRide, updateStatus, finishRide } from '../../redux/activeRideSlice';
import { addRideToHistory, refreshHistoryStats } from '../../redux/rideHistorySlice'; 
import { clearRequest, receiveRideRequest } from '../../redux/rideRequestSlice';

import styles from './RiderDashboard.module.css';
import { Users } from 'lucide-react';

// Dynamic Map Import ✅
const RiderMap = dynamic(() => import('../../component/Rider/RiderMap'), { 
  ssr: false,
  loading: () => <div style={{height: '300px', background: '#f5f5f5', borderRadius: '15px'}} />
});

const RiderDashboard = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');

  // --- REDUX STATES ---
  const { isOnline, walletBalance, profile, withdrawals } = useAppSelector((state) => state.rider);
  const { isActive, rideData, status: tripStatus } = useAppSelector((state) => state.activeRide);
  const { rides, weeklyTotal, monthlyTotal } = useAppSelector((state) => state.rideHistory);
  const { incomingRequest } = useAppSelector((state) => state.riderRequest);

  // Sync Stats on Tab Change
  useEffect(() => {
    dispatch(refreshHistoryStats());
  }, [activeTab, dispatch]);

  // Real-time Ride Request Listener (Integrated with Sound)
  useEffect(() => {
    const rideChannel = new BroadcastChannel('ride_requests');
    
    rideChannel.onmessage = (event) => {
      console.log("New Request Received:", event.data);
      
      if (event.data) {
        // 1. Redux में रिक्वेस्ट सेव करें
        dispatch(receiveRideRequest(event.data));
        
        // 2. नोटिफिकेशन साउंड प्ले करें (अगर ऑनलाइन है)
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2506/2506-preview.mp3'); 
        audio.play().catch(e => console.log("Audio play failed, waiting for user interaction"));
      } else {
        dispatch(clearRequest());
      }
    };

    return () => rideChannel.close();
  }, [dispatch]);

  // --- LIVE LOCATION TRACKING MAGIC ✨ ---
  useEffect(() => {
    if (isActive && tripStatus === 'PICKUP') {
      const userChannel = new BroadcastChannel('ridozo_user_stream');
      
      // मान लेते हैं कि राइडर भोपाल में मूव कर रहा है
      let lat = 23.2599; 
      let lng = 77.4126;

      const moveRider = setInterval(() => {
        lat += 0.0002; // धीरे-धीरे लोकेशन बदलना (थोड़ा कम किया ताकि रियलिस्टिक लगे)
        lng += 0.0002;

        userChannel.postMessage({
          type: 'LIVE_LOCATION_UPDATE',
          coords: [lat, lng]
        });
      }, 2000); // हर 2 सेकंड में अपडेट

      return () => {
        clearInterval(moveRider);
        userChannel.close();
      };
    }
  }, [isActive, tripStatus]);

  const hendleAccept = () => {
    if (incomingRequest) {
      // 1. Redux में रिक्वेस्ट एक्सेप्ट करें
      dispatch(acceptRide(incomingRequest));
      dispatch(clearRequest());
      setActiveTab('home');

      // 2. User को सिग्नल भेजें (📡)
      const userChannel = new BroadcastChannel('ridozo_user_stream');
      userChannel.postMessage({
        type: 'RIDE_ACCEPTED',
        riderData: {
          name: profile?.name,  
          vehicle: profile?.vehicle,
          rating: profile?.rating,
          coords: [23.2599, 77.4126]
        }
      });
      userChannel.close();
    }
  };

  const handleFinishRide = () => {
    const fare = rideData?.fare || 0;
    const now = Date.now();
    dispatch(addRideToHistory({
      id: `ID_${now}`,
      date: new Date().toLocaleDateString('en-GB'),
      timestamp: now,
      pickup: rideData?.pickup || "",
      drop: rideData?.drop || "",
      amount: fare,
      status: 'COMPLETED'
    }));
    dispatch(addMoney(fare));

    // यूजर को राइड खत्म होने का सिग्नल भेजें
    const userChannel = new BroadcastChannel('ridozo_user_stream');
    userChannel.postMessage({ type: 'RIDE_FINISHED' });
    userChannel.close();

    dispatch(finishRide());
  };

  return (
    <div className={styles.container}>
      {/* --- FIXED HEADER --- */}
      <header className={styles.top_ui}>
        <div className={styles.glass_header}>
          <div className={styles.profile_min} onClick={() => setActiveTab('account')}>
            <div className={styles.avatar_circle}>{profile?.name?.charAt(0)}</div>
            <div className={styles.header_txt}>
              <strong>{profile?.name}</strong>
              <p>BALANCE: <span>₹{walletBalance}</span></p>
            </div>
          </div>
          <div className={styles.status_box}>
            <span className={isOnline ? styles.txt_green : styles.txt_red}>{isOnline ? "ONLINE" : "OFFLINE"}</span>
            <label className={styles.switch}>
              <input type="checkbox" checked={isOnline} onChange={() => dispatch(toggleStatus())} />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </header>

      <main className={styles.main_content}>
        
        {/* --- 1. HOME TAB --- */}
        {activeTab === 'home' && (
          <div className={styles.tab_view}>
            <div className={styles.map_container} style={{height: '320px', borderRadius: '20px', overflow: 'hidden', margin: '10px', border: '2px solid #eee'}}>
                <RiderMap />
            </div>

            {isActive ? (
              <div className={styles.trip_overlay_card}>
                <span className={styles.trip_badge}>ON TRIP</span>
                <h2 className={styles.trip_title}>{tripStatus === 'PICKUP' ? 'PICKUP CLIENT' : 'DROPPING OFF'}</h2>
                <div className={styles.trip_location}>
                  <strong>{tripStatus === 'PICKUP' ? rideData?.pickup : rideData?.drop}</strong>
                </div>
                <button className={styles.action_btn_black} onClick={() => tripStatus === 'PICKUP' ? dispatch(updateStatus('DROPOFF')) : handleFinishRide()}>
                  {tripStatus === 'PICKUP' ? 'ARRIVED AT PICKUP' : 'COMPLETE RIDE'}
                </button>
              </div>
            ) : (
              <div className={styles.searching_area}>
                <div className={isOnline ? styles.pulse_green : styles.pulse_red}></div>
                <h3>{isOnline ? "SEARCHING FOR RIDES..." : "GO ONLINE TO START"}</h3>
              </div>
            )}
          </div>
        )}

        {/* --- 2. WALLET TAB --- */}
        {activeTab === 'wallet' && (
          <div className={styles.tab_padding}>
            <h1 className={styles.page_title}>MY WALLET</h1>
            <div className={styles.earnings_card}>
              <small>TOTAL AVAILABLE BALANCE</small>
              <h1 className={styles.gold_val}>₹{walletBalance}</h1>
              <button 
                className={styles.small_btn_gold} 
                onClick={() => {
                  if (walletBalance > 0) {
                    dispatch(withdrawBalance());
                    alert("विड्रॉल सफल! पैसा बैंक भेज दिया गया है।");
                  } else {
                    alert("निकालने के लिए बैलेंस नहीं है।");
                  }
                }}
              >WITHDRAW TO BANK</button>
            </div>
            
            <div className={styles.section_label}>WITHDRAWAL HISTORY</div>
            <div className={styles.history_list}>
              {withdrawals && withdrawals.length > 0 ? (
                withdrawals.map((wth: any) => (
                  <div key={wth.id} className={styles.mini_history_card}>
                    <div className={styles.mini_left}>
                      <div className={styles.icon_circle_red}>↓</div>
                      <div className={styles.info_text}>
                        <strong>Bank Transfer</strong>
                        <small>{wth.date}</small>
                      </div>
                    </div>
                    <span className={styles.txt_red}>-₹{wth.amount}</span>
                  </div>
                ))
              ) : <div className={styles.empty_state}><p>No withdrawal history found.</p></div>}
            </div>
          </div>
        )}

        {/* --- 3. HISTORY TAB --- */}
        {activeTab === 'history' && (
          <div className={styles.tab_padding}>
            <h1 className={styles.page_title}>HISTORY</h1>
            <div className={styles.income_stats_grid}>
              <div className={styles.stat_box}><small>WEEKLY</small><h3>₹{weeklyTotal}</h3></div>
              <div className={styles.stat_box}><small>MONTHLY</small><h3>₹{monthlyTotal}</h3></div>
            </div>
            <div className={styles.section_label}>ALL TRIPS</div>
            <div className={styles.history_list}>
                {rides.map((ride: any) => (
                <div key={ride.id} className={styles.history_card}>
                    <div className={styles.hist_header}><span>{ride.date}</span><strong>₹{ride.amount}</strong></div>
                    <p>📍 {ride.pickup} → 🏁 {ride.drop}</p>
                </div>
                ))}
            </div>
          </div>
        )}

        {/* --- 4. ACCOUNT TAB --- */}
        {activeTab === 'account' && (
          <div className={styles.tab_padding}>
            <h1 className={styles.page_title}>MY PROFILE</h1>
            <div className={styles.user_main_card}>
              <div className={styles.big_avatar}>{profile?.name?.charAt(0)}</div>
              <h3>{profile?.name}</h3>
              <div className={styles.rating_badge}>{profile?.rating} ⭐ RATING</div>
            </div>

            <div className={styles.section_label}>VEHICLE & CONTACT</div>
            <div className={styles.details_list}>
              <div className={styles.detail_item}><small>VEHICLE</small><strong>{profile?.vehicle || "Not Set"}</strong></div>
              <div className={styles.detail_item}><small>PHONE</small><strong>{profile?.phone || "Not Set"}</strong></div>
              <div className={styles.detail_item}><small>DOCUMENTS</small><strong className={styles.txt_green}>VERIFIED</strong></div>
            </div>

            <div className={styles.account_actions}>
               <button className={styles.logout_outline} onClick={() => { dispatch(logout()); router.push('/rider-login'); }}>
                 LOGOUT ACCOUNT
               </button>
            </div>
          </div>
        )}
      </main>

      {/* --- RIDE POPUP --- */}
      {isOnline && incomingRequest && !isActive && (
        <div className={styles.modal_backdrop}>
          <div className={styles.request_modal}>
            <span className={styles.new_req_tag}>NEW REQUEST</span>
            <h1 className={styles.fare_display}>₹{incomingRequest.fare}</h1>
            <div className={styles.route_box}>
              <p>📍 {incomingRequest.pickup}</p>
              <p>🏁 {incomingRequest.drop}</p>
            </div>
            <div className={styles.modal_actions}>
              <button className={styles.btn_grey} onClick={() => dispatch(clearRequest())}>IGNORE</button>
              <button className={styles.btn_gold} onClick={hendleAccept}>ACCEPT</button>
            </div>
          </div>
        </div>

      )}

      {/* --- FOOTER NAVBAR --- */}
      <nav className={styles.bottom_navbar}>
        {['home', 'wallet', 'history', 'account'].map((tab) => (
          <div key={tab} className={activeTab === tab ? styles.nav_item_active : styles.nav_item} onClick={() => setActiveTab(tab)}>
            <span>{tab.toUpperCase()}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default RiderDashboard;