/* eslint-disable no-useless-escape */
import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  setPaymentData,
  getPaymentData,
  getFromClientByID,
  updatedPayment,
  deletePayment,
} from "../../../stateManagement/slice/paymentSlice";
import {
  defaultInputStyle,
  defaultInputInvalidStyle,
  defaultInputLargeStyle,
  defaultInputLargeInvalidStyle,
} from "../../../constants/defaultStyles";

import { getClientDetailsSelector } from "../../../stateManagement/slice/clientSlice";
import { todayNepaliDate } from "../../Common/todayNepaliDate";
import NepaliDatePicker from "../../Common/NepaliDatePicker";

function ClientEditPaymentModel(props) {
  const emptyForm = {
    paymentType: "PaymentIn",
    paymentDate: todayNepaliDate(new Date()),
    amount: 0,
    note: "",
  };
  const dispatch = useDispatch();
  const editedData = useSelector(getPaymentData);
  const fromClientByID = useSelector(getFromClientByID);
  const ClientDetail = useSelector(getClientDetailsSelector);
  const [animate, setAnimate] = useState(true);
  const [clientForm, setClientForm] = useState(emptyForm);
  const [isTouched, setIsTouched] = useState(false);
  const [validForm, setValidForm] = useState(
    Object.keys(emptyForm).reduce((a, b) => {
      return { ...a, [b]: false };
    }, {})
  );

  const onEditHandler = useCallback(() => {
    setIsTouched(true);
    const isValid = Object.keys(validForm).every((key) => validForm[key]);

    if (!isValid) {
      toast.error("Invalid Credentials!", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }
    dispatch(
      updatedPayment({
        payload: {
          paymentType:
            ClientDetail.clientType === "Customer" ? "PaymentIn" : "PaymentOut",
          transactionNumber: clientForm.transactionNumber,
          partyDetails: { ...clientForm.partyDetails },
          amount: clientForm.amount,
          note: clientForm.note,
          paymentDate: clientForm.paymentDate,
        },
        fromClientByID,
        ClientDetail,
        prevoiusData: editedData,
      })
    );
    setClientForm(emptyForm);
    dispatch(setPaymentData(null));
    setIsTouched(false);
  }, [validForm, clientForm, ClientDetail, editedData]);

  const onDeleteHandler = useCallback(() => {
    setIsTouched(true);
    const isValid = Object.keys(validForm).every((key) => validForm[key]);
    if (!isValid) {
      toast.error("Invalid Credentials!", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }
    dispatch(
      deletePayment({ payload: clientForm, fromClientByID, ClientDetail })
    );
    setClientForm(emptyForm);
    dispatch(setPaymentData(null));
    toast.success("Payment Deleted Successfully!", {
      position: "bottom-center",
      autoClose: 2000,
    });
    setIsTouched(false);
  }, [validForm, clientForm]);

  const handlerClientValue = useCallback((event, keyName) => {
    const value = event.target.value;

    setClientForm((prev) => {
      return { ...prev, [keyName]: value };
    });
  }, []);

  const onCancelHandler = useCallback(() => {
    dispatch(setPaymentData(null));
  }, [dispatch]);

  useEffect(() => {
    setValidForm(() => ({
      paymentDate: true,
      amount: clientForm?.amount > 0,
      note: true,
    }));
  }, [clientForm]);

  useEffect(() => {
    if (editedData !== null) {
      setAnimate(true);
      console.log(editedData);
      setClientForm({
        ...editedData,
        paymentDate: editedData.createdDate.split("T")[0],
      });
    } else {
      setAnimate(false);
    }
  }, [editedData]);

  return editedData !== null ? (
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
      <div className="relative">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Edited Payment Details
                    </h3>
                    <div className="mt-2">
                      {/*  */}
                      <div className="bg-white rounded-xl mt-4">
                        <div className="flex mt-2">
                          <div className="flex-1">
                            <div>
                              <NepaliDatePicker
                                className={
                                  !validForm.paymentDate && isTouched
                                    ? defaultInputLargeInvalidStyle
                                    : defaultInputLargeStyle
                                }
                                id={"nepali-datepicker-4"}
                                setData={setClientForm}
                                data={clientForm}
                                name="paymentDate"
                                value={clientForm.paymentDate}
                                disabledBeforeDate={true}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex mt-2">
                          <div className="flex-1">
                            <input
                              autoComplete="nope"
                              placeholder="Client Name"
                              className={defaultInputStyle}
                              defaultValue={clientForm?.partyDetails?.name}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="flex mt-2">
                          <div className="flex-1">
                            <input
                              autoComplete="nope"
                              placeholder="Received Amount"
                              className={
                                !validForm.amount && isTouched
                                  ? defaultInputInvalidStyle
                                  : defaultInputStyle
                              }
                              value={clientForm.amount}
                              onChange={(e) => handlerClientValue(e, "amount")}
                            />
                          </div>
                        </div>
                        <div className="flex mt-2">
                          <div className="flex-1">
                            <input
                              autoComplete="nope"
                              placeholder="Note"
                              className={
                                !validForm.note && isTouched
                                  ? defaultInputInvalidStyle
                                  : defaultInputStyle
                              }
                              value={clientForm.note}
                              onChange={(e) => handlerClientValue(e, "note")}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onEditHandler}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-rose-600 text-base font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onDeleteHandler}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onCancelHandler}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  ) : null;
}

export default ClientEditPaymentModel;
