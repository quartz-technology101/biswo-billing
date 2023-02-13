import React, { useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import CheckCircleIcon from "../../components/Icons/CheckCircleIcon";
import { useDispatch, useSelector } from "react-redux";
import {
  createMultipleProduct,
  getProductStatus,
} from "../../stateManagement/slice/productSlice";
import {
  createMultipleCustomer,
  getClientStatus,
} from "../../stateManagement/slice/clientSlice";
function SuccessAlert({
  success,
  setSuccess,
  setData,
  data,
  setIsConfirmClicked,
  customer = false,
}) {
  const dispatch = useDispatch();
  const status = useSelector(getProductStatus);
  const clientStatus = useSelector(getClientStatus);
  const [animate, setAnimate] = useState(true);
  const onConfirmModal = useCallback(() => {
    setSuccess(false);
    setIsConfirmClicked(true);
    dispatch(createMultipleProduct(data));
    setTimeout(() => {
      status === "idle" && setIsConfirmClicked(false);
    }, 1000);
    setData([]);
  }, [data, dispatch, setIsConfirmClicked, setSuccess, setData]);
  const onConfirmCustomerModel = useCallback(() => {
    setSuccess(false);
    setIsConfirmClicked(true);
    dispatch(createMultipleCustomer(data));
    setTimeout(() => {
      clientStatus === "idle" && setIsConfirmClicked(false);
    }, 1000);
    setData([]);
  }, [data, dispatch, setIsConfirmClicked, setSuccess, setData]);
  const onCancelHandler = useCallback(() => {
    setSuccess(false);
    setData([]);
  }, []);

  useEffect(() => {
    if (success !== false) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [success]);

  return success !== false ? (
    <motion.div
      className="modal-container"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: animate ? 1 : 0,
      }}
      transition={{
        type: "spring",
        damping: 18,
      }}
    >
      <div className="overflow-hidden relative">
        <div className="fixed inset-0 bg-[#eeeeee] bg-opacity-100 transition-opacity"></div>
        <div className="fixed z-10 inset-20">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <CheckCircleIcon className="h-6 w-6  primary-self-text" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      {customer ? "Customer" : "Product"} Details
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        All the details of the{" "}
                        {customer ? "customer" : "product"} are correct. Do you
                        want to add this {customer ? "customer" : "product"} to
                        the database?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2  primary-background-color text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={customer ? onConfirmCustomerModel : onConfirmModal}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onCancelHandler}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  ) : null;
}

export default SuccessAlert;
