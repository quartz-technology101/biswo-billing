import React from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setFromClientByID,
  setPaymentData,
} from "../../../stateManagement/slice/paymentSlice";
import {
  setPageNumber,
  setTransactionShowDraft,
  getTransactionShowDraftSelector,
} from "../../../stateManagement/slice/transactionSlice";
import Button from "../../Button/Button";
import convertDate from "../../Common/ConvertEnglishDate";
import EmptyBar from "../../Common/EmptyBar";
import Pagination from "../../Pagination";
const defaultTdContent =
  "w-full flex flex-wrap flex-row items-center justify-start text-default-color font-title text-[12px] sm:text-base my-1";

const defaultTdContentSecond =
  "w-full flex flex-wrap flex-row items-center justify-end text-default-color font-title text-[12px] sm:text-base my-1";
const TransactionByID = ({
  name,
  data,
  initLoading,
  merchant,
  pageCount,
  currentPage,
  pagination,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const goToDetail = useCallback(
    (data) => {
      if (
        data.transactionType === "Sale" ||
        data.transactionType === "Purchase"
      ) {
        if (data.transactionType === "Purchase") {
          navigate(`/purchases/${data.transactionNumber}`);
        } else {
          navigate(`/invoices/${data.transactionNumber}`);
        }
      } else if (
        data.transactionType === "PaymentIn" ||
        data.transactionType === "PaymentOut"
      ) {
        dispatch(setPaymentData(data));
        dispatch(setFromClientByID(name));
      }
    },
    [dispatch, navigate]
  );

  return (
    <>
      {initLoading !== "loading" &&
        data !== null &&
        data.length > 0 &&
        data
          .slice()
          .reverse()
          .map((client, index) => (
            <div
              className="bg-white rounded-xl px-3 py-1 mb-4 cursor-pointer"
              style={name ? { marginTop: "1rem" } : {}}
              onClick={() => goToDetail(client)}
              key={index}
            >
              <div className="flex flex-wrap gap-4 p-2">
                <div className="flex-col flex-1">
                  <div
                    className={
                      defaultTdContent + "font-bold text-[18px] sm:text-[20px]"
                    }
                  >
                    <button
                      className="whitespace-nowrap text-ellipsis overflow-hidden text-[#000] cursor-pointer"
                      onClick={() => goToDetail(client.transactionNumber)}
                    >
                      {client.transactionType === "PaymentIn"
                        ? "Payment In"
                        : client.transactionType === "Sale"
                        ? "Sale"
                        : client.transactionType === "PaymentOut"
                        ? "Payment Out"
                        : client.transactionType === "Purchase"
                        ? "Purchase"
                        : client.transactionType === "OpeningBalance"
                        ? "Opening Balance"
                        : client.transactionType}
                      {(client.transactionType === "Sale" ||
                        client.transactionType === "Purchase") && (
                        <span className="text-[12px] sm:text-[15px] text-gray-600">
                          {client.billNumber && " #" + client.billNumber}
                        </span>
                      )}
                    </button>
                  </div>
                  <div className={defaultTdContent}>
                    <span className="whitespace-nowrap text-ellipsis overflow-hidden capitalize text-[13px] sm:text-[15px]">
                      {name === true
                        ? client?.partyDetails?.name
                        : client?.note}
                    </span>
                  </div>
                  <div className={defaultTdContent}>
                    <span className="whitespace-nowrap text-ellipsis overflow-hidden text-[11px] sm:text-[15px]">
                      {convertDate(new Date(client.createdDate))}{" "}
                    </span>
                  </div>
                  {name !== true && (
                    <div className={defaultTdContent}>
                      <span
                        className={`whitespace-nowrap text-ellipsis overflow-hidden ${
                          merchant === true
                            ? "bg-rose-100 text-rose-500"
                            : "bg-green-100 text-green-500"
                        } px-2 py-1`}
                      >
                        Bal: Rs. {client.amountToPay || 0}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-col flex-2">
                  <div className={defaultTdContentSecond}>
                    <span
                      className={
                        client.transactionType === "PaymentIn"
                          ? "whitespace-nowrap text-ellipsis overflow-hidden text-green-600"
                          : client.transactionType === "PaymentOut"
                          ? "whitespace-nowrap text-ellipsis overflow-hidden text-rose-600"
                          : "whitespace-nowrap text-ellipsis overflow-hidden"
                      }
                    >
                      Rs. {client.amount || 0}
                    </span>
                  </div>
                  <div className={defaultTdContentSecond}>
                    <span
                      className={
                        "whitespace-nowrap text-ellipsis overflow-hidden px-2 py-1 " +
                        (client.status === "Partial"
                          ? "bg-blue-200 text-blue-600"
                          : client.status === "Paid"
                          ? "bg-green-200 text-green-600"
                          : client.status === "Unpaid"
                          ? "bg-yellow-100 text-yellow-600"
                          : client.status === "To Give"
                          ? "bg-rose-100 text-rose-400"
                          : client.status === "To Receive"
                          ? "bg-green-100 text-green-500"
                          : client.status === "Draft"
                          ? "bg-gray-100 text-gray-500"
                          : "")
                      }
                    >
                      {client.status}
                    </span>
                  </div>
                  <div className={defaultTdContentSecond}>
                    <span className="whitespace-nowrap text-ellipsis overflow-hidden text-gray-600">
                      {(client.transactionType === "Sale" ||
                        client.transactionType === "Purchase") &&
                        `Rs. ${
                          client.amount - client.receviedAmount || 0
                        } Unpaid`}{" "}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      {(data === null || data.length <= 0 || initLoading === "loading") && (
        <div className="my-4">
          <EmptyBar
            title={name === true ? "data" : "client detail"}
            initLoading={initLoading}
          />
        </div>
      )}
      {pagination === true && initLoading !== "loading" && data.length > 0 && (
        <Pagination
          pageCount={pageCount}
          currentPage={currentPage}
          setPageNumber={setPageNumber}
        />
      )}
    </>
  );
};

export default TransactionByID;
