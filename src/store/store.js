import { configureStore } from '@reduxjs/toolkit';
import registerReducer from '../services/features/auth/registerSlice';
import authReducer from '../services/features/auth/authSlice';
import adminReducer from '../services/features/auth/adminAuthSlice';
import otpReducer from '../services/features/auth/otpSlice';
import productReducer from '../services/features/products/productSlice';
import territoryReducer from '../services/features/Territory/TerritorySlice';
import distributorReducer from '../services/features/distributor/distributorSlice';
import fseReducer from '../services/features/fse/fseSlice';
import retailerReducer from '../services/features/retailer/retailerSlice';
import locationReducer from '../services/features/fse/locationSlice';
import trackingReducer from '../services/features/fse/trackingSlice';
import verifyResetReducer from '../services/features/auth/resetOTPSlice';
import executiveReducer from '../services/features/executive/executiveSlice';
import managerReducer from '../services/features/manager/managerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminReducer,
    register: registerReducer,
    otp: otpReducer,
    products: productReducer,
    territory: territoryReducer,
    distributors: distributorReducer,
    fse: fseReducer,
    retailer: retailerReducer,
    location: locationReducer,
    tracking: trackingReducer,
    resetOtp: verifyResetReducer,
    executive: executiveReducer,
    manager: managerReducer,
  },
});
