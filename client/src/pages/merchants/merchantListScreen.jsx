import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ClientTable from "../../components/Clients/ClientTable";
import PageTitle from "../../components/Common/PageTitle";
import QuickAddClient from "../../components/Dashboard/QuickAddClient";
import {
  getAllMerchant,
  getAllMerchantsSelector,
  getMerchantFilterBySelector,
  getMerchantPageCountSelector,
  getMerchantPageNumberSelector,
  getMerchantSearchBySelector,
  getMerchantSortBySelector,
  setMerchantPageNumber,
  setMerchantFilterBy,
  setMerchantSearchBy,
  setMerchantSortBy,
} from "../../stateManagement/slice/clientSlice";

function MerchantListScreen() {
  const dispatch = useDispatch();
  const allMerchant = useSelector(getAllMerchantsSelector);
  const searchBy = useSelector(getMerchantSearchBySelector);
  const filterBy = useSelector(getMerchantFilterBySelector);
  const sortBy = useSelector(getMerchantSortBySelector);
  const page = useSelector(getMerchantPageNumberSelector);
  const pageCount = useSelector(getMerchantPageCountSelector);
  const [pageNumber, setPageNumber] = React.useState(page);
  React.useEffect(() => {
    if (allMerchant.length === 0 || page || page !== pageNumber) {
      setPageNumber(page);
      dispatch(
        getAllMerchant({
          page: page,
          searchBy: searchBy,
          filterBy: filterBy,
          sortBy: sortBy,
        })
      );
    }
  }, [dispatch, allMerchant.length, page, searchBy, filterBy, sortBy]);
  return (
    <div>
      <div className="p-4">
        <PageTitle title="Merchant List" />
      </div>

      <div className="flex flex-wrap">
        <div className="w-full lg:w-4/6 px-4 mb-2 sm:mb-2">
          <ClientTable
            showAdvanceSearch
            data={allMerchant}
            merchant={true}
            pageCount={pageCount}
            currentPage={page}
            setPageNumber={setMerchantPageNumber}
            searchBy={searchBy}
            filterBy={filterBy}
            sortBy={sortBy}
            setClientFilterBy={setMerchantFilterBy}
            setClientSearchBy={setMerchantSearchBy}
            setClientSortBy={setMerchantSortBy}
          />
        </div>
        <div className="w-full lg:w-2/6 px-4 mb-4 sm:mb-2">
          <QuickAddClient merchant={true} />
        </div>
      </div>
    </div>
  );
}

export default MerchantListScreen;
