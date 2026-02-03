import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Profile {
  name: string;
  vehicle: string;
  phone: string;
  rating: number;
}

interface RiderState {
  isLoggedIn: boolean;
  isOnline: boolean;
  walletBalance: string; // Dashboard की मांग के हिसाब से string रखा है
  profile: Profile;
}

const initialState: RiderState = {
  isLoggedIn: false,
  isOnline: false,
  walletBalance: "50000.00",
  profile: {
    name: "Uttam Turkar",
    vehicle: "HR 26 BK 9922",
    phone: "+91 98765 43210",
    rating: 4.9
  }
};

const riderSlice = createSlice({
  name: 'rider',
  initialState,
  reducers: {
    toggleStatus: (state) => {
      state.isOnline = !state.isOnline;
    },
    updateProfile: (state, action: PayloadAction<Partial<Profile>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    updateBalance: (state, action: PayloadAction<string>) => {
      state.walletBalance = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.isOnline = false;
    }
  },
});

export const { toggleStatus, updateProfile, updateBalance, logout } = riderSlice.actions;
export default riderSlice.reducer;