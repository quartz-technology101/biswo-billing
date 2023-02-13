import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import { todayNepaliDate } from "../../components/Common/todayNepaliDate";
import { NotifyWarning } from "../../toastify";
import * as api from "../API/ClientApi";
import { setUpdateTransactionOnClientEdit } from "./transactionSlice";
const Status = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
  FAILED: "failed",
});

const initialState = {
  openClientSelector: false,
  openMerchantSelector: false,
  selectedClient: null,
  selectedMerchant: null,
  status: Status.IDLE,
  data: [],
  dataMerchant: [],
  details: null,
  page: 1,
  pageCount: 1,
  merchantPageCount: 1,
  merchantPage: 1,
  filterBy: "",
  sortBy: 1,
  searchBy: {
    name: "",
    anything: "",
  },
  merchantSearchBy: {
    name: "",
    anything: "",
  },
  merchantFilterBy: "",
  merchantSortBy: 1,
  newForm: {
    id: nanoid(),
    image: "",
    name: "",
    email: "",
    billingAddress: "",
    mobileNo: "",
    totalAmountToPay: "",
    openingBalance: "",
    createdDate: todayNepaliDate(new Date()),
  },
  editedID: null,
  deletedID: null,
};

export const getAllCustomer =
  ({ page, searchBy, filterBy, sortBy, limit }) =>
  async (dispatch) => {
    dispatch(setClientStatus(Status.LOADING));
    try {
      const {
        data: { data, pageCount },
      } = await api.GetAllClientsAPI({
        clientType: "Customer",
        page,
        searchBy,
        filterBy,
        sortBy,
        limit,
      });
      dispatch(setPageCount(pageCount));
      dispatch(setAllClients(data));
      return dispatch(setClientStatus(Status.IDLE));
    } catch (error) {
      NotifyWarning(
        error?.response?.data?.message || "Error please reload page"
      );
      return dispatch(setClientStatus(Status.FAILED));
    }
  };

export const getAllMerchant =
  ({ page, searchBy, filterBy, sortBy }) =>
  async (dispatch) => {
    dispatch(setClientStatus(Status.LOADING));
    try {
      const {
        data: { data, pageCount },
      } = await api.GetAllClientsAPI({
        clientType: "Merchant",
        page,
        searchBy,
        filterBy,
        sortBy,
      });
      dispatch(setMerchantPageCount(pageCount));
      dispatch(setAllMerchant(data));
      return dispatch(setClientStatus(Status.IDLE));
    } catch (error) {
      NotifyWarning(
        error?.response?.data?.message || "Error please reload page"
      );
      return dispatch(setClientStatus(Status.FAILED));
    }
  };

export const getClientDetails = (id) => async (dispatch) => {
  dispatch(setClientStatus(Status.LOADING));
  try {
    const {
      data: { data },
    } = await api.GetClientsByIdAPI(id);
    dispatch(setClientDetails(data));
    return dispatch(setClientStatus(Status.IDLE));
  } catch (error) {
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    return dispatch(setClientStatus(Status.FAILED));
  }
};

export const createMultipleCustomer = (AddClientData) => async (dispatch) => {
  dispatch(setClientStatus(Status.LOADING));
  try {
    const {
      data: { data, message },
    } = await api.CreateMultipleClientsAPI({
      AddClientData,
      createdDate: todayNepaliDate(new Date()),
    });
    toast.success(message, {
      position: "bottom-center",
      autoClose: 2000,
    });
    dispatch(addMultipleCustomerData(data));
    return dispatch(setClientStatus(Status.IDLE));
  } catch (error) {
    console.log(error);
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    return dispatch(setClientStatus(Status.FAILED));
  }
};

export const createClient = (AddClientData) => async (dispatch) => {
  dispatch(setClientStatus(Status.LOADING));
  try {
    const {
      data: { data },
    } = await api.CreateClientsAPI(AddClientData);
    if (AddClientData.clientType === "Customer") {
      dispatch(addNewClient(data));
    } else {
      dispatch(addNewMerchant(data));
    }
    return dispatch(setClientStatus(Status.IDLE));
  } catch (error) {
    console.log(error);
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    return dispatch(setClientStatus(Status.FAILED));
  }
};

