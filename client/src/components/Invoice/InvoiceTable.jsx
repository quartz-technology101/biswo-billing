import React, { useCallback, useState } from "react";
import TransactionByID from "../Clients/clientDetail/transactionByID";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTransaction,
  getAllTransactionSelector,
  getTransactionStatusSelector,
  getTransactionPageNumberSelector,
  getTransactionPageCountSelector,
  getTransactionShowDraftSelector,
  setTransactionShowDraft,
  getTransactionSearchBySelector,
  getTransactionFilterBySelector,
  getTransactionSortBySelector,
  setTransactionSearchBy,
  getTransactionDateSelector,
  setTransactionDateFilterOpen,
} from "../../stateManagement/slice/transactionSlice";
import { BiFilter } from "react-icons/bi";
import { defaultSearchStyle } from "../../constants/defaultStyles";
import { setOpenFilter } from "../../stateManagement/slice/InitialMode";
import Button from "../Button/Button";
import { TbListSearch } from "react-icons/tb";
import { AiOutlineTransaction } from "react-icons/ai";
import { todayNepaliDate } from "../Common/todayNepaliDate";
function InvoiceTable({ showAdvanceSearch }) {
  const dispatch = useDispatch();
  const data = useSelector(getAllTransactionSelector);
  const searchBy = useSelector(getTransactionSearchBySelector);
  const [searchForm, setSearchForm] = useState(searchBy);
  const filterBy = useSelector(getTransactionFilterBySelector);
  const sortBy = useSelector(getTransactionSortBySelector);
  const date = useSelector(getTransactionDateSelector);
  const page = useSelector(getTransactionPageNumberSelector);
  const [pageNumber, setPageNumber] = React.useState(page);
  const pageCount = useSelector(getTransactionPageCountSelector);
  const onlyDraft = useSelector(getTransactionShowDraftSelector);
  const initLoading = useSelector(getTransactionStatusSelector);
  React.useEffect(() => {
    if (data.length === 0 || page !== pageNumber || page) {
      setPageNumber(page);
      dispatch(
        getAllTransaction({
          page: page,
          onlyDraft: onlyDraft,
          searchBy: searchBy,
          filterBy: filterBy,
          sortBy: sortBy,
          date: date,
        })
      );
    }
  }, [
    dispatch,
    data.length,
    page,
    !onlyDraft,
    onlyDraft,
    searchBy,
    filterBy,
    sortBy,
    date,
  ]);

  const handleShowDraft = (value) => {
    dispatch(setTransactionShowDraft(value));
  };
  const handlerSearchValue = useCallback(
    (event, keyName) => {
      const { value } = event.target;
      setSearchForm((prev) => ({ ...prev, [keyName]: value }));
      dispatch(setTransactionSearchBy({ ...searchForm, [keyName]: value }));
    },
    [searchForm]
  );

  return (
    <>
      {showAdvanceSearch === true && (
        <div className="bg-white rounded-xl px-3 py-3 mb-3">
          <div className="font-title mb-2">Advanced Search</div>
          <div className="flex w-full flex-col sm:flex-row">
            <div className="mb-2 sm:mb-0 sm:text-left text-default-color flex flex-row font-title flex-1 px-2">
              <div className="h-12 w-12 rounded-2xl bg-gray-100 mr-2 flex justify-center items-center text-gray-400">
                <AiOutlineTransaction
                  className={`w-6 h-6 ${
                    searchBy.name !== "" ? "text-[#00684a96]" : "text-gray-400"
                  }`}
                />
              </div>
              <input
                autoComplete="nope"
                value={searchForm.name}
                placeholder="Search by client or merchant name"
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
                title="Ex: bill number, product name, client type etc."
              />
              <div
                type="button"
                className={`h-12 w-12 rounded-2xl bg-gray-100 ml-2 flex justify-center items-center cursor-pointer
                `}
                onClick={() => dispatch(setTransactionDateFilterOpen(true))}
                title={filterBy !== "" || sortBy !== 1 ? "Filtering" : "Filter"}
              >
                <BiFilter
                  className={`h-7 w-7                 ${
                    filterBy !== "" ||
                    sortBy !== 1 ||
                    date.startDate !== "" ||
                    date.endDate !== todayNepaliDate(new Date())
                      ? "text-[#00684a96] animate-pulse"
                      : "text-gray-400"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-4">
        <Button
          half={1}
          roundedSmall={true}
          active={!onlyDraft}
          inActive={onlyDraft}
          onClick={() => handleShowDraft(false)}
        >
          All Transaction
        </Button>
        <Button
          half={1}
          roundedSmall={true}
          onClick={() => handleShowDraft(true)}
          active={onlyDraft}
          inActive={!onlyDraft}
        >
          Draft Transaction
        </Button>
      </div>
      <TransactionByID
        data={data}
        name={true}
        initLoading={initLoading}
        pageCount={pageCount}
        currentPage={page}
        pagination={true}
      />
    </>
  );
}

export default InvoiceTable;
