import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientStatus } from "../../stateManagement/slice/clientSlice";
import { defaultSearchStyle } from "../../constants/defaultStyles";
import EmptyBar from "../Common/EmptyBar";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination";
import { BiFilter } from "react-icons/bi";
import FilterData from "../Filtering";
import { setOpenFilter } from "../../stateManagement/slice/InitialMode";
import { TbListSearch, TbUserSearch } from "react-icons/tb";
import Button from "../Button/Button";

function ClientTable({
  showAdvanceSearch = false,
  data,
  merchant,
  currentPage,
  pageCount,
  setPageNumber,
  searchBy,
  filterBy,
  sortBy,
  setClientSearchBy,
  setClientFilterBy,
  setClientSortBy,
  handleSelect,
  openModal = false,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const defaultTdContent =
    "w-full flex flex-wrap flex-row items-center justify-start text-[18px] my-1";

  const defaultTdContentSecond =
    "w-full flex flex-wrap flex-row items-center justify-end text-[12px] sm:text-base my-1";
  const ToFilterData = [];
  const goToClientDetails = useCallback(
    (id) => {
      navigate(`/${merchant === true ? "merchant" : "customer"}/${id}`);
    },
    [navigate]
  );
  const initLoading = useSelector(getClientStatus);

  const [searchForm, setSearchForm] = useState(searchBy);

  const handlerSearchValue = useCallback(
    (event, keyName) => {
      const { value } = event.target;
      setSearchForm((prev) => ({ ...prev, [keyName]: value }));
      dispatch(setClientSearchBy({ ...searchForm, [keyName]: value }));
    },
    [searchForm]
  );
  const handlerFilterValue = useCallback((value) => {
    dispatch(setClientFilterBy(value));
  });
  const handlerSortValue = useCallback((value) => {
    dispatch(setClientSortBy(value));
  });

  return (
    <>
      {showAdvanceSearch === true && (
        <div className="bg-white rounded-xl px-3 py-3 mb-3">
          <div className="font-title mb-2">Advanced Search</div>
          <div className="flex w-full flex-col sm:flex-row">
            <div className="mb-2 sm:mb-0 sm:text-left text-default-color flex flex-row font-title flex-1 px-2">
              <div className="h-12 w-12 rounded-2xl bg-gray-100 mr-2 flex justify-center items-center text-gray-400">
                <TbUserSearch
                  className={`w-6 h-6 ${
                    searchBy.name !== "" ? "text-[#00684a96]" : "text-gray-400"
                  }`}
                />
              </div>
              <input
                autoComplete="nope"
                value={searchForm.name}
                placeholder={`Search by ${
                  merchant === true ? "merchant" : "customer"
                } name`}
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
                title="Ex: mobile number, address, email etc."
              />
              {!openModal && (
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
                    name={merchant === true ? "Merchant" : "Customer"}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <>
        {initLoading !== "loading" &&
          data.length > 0 &&
          data?.map((client, index) => (
            <div
              className={
                `bg-white rounded-xl cursor-pointer` +
                (openModal ? " mb-2 px-1" : " mb-4 px-3")
              }
              onClick={() => !openModal && goToClientDetails(client._id)}
              key={index}
            >
              <div className="flex flex-wrap items-center gap-4 p-2">
                <div className="flex-col flex-0 flex items-center justify-center">
                  {openModal === false &&
                    (client.image ? (
                      <span className="flex justify-center items-center">
                        <img
                          className="object-contain h-12 w-12 rounded-2xl"
                          loading="lazy"
                          src={client.image}
                          alt={client.name}
                        />
                      </span>
                    ) : (
                      <span className="h-12 w-12 rounded-2xl bg-gray-100 flex justify-center items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    ))}
                </div>
                {!openModal && (
                  <div className="flex-col flex-1">
                    <div className={defaultTdContent}>
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden pb-0.5 capitalize font-medium">
                        {client.name}
                      </span>
                    </div>
                    <div className={defaultTdContent}>
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden capitalize text-[14px] sm:text-[15px] text-gray-600">
                        {client.mobileNo}
                      </span>
                    </div>
                  </div>
                )}
                {openModal && (
                  <>
                    <div className="flex-col flex-1">
                      <div className={defaultTdContent}>
                        <span className="whitespace-nowrap text-ellipsis overflow-hidden text-gray-700 capitalize font-semibold text-[16px]">
                          Name:{" "}
                          <span className="text-sm font-normal">
                            {client.name}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="flex-col flex-2">
                      <div className={defaultTdContent}>
                        <span className="whitespace-nowrap text-ellipsis overflow-hidden capitalize font-semibold text-[16px] text-gray-700 hidden md:block">
                          Mobile:{" "}
                          <span className="text-sm font-normal">
                            {client.mobileNo}
                          </span>
                        </span>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex-col flex-1">
                  {!openModal ? (
                    <div className={defaultTdContentSecond}>
                      <span
                        className={`whitespace-nowrap text-ellipsis overflow-hidden pb-0.5 ${
                          merchant === true ? "text-rose-600" : "text-green-600"
                        }`}
                      >
                        Rs. {client.totalAmountToPay}
                      </span>
                    </div>
                  ) : (
                    <div className={defaultTdContentSecond}>
                      <Button roundedSmall onClick={() => handleSelect(client)}>
                        select
                      </Button>
                    </div>
                  )}
                  {!openModal && (
                    <div className={defaultTdContentSecond}>
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden text-[14px] sm:text-[15px] text-gray-600">
                        {client.totalAmountToPay < 0
                          ? `${merchant === true ? "To Receive" : "To Give"}`
                          : client.totalAmountToPay > 0
                          ? `${merchant === true ? "To Give" : "To Receive"}`
                          : "Settled"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

        {(data === null || data.length <= 0 || initLoading === "loading") && (
          <EmptyBar
            title={`${merchant === true ? "Merchant" : "Client"} Data`}
            initLoading={initLoading}
          />
        )}
      </>
      {initLoading !== "loading" && data.length > 0 && (
        <Pagination
          pageCount={pageCount}
          currentPage={currentPage}
          setPageNumber={setPageNumber}
        />
      )}
    </>
  );
}

export default ClientTable;
