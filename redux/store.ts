import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

// आपके स्लाइसेस
import riderReducer from "./riderSlice";
import globalReducer from "./globalSlice";
import rideRequestReducer from "./rideRequestSlice";
import activeRideReducer from "./activeRideSlice";

// 1. सभी रिड्यूसर्स को एक साथ जोड़ें (यही गलती थी)
const rootReducer = combineReducers({
  global: globalReducer,
  rider: riderReducer, // अब 'rider' भी स्टोर का हिस्सा है
  riderRequest: rideRequestReducer,
  activeRide: activeRideReducer
});

// 2. Persist कॉन्फ़िगरेशन
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["global", "rider", "riderRequest", "activeRide"], // अगर आप चाहते हैं कि ऑनलाइन स्टेटस रिफ्रेश करने पर भी न हटे
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 3. सिर्फ एक स्टोर बनाएँ (Final Store)
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

// Types (इनका इस्तेमाल hooks.ts में करें)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;