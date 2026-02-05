import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// एक चैनल बनाओ जो दोनों टैब्स के बीच बात करेगा
const rideChannel = typeof window !== "undefined" ? new BroadcastChannel('ride_requests') : null;

interface RideRequest {
  id: string;
  pickup: string;
  drop: string;
  fare: number;
  userName: string;
}

const initialState: { incomingRequest: RideRequest | null } = {
  incomingRequest: null,
};

const rideRequestSlice = createSlice({
  name: 'rideRequest',
  initialState,
  reducers: {
    sendRideRequest: (state, action: PayloadAction<RideRequest>) => {
      state.incomingRequest = action.payload;
      // ✅ दूसरे टैब (Rider) को डेटा भेजो
      rideChannel?.postMessage(action.payload);
    },
    // यह नया रिड्यूसर है जो दूसरे टैब से डेटा रिसीव करेगा ✅
    receiveRideRequest: (state, action: PayloadAction<RideRequest>) => {
      state.incomingRequest = action.payload;
    },
    clearRequest: (state) => {
      state.incomingRequest = null;
      rideChannel?.postMessage(null); // दूसरे टैब को बोलो कि रिक्वेस्ट हट गई
    }
  }
});

export const { sendRideRequest, receiveRideRequest, clearRequest } = rideRequestSlice.actions;
export default rideRequestSlice.reducer;