export const updateClient =
  ({ updateData, data }) =>
  async (dispatch) => {
    dispatch(setClientStatus(Status.LOADING));
    updateData = { ...updateData };
    data = { ...data };
    if (parseInt(updateData.openingBalance) > parseInt(data.openingBalance)) {
      const RemainingAmountToPaid =
        updateData.totalAmountToPay +
        (parseInt(updateData.openingBalance) - parseInt(data.openingBalance));
      updateData.totalAmountToPay = RemainingAmountToPaid;
      dispatch(
        setUpdateTransactionOnClientEdit({
          id: updateData._id,
          openingBalance: parseInt(updateData.openingBalance),
        })
      );
      dispatch(setClientDetails(updateData));
    } else if (
      parseInt(updateData.openingBalance) < parseInt(data.openingBalance)
    ) {
      const RemainingAmountToPaid =
        updateData.totalAmountToPay -
        (parseInt(data.openingBalance) - parseInt(updateData.openingBalance));
      updateData.totalAmountToPay = RemainingAmountToPaid;
      dispatch(
        setUpdateTransactionOnClientEdit({
          id: updateData._id,
          openingBalance: parseInt(updateData.openingBalance),
        })
      );
      dispatch(setClientDetails(updateData));
    } else {
      dispatch(setClientDetails(updateData));
    }
    try {
      dispatch(onConfirmEditClient());
      await api.UpdateClientsAPI(updateData);
      return dispatch(setClientStatus(Status.IDLE));
    } catch (error) {
      NotifyWarning(
        error?.response?.data?.message || "Error please reload page"
      );
      return dispatch(setClientStatus(Status.FAILED));
    }
  };

export const deleteClient = (id) => async (dispatch) => {
  dispatch(setClientStatus(Status.LOADING));
  try {
    dispatch(setDeleteId(null));
    await api.DeleteClientsAPI(id);
    dispatch(onConfirmDeletedClient(id));
    return dispatch(setClientStatus(Status.IDLE));
  } catch (error) {
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    return dispatch(setClientStatus(Status.FAILED));
  }
};

