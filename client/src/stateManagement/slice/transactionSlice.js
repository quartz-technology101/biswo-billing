import { createSlice } from "@reduxjs/toolkit";
import { todayNepaliDate } from "../../components/Common/todayNepaliDate";
import { NotifyWarning } from "../../toastify";
import * as api from "../API/transactionApi";

const Status = Object.freeze({
  Idle: "idle",
  Loading: "loading",
  Failed: "failed",
});

const initialState = {
  data: [],
  detailList: null,
  productList: null,
  status: Status.Idle,
  page: 1,
  pageCount: 1,
  filterBy: "",
  sortBy: 1,
  searchBy: {
    name: "",
    anything: "",
  },
  date: {
    startDate: "",
    endDate: todayNepaliDate(new Date()),
  },
  dateFilterOpen: false,
  showDraft: false,
  pageProduct: 1,
  pageCountProduct: 1,
};

export const getAllTransaction =
  ({ page, onlyDraft, searchBy, filterBy, sortBy, date }) =>
  async (dispatch) => {
    dispatch(setTransactionStatus(Status.Loading));
    try {
      const {
        data: { data, pageCount },
      } = await api.GetAllProductAPI({
        page,
        onlyDraft,
        searchBy,
        filterBy,
        sortBy,
        date,
      });
      dispatch(setPageCount(pageCount));
      const reverseData = data.reverse();
      dispatch(setAllTransaction(reverseData));
      return dispatch(setTransactionStatus(Status.Idle));
    } catch (error) {
      NotifyWarning(
        error?.response?.data?.message || "Error please reload page"
      );
      return dispatch(setTransactionStatus(Status.Failed));
    }
  };

export const getByTransactionID =
  ({ id, page }) =>
  async (dispatch) => {
    dispatch(setTransactionStatus(Status.Loading));
    try {
      const {
        data: { data },
      } = await api.GetProductByIdAPI({ id, page });
      const reverseData = data.reverse();
      dispatch(setTransactionDetailByID(reverseData));
      return dispatch(setTransactionStatus(Status.Idle));
    } catch (error) {
      NotifyWarning(
        error?.response?.data?.message || "Error please reload page"
      );
      return dispatch(setTransactionStatus(Status.Failed));
    }
  };

export const getTransactionByProduct =
  ({ id, page }) =>
  async (dispatch) => {
    dispatch(setTransactionStatus(Status.Loading));
    try {
      const {
        data: { data, pageCount },
      } = await api.GetTransactionByProductAPI({ id, page });
      dispatch(setTransactionDetailByProductID(data));
      dispatch(setPageCountProduct(pageCount));
      return dispatch(setTransactionStatus(Status.Idle));
    } catch (error) {
      NotifyWarning(
        error?.response?.data?.message || "Error please reload page"
      );
      return dispatch(setTransactionStatus(Status.Failed));
    }
  };

export const newTransactionByProductAmount =
  ({ id, payload }) =>
  async (dispatch) => {
    dispatch(setTransactionStatus(Status.Loading));
    try {
      dispatch(setNewTransactionByProductAmount({ id, payload }));
      return dispatch(setTransactionStatus(Status.Idle));
    } catch (error) {
      NotifyWarning(
        error?.response?.data?.message || "Error please reload page"
      );
      return dispatch(setTransactionStatus(Status.Failed));
    }
  };

const calculationTransaction = (data) => {
  const arr = data.map((item) =>
    item.transactionType === "Sale" || item.transactionType === "Purchase"
      ? item.amount - item.receviedAmount
      : item.transactionType === "PaymentIn"
      ? item.amount
      : item.transactionType === "PaymentOut"
      ? item.amount
      : item.transactionType === "OpeningBalance"
      ? item.amount
      : 0
  );
  const arr2 = data.map((item) =>
    item.transactionType === "Sale" || item.transactionType === "Purchase"
      ? true
      : item.transactionType === "PaymentIn" ||
        item.transactionType === "PaymentOut"
      ? false
      : item.transactionType === "OpeningBalance"
      ? true
      : false
  );
  let result = [arr[0]];
  let sum = arr[0];

  for (let i = 1; i < arr.length; i++) {
    arr2[i] ? (sum += arr[i]) : (sum -= arr[i]);
    result.push(sum);
  }
  const newData = data.map((item, index) => {
    return {
      ...item,
      amountToPay: result[index],
    };
  });
  return newData;
};

