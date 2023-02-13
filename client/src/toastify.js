import { toast } from "react-toastify";

export const NotifySuccess = (message) => {
  toast.success(message);
};

export const NotifyError = (message) => {
  toast.error(`${message}`);
};

export const NotifyWarning = (message) => {
  toast.warning(`${message}`, {
    position: toast.POSITION.BOTTOM_CENTER,
    autoClose: 4000,
  });
};

export const NotifyInfo = (message) => {
  toast.info(`${message}`);
};
