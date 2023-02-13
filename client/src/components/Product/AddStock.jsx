/* eslint-disable no-useless-escape */
import React, { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Button/Button";
import SectionTitle from "../Common/SectionTitle";
import {
  defaultInputStyle,
  defaultInputInvalidStyle,
  defaultInputLargeStyle,
  defaultInputLargeInvalidStyle,
  defaultSkeletonLargeStyle,
} from "../../constants/defaultStyles";

import {
  getProductByIdSelector,
  addOrReduceProductQuantity,
} from "../../stateManagement/slice/productSlice";
import { newTransactionByProductAmount } from "../../stateManagement/slice/transactionSlice";
import { ChooseUnitForStock } from "./dropdown";
import Skeleton from "react-loading-skeleton";
import { todayNepaliDate } from "../Common/todayNepaliDate";
import NepaliDatePicker from "../Common/NepaliDatePicker";

function AddStock({ isAdd }) {
  const ProductDetail = useSelector(getProductByIdSelector);
  const emptyForm = {
    quantity: "",
    stockDate: todayNepaliDate(new Date()),
    note: "",
    unit: "Choose Unit",
  };
  const [isTouched, setIsTouched] = useState(false);
  const [productForm, setProductForm] = useState(emptyForm);
  const [validForm, setValidForm] = useState(
    Object.keys(emptyForm).reduce((a, b) => {
      return { ...a, [b]: false };
    }, {})
  );
  const dispatch = useDispatch();

  const handlerClientValue = useCallback(
    (event, keyName) => {
      const value = event.target.value;
      setProductForm((prev) => {
        return { ...prev, [keyName]: value };
      });
    },
    [ProductDetail]
  );

  const submitHandler = useCallback(() => {
    setIsTouched(true);
    if (productForm.quantity) {
      productForm.quantity = Number(productForm.quantity);
    }
    const isValid = Object.keys(validForm).every((key) => validForm[key]);
    if (!isValid) {
      toast.error("Please fill all the required fields", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }
    setProductForm(emptyForm);
    dispatch(
      addOrReduceProductQuantity(ProductDetail._id, {
        ...productForm,
        isAdd: isAdd,
        isSecondaryUnitChecked:
          ProductDetail.primaryUnit.toLowerCase() ===
          productForm.unit.toLowerCase()
            ? false
            : true,
        conversionRatio: ProductDetail.conversionRatio,
        stockDate: productForm.stockDate,
      })
    );
    dispatch(
      newTransactionByProductAmount({
        id: ProductDetail._id,
        payload: {
          ...productForm,
          isAdd: isAdd,
          unit: productForm.unit,
          stockDate: productForm.stockDate,
        },
      })
    );
    setIsTouched(false);
  }, [productForm, validForm, dispatch, ProductDetail, isAdd]);

  useEffect(() => {
    setValidForm(() => ({
      stockDate: true,
      quantity: productForm.quantity ? true : false,
      note: true,
      unit: productForm.unit === "Choose Unit" ? false : true,
    }));
  }, [productForm]);

  return (
    <div className="bg-white rounded-xl p-4">
      <SectionTitle>{isAdd ? "Add" : "Reduce"} Stock </SectionTitle>
      <div className="flex mt-2">
        <div className="flex-1">
          {ProductDetail === null ? (
            <Skeleton className={defaultSkeletonLargeStyle} />
          ) : (
            <div className="relative">
              <input
                autoComplete="nope"
                placeholder={
                  isAdd ? "Add" + " Quantity" : "Reduce" + " Quantity"
                }
                type="number"
                className={
                  !validForm.quantity && isTouched
                    ? defaultInputInvalidStyle
                    : defaultInputStyle
                }
                value={productForm.quantity}
                onChange={(e) => handlerClientValue(e, "quantity")}
              />
              <span
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl text-default-color text-[11px] cursor-pointer
                 hover:bg-gray-100 hover:text-default-color z-[1000]"
              >
                <ChooseUnitForStock
                  primaryUnit={ProductDetail?.primaryUnit}
                  secondaryUnit={ProductDetail?.secondaryUnit}
                  setProductForm={setProductForm}
                  productForm={productForm}
                  validForm={validForm}
                  isTouched={isTouched}
                />
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex mt-2">
        <div className="flex-1">
          <div>
            <NepaliDatePicker
              className={
                !validForm.stockDate && isTouched
                  ? defaultInputLargeInvalidStyle
                  : defaultInputLargeStyle
              }
              id={"nepali-datepicker-5"}
              setData={setProductForm}
              data={productForm}
              name="stockDate"
              value={productForm.stockDate}
              disabledBeforeDate={true}
            />
          </div>
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
            value={productForm.note}
            onChange={(e) => handlerClientValue(e, "note")}
          />
        </div>
      </div>

      <div className="mt-3">
        <Button onClick={submitHandler} block={1} danger={isAdd ? 0 : 1}>
          <span className="inline-block ml-2"> Submit </span>
        </Button>
      </div>
    </div>
  );
}

export default AddStock;
