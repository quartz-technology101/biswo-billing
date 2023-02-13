import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ClientTable from "../../components/Clients/ClientTable";
import PageTitle from "../../components/Common/PageTitle";
import QuickAddClient from "../../components/Dashboard/QuickAddClient";
import {
  getAllCustomer,
  getAllClientsSelector,
  getClientPageNumberSelector,
  getClientPageCountSelector,
  setClientPageNumber,
  getClientSearchBySelector,
  getClientFilterBySelector,
  getClientSortBySelector,
  setClientFilterBy,
  setClientSearchBy,
  setClientSortBy,
} from "../../stateManagement/slice/clientSlice";

function ClientListScreen() {
  const dispatch = useDispatch();
  const allClients = useSelector(getAllClientsSelector);
  const searchBy = useSelector(getClientSearchBySelector);
  const filterBy = useSelector(getClientFilterBySelector);
  const sortBy = useSelector(getClientSortBySelector);
  const page = useSelector(getClientPageNumberSelector);
  const pageCount = useSelector(getClientPageCountSelector);
  React.useEffect(() => {
    if (allClients.length === 0 || page) {
      dispatch(
        getAllCustomer({
          page: page,
          searchBy: searchBy,
          filterBy: filterBy,
          sortBy: sortBy,
        })
      );
    }
  }, [dispatch, allClients.length, page, searchBy, filterBy, sortBy]);
  return (
    <div>
      <div className="p-4">
        <PageTitle title="Customer List" />
      </div>

      <div className="flex flex-wrap">
        <div className="w-full lg:w-4/6 px-4 mb-2 sm:mb-2">
          <ClientTable
            showAdvanceSearch
            data={allClients}
            pageCount={pageCount}
            currentPage={page}
            setPageNumber={setClientPageNumber}
            searchBy={searchBy}
            filterBy={filterBy}
            sortBy={sortBy}
            setClientFilterBy={setClientFilterBy}
            setClientSearchBy={setClientSearchBy}
            setClientSortBy={setClientSortBy}
          />
        </div>
        <div className="w-full lg:w-2/6 px-4 mb-4 sm:mb-2">
          <QuickAddClient />
        </div>
      </div>
    </div>
  );
}

export default ClientListScreen;
