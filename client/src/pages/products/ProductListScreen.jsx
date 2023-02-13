import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../../components/Common/PageTitle";
import ProductTable from "../../components/Product/ProductTable";
import QuickAddProduct from "../../components/Product/QuickAddProduct";
import {
  getAllProducts,
  getAllProductSelector,
  getProductPageCountSelector,
  getProductPageNumberSelector,
  setProductPageNumber,
  getProductStatus,
  getProductSearchBySelector,
  getProductFilterBySelector,
  getProductSortBySelector,
} from "../../stateManagement/slice/productSlice";

function ProductListScreen() {
  const dispatch = useDispatch();
  const allProducts = useSelector(getAllProductSelector);
  const initLoading = useSelector(getProductStatus);
  const page = useSelector(getProductPageNumberSelector);
  const pageCount = useSelector(getProductPageCountSelector);
  const searchBy = useSelector(getProductSearchBySelector);
  const filterBy = useSelector(getProductFilterBySelector);
  const sortBy = useSelector(getProductSortBySelector);
  const [pageNumber, setPageNumber] = React.useState(page);
  React.useEffect(() => {
    if (allProducts.length === 0 || page || page !== pageNumber) {
      setPageNumber(page);
      dispatch(
        getAllProducts({
          page: page,
          searchBy: searchBy,
          filterBy: filterBy,
          sortBy: sortBy,
        })
      );
    }
  }, [dispatch, allProducts.length, page, searchBy, filterBy, sortBy]);
  return (
    <div className="overflow-hidden">
      <div className="p-4">
        <PageTitle title="Products" />
      </div>

      <div className="flex flex-wrap">
        <div className="w-full lg:w-4/6 px-4 mb-2 sm:mb-2">
          <ProductTable
            showAdvanceSearch
            allProducts={allProducts}
            initLoading={initLoading}
            pageCount={pageCount}
            currentPage={page}
            setPageNumber={setProductPageNumber}
            searchBy={searchBy}
            filterBy={filterBy}
            sortBy={sortBy}
          />
        </div>
        <div className="w-full lg:w-2/6 px-4 mb-4 sm:mb-2">
          <QuickAddProduct />
        </div>
      </div>
    </div>
  );
}

export default ProductListScreen;
