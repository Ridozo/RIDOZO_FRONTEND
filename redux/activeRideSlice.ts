import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  currentRide: null,
  status: 'idle', // idle, picked, ongoing, completed
};

const activeRideSlice = createSlice({
  name: "activeRide",
  initialState,
  reducers: {
    // यही वो एक्शन है जो गायब है
    acceptRide: (state, action: PayloadAction<any>) => {
      state.currentRide = action.payload;
      state.status = 'ongoing';
    },
    updateStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    // चेक करें कि आपने यहाँ क्या नाम रखा है (finishRide या endRide)
    finishRide: (state) => {
      state.currentRide = null;
      state.status = 'completed';
    },
  },
});

// इन सबको export करना ज़रूरी है ताकि page.tsx इन्हें पहचान सके
export const { acceptRide, updateStatus, finishRide } = activeRideSlice.actions;
export default activeRideSlice.reducer;