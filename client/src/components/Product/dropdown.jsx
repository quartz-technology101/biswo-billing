import React, { useState } from "react";
import { Menu } from "@headlessui/react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { useCallback } from "react";
import {
  getTotalTaxesWithPercent,
  minusTotalDiscountAmount,
  sumProductTotal,
  sumTotalTaxes,
} from "../../utils/match";

export const Dropdown = ({ name, handlerProductValue, productForm }) => {
  const category = [
    "Choose Category",
    "General",
    "Carpentry",
    "Plumbing",
    "Painting",
    "Bathroom",
  ];
  const primaryUnit = [
    "Choose Unit",
    "BAG",
    "PACK",
    "BOX",
    "PCS",
    "SET",
    "FT",
    "M",
    "IN",
    "CM",
    "ML",
    "L",
    "KG",
    "G",
  ];
  const secondaryUnit = [
    "Choose Unit",
    "BAG",
    "PACK",
    "BOX",
    "PCS",
    "SET",
    "FT",
    "M",
    "IN",
    "CM",
    "ML",
    "L",
    "KG",
    "G",
  ];
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Menu as="div" className="dropdown relative">
      <Menu.Button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="dropdown-btn w-full text-left"
      >
        <div>
          <div
            className={
              productForm[name] === "Choose Category" ||
              productForm[name] === "Choose Unit" ||
              productForm[name] === ""
                ? "text-gray-400 text-[15px] leading-tight"
                : "text-[15px] leading-tight"
            }
          >
            {productForm[name] ||
              `Choose ${name === "category" ? "Category" : "Unit"}`}
          </div>
        </div>
        {isOpen ? (
          <RiArrowUpSLine className="dropdown-icon-secondary" />
        ) : (
          <RiArrowDownSLine className="dropdown-icon-secondary" />
        )}
      </Menu.Button>

      <Menu.Items className="dropdown-menu">
        {name === "category"
          ? category?.map((value, index) => {
              return (
                <Menu.Item
                  as="li"
                  onClick={(e) => handlerProductValue(e, name)}
                  key={index}
                  className={
                    index === 0
                      ? "cursor-pointer w-full text-gray-400 text-[13px] px-10 py-1 hover:text-[#fff] hover:bg-[#00684a60] transition"
                      : "cursor-pointer w-full text-[13px] px-10 py-1 hover:text-[#fff] hover:bg-[#00684a40] transition"
                  }
                >
                  {value}
                </Menu.Item>
              );
            })
          : name === "primaryUnit"
          ? primaryUnit?.map((value, index) => {
              return (
                <Menu.Item
                  as="li"
                  onClick={(e) => handlerProductValue(e, name)}
                  key={index}
                  className={
                    index === 0
                      ? "cursor-pointer text-gray-400 text-[13px] px-10 py-1 hover:text-[#fff] hover:bg-[#00684a60] transition"
                      : "cursor-pointer text-[13px] px-10 py-1 hover:text-[#fff] hover:bg-[#00684a40] transition"
                  }
                >
                  {value}
                </Menu.Item>
              );
            })
          : name === "secondaryUnit"
          ? secondaryUnit?.map((value, index) => {
              return (
                <Menu.Item
                  as="li"
                  onClick={(e) => handlerProductValue(e, name)}
                  key={index}
                  className={
                    index === 0
                      ? "cursor-pointer text-gray-400 text-[13px] px-10 py-1 hover:text-[#fff] hover:bg-[#00684a60] transition"
                      : "cursor-pointer text-[13px] px-10 py-1 hover:text-[#fff] hover:bg-[#00684a40] transition"
                  }
                >
                  {value}
                </Menu.Item>
              );
            })
          : null}
      </Menu.Items>
    </Menu>
  );
};

