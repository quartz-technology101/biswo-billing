import React from "react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import convertDate from "../Common/ConvertEnglishDate";
import EmptyBar from "../Common/EmptyBar";
const defaultTdContent =
  "w-full flex flex-wrap flex-row items-center justify-start text-default-color font-title text-[12px] sm:text-base";

const defaultTdContentSecond =
  "w-full flex flex-wrap flex-row items-center justify-center text-default-color font-title text-[12px] sm:text-base my-1";
const TransactionByProductID = ({ data, initLoading, id }) => {
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
      }
    },
    [dispatch, navigate]
  );
  const productData = data?.map((item) =>
    item?.productDetails?.filter((product) => product.productID === id)
  );
  const productDatas = productData?.map((item) => item[0]);
  if (data?.length <= 0 || initLoading === "loading")
    return <EmptyBar title="Product detail" initLoading={initLoading} />;
  return data?.map((client, index) => (
    <div
      className="bg-white rounded-xl px-3 py-1 mb-6 cursor-pointer"
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
              {client.transactionType === "Sale"
                ? "Sale"
                : client.transactionType === "Purchase"
                ? "Purchase"
                : client.transactionType === "OpeningBalance"
                ? "Opening Balance"
                : client.transactionType === "AddQuantity"
                ? "Add Stock"
                : client.transactionType === "ReduceQuantity"
                ? "Reduce Stock"
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
            <span className="whitespace-nowrap text-ellipsis overflow-hidden text-[11px] sm:text-[14px]">
              {convertDate(
                client.createdDate ? client.createdDate : client.createdAt
              )}
            </span>
          </div>
          <div className={defaultTdContent}>
            <span className="whitespace-nowrap text-ellipsis overflow-hidden capitalize text-[13px] sm:text-[14px]">
              {client?.note?.split(" !-! ")[0] && client.note.split(" !-! ")[0]}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <div className={defaultTdContentSecond}>
            <span
              className="whitespace-nowrap text-ellipsis overflow-hidden"
              style={{
                color:
                  client.transactionType === "Sale"
                    ? "#FF0000"
                    : client.transactionType === "ReduceQuantity"
                    ? "#FF0000"
                    : "#00B74A",
              }}
            >
              {client.transactionType === "Sale"
                ? "-"
                : client.transactionType === "ReduceQuantity"
                ? "-"
                : "+"}{" "}
              {productDatas[index]?.quantity} {productDatas[index]?.unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  ));
};

export default TransactionByProductID;
