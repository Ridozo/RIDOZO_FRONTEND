"use client";
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './user-dashboard.module.css';

// --- CUSTOM ICONS ---
const pickupIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [38, 38], iconAnchor: [19, 38],
});

const riderIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png', // Bike Icon
  iconSize: [40, 40], iconAnchor: [20, 40],
});

// मैप को ऑटो-सेंटर करने के लिए हेल्पर
function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();
  map.setView(coords, map.getZoom());
  return null;
}

const BookingPage = () => {
  const [step, setStep] = useState('select-location');
  const [position, setPosition] = useState<[number, number]>([23.2599, 77.4126]); // Default Bhopal
  const [pickupAddress, setPickupAddress] = useState("Locating you..."); 
  const [destination, setDestination] = useState("");
  const [searchResults, setSearchResults] = useState([]); // सर्च रिजल्ट्स के लिए
  const [riderDetails, setRiderDetails] = useState<any>(null);

  // --- सटीक को-ऑर्डिनेट से लोकेशन का नाम उठाना (FIXED & SECURE) ✨ ---
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);

          try {
            // Nominatim API को 'User-Agent' की सख्त जरूरत होती है
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'User-Agent': 'Ridozo-App-v2' // इसे थोड़ा बदल दिया ताकि नई पहचान मिले
                }
              }
            );

            if (!res.ok) throw new Error("API Limit reached or Blocked");

            const data = await res.json();
            
            const exactLocation = 
              data.address.amenity || 
              data.address.building || 
              data.address.suburb || 
              data.address.neighbourhood || 
              data.address.road || 
              "Selected Location";

            const city = data.address.city || data.address.town || "Bhopal";
            setPickupAddress(`📍 ${exactLocation}, ${city}`);
            
          } catch (error) {
            console.error("Fetch error:", error);
            // एरर आने पर ऐप क्रैश न हो, इसलिए डिफ़ॉल्ट टेक्स्ट सेट करें
            setPickupAddress(`📍 Bhopal Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`); 
          }
        },
        (error) => {
          setPickupAddress("📍 MP Nagar, Bhopal");
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // --- 2. सर्च फंक्शन (जैसे-जैसे यूजर टाइप करेगा) ---
  const handleSearch = async (query: string) => {
    setDestination(query);
    if (query.length > 2) {
      const bhopalViewbox = "77.30,36.35,77.60,23.15";
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=6&viewbox=${bhopalViewbox}&bounded=1&addressdetails=1`,
          {
            headers: { 'User-Agent': 'Ridozo-App-v1' }
          }
        );
        const data = await res.json();
        const filteredData = data.filter((item: any) =>
         item.display_name.toLowerCase().includes('bhopal') || 
         item.display_name.toLowerCase().includes('madhay pradesh')
        );
        setSearchResults(filteredData);
      } catch (e) { console.error("Search error", e); }
    } else {
      setSearchResults([]);
    }
  };

  const selectDestination = (locName: string, lat: string, lon: string) => {
    const coords: [number, number] = [parseFloat(lat), parseFloat(lon)];
    setDestination(locName);
    setPosition(coords);
    setSearchResults([]); 
    setStep('choose-vehicle');
  };

  // --- 3. LISTEN FOR RIDER SIGNALS (LIVE UPDATES & FINISH) ---
  useEffect(() => {
    const userChannel = new BroadcastChannel('ridozo_user_stream');
    
    userChannel.onmessage = (event) => {
      if (event.data.type === 'RIDE_ACCEPTED') {
        setRiderDetails(event.data.riderData);
        setStep('rider-assigned');
      }

      if (event.data.type === 'LIVE_LOCATION_UPDATE') {
        setRiderDetails((prev: any) => ({
          ...prev,
          coords: event.data.coords 
        }));
      }

      if (event.data.type === 'RIDE_FINISHED') {
        alert("Ride Finished! Hope you enjoyed the Ridozo trip. ✨");
        setStep('select-location');
        setRiderDetails(null);
        setDestination("");
        if ("geolocation" in navigator) {
           navigator.geolocation.getCurrentPosition(pos => {
             setPosition([pos.coords.latitude, pos.coords.longitude]);
           });
        }
      }
    };

    return () => userChannel.close();
  }, []);

  const handleConfirmBooking = () => {
    const rideData = {
      id: `RIDO_${Date.now()}`,
      userName: "Premium User",
      pickup: pickupAddress,
      drop: destination,
      fare: 45,
    };
    new BroadcastChannel('ride_requests').postMessage(rideData);
    setStep('searching');
  };

  return (
    <div className={styles.main_container}>
      <div className={styles.map_view}>
        <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          <RecenterMap coords={position} />
          
          <Marker position={position} icon={pickupIcon}>
            <Popup>{destination || "Your Location"}</Popup>
          </Marker>

          {step === 'rider-assigned' && riderDetails && (
            <Marker position={riderDetails.coords} icon={riderIcon}>
              <Popup>Captain {riderDetails.name} is moving!</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* --- UI OVERLAYS ✅ --- */}
      {step !== 'rider-assigned' && (
        <div className={styles.top_search}>
           <div className={styles.location_inputs}>
              <div className={styles.input_wrapper}>
                <input 
                  type="text" 
                  readOnly 
                  value={pickupAddress} 
                  className={styles.input_flat} 
                />
              </div>
              <div className={styles.divider}></div>
              <input 
                type="text" 
                placeholder="🏁 Where to go?" 
                value={destination} 
                className={styles.input_flat} 
                onChange={(e) => handleSearch(e.target.value)}
              />
           </div>

           {/* --- सर्च रिजल्ट्स की लिस्ट --- */}
           {searchResults.length > 0 && (
             <div className={styles.search_results_list}>
               {searchResults.map((result: any) => (
                 <div 
                   key={result.place_id} 
                   className={styles.result_item}
                   onClick={() => selectDestination(result.display_name, result.lat, result.lon)}
                 >
                   <span className={styles.res_icon}>📍</span>
                   <div className={styles.res_info}>
                      <p>{result.display_name.split(',')[0]}</p>
                      <small>{result.display_name.split(',').slice(1, 3).join(',')}</small>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      )}

      <div className={styles.bottom_card}>
        {step === 'select-location' && searchResults.length === 0 && (
          <div className={styles.content}>
            <h3 className={styles.section_title}>Popular in Bhopal</h3>
            <div className={styles.recent_item} onClick={() => selectDestination("DB City Mall", "23.2324", "77.4300")}>
              <span>🏢</span> <div><p>DB City Mall</p><small>Arera Hills</small></div>
            </div>
            <div className={styles.recent_item} onClick={() => selectDestination("Upper Lake", "23.2494", "77.3875")}>
              <span>🌊</span> <div><p>Upper Lake</p><small>VIP Road</small></div>
            </div>
          </div>
        )}

        {step === 'choose-vehicle' && (
          <div className={styles.content}>
            <div className={styles.vehicle_card_active}>
              <div className={styles.v_icon}>🏍️</div>
              <div className={styles.v_details}><p>Ridozo Bike</p><span>Nearby</span></div>
              <div className={styles.v_price}>₹45</div>
            </div>
            <button className={styles.confirm_btn} onClick={handleConfirmBooking}>CONFIRM BOOKING</button>
          </div>
        )}

        {step === 'searching' && (
          <div className={styles.searching_content}>
             <div className={styles.loader_circle}></div>
             <h3>Finding Captain...</h3>
             <button className={styles.cancel_btn_small} onClick={() => setStep('choose-vehicle')}>CANCEL</button>
          </div>
        )}

        {step === 'rider-assigned' && riderDetails && (
          <div className={styles.content}>
            <div className={styles.rider_card}>
               <div className={styles.rider_info}>
                  <div className={styles.rider_img}>👨‍✈️</div>
                  <div>
                    <h4>{riderDetails.name}</h4>
                    <p>{riderDetails.vehicle} • ⭐ {riderDetails.rating}</p>
                  </div>
                  <div className={styles.call_btn}>📞</div>
               </div>
               <div className={styles.otp_box}>OTP: 4921</div>
               <p className={styles.status_text}>Captain is moving towards you...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;