export const EditDropdown = ({
  name,
  handlerProductValue,
  productForm,
  disabled = false,
}) => {
  const category = [
    "Choose Category",
    "General",
    "Carpentry",
    "Plumbing",
    "Painting",
    "Bathroom",
  ];
  const primaryUnit = ["Choose Unit", "ML", "L", "KG", "G"];
  const secondaryUnit = ["Choose Unit", "ML", "L", "KG", "G"];
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Menu as="div" className="dropdown relative">
      <Menu.Button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="dropdown-btn w-full text-left"
      >
        <div>
          <div
            className={
              productForm[name] === "Choose Category" ||
              productForm[name] === "Choose Unit" ||
              productForm[name] === ""
                ? "text-gray-400 text-[15px] leading-tight"
                : "text-[15px] leading-tight"
            }
          >
            {productForm[name] ||
              `Choose ${name === "category" ? "Category" : "Unit"}`}
          </div>
        </div>
        {isOpen ? (
          <RiArrowUpSLine className="dropdown-icon-secondary" />
        ) : (
          <RiArrowDownSLine className="dropdown-icon-secondary" />
        )}
      </Menu.Button>
      {!disabled ? (
        <Menu.Items className="dropdown-menu">
          {name === "category"
            ? category?.map((value, index) => {
                return (
                  <Menu.Item
                    as="li"
                    onClick={(e) => handlerProductValue(e, name)}
                    key={index}
                    className={
                      index === 0
                        ? "cursor-pointer w-full text-gray-400 text-[13px] px-10 py-1 hover:text-[#fff] hover:bg-[#00684a60] transition"
                        : "cursor-pointer w-full text-[13px] px-10 py-1 hover:text-[#fff] hover:bg-[#00684a40] transition"
                    }
                  >
                    {value}
                  </Menu.Item>
                );
              })
            : name === "primaryUnit"
            ? primaryUnit?.map((value, index) => {
                return (
                  <Menu.Item
                    as="li"
                    onClick={(e) => handlerProductValue(e, name)}
                    key={index}
                    className={
                      index === 0
                        ? "cursor-pointer text-gray-400 text-[13px] px-10 py-1 hover:text-[#fff] hover:bg-[#00684a60] transition"
                        : "cursor-pointer text-[13px] px-10 py-1 hover:text-[#fff] hover:bg-[#00684a40] transition"
                    }
                  >
                    {value}
                  </Menu.Item>
                );
              })
            : name === "secondaryUnit"
            ? secondaryUnit?.map((value, index) => {
                return (
                  <Menu.Item
                    as="li"
                    onClick={(e) => handlerProductValue(e, name)}
                    key={index}
                    className={
                      index === 0
                        ? "cursor-pointer text-gray-400 text-[13px] px-10 py-1 hover:text-[#fff] hover:bg-[#00684a60] transition"
                        : "cursor-pointer text-[13px] px-10 py-1 hover:text-[#fff] hover:bg-[#00684a40] transition"
                    }
                  >
                    {value}
                  </Menu.Item>
                );
              })
            : null}
        </Menu.Items>
      ) : null}
    </Menu>
  );
};

