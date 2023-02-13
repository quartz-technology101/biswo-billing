import React, { useState, useCallback, useMemo, useEffect } from "react";

import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Button/Button";
import ImageUpload from "../Common/ImageUpload";
import SectionTitle from "../Common/SectionTitle";
import {
  defaultInputStyle,
  defaultInputInvalidStyle,
  defaultInputLargeStyle,
  defaultSkeletonLargeStyle,
  defaultSkeletonNormalStyle,
} from "../../constants/defaultStyles";
import {
  createProduct,
  getProductNewForm,
  updateNewProductFormField,
  getProductStatus,
} from "../../stateManagement/slice/productSlice";
import { Dropdown } from "./dropdown";
import DisClosure from "./disClosureProduct";

const emptyForm = {
  itemCode: "",
  title: "",
  brand: "",
  image: "",
  category: "",
  price: 0,
  purchasePrice: 0,
  primaryUnit: "",
  secondaryUnit: "",
  conversionRatio: 0,
  quantity: 0,
  lowQuantityAlert: 0,
  remarks: "",
};

function QuickAddProduct() {
  const dispatch = useDispatch();
  const productNewForm = useSelector(getProductNewForm);
  const isInitLoading = useSelector(getProductStatus) === "loading";
  const [isTouched, setIsTouched] = useState(false);
  const [productForm, setProductForm] = useState(emptyForm);
  const [validForm, setValidForm] = useState(
    Object.keys(emptyForm).reduce((a, b) => {
      return { ...a, [b]: false };
    }, {})
  );

  const onChangeImage = useCallback(
    (str) => {
      setProductForm((prev) => ({ ...prev, image: str }));
      dispatch(updateNewProductFormField({ key: "image", value: str }));
    },
    [dispatch]
  );

  const handlerProductValue = useCallback(
    (event, keyName) => {
      if (
        keyName === "primaryUnit" ||
        keyName === "category" ||
        keyName === "secondaryUnit"
      ) {
        const value = event.target.textContent;
        if (value === "Choose Unit" || value === "Choose Category") return;
        setProductForm((prev) => {
          return { ...prev, [keyName]: value };
        });
        dispatch(updateNewProductFormField({ key: keyName, value }));
        return;
      }
      const value = event.target.value;
      setProductForm((prev) => {
        return { ...prev, [keyName]: value };
      });

      dispatch(updateNewProductFormField({ key: keyName, value }));
    },
    [dispatch]
  );

  const submitHandler = useCallback(() => {
    setIsTouched(true);
    const isValid = Object.keys(validForm).every((key) => validForm[key]);

    if (!isValid) {
      toast.error("Invalid Product Form!", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }
    dispatch(createProduct(productForm));
    setIsTouched(false);
  }, [productForm, dispatch, validForm]);

  const imageUploadClasses = useMemo(() => {
    const defaultStyle = "rounded-xl ";

    if (!productForm?.image) {
      return defaultStyle + " border-dashed border-2 border-indigo-400";
    }

    return defaultStyle;
  }, [productForm]);

  useEffect(() => {
    setValidForm((prev) => ({
      itemCode: true,
      title: !!productForm.title,
      brand: true,
      image: true,
      category: !!productForm.category,
      price: !!productForm.price,
      purchasePrice: true,
      primaryUnit: true,
      secondaryUnit: true,
      conversionRatio: true,
      quantity: !!productForm.quantity && productForm.quantity > 0,
      lowQuantityAlert: !!productForm.lowQuantityAlert,
      remarks: true,
    }));
  }, [productForm]);

  useEffect(() => {
    if (productNewForm) {
      setProductForm(productNewForm);
    }
  }, [productNewForm]);

  return (
    <div className="bg-white rounded-xl p-4">
      <SectionTitle> Quick Add Product </SectionTitle>
      <div className="flex mt-2">
        {isInitLoading ? (
          <Skeleton className="skeleton-input-radius skeleton-image border-dashed border-2" />
        ) : (
          <ImageUpload
            keyName="QuickEditImageUpload"
            className={imageUploadClasses}
            url={productForm?.image}
            folder="products"
            onChangeImage={onChangeImage}
          />
        )}

        <div className="flex-1 pl-3 text-sm">
          {isInitLoading ? (
            <Skeleton className={defaultSkeletonLargeStyle} />
          ) : (
            <div>
              <input
                autoComplete="nope"
                value={productForm?.title}
                placeholder="Product Name"
                className={defaultInputLargeStyle}
                onChange={(e) => handlerProductValue(e, "title")}
                disabled={isInitLoading}
              />
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 text-sm">
        <div className="font-title text-sm text-default-color">Brand</div>
        <div className="flex">
          <div className="flex-1">
            {isInitLoading ? (
              <Skeleton className={defaultSkeletonNormalStyle} />
            ) : (
              <input
                autoComplete="nope"
                placeholder="Brand"
                type="text"
                className={
                  !validForm.brand && isTouched
                    ? defaultInputInvalidStyle
                    : defaultInputStyle
                }
                disabled={isInitLoading}
                value={productForm?.brand}
                onChange={(e) => handlerProductValue(e, "brand")}
              />
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 relative">
        <div className="font-title text-sm text-default-color">Category</div>
        <div className="flex">
          <div className="flex-1 text-sm">
            {isInitLoading ? (
              <Skeleton className={defaultSkeletonNormalStyle} />
            ) : (
              <Dropdown
                name="category"
                handlerProductValue={handlerProductValue}
                productForm={productForm}
              />
            )}
          </div>
        </div>
      </div>
      <DisClosure
        isInitLoading={isInitLoading}
        Skeleton={Skeleton}
        defaultInputStyle={defaultInputStyle}
        defaultInputInvalidStyle={defaultInputInvalidStyle}
        defaultSkeletonNormalStyle={defaultSkeletonNormalStyle}
        validForm={validForm}
        isTouched={isTouched}
        productForm={productForm}
        handlerProductValue={handlerProductValue}
        editMode={false}
      />
      <div className="mt-3">
        <Button onClick={submitHandler} block={1}>
          <span className="inline-block ml-2"> Submit </span>
        </Button>
      </div>
    </div>
  );
}

export default QuickAddProduct;
