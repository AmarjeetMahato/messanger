import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  id: string;
  email:string;
  username: string;
  fullName: string;
  avatarUrl?: string | null;
  isVerified:boolean;
  lastSeen:string | null
};

type AuthState = {
  user: User | null;
};

type SetCredentialsPayload = {
  user: User;
};


const initialState:AuthState = {
      user:null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      state.user = action.payload.user;
    },

    logout: (state) => {
      state.user = null;
    },
  },
});

export const {setCredentials,logout} = authSlice.actions;
export default authSlice.reducer