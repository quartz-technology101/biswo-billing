import React from "react";
import convertDate from "../../components/Common/ConvertEnglishDate";
import { sumProductTotal } from "../../utils/match";

const PrintPurchase = ({
  invoiceForm,
  isExporting,
  componentRef,
  isViewMode,
  margin = "auto",
}) => {
  const subTotalAmount = sumProductTotal([...invoiceForm?.products]);
  const tableSize = isExporting ? "0.8rem" : "1rem";
  // if windows is in mobile mode set width
  const customeWidth = window.innerWidth < 600 ? "300px" : "500px";
  return (
    <div
      ref={componentRef}
      style={
        isExporting
          ? {
              maxWidth: "240px",
              height: "100%",
              transform: "rotate(90deg)",
              position: "fixed",
              top: 0,
              right: 20,
              marginTop: "0px",
              display: "inline-block",
              padding: "0.2rem",
              fontSize: "0.9rem",
            }
          : isViewMode
          ? {
              width: customeWidth,
              height: "100%",
              display: "block",
              padding: "2rem",
              fontSize: "1rem",
              margin: margin,
              backgroundColor: "white",
              borderRadius: "0.75rem",
            }
          : {
              display: "none",
            }
      }
    >
      <h1 className="text-red-600 font-bold text-center text-[1.1rem]">
        {invoiceForm?.companyDetail?.companyName}
      </h1>
      <h2 className="text-center">
        {invoiceForm?.companyDetail?.billingAddress}
      </h2>
      <h2 className="text-center">
        (+977){invoiceForm?.companyDetail?.companyMobile}
      </h2>
      <h2 className="text-center">
        {invoiceForm?.companyDetail?.companyPhone}
      </h2>
      <h2 className={`pt-2 flex items-center justify-between`}>
        <span>Bill No: {invoiceForm?.invoiceNo || "123"}</span>
        <span className="text-sm">
          Date: {convertDate(invoiceForm?.createdDate, true)}
        </span>
      </h2>
      <h2>Bill From: {invoiceForm?.clientDetail?.name || "ABC"}</h2>
      <h2>Mobile No: {invoiceForm?.clientDetail?.mobileNo || "123"}</h2>
      <h2 className={`pb-1`}>
        Address: {invoiceForm?.clientDetail?.billingAddress || "ABC"}
      </h2>
      <table className={`ml-auto w-full text-[${tableSize}]`}>
        <tbody>
          <tr className="border-dashed border-t-2 border-b-2 border-gray-400"></tr>
          <tr>
            <th className="font-normal text-left">S.N.</th>
            <th className="font-normal text-left">Products</th>
            <th className=" pl-4 font-normal text-right">Price</th>
            <th className="pl-4 font-normal text-left">Qty</th>
            <th className="pl-4 font-normal text-right">Total</th>
          </tr>
          <tr className="border-dashed border-t-2 border-b-2 border-gray-400"></tr>
          {invoiceForm?.products?.map((product, index) => (
            <tr key={index}>
              <td className="text-left">{index + 1}</td>
              <td className={`text-left`}>{product?.name}</td>
              <td className="text-right">{product?.amount}</td>
              <td className="text-center">{product?.quantity}</td>
              <td className="text-right">
                {product.quantity * product.amount}
              </td>
            </tr>
          ))}
          <tr className="border-dashed border-t-2 border-b-2 border-gray-400"></tr>
        </tbody>
      </table>
      <table className="ml-auto mt-4">
        <tbody>
          <tr
            className={`border-dashed border-b-2 border-gray-400 w-1/2 text-right text-[${tableSize}]`}
          >
            <td className="text-right">Subtotal</td>
            <td className="text-right pl-10 pt-1">Rs.{subTotalAmount}</td>
          </tr>
          {invoiceForm?.taxes?.map((tax, index) =>
            tax?.uniqueTitle !== "Extra Fee" ? (
              <tr key={index} className={`text-[${tableSize}]`}>
                <td className="text-right">Discount </td>
                <td className="text-right pl-10 pt-1">Rs.{tax?.amount}</td>
              </tr>
            ) : null
          )}
          <tr className="border-dashed border-t-2 border-b-2 border-gray-400"></tr>
          {invoiceForm?.taxes?.map((tax, index) =>
            tax?.uniqueTitle === "Extra Fee" ? (
              <tr key={index} className={`text-[${tableSize}]`}>
                <td className="text-right">Charge </td>
                <td className="text-right pl-10 pt-1">Rs.{tax?.amount}</td>
              </tr>
            ) : null
          )}
          <tr className="border-dashed border-t-2 border-b-2 border-gray-400"></tr>
          <tr>
            <td className="text-right">Total</td>
            <td className="text-right pl-10 pt-1">
              Rs.{invoiceForm?.totalAmount}
            </td>
          </tr>
          <tr className="border-dashed border-t-2 border-b-2 border-gray-400"></tr>
          <tr>
            <td className="text-right">Received</td>
            <td className="text-right pl-10 pt-1">
              Rs.{invoiceForm?.paidAmount || 0}
            </td>
          </tr>
          <tr className="border-dashed border-t-2 border-b-2 border-gray-400"></tr>
          <tr>
            <td className="text-right text-red-600">Due</td>
            <td className="text-right pl-10 pt-1 text-red-600">
              Rs.{invoiceForm?.totalAmount - invoiceForm?.paidAmount || 0}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="text-center mt-2">
        <h2 className="text-center">Thank You, Visit Again!</h2>
      </div>

      <div className="pt-4 text-white">.</div>
    </div>
  );
};

export default PrintPurchase;
