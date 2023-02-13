import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  getTransactionDateFilterOpenSelector,
  setTransactionDateFilterOpen,
  getTransactionDateSelector,
  setTransactionDate,
  getTransactionFilterBySelector,
  getTransactionSortBySelector,
  setTransactionFilterBy,
  setTransactionSortBy,
} from "../../stateManagement/slice/transactionSlice";
import NepaliDatePicker from "../Common/NepaliDatePicker";
import SortByComponent from "./sort";

function TransactionFilter() {
  const ToFilterData = ["", "Sale", "Purchase", "PaymentOut", "PaymentIn"];
  const dispatch = useDispatch();
  const openModal = useSelector(getTransactionDateFilterOpenSelector);
  const filterBy = useSelector(getTransactionFilterBySelector);
  const sortBy = useSelector(getTransactionSortBySelector);
  const date = useSelector(getTransactionDateSelector);
  const [filterData, setFilterData] = useState(filterBy);
  const [sortData, setSortByData] = useState(sortBy);
  const [dateData, setDateData] = useState(date);
  const onSubmitHandler = useCallback(() => {
    dispatch(setTransactionFilterBy(filterData));
    dispatch(setTransactionSortBy(sortData));
    dispatch(setTransactionDate(dateData));
    dispatch(setTransactionDateFilterOpen(false));
  }, [dispatch, filterData, sortData, dateData]);

  const [animate, setAnimate] = useState(true);

  const onCancelHandler = useCallback(() => {
    dispatch(setTransactionDateFilterOpen(false));
  }, [dispatch]);

  useEffect(() => {
    if (openModal) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [openModal]);

  return openModal ? (
    <motion.div
      className="modal-container bg-opacity-75 transition-opacity bg-gray-200 popup-model"
      aria-labelledby="modal-title"
      role="dialog"
      id="exampleModal"
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
      <div className="relative">
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className=" p-4 flex justify-center items-center min-h-full">
            <div className="relative rounded-lg overflow-hidden shadow-xl transform transition-all flex flex-col w-full md:w-8/12 lg:w-6/12 xl:w-5/12">
              <div className="bg-gray-50 text-gray-900 text-[0.98rem] leading-6 px-4 pt-5 sm:pb-4 flex-1">
                {ToFilterData.length > 0 ? (
                  <>
                    <div className="font-semibold">Filter By:</div>
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
                <div className="font-semibold">Filter Date:</div>
                <div className="flex flex-wrap justify-start items-center gap-4 my-2 max-w-xl mx-auto">
                  <div className="flex flex-row justify-center items-center gap-3">
                    <div className="text-[0.8rem] sm:text-sm sm:text-center">
                      {" "}
                      Start Date{" "}
                    </div>
                    <NepaliDatePicker
                      className={
                        " text-center primary-background-color rounded-lg py-1 text-xs sm:text-sm text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-200"
                      }
                      setData={setDateData}
                      name="startDate"
                      id={"nepali-datepicker-1"}
                      data={dateData}
                      value={dateData?.startDate}
                      disabledBeforeDate={true}
                    />
                  </div>
                  <div className="flex flex-row justify-center items-center gap-4">
                    <div className=" text-[0.8rem] sm:text-sm sm:text-center">
                      {" "}
                      End Date{" "}
                    </div>
                    <NepaliDatePicker
                      className={
                        " text-center text-xs sm:text-sm primary-background-color rounded-lg py-1 text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-200"
                      }
                      setData={setDateData}
                      name="endDate"
                      id={"nepali-datepicker-2"}
                      data={dateData}
                      value={dateData?.endDate}
                      disabledBeforeDate={true}
                      disabledAfterDate={true}
                    />
                  </div>
                </div>
                <div className="font-semibold">Sort By:</div>
                <SortByComponent
                  setSortByData={setSortByData}
                  sortData={sortData}
                  name={"Transaction"}
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
      </div>
    </motion.div>
  ) : null;
}

export default TransactionFilter;
