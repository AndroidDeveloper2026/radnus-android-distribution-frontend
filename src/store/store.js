import { configureStore } from '@reduxjs/toolkit';
import registerReducer from '../services/features/auth/registerSlice';
import authReducer from '../services/features/auth/authSlice';
import adminReducer from '../services/features/auth/adminAuthSlice';
import otpReducer from '../services/features/auth/otpSlice';
import productReducer from '../services/features/products/productSlice';
import territoryReducer from '../services/features/Territory/TerritorySlice';
import distributorReducer from "../services/features/distributor/distributorSlice";
// import verifyResetReducer from '../services/features/auth/resetOTPSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminReducer,
    register: registerReducer,
    otp: otpReducer,
    products: productReducer,
    territory: territoryReducer,
    distributors: distributorReducer,
    // resetOtp:verifyResetReducer,
  },
});
