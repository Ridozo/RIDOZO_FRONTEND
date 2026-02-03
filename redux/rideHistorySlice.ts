import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Ride {
  id: string;
  date: string; // Format: YYYY-MM-DD
  time: string;
  pickup: string;
  drop: string;
  amount: number;
  status: 'COMPLETED' | 'CANCELLED';
}

interface HistoryState {
  rides: Ride[];
  weeklyTotal: number;
  monthlyTotal: number;
  searchTerm: string; // <-- यह मिसिंग था, अब ऐड कर दिया है
}

const initialState: HistoryState = {
  rides: [],
  weeklyTotal: 0,
  monthlyTotal: 0,
  searchTerm: "", // <-- इनिशियली खाली रहेगा
};

const rideHistorySlice = createSlice({
  name: 'rideHistory',
  initialState,
  reducers: {
    addRideToHistory: (state, action: PayloadAction<Ride>) => {
      state.rides.unshift(action.payload);

      const rideDate = new Date(action.payload.date);
      const now = new Date();

      // हफ्ते की कैलकुलेशन (Last 7 Days)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      
      // महीने की कैलकुलेशन (Current Month)
      const isThisMonth = rideDate.getMonth() === now.getMonth() && 
                          rideDate.getFullYear() === now.getFullYear();

      if (rideDate >= oneWeekAgo) {
        state.weeklyTotal += action.payload.amount;
      }
      if (isThisMonth) {
        state.monthlyTotal += action.payload.amount;
      }
    },

    // --- यह नया रिड्यूसर ऐड किया है (Search Error Solve करने के लिए) ---
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },

    resetHistory: () => initialState,
  },
});

// अब यहाँ से setSearchTerm एक्सपोर्ट होगा, तो एरर नहीं आएगी
export const { addRideToHistory, resetHistory, setSearchTerm } = rideHistorySlice.actions;
export default rideHistorySlice.reducer;