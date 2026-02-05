import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER 
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

import riderReducer from './riderSlice';
import riderRequestReducer from './rideRequestSlice'; // ✅ पहले से मौजूद है
import activeRideReducer from './activeRideSlice';
import rideHistoryReducer from './rideHistorySlice';

// 1. सारे Reducers को कंबाइन करें
const rootReducer = combineReducers({
  rider: riderReducer,
  riderRequest: riderRequestReducer, // ✅ यहाँ यह जुड़ गया है
  activeRide: activeRideReducer,
  rideHistory: rideHistoryReducer,
});

// 2. Persist Config सेट करें
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // हम सिर्फ 'rider' और 'rideHistory' को सेव करेंगे 
  // 'riderRequest' को यहाँ नहीं डालेंगे ताकि रिफ्रेश पर रिक्वेस्ट साफ़ हो जाए ✅
  whitelist: ['rider', 'rideHistory'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 3. Store कॉन्फ़िगर करें
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 4. Persistor एक्सपोर्ट करें
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;