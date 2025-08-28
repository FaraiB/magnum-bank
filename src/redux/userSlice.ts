import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string | null;
  name: string | null;
  balance: number;
  transactions: any[]; //change type later
}

const initialState: UserState = {
  id: null,
  name: null,
  balance: 0,
  transactions: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.balance = action.payload.balance;
      state.transactions = action.payload.transactions;
    },
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    addTransaction: (state, action: PayloadAction<any>) => {
      state.transactions.unshift(action.payload); //adds new transaction to the beginning
    },
    clearUser: (state) => {
      state.id = null;
      state.name = null;
      state.balance = 0;
      state.transactions = [];
    },
  },
});

export const { setUser, setBalance, addTransaction, clearUser } =
  userSlice.actions;

export default userSlice.reducer;
