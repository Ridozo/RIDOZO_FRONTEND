import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActiveState {
  isActive: boolean;
  status: 'PICKUP' | 'DROPOFF';
  rideData: any | null;
}

const initialState: ActiveState = {
  isActive: false,
  status: 'PICKUP',
  rideData: null
};

const activeRideSlice = createSlice({
  name: 'activeRide',
  initialState,
  reducers: {
    acceptRide: (state, action: PayloadAction<any>) => {
      state.isActive = true;
      state.status = 'PICKUP';
      state.rideData = action.payload;
    },
    updateStatus: (state, action: PayloadAction<'PICKUP' | 'DROPOFF'>) => {
      state.status = action.payload;
    },
    finishRide: (state) => {
      state.isActive = false;
      state.rideData = null;
    }
  }
});

export const { acceptRide, updateStatus, finishRide } = activeRideSlice.actions;
export default activeRideSlice.reducer;