import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WithdrawalRecord {
  id: string;
  amount: number;
  date: string;
}

interface RiderState {
  isOnline: boolean;
  walletBalance: number;
  withdrawals: WithdrawalRecord[]; 
  profile: {
    name: string;
    vehicle: string;
    rating: number;
    phone: string;
  };
}

const initialState: RiderState = {
  walletBalance: 0,
  withdrawals: [], 
  isOnline: false,
  profile: {  
    name: "",
    vehicle: "",
    rating: 5.0,
    phone: ""
  }
};

const riderSlice = createSlice({
  name: 'rider',
  initialState,
  reducers: {
    // यही वो फंक्शन है जो गायब था ✅
    setLogin: (state, action: PayloadAction<{phone: string, name: string, vehicle: string}>) => {
      state.isOnline = true;
      state.profile = {
        ...state.profile,
        name: action.payload.name,
        vehicle: action.payload.vehicle,
        phone: action.payload.phone,
      };
    },

    toggleStatus: (state) => {
      state.isOnline = !state.isOnline;
    },

    addMoney: (state, action: PayloadAction<number>) => {
      state.walletBalance += action.payload;
    },

    withdrawBalance: (state) => {
      if (state.walletBalance > 0) {
        state.withdrawals.unshift({
          id: `WTH_${Date.now()}`,
          amount: state.walletBalance,
          date: new Date().toLocaleString('en-GB')
        });
        state.walletBalance = 0;
      }
    },

    logout: (state) => {
      return initialState; // सब कुछ रिसेट कर देगा
    }
  }
});

// यहाँ चेक करें: setLogin एक्सपोर्ट होना ज़रूरी है ✅
export const { setLogin, toggleStatus, addMoney, withdrawBalance, logout } = riderSlice.actions;
export default riderSlice.reducer;