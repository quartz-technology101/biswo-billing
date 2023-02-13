import API from "./index";

export const GetAllClientsAPI = ({
  page,
  searchBy,
  filterBy,
  sortBy,
  clientType,
  limit,
}) =>
  API.get("/clients", {
    params: {
      page,
      searchBy,
      filterBy,
      sortBy,
      clientType,
      limit,
    },
  });
export const GetClientsByIdAPI = (id) => API.get(`/clients/${id}`);
export const CreateClientsAPI = (AddClientsData) =>
  API.post("/clients", AddClientsData);
export const CreateMultipleClientsAPI = ({ AddClientData, createdDate }) =>
  API.post("/clients/multiple", { AddClientData, createdDate });
export const UpdateClientsAPI = (UpdateClientsData) =>
  API.patch(`/clients/${UpdateClientsData._id}`, UpdateClientsData);
export const DeleteClientsAPI = (id) => API.delete(`/clients/${id}`);
export const GetFilterData = () => API.get("/clients/filter");
