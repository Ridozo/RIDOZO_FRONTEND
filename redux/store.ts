import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

// आपके स्लाइसेस (इम्पोर्ट्स एकदम सही हैं)
import riderReducer from "./riderSlice";
import globalReducer from "./globalSlice";
import rideRequestReducer from "./rideRequestSlice";
import activeRideReducer from "./activeRideSlice";
import rideHistoryReducer from "./rideHistorySlice"; // आपकी नई स्लाइस

// 1. सभी रिड्यूसर्स को एक साथ जोड़ें
const rootReducer = combineReducers({
  global: globalReducer,
  rider: riderReducer,
  riderRequest: rideRequestReducer,
  activeRide: activeRideReducer,
  rideHistory: rideHistoryReducer, // यहाँ ऐड हो गया
});

// 2. Persist कॉन्फ़िगरेशन
const persistConfig = {
  key: "root",
  storage,
  // 'rideHistory' को भी whitelist में डाल दिया है ताकि हिस्ट्री डिलीट न हो रिफ्रेश पर
  whitelist: ["global", "rider", "riderRequest", "activeRide", "rideHistory"], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 3. Final Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
        ],
      },
    }),
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;