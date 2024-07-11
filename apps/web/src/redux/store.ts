import { configureStore } from '@reduxjs/toolkit';
import settingsReaducer from '@/redux/slices/settings-slice';
import propertyCategoryReducer from './slices/propertyCategory-slice';
import tenantReducer from './slices/tenant-slice';
import roomReducer from './slices/room-slice';
import roomAvailabilityReducer from './slices/roomAvailability-slice';
import propertiesClientSlice from './slices/client/property-slice';
import transactionClientReducer from './slices/client/transaction-slice';
import specialPriceReducer from './slices/specialPrice-slice';
import orderTenantReducer from "./slices/orderTenant-slice";
import orderClientReducer from "./slices/client/orderClient-slice";
import reviewReducer from "./slices/client/review-slice";
import salesReportReducer from "./slices/salesReport-slice";

export const store = configureStore({
  reducer: {
    settingsReaducer,
    propertyCategoryReducer,
    tenantReducer,
    roomReducer,
    roomAvailabilityReducer,
    propertiesClientSlice,
    transactionClientReducer,
    specialPriceReducer,
    orderTenantReducer,
    orderClientReducer,
    reviewReducer,
    salesReportReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
