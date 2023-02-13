/* eslint-disable no-useless-escape */
import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  getOpenFilter,
  setOpenFilter,
} from "../../stateManagement/slice/InitialMode";
import SortByComponent from "./sort";
import NepaliDatePicker from "../Common/NepaliDatePicker";
import { setTransactionDateFilterOpen } from "../../stateManagement/slice/transactionSlice";
import Button from "../Button/Button";

function FilterData({
  ToFilterData,
  filterBy,
  sortBy,
  setFilterBy,
  setSortBy,
  setDateBy,
  name,
}) {
  const dispatch = useDispatch();
  const openModal = useSelector(getOpenFilter);
  const [animate, setAnimate] = useState(true);
  const [filterData, setFilterData] = useState(filterBy);
  const [sortData, setSortByData] = useState(sortBy);
  const onCancelHandler = useCallback(() => {
    dispatch(setOpenFilter());
  }, [dispatch]);
  const onSubmitHandler = useCallback(() => {
    setFilterBy(filterData);
    setSortBy(sortData);
    dispatch(setOpenFilter());
  }, [dispatch, filterData, setFilterBy, sortData, setSortBy, setDateBy]);

  useEffect(() => {
    if (openModal && animate) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openModal, animate]);

  const handleClickOutside = (event) => {
    event.stopPropagation();
    if (event.target.closest(".popup-model") === null) {
      onCancelHandler();
    }
  };
  useEffect(() => {
    if (openModal !== false) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [openModal]);

  return openModal !== false ? (
    <motion.div
      className="fixed inset-0 z-50 bg-opacity-75 transition-opacity bg-gray-200"
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
      <div className="relative top-28">
        <div className="px-4 flex items-center justify-center w-full h-full">
          <div className="popup-model rounded-lg overflow-y-hidden shadow-xl transform transition-all flex  flex-col w-full md:w-10/12 lg:w-8/12 xl:w-6/12">
            <div className="bg-gray-50 px-4 pt-5 sm:pb-4 flex-1">
              {ToFilterData.length > 0 ? (
                <>
                  <div className="font-title font-semibold">Filter By:</div>
                  <div className="flex flex-row flex-wrap items-center justify-start mb-2 max-w-xl mx-auto">
                    {ToFilterData.map((data) => (
                      <span
                        key={data}
                        onClick={() => {
                          setFilterData(data);
                        }}
                        className={
                          "px-3 py-1 mx-2 my-2 text-xs sm:text-sm cursor-pointer rounded-lg " +
                          (filterData === data
                            ? " primary-background-color text-white "
                            : " bg-gray-200 hover:bg-gray-300 text-black")
                        }
                      >
                        {data === ""
                          ? "All"
                          : data === "PaymentIn"
                          ? "Payment In"
                          : data === "PaymentOut"
                          ? "Payment Out"
                          : data}
                      </span>
                    ))}
                  </div>
                </>
              ) : null}
              <div className="font-title font-semibold">Sort By:</div>
              <SortByComponent
                setSortByData={setSortByData}
                sortData={sortData}
                name={name}
              />
            </div>
            <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-white text-base font-medium primary-background-color-dim primary-background-color-hover hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onSubmitHandler}
              >
                Submit
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onCancelHandler}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  ) : null;
}

export default FilterData;