export const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactionStatus: (state, action) => {
      state.status = action.payload;
    },

    setPageCount: (state, action) => {
      state.pageCount = action.payload;
    },

    setPageCountProduct: (state, action) => {
      state.pageCountProduct = action.payload;
    },

    setPageNumber: (state, action) => {
      state.page = action.payload;
    },

    setPageNumberProduct: (state, action) => {
      state.pageProduct = action.payload;
    },

    setTransactionShowDraft: (state, action) => {
      state.showDraft = action.payload;
    },

    setTransactionSearchBy: (state, action) => {
      state.searchBy = action.payload;
    },

    setTransactionFilterBy: (state, action) => {
      state.filterBy = action.payload;
    },

    setTransactionSortBy: (state, action) => {
      state.sortBy = action.payload;
    },

    setTransactionDate: (state, action) => {
      state.date = action.payload;
    },
    setTransactionDateFilterOpen: (state, action) => {
      state.dateFilterOpen = action.payload;
    },
    setAllTransaction: (state, action) => {
      let data = [];
      data = action.payload.filter(
        (item) => item.transactionType !== "OpeningBalance"
      );
      const newData = calculationTransaction(data);
      state.data = newData;
    },

    setCreateTransaction: (state, action) => {
      const data = action.payload;
      if (
        data.transactionType === "PaymentIn" ||
        data.transactionType === "PaymentOut"
      ) {
        if (data.fromClientByID === true) {
          state.data.push(data);
          const newData = calculationTransaction(state.data);
          state.data = newData;
        } else {
          state.detailList.push(data);
          const newData = calculationTransaction(state.detailList);
          state.detailList = newData;
        }
      } else {
        state.data.push(data);
      }
    },

    setUpdateTransactionOnClientEdit: (state, action) => {
      const { id, openingBalance } = action.payload;
      const index = state.detailList.findIndex(
        (item) => item.transactionNumber === id
      );
      if (index !== -1) {
        state.detailList[index].amount = openingBalance;
        const newData = calculationTransaction(state.detailList);
        state.detailList = newData;
      }
    },

    setUpdateTransaction: (state, action) => {
      const data = action.payload;
      let index;
      if (
        data.transactionType === "PaymentIn" ||
        data.transactionType === "PaymentOut"
      ) {
        if (data.fromClientByID === true) {
          index = state.data.findIndex(
            (item) => item.transactionNumber === data.transactionNumber
          );
        } else {
          index = state.detailList.findIndex(
            (item) => item.transactionNumber === data.transactionNumber
          );
        }
        if (index !== -1) {
          if (data.fromClientByID === true) {
            state.data[index] = data;
            const newData = calculationTransaction(state.data);
            state.data = newData;
          } else {
            state.detailList[index] = data;
            const newData = calculationTransaction(state.detailList);
            state.detailList = newData;
          }
        }
      } else {
        index = state.data.findIndex(
          (item) => item.transactionNumber === data.transactionNumber
        );
        if (index !== -1) {
          state.data[index] = data;
        }
      }
    },

    setDeleteTransaction: (state, action) => {
      const { id, fromClientByID, method } = action.payload;
      if (method === "Payment") {
        if (fromClientByID === true) {
          state.data = state.data.filter(
            (item) => item.transactionNumber !== id
          );
          const newData = calculationTransaction(state.data);
          state.data = newData;
        } else if (fromClientByID === false) {
          state.detailList = state.detailList.filter(
            (item) => item.transactionNumber !== id
          );
          const newData = calculationTransaction(state.detailList);
          state.detailList = newData;
        }
      } else {
        state.data = state.data.filter((item) => item.transactionNumber !== id);
      }
    },

    setTransactionDetailByID: (state, action) => {
      let data = action.payload;
      const newData = calculationTransaction(data);
      state.detailList = newData;
    },

    setTransactionDetailByProductID: (state, action) => {
      let data = action.payload;
      state.productList = data;
    },
    setNewTransactionByProductAmount: (state, action) => {
      const { id, payload } = action.payload;
      const productTransaction = {
        transactionNumber: id,
        transactionType: payload.isAdd ? "AddQuantity" : "ReduceQuantity",
        partyDetails: {
          _id: null,
        },
        productDetails: [
          {
            productID: id,
            quantity: payload.quantity,
            isSecondaryUnitChecked: false,
            unit: payload.unit,
          },
        ],
        note: payload.note,
        createdDate: payload.stockDate,
      };
      state.productList.push(productTransaction);
    },
  },
});

export const {
  setTransactionDetailByID,
  setPageCount,
  setPageNumber,
  setPageCountProduct,
  setPageNumberProduct,
  setTransactionShowDraft,
  setTransactionSearchBy,
  setTransactionFilterBy,
  setTransactionSortBy,
  setTransactionDate,
  setTransactionDateFilterOpen,
  setTransactionDetailByProductID,
  setNewTransactionByProductAmount,
  setUpdateTransactionOnClientEdit,
  setCreateTransaction,
  setUpdateTransaction,
  setTransactionStatus,
  setAllTransaction,
  setDeleteTransaction,
} = transactionSlice.actions;

export const getTransactionStatusSelector = (state) =>
  state.transactions.status;

export const getTransactionPageCountSelector = (state) =>
  state.transactions.pageCount;

export const getTransactionPageCountProductSelector = (state) =>
  state.transactions.pageCountProduct;

export const getTransactionPageNumberSelector = (state) =>
  state.transactions.page;

export const getTransactionPageNumberProductSelector = (state) =>
  state.transactions.pageProduct;

export const getTransactionShowDraftSelector = (state) =>
  state.transactions.showDraft;

export const getTransactionSearchBySelector = (state) =>
  state.transactions.searchBy;

export const getTransactionFilterBySelector = (state) =>
  state.transactions.filterBy;

export const getTransactionSortBySelector = (state) =>
  state.transactions.sortBy;

export const getTransactionDateSelector = (state) => state.transactions.date;

export const getTransactionDateFilterOpenSelector = (state) =>
  state.transactions.dateFilterOpen;

export const getTransactionDetailByIDSelector = (state) =>
  state.transactions.detailList;

export const getTransactionDetailByProductIDSelector = (state) =>
  state.transactions.productList;

export const getAllTransactionSelector = (state) => state.transactions.data;

export default transactionSlice.reducer;
