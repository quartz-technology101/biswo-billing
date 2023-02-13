import { NotifyInfo } from "../../toastify";

export const handleContextMenu = (e) => {
  e.preventDefault();
};

export const handleKeydown = (e) => {
  if (e.ctrlKey && e.keyCode === 73) {
    e.preventDefault();
    NotifyInfo(
      "You are not allowed to use this Keys. Please contact your administrator."
    );
  }
};

export const SecureClient = () => {
  document.addEventListener("contextmenu", handleContextMenu);
  document.addEventListener("keydown", handleKeydown);
  return () => {
    document.removeEventListener("contextmenu", handleContextMenu);
    document.removeEventListener("keydown", handleKeydown);
  };
  // return () => {};
};
