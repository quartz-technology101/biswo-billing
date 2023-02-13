import API from "./index";

export const GetAllProductAPI = ({
  page,
  onlyDraft,
  searchBy,
  filterBy,
  sortBy,
  date,
}) =>
  API.get(`/transactions`, {
    params: {
      page,
      draft: onlyDraft,
      searchBy,
      filterBy,
      sortBy,
      date,
    },
  });
export const GetProductByIdAPI = ({ id, page }) =>
  API.get(`/transactions/${id}`, {
    params: {
      page,
    },
  });
export const GetTransactionByProductAPI = ({ id, page }) =>
  API.get(`/transactions/product/${id}`, {
    params: {
      page,
    },
  });
