import React, { useCallback, useMemo, useState } from "react";
import { defaultSearchStyle } from "../../constants/defaultStyles";
import ProductIDIcon from "../Icons/ProductIDIcon";
import { TbListSearch } from "react-icons/tb";
import EmptyBar from "../Common/EmptyBar";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination";
import { BiFilter } from "react-icons/bi";
import FilterData from "../Filtering";
import { setOpenFilter } from "../../stateManagement/slice/InitialMode";
import {
  setProductSearchBy,
  setProductFilterBy,
  setProductSortBy,
} from "../../stateManagement/slice/productSlice";
import { useDispatch } from "react-redux";
import Button from "../Button/Button";

function ProductTable({
  showAdvanceSearch = false,
  allProducts,
  initLoading,
  pageCount,
  currentPage,
  setPageNumber,
  searchBy,
  filterBy,
  sortBy,
  handleSelect,
  openModal = false,
}) {
  const dispatch = useDispatch();
  const defaultTdContent =
    "w-full flex flex-wrap flex-row items-center justify-start text-[12px] sm:text-base my-1";

  const defaultTdContentSecond =
    "w-full flex flex-wrap flex-row items-center justify-end text-[12px] sm:text-base my-1";

  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState(searchBy);
  const ToFilterData = [
    "",
    "General",
    "Carpentry",
    "Plumbing",
    "Painting",
    "Bathroom",
  ];

  const goToProductDetail = useCallback((item) => {
    navigate(`/products/${item._id}`);
  });

  const handlerSearchValue = useCallback(
    (event, keyName) => {
      const { value } = event.target;
      setSearchForm((prev) => ({ ...prev, [keyName]: value }));
      dispatch(setProductSearchBy({ ...searchForm, [keyName]: value }));
    },
    [searchForm]
  );
  const handlerFilterValue = useCallback((value) => {
    dispatch(setProductFilterBy(value));
  });
  const handlerSortValue = useCallback((value) => {
    dispatch(setProductSortBy(value));
  });
  return (
    <>
      {showAdvanceSearch === true && (
        <div className="bg-white rounded-xl px-3 py-3 mb-3">
          <div className="font-title mb-2">Advanced Search</div>
          <div className="flex w-full flex-col sm:flex-row">
            <div className="mb-2 sm:mb-0 sm:text-left text-default-color flex flex-row font-title flex-1 px-2">
              <div className="h-12 w-12 rounded-2xl bg-gray-100 mr-2 flex justify-center items-center text-gray-400">
                <ProductIDIcon
                  className={`w-6 h-6 ${
                    searchBy.name !== "" ? "text-[#00684a96]" : "text-gray-400"
                  }`}
                />
              </div>
              <input
                autoComplete="nope"
                value={searchForm.name}
                placeholder="Search by product name"
                className={defaultSearchStyle}
                onChange={(event) => handlerSearchValue(event, "name")}
              />
            </div>
            <div className="mb-2 sm:mb-0 sm:text-left text-default-color flex flex-row font-title flex-1 px-2">
              <div className="h-12 w-12 rounded-2xl bg-gray-100 mr-2 flex justify-center items-center text-gray-400">
                <TbListSearch
                  className={`w-6 h-6 ${
                    searchBy.anything !== ""
                      ? "text-[#00684a96]"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <input
                autoComplete="nope"
                value={searchForm.anything}
                placeholder="Search anything"
                className={defaultSearchStyle}
                onChange={(event) => handlerSearchValue(event, "anything")}
                title="Ex: product code, brand name etc."
              />
              {!openModal ? (
                <>
                  <div
                    type="button"
                    className={`h-12 w-12 rounded-2xl bg-gray-100 ml-2 flex justify-center items-center cursor-pointer
                `}
                    onClick={() => dispatch(setOpenFilter())}
                    title={
                      filterBy !== "" || sortBy !== 1 ? "Filtering" : "Filter"
                    }
                  >
                    <BiFilter
                      className={`h-7 w-7                 ${
                        filterBy !== "" || sortBy !== 1
                          ? "text-[#00684a96] animate-pulse"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <FilterData
                    ToFilterData={ToFilterData}
                    filterBy={filterBy}
                    setFilterBy={handlerFilterValue}
                    setSortBy={handlerSortValue}
                    sortBy={sortBy}
                    name="Product"
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
      <div>
        {initLoading !== "loading" &&
          allProducts.length > 0 &&
          allProducts?.map((product, index) => (
            <div
              className={
                `bg-white rounded-xl py-1 cursor-pointer` +
                (openModal ? " mb-2 px-1" : " mb-4 px-3")
              }
              key={index}
              onClick={() => !openModal && goToProductDetail(product)}
            >
              {openModal ? (
                <div className="flex flex-wrap justify-between items-center p-2">
                  <div className={" font-semibold"}>{product.title}</div>
                  <div className={" hidden sm:block font-semibold"}>
                    {product.category}{" "}
                    <span
                      className={`font-normal text-sm ${
                        product.quantity <= product.lowQuantityAlert
                          ? " text-red-500 "
                          : ""
                      }`}
                    >
                      ( {product.quantity?.toFixed(2)}{" "}
                      <span className="font-normal text-xs">
                        "{product.primaryUnit}"
                      </span>{" "}
                      )
                    </span>
                  </div>
                  <div className={""}>
                    <Button roundedSmall onClick={() => handleSelect(product)}>
                      select
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 p-2">
                  <div className="flex-col flex-1">
                    <div
                      className={
                        defaultTdContent +
                        "font-bold text-[18px] sm:text-[20px]"
                      }
                    >
                      <button
                        className="whitespace-nowrap text-ellipsis mb-0.5 overflow-hidden text-[#000] cursor-pointer"
                        onClick={() => {}}
                      >
                        {product.title}
                      </button>
                    </div>
                    <div className={defaultTdContent + " text-gray-500 "}>
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden text-[11px] sm:text-[15px]">
                        Sale Price
                      </span>
                    </div>
                    <div className={defaultTdContent}>
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden">
                        Rs. {product.price}/{product.primaryUnit}
                      </span>
                    </div>
                  </div>
                  <div className="flex-col flex-1 flex items-center justify-end">
                    <div
                      className={
                        "pb-1 flex items-center justify-center w-full flex-wrap" +
                        " text-gray-500 "
                      }
                    >
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden text-[11px] sm:text-[15px]">
                        Purchase Price
                      </span>
                    </div>
                    <div
                      className={
                        "pb-1 flex items-center justify-center w-full flex-wrap text-[12px] sm:text-base"
                      }
                    >
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden">
                        {product.purchasePrice || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex-col flex-1">
                    <div
                      className={
                        defaultTdContentSecond +
                        "font-bold text-[12px] text-gray-500 mb-[0.8rem] sm:mb-0 sm:text-[13px]"
                      }
                    >
                      <span className="whitespace-nowrap text-ellipsis mb-0.5 overflow-hidden cursor-pointer">
                        {product.category}
                      </span>
                    </div>
                    <div className={defaultTdContentSecond + " text-gray-500 "}>
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden text-[11px] sm:text-[15px]">
                        Quantity
                      </span>
                    </div>
                    <div className={defaultTdContentSecond}>
                      <span
                        className={`whitespace-nowrap text-ellipsis overflow-hidden  ${
                          product.quantity <= product.lowQuantityAlert
                            ? " text-red-500 "
                            : ""
                        }`}
                      >
                        {product?.quantity?.toFixed(1)} {product.primaryUnit}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        {(allProducts.length <= 0 || initLoading === "loading") && (
          <EmptyBar initLoading={initLoading} />
        )}
        {allProducts.length > 0 && initLoading !== "loading" && (
          <Pagination
            pageCount={pageCount}
            currentPage={currentPage}
            setPageNumber={setPageNumber}
          />
        )}
      </div>
    </>
  );
}

export default ProductTable;
