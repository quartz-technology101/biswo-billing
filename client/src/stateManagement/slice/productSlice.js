import * as api from "../API/ProductApi";
import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { NotifyWarning } from "../../toastify";
import { toast } from "react-toastify";
import { todayNepaliDate } from "../../components/Common/todayNepaliDate";
const Status = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
  FAILED: "failed",
});
const initialState = {
  openProductSelector: false,
  selectedProduct: null,
  status: Status.IDLE,
  data: [],
  details: null,
  page: 1,
  filterBy: "",
  sortBy: 1,
  searchBy: {
    name: "",
    anything: "",
  },
  pageCount: 1,
  newForm: {
    id: nanoid(),
    itemCode: "",
    title: "",
    brand: "",
    image: "",
    category: "",
    price: "",
    purchasePrice: "",
    primaryUnit: "",
    secondaryUnit: "",
    conversionRatio: 0,
    quantity: "",
    lowQuantityAlert: "",
    remarks: "",
    createdDate: todayNepaliDate(new Date()),
  },
  editedID: null,
  deletedID: null,
};

export const getAllProducts =
  ({ page, searchBy, filterBy, sortBy, limit }) =>
  async (dispatch) => {
    dispatch(setProductStatus(Status.LOADING));
    try {
      const {
        data: { data, pageCount },
      } = await api.GetAllProductAPI({
        page,
        searchBy,
        filterBy,
        sortBy,
        limit,
      });
      dispatch(setProductPageCount(pageCount));
      dispatch(setAllProducts(data));
      return dispatch(setProductStatus(Status.IDLE));
    } catch (error) {
      NotifyWarning(
        error?.response?.data?.message || "Error please reload page"
      );
      return dispatch(setProductStatus(Status.FAILED));
    }
  };

export const getProductById = (id) => async (dispatch) => {
  dispatch(setProductStatus(Status.LOADING));
  try {
    const {
      data: { data },
    } = await api.GetProductByIdAPI(id);
    dispatch(setProductById(data));
    return dispatch(setProductStatus(Status.IDLE));
  } catch (error) {
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    return dispatch(setProductStatus(Status.FAILED));
  }
};

export const createProduct = (AddProductData) => async (dispatch) => {
  dispatch(setProductStatus(Status.LOADING));
  try {
    const {
      data: { data, message },
    } = await api.CreateProductAPI(AddProductData);

    toast.success(message, {
      position: "bottom-center",
      autoClose: 2000,
    });
    dispatch(addNewProduct(data));
    return dispatch(setProductStatus(Status.IDLE));
  } catch (error) {
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    return dispatch(setProductStatus(Status.FAILED));
  }
};

export const createMultipleProduct =
  (AddMultipleProductData) => async (dispatch) => {
    dispatch(setProductStatus(Status.LOADING));
    try {
      const {
        data: { data, message },
      } = await api.createMultipleProductAPI({
        products: AddMultipleProductData,
        createdDate: todayNepaliDate(new Date()),
      });
      toast.success(message, {
        position: "bottom-center",
        autoClose: 2000,
      });
      dispatch(addMultipleProductData(data));
      return dispatch(setProductStatus(Status.IDLE));
    } catch (error) {
      NotifyWarning(
        error?.response?.data?.message || "Error please reload page"
      );
      return dispatch(setProductStatus(Status.FAILED));
    }
  };

export const addOrReduceProductQuantity = (id, payload) => async (dispatch) => {
  dispatch(setProductStatus(Status.LOADING));
  try {
    const {
      data: { message },
    } = await api.addOrReduceProductQuantityAPI(
      id,
      payload.quantity,
      payload.isAdd,
      payload.note,
      payload.stockDate,
      payload.isSecondaryUnitChecked
    );
    toast.success(message, {
      position: "bottom-center",
      autoClose: 2000,
    });
    dispatch(addOrReduceProductQuantityData({ id, payload }));
    return dispatch(setProductStatus(Status.IDLE));
  } catch (error) {
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    return dispatch(setProductStatus(Status.FAILED));
  }
};

