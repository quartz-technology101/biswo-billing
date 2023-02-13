import { configureStore } from "@reduxjs/toolkit";
import productRedicer from "../slice/productSlice";
import clientReducer from "../slice/clientSlice";
import invoiceReducer from "../slice/invoiceSlice";
import InitialMode from "../slice/InitialMode";
import companySlice from "../slice/companySlice";
import transactionSlice from "../slice/transactionSlice";
import paymentSlice from "../slice/paymentSlice";
export const store = configureStore({
  reducer: {
    products: productRedicer,
    clients: clientReducer,
    invoices: invoiceReducer,
    payments: paymentSlice,
    transactions: transactionSlice,
    company: companySlice,
    initialMode: InitialMode,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production" ? true : false,
});
