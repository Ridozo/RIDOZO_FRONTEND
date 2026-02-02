import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RideData {
  id: string;
  pickup: string;
  drop: string;
  fare: string;
  distance: string;
  customerName: string;
}

interface RideRequestState {
  incomingRequest: RideData | null; // नई रिक्वेस्ट का डेटा यहाँ रहेगा
  isSearching: boolean;            // क्या हम राइड ढूंढ रहे हैं?
}

const initialState: RideRequestState = {
  incomingRequest: null,
  isSearching: false,
};

const rideRequestSlice = createSlice({
  name: 'rideRequest', // स्लाइस का नाम बदल दिया
  initialState,
  reducers: {
    // जब सर्वर से नई रिक्वेस्ट आए
    setIncomingRequest: (state, action: PayloadAction<RideData | null>) => {
      state.incomingRequest = action.payload;
    },
    // रिक्वेस्ट को साफ़ करने के लिए (Accept/Reject के बाद)
    clearRequest: (state) => {
      state.incomingRequest = null;
    },
    setSearchingStatus: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    }
  },
});

export const { setIncomingRequest, clearRequest, setSearchingStatus } = rideRequestSlice.actions;
export default rideRequestSlice.reducer;