export const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    setPageCount: (state, action) => {
      state.pageCount = action.payload;
    },
    setMerchantPageCount: (state, action) => {
      state.merchantPageCount = action.payload;
    },
    setClientPageNumber: (state, action) => {
      state.page = action.payload;
    },
    setMerchantPageNumber: (state, action) => {
      state.merchantPage = action.payload;
    },
    setClientSearchBy: (state, action) => {
      state.searchBy = action.payload;
    },
    setMerchantSearchBy: (state, action) => {
      state.merchantSearchBy = action.payload;
    },
    setClientFilterBy: (state, action) => {
      state.filterBy = action.payload;
    },
    setMerchantFilterBy: (state, action) => {
      state.merchantFilterBy = action.payload;
    },
    setClientSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setMerchantSortBy: (state, action) => {
      state.merchantSortBy = action.payload;
    },
    addMultipleCustomerData: (state, action) => {
      const newDatas = [...state.data, ...action.payload];
      state.data = newDatas;
    },
    addNewClient: (state, action) => {
      console.log(action.payload);
      const totalAmountToPay = parseInt(action.payload.openingBalance || 0);
      const newDatas = [...state.data, { ...action.payload, totalAmountToPay }];
      state.data = newDatas;
      const reNewForm = {
        id: nanoid(),
        image: "",
        name: "",
        email: "",
        billingAddress: "",
        mobileNo: "",
        openingBalance: "",
        totalAmountToPay: 0,
      };
      state.newForm = { ...reNewForm };
    },
    addNewMerchant: (state, action) => {
      const totalAmountToPay = parseInt(action.payload.openingBalance || 0);
      const newDatas = [
        ...state.dataMerchant,
        { ...action.payload, totalAmountToPay },
      ];
      state.dataMerchant = newDatas;
      const reNewForm = {
        id: nanoid(),
        image: "",
        name: "",
        email: "",
        billingAddress: "",
        mobileNo: "",
        totalAmountToPay: 0,
        openingBalance: "",
      };
      state.newForm = { ...reNewForm };
    },
    setClientDetails: (state, action) => {
      state.details = action.payload;
    },

    updateNewClientForm: (state, action) => {
      state.newForm = { ...action.payload };
    },

    updateNewClientFormField: (state, action) => {
      state.newForm[action.payload.key] = action.payload.value;
    },

    setAllClients: (state, action) => {
      state.data = action.payload;
    },

    setAllMerchant: (state, action) => {
      state.dataMerchant = action.payload;
    },

    setDeleteId: (state, action) => {
      state.deletedID = action.payload;
    },

    setEditedId: (state, action) => {
      state.editedID = action.payload;
    },

    onConfirmDeletedClient: (state, action) => {
      const newDatas = state.data.filter(
        (client) => client._id !== action.payload
      );
      const newDatasMerchant = state.dataMerchant.filter(
        (client) => client._id !== action.payload
      );
      state.dataMerchant = newDatasMerchant;
      state.data = newDatas;
    },

    onConfirmEditClient: (state) => {
      state.editedID = null;
    },

    setOpenClientSelector: (state, action) => {
      state.openClientSelector = action.payload;
      if (!action.payload) {
        state.selectedClient = null;
      }
    },

    setOpenMerchantSelector: (state, action) => {
      state.openMerchantSelector = action.payload;
      if (!action.payload) {
        state.selectedMerchant = null;
      }
    },

    setClientSelector: (state, action) => {
      const isFindIndex = state.data.findIndex(
        (client) => client._id === action.payload
      );
      if (isFindIndex !== -1) {
        state.selectedClient = state.data[isFindIndex];
      }
    },

    setMerchantSelector: (state, action) => {
      const isFindIndex = state.dataMerchant.findIndex(
        (client) => client._id === action.payload
      );
      if (isFindIndex !== -1) {
        state.selectedMerchant = state.dataMerchant[isFindIndex];
      }
    },

    setClientStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const {
  setPageCount,
  addMultipleCustomerData,
  setMerchantPageCount,
  setClientPageNumber,
  setMerchantPageNumber,
  setClientSearchBy,
  setMerchantSearchBy,
  setClientFilterBy,
  setMerchantFilterBy,
  setClientSortBy,
  setMerchantSortBy,
  addNewClient,
  addNewMerchant,
  setClientDetails,
  updateNewClientForm,
  updateNewClientFormField,
  setAllClients,
  setAllMerchant,
  setDeleteId,
  setEditedId,
  onConfirmDeletedClient,
  onConfirmEditClient,
  setOpenClientSelector,
  setOpenMerchantSelector,
  setClientSelector,
  setMerchantSelector,
  setClientStatus,
} = clientsSlice.actions;

export const getClientPageNumberSelector = (state) => state.clients.page;

export const getClientPageCountSelector = (state) => state.clients.pageCount;

export const getMerchantPageCountSelector = (state) =>
  state.clients.merchantPageCount;

export const getMerchantPageNumberSelector = (state) =>
  state.clients.merchantPage;

export const getClientSearchBySelector = (state) => state.clients.searchBy;

export const getMerchantSearchBySelector = (state) =>
  state.clients.merchantSearchBy;

export const getClientFilterBySelector = (state) => state.clients.filterBy;

export const getMerchantFilterBySelector = (state) =>
  state.clients.merchantFilterBy;

export const getClientSortBySelector = (state) => state.clients.sortBy;

export const getMerchantSortBySelector = (state) =>
  state.clients.merchantSortBy;

export const getAllClientsSelector = (state) => state.clients.data;

export const getAllMerchantsSelector = (state) => state.clients.dataMerchant;

export const getClientDetailsSelector = (state) => state.clients.details;

export const getClientNewForm = (state) => state.clients.newForm;

export const getDeletedClientForm = (state) => state.clients.deletedID;

export const getEditedIdForm = (state) => state.clients.editedID;

export const getIsOpenClientSelector = (state) =>
  state.clients.openClientSelector;

export const getIsOpenMerchantSelector = (state) =>
  state.clients.openMerchantSelector;

export const getSelectedClient = (state) => state.clients.selectedClient;

export const getSelectedMerchant = (state) => state.clients.selectedMerchant;

export const getClientStatus = (state) => state.clients.status;

export default clientsSlice.reducer;
