import { Disclosure } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { MinusIcon } from "@heroicons/react/20/solid";
import React from "react";
import { useMemo } from "react";
import { EditDropdown, Dropdown } from "./dropdown";
export default function Example({
  isInitLoading,
  Skeleton,
  defaultSkeletonNormalStyle,
  defaultInputStyle,
  defaultInputInvalidStyle,
  validForm,
  isTouched,
  productForm,
  handlerProductValue,
  editMode,
}) {
  let allowToAdd = useMemo(() => {
    return productForm?.secondaryUnit?.length !== 0;
  }, [productForm._id]);
  const [alternativeUnit, setAlternativeUnit] = React.useState(false);
  return (
    <div className="w-full">
      <div className="mx-auto w-full rounded-2xl bg-white mt-4">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                className="flex w-full justify-between rounded-lg bg-green-50
               pl-2 pr-4 py-3 text-left text-sm font-medium primary-self-text hover:bg-green-100
                focus:outline-none focus-visible:ring focus-visible:primary-self-text focus-visible:ring-opacity-75"
              >
                <span>Item Pricing</span>
                {open ? (
                  <MinusIcon className={`h-5 w-5 primary-self-text`} />
                ) : (
                  <PlusIcon className={`h-5 w-5 primary-self-text`} />
                )}
              </Disclosure.Button>
              <Disclosure.Panel className="bg-green-50/20 rounded-xl text-sm">
                <div className="pt-3 relative">
                  <div className="font-title text-sm text-default-color">
                    Primary Unit
                  </div>
                  <div className="flex">
                    <div className="flex-1">
                      {isInitLoading ? (
                        <Skeleton className={defaultSkeletonNormalStyle} />
                      ) : editMode ? (
                        <EditDropdown
                          name="primaryUnit"
                          handlerProductValue={handlerProductValue}
                          productForm={productForm}
                          disabled={true}
                        />
                      ) : (
                        <Dropdown
                          name="primaryUnit"
                          handlerProductValue={handlerProductValue}
                          productForm={productForm}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {editMode
                  ? productForm?.secondaryUnit?.length === 0 &&
                    !alternativeUnit && (
                      <button
                        className="mt-2 capitalize text-[12px] font-title primary-self-text"
                        onClick={() => setAlternativeUnit(!alternativeUnit)}
                      >
                        <span className="text-lg">+</span> Add Secondary Unit
                      </button>
                    )
                  : !!productForm?.primaryUnit &&
                    !alternativeUnit && (
                      <button
                        className="mt-2 capitalize text-[12px] font-title primary-self-text"
                        onClick={() => setAlternativeUnit(!alternativeUnit)}
                      >
                        <span className="text-lg">+</span> Add Secondary Unit
                      </button>
                    )}
                {(alternativeUnit ||
                  productForm?.secondaryUnit?.length !== 0) && (
                  <div className="pt-3 relative">
                    <div className="font-title text-sm text-default-color">
                      Secondary Unit
                    </div>
                    <div className="flex">
                      <div className="flex-1">
                        {isInitLoading ? (
                          <Skeleton className={defaultSkeletonNormalStyle} />
                        ) : editMode ? (
                          <EditDropdown
                            name="secondaryUnit"
                            handlerProductValue={handlerProductValue}
                            productForm={productForm}
                            disabled={allowToAdd}
                          />
                        ) : (
                          <Dropdown
                            name="secondaryUnit"
                            handlerProductValue={handlerProductValue}
                            productForm={productForm}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {productForm?.secondaryUnit && (
                  <div className="mt-3 text-sm">
                    <div className="font-title text-sm text-default-color">
                      Enter Unit Conversion Rate
                    </div>
                    <div className="flex">
                      <div
                        className="flex-1 border-2 border-[#00684a40] rounded-lg
                    flex items-center justify-center primary-self-text"
                      >
                        1 {productForm?.primaryUnit}
                      </div>
                      <div className="flex-2 mx-4 mt-3">=</div>
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            autoComplete="nope"
                            placeholder="Enter"
                            type="number"
                            className={defaultInputStyle}
                            value={productForm?.conversionRatio}
                            disabled={allowToAdd}
                            onChange={(e) =>
                              handlerProductValue(e, "conversionRatio")
                            }
                          />
                          {productForm?.secondaryUnit && (
                            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-50 text-default-color px-4 py-1 rounded-lg">
                              /{productForm?.secondaryUnit}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {[
                  {
                    name: "price",
                    denote: "Price",
                    type: "number",
                  },
                  {
                    name: "purchasePrice",
                    denote: "Purchase Price",
                    type: "number",
                  },
                ].map((i, index) => (
                  <div key={index} className="pt-3">
                    <div className="font-title text-sm text-default-color">
                      {i.denote}
                    </div>
                    <div className="flex">
                      <div className="flex-1">
                        {isInitLoading ? (
                          <Skeleton className={defaultSkeletonNormalStyle} />
                        ) : (
                          <div className="relative">
                            <input
                              autoComplete="nope"
                              placeholder={i.denote}
                              type={i.type}
                              className={
                                !validForm[i.name] && isTouched
                                  ? defaultInputInvalidStyle
                                  : defaultInputStyle
                              }
                              disabled={isInitLoading}
                              value={productForm[i.name]}
                              onChange={(e) => handlerProductValue(e, i.name)}
                            />
                            {productForm?.primaryUnit && (
                              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-50 text-default-color px-4 py-1 rounded-lg">
                                /{productForm?.primaryUnit}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as="div" className="mt-4">
          {({ open }) => (
            <>
              <Disclosure.Button
                className="flex w-full justify-between rounded-lg bg-green-50
               pl-2 pr-4 py-3 text-left text-sm font-medium primary-self-text hover:bg-green-100
                focus:outline-none focus-visible:ring focus-visible:primary-self-text focus-visible:ring-opacity-75"
              >
                <span>Stock Details</span>
                {open ? (
                  <MinusIcon className={`h-5 w-5 primary-self-text`} />
                ) : (
                  <PlusIcon className={`h-5 w-5 primary-self-text`} />
                )}
              </Disclosure.Button>
              <Disclosure.Panel className="bg-green-50/20 rounded-xl text-sm">
                {[
                  {
                    name: "quantity",
                    denote: "Quantity",
                    type: "number",
                  },
                  {
                    name: "lowQuantityAlert",
                    denote: "Low Quantity Alert",
                    type: "number",
                  },
                ].map((i, index) => (
                  <div key={index} className="pt-3">
                    <div className="font-title text-sm text-default-color">
                      {i.denote}
                    </div>
                    <div className="flex">
                      <div className="flex-1">
                        {isInitLoading ? (
                          <Skeleton className={defaultSkeletonNormalStyle} />
                        ) : (
                          <input
                            autoComplete="nope"
                            placeholder={i.denote}
                            type={i.type}
                            className={
                              !validForm[i.name] && isTouched
                                ? defaultInputInvalidStyle
                                : defaultInputStyle
                            }
                            disabled={isInitLoading}
                            value={productForm[i.name]}
                            onChange={(e) => handlerProductValue(e, i.name)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as="div" className="mt-4">
          {({ open }) => (
            <>
              <Disclosure.Button
                className="flex w-full justify-between rounded-lg bg-green-50
               pl-2 pr-4 py-3 text-left text-sm font-medium primary-self-text hover:bg-green-100
                focus:outline-none focus-visible:ring focus-visible:primary-self-text focus-visible:ring-opacity-75"
              >
                <span>Other Details</span>
                {open ? (
                  <MinusIcon className={`h-5 w-5 primary-self-text`} />
                ) : (
                  <PlusIcon className={`h-5 w-5 primary-self-text`} />
                )}
              </Disclosure.Button>
              <Disclosure.Panel className="bg-green-50/20 rounded-xl text-sm">
                {[
                  {
                    name: "itemCode",
                    denote: "Item Code",
                    type: "text",
                  },
                  {
                    name: "remarks",
                    denote: "Remarks",
                    type: "text",
                  },
                ].map((i, index) => (
                  <div key={index} className="pt-3">
                    <div className="font-title text-sm text-default-color">
                      {i.denote}
                    </div>
                    <div className="flex">
                      <div className="flex-1">
                        {isInitLoading ? (
                          <Skeleton className={defaultSkeletonNormalStyle} />
                        ) : (
                          <input
                            autoComplete="nope"
                            placeholder={i.denote}
                            type={i.type}
                            className={
                              !validForm[i.name] && isTouched
                                ? defaultInputInvalidStyle
                                : defaultInputStyle
                            }
                            disabled={isInitLoading}
                            value={productForm[i.name]}
                            onChange={(e) => handlerProductValue(e, i.name)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
