import API from "./index";

export const CreatePaymentAPI = (AddPaymentData) =>
  API.post("/payments", AddPaymentData);

export const UpdatePaymentAPI = (UpdatePaymentData) =>
  API.patch(
    `/payments/${UpdatePaymentData.transactionNumber}`,
    UpdatePaymentData
  );

export const DeletePaymentAPI = (id) => API.delete(`/payments/${id}`);