export const ChooseUnit = ({
  primaryUnit,
  secondaryUnit,
  setInvoiceForm,
  invoiceForm,
  productID,
  setActiveUnit,
}) => {
  const unit = [primaryUnit, secondaryUnit];
  const [isOpen, setIsOpen] = useState(false);
  const handleProduct = useCallback(
    (value) => {
      setIsOpen(false);
      let updatedData = { ...invoiceForm };
      let updateProducts = [...invoiceForm.products];
      const isFindIndex = updateProducts.findIndex(
        (prod) => prod.id === productID
      );
      if (isFindIndex !== -1) {
        updateProducts[isFindIndex] = {
          ...updateProducts[isFindIndex],
          isSecondaryUnitChecked: value === secondaryUnit,
          amount:
            value === secondaryUnit
              ? updateProducts[isFindIndex].prevAmount /
                updateProducts[isFindIndex].conversionRatio
              : updateProducts[isFindIndex].prevAmount,
        };
        updatedData.products = [...updateProducts];
      }
      const subTotalAmount = sumProductTotal(updateProducts);
      const updateTaxes = getTotalTaxesWithPercent(
        invoiceForm.taxes,
        subTotalAmount
      );
      updatedData.taxes = updateTaxes;
      updatedData.totalAmount = minusTotalDiscountAmount(
        subTotalAmount,
        sumTotalTaxes(updateTaxes)
      );
      setInvoiceForm(updatedData);
    },
    [invoiceForm]
  );
  return (
    <Menu
      as="div"
      className="w-full max-w-[100px] cursor-pointer relative ml-1"
    >
      <Menu.Button
        onClick={() => {
          setIsOpen(!isOpen);
          setActiveUnit(productID);
        }}
        className="flex items-center px-2 mr-4 border-2 rounded-lg bg-green-50 border-[#00684a40] h-8 w-full text-left"
      >
        <div className="text-[#00684a] text-[11.5px]">
          {invoiceForm.products.filter((item) => item.id === productID)[0]
            .isSecondaryUnitChecked === true
            ? secondaryUnit
            : primaryUnit}
        </div>
        {isOpen ? (
          <RiArrowDownSLine className="text-base text-[#00684a] absolute right-1" />
        ) : (
          <RiArrowUpSLine className="text-base text-[#00684a] absolute right-1" />
        )}
      </Menu.Button>

      <Menu.Items
        className={`py-1 text-[11px] space-y-2 shadow-md bg-white absolute
       w-full z-[1000] list-none max-h-[10rem] overflow-y-auto`}
      >
        {unit?.map((value, index) => {
          return (
            <Menu.Item
              as="li"
              key={index}
              className="cursor-pointer w-full text-[13px] px-1 py-1 hover:bg-[#00684a10] transition text-center"
              onClick={() => handleProduct(value)}
            >
              {value}
            </Menu.Item>
          );
        })}
      </Menu.Items>
    </Menu>
  );
};

export const ChooseUnitForStock = ({
  primaryUnit,
  secondaryUnit,
  setProductForm,
  productForm,
  validForm,
  isTouched,
}) => {
  const unit = [primaryUnit, secondaryUnit];
  const [isOpen, setIsOpen] = useState(false);
  const handleProduct = useCallback(
    (value) => {
      setIsOpen(false);
      setProductForm({
        ...productForm,
        unit: value,
      });
    },
    [productForm]
  );
  return (
    <Menu
      as="div"
      className="w-full max-w-[100px] cursor-pointer relative ml-1"
    >
      <Menu.Button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={
          !validForm.unit && isTouched
            ? `flex items-center px-2 mr-4 border-2 rounded-lg bg-red-50 border-red-400 h-8 w-full text-left`
            : `flex items-center px-2 mr-4 border-2 rounded-lg bg-green-50 border-[#00684a40] h-8 w-full text-left`
        }
      >
        <div className="text-[#00684a] text-[12px] capitalize">
          {productForm.unit}
        </div>
        {isOpen ? (
          <RiArrowDownSLine className="text-base text-[#00684a] absolute right-1" />
        ) : (
          <RiArrowUpSLine className="text-base text-[#00684a] absolute right-1" />
        )}
      </Menu.Button>

      <Menu.Items
        className={`py-1 text-[11px] space-y-2 shadow-md bg-green-50 absolute
       w-full z-[1000] list-none max-h-[10rem] overflow-y-auto`}
      >
        {unit?.map((value, index) => {
          return (
            <Menu.Item
              as="li"
              key={index}
              className="cursor-pointer w-full text-[13px] px-1 pt-0.5 last:pt-1 hover:bg-[#00684a10] transition text-center
              border-t-[1px] border-t-[#00684b7c] first:border-t-0 capitalize"
              onClick={() => handleProduct(value)}
            >
              {value}
            </Menu.Item>
          );
        })}
      </Menu.Items>
    </Menu>
  );
};
