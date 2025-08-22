import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; 
import { mainMiddleware, authMiddleware } from './middleware'; 

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(mainMiddleware, authMiddleware),
});

export default store; 