export const updateProduct = (UpdateProductData) => async (dispatch) => {
  dispatch(setProductStatus(Status.LOADING));
  try {
    const {
      data: { data },
    } = await api.UpdateProductAPI(UpdateProductData);
    dispatch(onConfirmEditProduct(data));
    return dispatch(setProductStatus(Status.IDLE));
  } catch (error) {
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    return dispatch(setProductStatus(Status.FAILED));
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  dispatch(setProductStatus(Status.LOADING));
  try {
    await api.DeleteProductAPI(id);
    dispatch(onConfirmDeletedProduct());
    return dispatch(setProductStatus(Status.IDLE));
  } catch (error) {
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    return dispatch(setProductStatus(Status.FAILED));
  }
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProductStatus: (state, action) => {
      state.status = action.payload;
    },
    setProductPageCount: (state, action) => {
      state.pageCount = action.payload;
    },
    setProductSearchBy: (state, action) => {
      state.searchBy = action.payload;
    },
    setProductFilterBy: (state, action) => {
      state.filterBy = action.payload;
    },
    setProductSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setProductPageNumber: (state, action) => {
      state.page = action.payload;
    },
    setProductById: (state, action) => {
      state.details = action.payload;
    },
    addNewProduct: (state, action) => {
      const newDatas = [...state.data, action.payload];
      state.data = newDatas;

      const reNewForm = {
        id: nanoid(),
        itemCode: "",
        title: "",
        brand: "",
        image: "",
        category: "",
        price: "",
        purchasePrice: "",
        primaryUnit: "",
        secondaryUnit: "",
        conversionRatio: "",
        quantity: 0,
        lowQuantityAlert: "",
        remarks: "",
      };
      state.newForm = { ...reNewForm };
    },
    addOrReduceProductQuantityData: (state, action) => {
      const { id, payload } = action.payload;
      const newDatas = state.data
        .slice()
        .reverse()
        .map((item) => {
          if (item._id === id) {
            if (payload.isAdd) {
              if (payload.isSecondaryUnitChecked) {
                item.quantity += payload.quantity / payload.conversionRatio;
              } else {
                item.quantity += payload.quantity;
              }
            } else {
              if (payload.isSecondaryUnitChecked) {
                item.quantity -= payload.quantity / payload.conversionRatio;
              } else {
                item.quantity -= payload.quantity;
              }
            }
          }
          return item;
        });
      state.data = newDatas;
      const newDetails = { ...state.details };
      if (newDetails._id === id) {
        if (payload.isAdd) {
          if (payload.isSecondaryUnitChecked) {
            newDetails.quantity += payload.quantity / payload.conversionRatio;
          } else {
            newDetails.quantity += payload.quantity;
          }
        } else {
          if (payload.isSecondaryUnitChecked) {
            newDetails.quantity -= payload.quantity / payload.conversionRatio;
          } else {
            newDetails.quantity -= payload.quantity;
          }
        }
      }
      state.details = newDetails;
    },
    addMultipleProductData: (state, action) => {
      const newDatas = [...state.data, ...action.payload];
      state.data = newDatas;
    },

    updateNewProductForm: (state, action) => {
      state.newForm = { ...action.payload };
    },

    updateNewProductFormField: (state, action) => {
      state.newForm[action.payload.key] = action.payload.value;
    },

    setAllProducts: (state, action) => {
      state.data = action.payload;
    },

    setDeleteId: (state, action) => {
      state.deletedID = action.payload;
    },

    setEditedId: (state, action) => {
      state.editedID = action.payload;
    },

    onConfirmDeletedProduct: (state) => {
      const newDatas = state.data.filter(
        (product) => product._id !== state.deletedID
      );
      state.data = newDatas;
      state.deletedID = null;
    },

    onConfirmEditProduct: (state, action) => {
      const isFindIndex = state.data.findIndex(
        (product) => product._id === state.editedID
      );
      if (isFindIndex !== -1) {
        state.data[isFindIndex] = { ...action.payload };
      }
      state.editedID = null;
    },

    onAddOrRemoveProduct: (state, action) => {
      const { products, type } = action.payload;
      const newDatas = [...state.data];
      products.forEach((product) => {
        const isFindIndex = newDatas.findIndex(
          (data) => data._id === product.productID
        );
        if (isFindIndex !== -1) {
          if (type === "Sale") {
            if (product.isSecondaryUnitChecked) {
              newDatas[isFindIndex].quantity -=
                product.quantity / product.conversionRatio;
            } else {
              newDatas[isFindIndex].quantity -= parseInt(product.quantity);
            }
          } else {
            if (product.isSecondaryUnitChecked) {
              newDatas[isFindIndex].quantity +=
                product.quantity / product.conversionRatio;
            } else {
              newDatas[isFindIndex].quantity += parseInt(product.quantity);
            }
          }
        }
      });
      state.data = newDatas;
    },

    onUpdateInvoiceProduct: (state) => {
      state.data = [];
    },
    setOpenProductSelector: (state, action) => {
      state.openProductSelector = action.payload;
      if (!action.payload) {
        state.selectedProduct = null;
      }
    },

    setProductSelector: (state, action) => {
      const isFindIndex = state.data.findIndex(
        (product) => product._id === action.payload
      );
      if (isFindIndex !== -1) {
        state.selectedProduct = state.data[isFindIndex];
      }
    },
  },
});

export const {
  setProductPageCount,
  onUpdateInvoiceProduct,
  setProductPageNumber,
  setProductSearchBy,
  setProductFilterBy,
  setProductSortBy,
  addNewProduct,
  setProductById,
  addOrReduceProductQuantityData,
  addMultipleProductData,
  onAddOrRemoveProduct,
  updateNewProductForm,
  updateNewProductFormField,
  setAllProducts,
  setDeleteId,
  setEditedId,
  onConfirmDeletedProduct,
  onConfirmEditProduct,
  setOpenProductSelector,
  setProductSelector,
  setProductStatus,
} = productSlice.actions;

export const getAllProductSelector = (state) => state.products.data;

export const getProductPageCountSelector = (state) => state.products.pageCount;

export const getProductPageNumberSelector = (state) => state.products.page;

export const getProductSearchBySelector = (state) => state.products.searchBy;

export const getProductFilterBySelector = (state) => state.products.filterBy;

export const getProductSortBySelector = (state) => state.products.sortBy;

export const getProductByIdSelector = (state) => state.products.details;

export const getProductNewForm = (state) => state.products.newForm;

export const getDeletedProductForm = (state) => state.products.deletedID;

export const getEditedIdForm = (state) => state.products.editedID;

export const getIsOpenProductSelector = (state) =>
  state.products.openProductSelector;

export const getSelectedProduct = (state) => state.products.selectedProduct;

export const getProductStatus = (state) => state.products.status;

export default productSlice.reducer;
