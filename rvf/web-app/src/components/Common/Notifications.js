import React from "react";
import { toast } from "react-toastify";

export const showError = (message) => {
  return toast.error(<h6 className="">{message}</h6>, {
    hideProgressBar: false,
    autoClose: 2500,
    position: "top-right",
  });
};

export const showSuccess = (message) => {
  return toast.success(<h6 className="success-message">{message}</h6>, {
    hideProgressBar: false,
    autoClose: 3000,
    position: "top-right",
  });
};
