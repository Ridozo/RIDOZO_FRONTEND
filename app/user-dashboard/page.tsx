"use client";
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './user-dashboard.module.css';

// Custom Marker Icon (Ridozo Green Style)
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

const BookingPage = () => {
  const [step, setStep] = useState('select-location');
  const [position, setPosition] = useState<[number, number]>([23.2599, 77.4126]); // Default: Bhopal Center
  const [destination, setDestination] = useState("");

  // --- RIDE REQUEST HANDLER ---
  const handleConfirmBooking = () => {
    // 1. राइड डेटा तैयार करें
    const rideData = {
      id: `RIDO_${Date.now()}`,
      userName: "Premium User",
      pickup: "MP Nagar, Bhopal",
      drop: destination || "Bhopal Destination",
      fare: destination === "DB City Mall" ? 45 : 65,
    };

    // 2. BroadcastChannel से राइडर को सिग्नल भेजें 📡
    const rideChannel = new BroadcastChannel('ridozo_stream');
    rideChannel.postMessage({ type: 'NEW_RIDE', data: rideData });

    alert("Searching for nearby Ridozo Captains in Bhopal... 🔍");
    setStep('searching');
  };

  const selectDestination = (locName: string, coords: [number, number]) => {
    setDestination(locName);
    setPosition(coords); // मैप को उस लोकेशन पर मूव करें
    setStep('choose-vehicle');
  };

  return (
    <div className={styles.main_container}>
      {/* --- LEAFLET MAP --- */}
      <div className={styles.map_view}>
        <MapContainer 
          center={position} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <Marker position={position} icon={customIcon}>
            <Popup>{destination || "Bhopal"}</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* --- TOP SEARCH BAR (HD GREEN) --- */}
      <div className={styles.top_search}>
         <div className={styles.back_btn} onClick={() => window.history.back()}>←</div>
         <div className={styles.location_inputs}>
            <div className={styles.input_box}>
              <span className={styles.dot_green}>●</span>
              <input type="text" readOnly value="MP Nagar, Bhopal" className={styles.input_flat} />
            </div>
            <div className={styles.divider}></div>
            <div className={styles.input_box}>
              <span className={styles.dot_red}>■</span>
              <input 
                type="text" 
                placeholder="Where to go in Bhopal?" 
                value={destination}
                className={styles.input_flat} 
                readOnly
              />
            </div>
         </div>
      </div>

      {/* --- BOTTOM SLIDING PANEL --- */}
      <div className={styles.bottom_card}>
        <div className={styles.pull_bar}></div>
        
        {step === 'select-location' && (
          <div className={styles.content}>
            <h3 className={styles.section_title}>Popular in Bhopal</h3>
            <div className={styles.recent_list}>
              <div className={styles.recent_item} onClick={() => selectDestination("DB City Mall", [23.2324, 77.4300])}>
                <div className={styles.icon_bg}>🏢</div>
                <div>
                  <p className={styles.place_name}>DB City Mall</p>
                  <p className={styles.place_sub}>Arera Hills, Bhopal</p>
                </div>
              </div>

              <div className={styles.recent_item} onClick={() => selectDestination("Upper Lake", [23.2494, 77.3875])}>
                <div className={styles.icon_bg}>🌊</div>
                <div>
                  <p className={styles.place_name}>Upper Lake (VIP Road)</p>
                  <p className={styles.place_sub}>Lake View, Bhopal</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'choose-vehicle' && (
          <div className={styles.content}>
            <div className={styles.v_header}>
                <h3 className={styles.section_title}>Available Rides</h3>
                <span className={styles.fare_estimate}>ESTIMATED FARE</span>
            </div>
            <div className={styles.vehicle_options}>
              <div className={styles.vehicle_card_active}>
                <div className={styles.v_icon}>🏍️</div>
                <div className={styles.v_details}>
                  <p>Ridozo Bike</p>
                  <span>2 min away</span>
                </div>
                <div className={styles.v_price}>₹{destination === "DB City Mall" ? 45 : 35}</div>
              </div>
            </div>
            <button className={styles.confirm_btn} onClick={handleConfirmBooking}>
              CONFIRM & REQUEST RIDE
            </button>
          </div>
        )}

        {step === 'searching' && (
          <div className={styles.content}>
             <div className={styles.searching_loader}>
                <div className={styles.pulse_green}></div>
                <h3>Connecting to Captains...</h3>
                <p>Requesting ride to {destination}</p>
                <button className={styles.cancel_btn} onClick={() => setStep('choose-vehicle')}>CANCEL</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;