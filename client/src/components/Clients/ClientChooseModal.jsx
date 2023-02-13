import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  getIsOpenClientSelector,
  getAllClientsSelector,
  setClientSelector,
  setOpenClientSelector,
  getAllCustomer,
  getClientPageNumberSelector,
  getClientPageCountSelector,
  setClientPageNumber,
  getClientSearchBySelector,
  getClientFilterBySelector,
  getClientSortBySelector,
  setClientSearchBy,
  setClientFilterBy,
  setClientSortBy,
} from "../../stateManagement/slice/clientSlice";
import ClientTable from "./ClientTable";

function ClientChooseModal() {
  const dispatch = useDispatch();
  const allClients = useSelector(getAllClientsSelector);
  const page = useSelector(getClientPageNumberSelector);
  const pageCount = useSelector(getClientPageCountSelector);
  const openModal = useSelector(getIsOpenClientSelector);
  const searchBy = useSelector(getClientSearchBySelector);
  const filterBy = useSelector(getClientFilterBySelector);
  const sortBy = useSelector(getClientSortBySelector);
  React.useEffect(() => {
    if (openModal) {
      dispatch(
        getAllCustomer({
          page: page,
          searchBy: searchBy,
          filterBy: filterBy,
          sortBy: sortBy,
          limit: 5,
        })
      );
    }
  }, [dispatch, page, searchBy, filterBy, sortBy, openModal]);

  const [animate, setAnimate] = useState(true);

  const onCancelHandler = useCallback(() => {
    dispatch(setOpenClientSelector(false));
    dispatch(setClientPageNumber(1));
  }, [dispatch]);

  const handleSelect = useCallback(
    (item) => {
      console.log(item);
      dispatch(setClientSelector(item._id));

      setTimeout(() => {
        dispatch(setClientPageNumber(1));
        dispatch(setOpenClientSelector(false));
      }, 50);
    },
    [dispatch]
  );

  useEffect(() => {
    if (openModal) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [openModal]);

  return openModal ? (
    <motion.div
      className="modal-container"
      style={{
        height: "100%",
      }}
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
      <div className="relative">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex justify-center items-center min-h-full p-4 text-center">
            <div className="relative bg-gray-200 rounded-lg text-left overflow-hidden shadow-xl transform transition-all pt-2 flex flex-col w-full sm:mx-20 lg:mx-40">
              <div className="flex flex-wrap">
                <div className="w-full px-4 mb-4 sm:mb-1">
                  <ClientTable
                    showAdvanceSearch
                    data={allClients}
                    merchant={false}
                    currentPage={page}
                    pageCount={pageCount}
                    setPageNumber={setClientPageNumber}
                    searchBy={searchBy}
                    filterBy={filterBy}
                    sortBy={sortBy}
                    setClientSearchBy={setClientSearchBy}
                    setClientFilterBy={setClientFilterBy}
                    setClientSortBy={setClientSortBy}
                    handleSelect={handleSelect}
                    openModal={openModal}
                  />
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onCancelHandler}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  ) : null;
}

export default ClientChooseModal;
