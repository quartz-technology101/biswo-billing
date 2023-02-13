import { createSlice, nanoid } from "@reduxjs/toolkit";
import { todayNepaliDate } from "../../components/Common/todayNepaliDate";
import { NotifyWarning } from "../../toastify";
import * as api from "../API/InvoiceApi";
import { onAddOrRemoveProduct, onUpdateInvoiceProduct } from "./productSlice";
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
  invoiceNo: "",
  isConfirmModal: false,
  isConfirm: false,
  detailList: null,
  deletedID: null,
  currentEditedID: null,
  status: Status.Idle,
  newForm: {
    id: nanoid(),
    invoiceNo: "",
    statusIndex: "1",
    statusName: "Draft",
    totalAmount: 0,
    paidAmount: 0,
    dueDate: "",
    invoiceType: "Sale",
    createdDate: todayNepaliDate(new Date()),
    currencyUnit: "Rs.",
    clientDetail: {
      id: "",
      name: "",
      mobileNo: "",
      email: "",
      image: "",
      billingAddress: "",
    },
    products: [],
    taxes: [],
    note: "",
  },
};

export const createNewInvoice = (payload) => async (dispatch) => {
  dispatch(setInvoiceStatus(Status.Loading));
  dispatch(setTransactionStatus(Status.Loading));
  try {
    const {
      data: { data },
    } = await api.CreateInvoiceAPI(payload);
    const invoiceNo = payload.invoiceNo || "";
    dispatch(
      setCreateTransaction({
        amount: payload.totalAmount,
        note: payload.note,
        billNumber: invoiceNo,
        partyDetails: payload.clientDetail,
        receviedAmount: payload.paidAmount,
        status: payload.statusName,
        transactionNumber: data._id,
        transactionType: payload.invoiceType,
        createdDate: payload.createdDate,
      })
    );

    let NoNullProductDetail = [];
    if (payload.products && payload.products.length > 0) {
      NoNullProductDetail = payload.products.filter((product) => {
        return product.productID !== null && product.productID !== "";
      });
      dispatch(
        onAddOrRemoveProduct({
          products: NoNullProductDetail,
          type: payload.invoiceType,
        })
      );
    }
    dispatch(setTransactionStatus(Status.Idle));
    return dispatch(setInvoiceStatus(Status.Idle));
  } catch (error) {
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    dispatch(setTransactionStatus(Status.Failed));
    return dispatch(setInvoiceStatus(Status.Failed));
  }
};

export const updatedInvoice = (payload) => async (dispatch) => {
  dispatch(setInvoiceStatus(Status.Loading));
  dispatch(setTransactionStatus(Status.Loading));
  try {
    const {
      data: { data },
    } = await api.UpdateInvoiceAPI(payload);
    const invoiceNo = payload.invoiceNo || "";
    dispatch(
      setUpdateTransaction({
        amount: payload.totalAmount,
        note: payload.note,
        billNumber: invoiceNo,
        partyDetails: payload.clientDetail,
        receviedAmount: payload.paidAmount,
        status: payload.statusName,
        transactionNumber: data._id,
        transactionType: payload.invoiceType,
        createdDate: data.createdDate,
      })
    );
    dispatch(onUpdateInvoiceProduct());
    dispatch(setTransactionStatus(Status.Idle));
    return dispatch(setInvoiceStatus(Status.Idle));
  } catch (error) {
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    dispatch(setTransactionStatus(Status.Failed));
    return dispatch(setInvoiceStatus(Status.Failed));
  }
};

export const getByIdInvoice = (payload) => async (dispatch) => {
  dispatch(setInvoiceStatus(Status.Loading));
  try {
    const {
      data: { data },
    } = await api.GetInvoiceByIdAPI(payload);
    dispatch(setAllInvoiceDetailList(data));
    return dispatch(setInvoiceStatus(Status.Idle));
  } catch (error) {
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    return dispatch(setInvoiceStatus(Status.Failed));
  }
};

export const getInvoiceNumber = () => async (dispatch) => {
  dispatch(setInvoiceStatus(Status.Loading));
  try {
    const {
      data: { data },
    } = await api.GetNewInvoiceNoAPI();
    dispatch(setUpCommingInvoiceNo(data));
    return dispatch(setInvoiceStatus(Status.Idle));
  } catch (error) {
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    return dispatch(setInvoiceStatus(Status.Failed));
  }
};

export const deleteInvoice = (id) => async (dispatch) => {
  dispatch(setInvoiceStatus(Status.Loading));
  dispatch(setTransactionStatus(Status.Loading));
  try {
    await api.DeleteInvoiceAPI(id);
    dispatch(setDeleteTransaction({ id }));
    dispatch(setTransactionStatus(Status.Idle));
    return dispatch(setInvoiceStatus(Status.Idle));
  } catch (error) {
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    return dispatch(setInvoiceStatus(Status.Failed));
  }
};

export const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    setInvoiceStatus: (state, action) => {
      state.status = action.payload;
    },

    setAllInvoiceDetailList: (state, action) => {
      state.detailList = action.payload;
    },

    setUpCommingInvoiceNo: (state, action) => {
      state.invoiceNo = action.payload;
    },

    setDeleteId: (state, action) => {
      state.deletedID = action.payload;
    },

    setEditedId: (state, action) => {
      state.currentEditedID = action.payload;
    },

    updateNewInvoiceForm: (state, action) => {
      state.newForm = { ...action.payload };
    },

    setConfirmModalOpen: (state, action) => {
      state.isConfirmModal = action.payload;
    },

    setIsConfirm: (state, action) => {
      state.isConfirm = action.payload;
    },
  },
});

export const {
  setAllInvoiceDetailList,
  setNewInvoices,
  setDeleteId,
  setEditedId,
  setConfirmModalOpen,
  setIsConfirm,
  updateNewInvoiceForm,
  setUpCommingInvoiceNo,
  setGenerateQuotation,
  setInvoiceStatus,
} = invoiceSlice.actions;

export const getInvocieNo = (state) => state.invoices.invoiceNo;

export const getInvoiceStatusSelector = (state) => state.invoices.status;

export const getAllInvoiceDetailSelector = (state) => state.invoices.detailList;

export const getDeletedInvoiceForm = (state) => state.invoices.deletedID;

export const getInvoiceNewForm = (state) => state.invoices.newForm;

export const getIsInvoiceConfirmModal = (state) =>
  state.invoices.isConfirmModal;

export const getIsConfirm = (state) => state.invoices.isConfirm;

export const getTotalBalance = (state) =>
  state.invoices.data.reduce((prev, next) => {
    return prev + (next.totalAmount || 0);
  }, 0);

export default invoiceSlice.reducer;
