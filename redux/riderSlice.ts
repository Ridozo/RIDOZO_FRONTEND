import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1. Data Structure (Types)
interface Profile {
  name: string;
  vehicle: string;
  phone: string;
  rating: number;
}

interface RiderState {
  isLoggedIn: boolean;
  isOnline: boolean;
  walletBalance: string;
  profile: Profile;
}

// 2. Initial Data (तुम्हारा बताया हुआ डिफ़ॉल्ट डेटा)
const initialState: RiderState = {
  isLoggedIn: false,
  isOnline: false,
  walletBalance: "500.00",
  profile: {
    name: "JAT RIDER",
    vehicle: "HR 26 BK 9922",
    phone: "+91 98765 43210",
    rating: 4.9
  }
};

// 3. Slice Logic
const riderSlice = createSlice({
  name: 'rider',
  initialState,
  reducers: {
    // लॉगिन के समय डेटा सेट करने के लिए
    setLogin: (state, action: PayloadAction<Partial<Profile>>) => {
      state.isLoggedIn = true;
      state.profile = { ...state.profile, ...action.payload };
    },
    // ऑनलाइन/ऑफलाइन टॉगल
    toggleStatus: (state) => {
      state.isOnline = !state.isOnline;
    },
    // प्रोफाइल एडिट करने के लिए
    updateProfile: (state, action: PayloadAction<Partial<Profile>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    // वॉलेट बैलेंस अपडेट (राइड पूरी होने पर)
    updateBalance: (state, action: PayloadAction<string>) => {
      state.walletBalance = action.payload;
    },
    // लॉगआउट के लिए
    logout: (state) => {
      state.isLoggedIn = false;
      state.isOnline = false;
    }
  },
});

export const { setLogin, toggleStatus, updateProfile, updateBalance, logout } = riderSlice.actions;
export default riderSlice.reducer;