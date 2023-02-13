import API from "./index";

export const GetAllProductAPI = ({ page, searchBy, filterBy, sortBy, limit }) =>
  API.get("/products", {
    params: {
      page,
      searchBy,
      filterBy,
      sortBy,
      limit,
    },
  });
export const GetProductByIdAPI = (id) => API.get(`/products/${id}`);
export const CreateProductAPI = (AddProductData) =>
  API.post("/products", AddProductData);
export const createMultipleProductAPI = ({ products, createdDate }) =>
  API.post("/products/multiple", { products, createdDate });
export const addOrReduceProductQuantityAPI = (
  id,
  quantity,
  isAdd,
  note,
  stockDate,
  isSecondaryUnitChecked
) =>
  API.patch(`/products/quantity/${id}`, {
    quantity,
    isAdd,
    note,
    stockDate,
    isSecondaryUnitChecked,
  });
export const UpdateProductAPI = (UpdateProductData) =>
  API.patch(`/products/${UpdateProductData._id}`, UpdateProductData);
export const DeleteProductAPI = (id) => API.delete(`/products/${id}`);
export const GetFilterData = () => API.get("/products/filter");
