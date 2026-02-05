import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RideRecord {
  id: string;
  date: string;
  timestamp: number; 
  pickup: string;
  drop: string;
  amount: number;
  status: 'COMPLETED';
}

interface HistoryState {
  rides: RideRecord[];
  weeklyTotal: number;
  monthlyTotal: number;
}

const initialState: HistoryState = {
  rides: [],
  weeklyTotal: 0,
  monthlyTotal: 0,
};

// हेल्पर फंक्शन: 7 और 30 दिन का हिसाब लगाने के लिए
const calculateTotals = (rides: RideRecord[]) => {
  const now = Date.now();
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
  const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;

  let weekly = 0;
  let monthly = 0;

  rides.forEach(ride => {
    const age = now - ride.timestamp;
    if (age <= oneWeekInMs) weekly += ride.amount;
    if (age <= oneMonthInMs) monthly += ride.amount;
  });

  return { weekly, monthly };
};

const rideHistorySlice = createSlice({
  name: 'rideHistory',
  initialState,
  reducers: {
    // 1. नई राइड जोड़ते वक्त स्टैट्स अपडेट
    addRideToHistory: (state, action: PayloadAction<RideRecord>) => {
      state.rides.unshift(action.payload);
      const totals = calculateTotals(state.rides);
      state.weeklyTotal = totals.weekly;
      state.monthlyTotal = totals.monthly;
    },

    // 2. नाम यहाँ 'refreshHistoryStats' फिक्स कर दिया है ✅
    refreshHistoryStats: (state) => {
      const totals = calculateTotals(state.rides);
      state.weeklyTotal = totals.weekly;
      state.monthlyTotal = totals.monthly;
    }
  }
});

// एक्सपोर्ट्स में नाम एकदम सही है ✅
export const { addRideToHistory, refreshHistoryStats } = rideHistorySlice.actions;
export default rideHistorySlice.reducer;