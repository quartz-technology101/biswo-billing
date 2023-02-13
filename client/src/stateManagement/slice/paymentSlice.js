import { createSlice } from "@reduxjs/toolkit";
import { NotifyWarning } from "../../toastify";
import * as api from "../API/paymentApi";
import { setClientDetails } from "./clientSlice";
import {
  setCreateTransaction,
  setDeleteTransaction,
  setTransactionStatus,
  setUpdateTransaction,
} from "./transactionSlice";

const Status = Object.freeze({
  Idle: "idle",
  Loading: "loading",
  Failed: "failed",
});

const initialState = {
  status: Status.Idle,
  productData: null,
  fromClientByID: false,
};

export const createPayment =
  ({ payload, fromClientByID, clientDetail }) =>
  async (dispatch) => {
    dispatch(setPaymentStatus(Status.Loading));
    dispatch(setTransactionStatus(Status.Loading));
    clientDetail = { ...clientDetail };
    const RemainingAmountToPaid =
      clientDetail.totalAmountToPay - payload.amount;
    clientDetail.totalAmountToPay = RemainingAmountToPaid;
    dispatch(setClientDetails(clientDetail));
    try {
      const {
        data: { data },
      } = await api.CreatePaymentAPI(payload);
      dispatch(
        setCreateTransaction({
          amount: parseInt(payload.amount),
          note: payload.note || "Payment Added",
          partyDetails: payload.partyDetails,
          transactionNumber: data._id,
          transactionType: payload.paymentType,
          createdDate: payload.paymentDate,
          fromClientByID,
        })
      );
      dispatch(setTransactionStatus(Status.Idle));
      return dispatch(setPaymentStatus(Status.Idle));
    } catch (error) {
      NotifyWarning(
        error?.response?.data?.message || "Error please reload page"
      );
      dispatch(setTransactionStatus(Status.Failed));
      return dispatch(setPaymentStatus(Status.Failed));
    }
  };

export const updatedPayment =
  ({ payload, fromClientByID, ClientDetail, prevoiusData }) =>
  async (dispatch) => {
    dispatch(setPaymentStatus(Status.Loading));
    dispatch(setTransactionStatus(Status.Loading));
    if (ClientDetail !== null) {
      ClientDetail = { ...ClientDetail };
      if (parseInt(payload.amount) > parseInt(prevoiusData.amount)) {
        const RemainingAmountToPaid =
          ClientDetail.totalAmountToPay -
          (parseInt(payload.amount) - parseInt(prevoiusData.amount));
        ClientDetail.totalAmountToPay = RemainingAmountToPaid;
        dispatch(setClientDetails(ClientDetail));
      } else {
        const RemainingAmountToPaid =
          ClientDetail.totalAmountToPay +
          (parseInt(prevoiusData.amount) - parseInt(payload.amount));
        ClientDetail.totalAmountToPay = RemainingAmountToPaid;
        dispatch(setClientDetails(ClientDetail));
      }
    }

    try {
      await api.UpdatePaymentAPI(payload);
      dispatch(
        setUpdateTransaction({
          amount: parseInt(payload.amount),
          note: payload.note || "Payment Updated",
          partyDetails: payload.partyDetails,
          transactionNumber: payload.transactionNumber,
          transactionType: payload.paymentType,
          createdDate: payload.paymentDate,
          fromClientByID,
        })
      );
      dispatch(setTransactionStatus(Status.Idle));
      return dispatch(setPaymentStatus(Status.Idle));
    } catch (error) {
      NotifyWarning(
        error?.response?.data?.message || "Error please reload page"
      );
      dispatch(setTransactionStatus(Status.Failed));
      return dispatch(setPaymentStatus(Status.Failed));
    }
  };

export const deletePayment =
  ({ payload, ClientDetail, fromClientByID }) =>
  async (dispatch) => {
    dispatch(setPaymentStatus(Status.Loading));
    try {
      if (ClientDetail !== null) {
        ClientDetail = { ...ClientDetail };
        const RemainingAmountToPaid =
          parseInt(ClientDetail.totalAmountToPay) + parseInt(payload.amount);
        ClientDetail.totalAmountToPay = RemainingAmountToPaid;
        dispatch(setClientDetails(ClientDetail));
      }
      dispatch(
        setDeleteTransaction({
          id: payload.transactionNumber,
          fromClientByID,
          method: "Payment",
        })
      );
      await api.DeletePaymentAPI(payload.transactionNumber);
      return dispatch(setPaymentStatus(Status.Idle));
    } catch (error) {
      NotifyWarning(
        error?.response?.data?.message || "Error please reload page"
      );
      return dispatch(setPaymentStatus(Status.Failed));
    }
  };

export const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setPaymentStatus: (state, action) => {
      state.status = action.payload;
    },
    setPaymentData: (state, action) => {
      state.productData = action.payload;
    },
    setFromClientByID: (state, action) => {
      state.fromClientByID = action.payload;
    },
  },
});

export const { setPaymentStatus, setPaymentData, setFromClientByID } =
  paymentSlice.actions;
export const getPaymentData = (state) => state.payments.productData;
export const getFromClientByID = (state) => state.payments.fromClientByID;

export default paymentSlice.reducer;
