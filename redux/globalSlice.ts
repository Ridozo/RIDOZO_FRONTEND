import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  menus: any[];
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
}

// 1. Initial State को खाली रखो क्योंकि Redux Persist इसे खुद भर देगा
const initialState: GlobalState = {
  menus: [],
  user: null,
  accessToken: null,
  refreshToken: null,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMenus(state, action: PayloadAction<any[]>) {
      state.menus = action.payload;
    },

    setUser(state, action: PayloadAction<any | null>) {
      state.user = action.payload;
      // 2. LocalStorage अपडेट करने से पहले window चेक करना ज़रूरी है
      if (typeof window !== "undefined") {
        if (action.payload) {
          localStorage.setItem("user", JSON.stringify(action.payload));
        } else {
          localStorage.removeItem("user");
        }
      }
    },

    setTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
      }
    },

    clearTokens(state) {
      state.accessToken = null;
      state.refreshToken = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    },

    logout(state) {
      state.user = null;
      state.menus = [];
      state.accessToken = null;
      state.refreshToken = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    },
  },
});

export const { setMenus, setUser, setTokens, clearTokens, logout } = globalSlice.actions;
export default globalSlice.reducer;
