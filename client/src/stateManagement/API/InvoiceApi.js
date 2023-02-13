import API from "./index";

export const GetNewInvoiceNoAPI = () => API.get("/invoices/newInvoiceNo");

export const GetInvoiceByIdAPI = (id) => API.get(`/invoices/${id}`);

export const CreateInvoiceAPI = (AddInvoiceData) =>
  API.post("/invoices", AddInvoiceData);

export const UpdateInvoiceAPI = (UpdateInvoiceData) =>
  API.patch(`/invoices/${UpdateInvoiceData._id}`, UpdateInvoiceData);

export const DeleteInvoiceAPI = (id) => API.delete(`/invoices/${id}`);

export const GetFilterData = () => API.get("/invoices/filter");
