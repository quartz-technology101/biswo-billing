import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../components/Common/PageTitle";
import {
  getTransactionByProduct,
  getTransactionDetailByProductIDSelector,
  getTransactionPageCountProductSelector,
  getTransactionPageNumberProductSelector,
  getTransactionStatusSelector,
  setPageNumberProduct,
} from "../../stateManagement/slice/transactionSlice";
import EmptyBar from "../../components/Common/EmptyBar";
import {
  getProductById,
  setEditedId,
  getProductByIdSelector,
} from "../../stateManagement/slice/productSlice";
import TransactionByProductID from "../../components/Product/ProductTransactionData";
import AddStock from "../../components/Product/AddStock";
import Button from "../../components/Button/Button";
import Pagination from "../../components/Pagination";

const ProductDetailScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const handleAction = useCallback(
    (item) => {
      dispatch(setEditedId(item._id));
    },
    [dispatch, id]
  );

  const data = useSelector(getTransactionDetailByProductIDSelector);
  const productDetails = useSelector(getProductByIdSelector);
  const page = useSelector(getTransactionPageNumberProductSelector);
  const pageCount = useSelector(getTransactionPageCountProductSelector);
  const initLoading = useSelector(getTransactionStatusSelector);
  React.useEffect(() => {
    dispatch(getTransactionByProduct({ page: page, id: id }));
  }, [id, dispatch, page]);
  React.useEffect(() => {
    dispatch(getProductById(id));
  }, [id, dispatch]);
  const [viewMore, setViewMore] = React.useState(false);
  const [isAdd, setIsAdd] = React.useState(true);
  const {
    secondaryUnit,
    price,
    purchasePrice,
    quantity,
    category,
    primaryUnit,
    stockValue = quantity * price,
    brand,
    lowQuantityAlert,
    remarks,
  } = productDetails || {
    title: "",
    brand: "",
    price: "",
    purchasePrice: "",
    quantity: "",
    category: "",
    primaryUnit: "",
    secondaryUnit: "",
    stockValue: "",
    lowQuantityAlert: "",
    remarks: "",
  };
  const defaultTdContent =
    "text-left text-default-color font-title text-[12px] sm:text-base";

  const defaultTdContentSecond =
    "text-right text-default-color font-title text-[12px] text-gray-600 sm:text-base";
  4;
  return (
    <div>
      <div className="py-4 px-6 sm:pl-6 sm:pr-2 capitalize flex justify-between items-center">
        <PageTitle title={`Product ${productDetails?.title || " Detail"}`} />
        <Menu
          menuButton={
            <MenuButton>
              <div className="bg-gray-50 px-2 rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#00684a9c]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              </div>
            </MenuButton>
          }
          transition
        >
          <MenuItem onClick={() => handleAction(productDetails)}>
            Action
          </MenuItem>
        </Menu>
      </div>
      <div className="flex flex-wrap mb-1">
        <div className="w-full lg:w-4/6 px-4 mb-4 sm:mb-2">
          <div className="w-full mb-4 sm:mb-1">
            {productDetails === null ? (
              <EmptyBar title={"No Data Found"} initLoading={initLoading} />
            ) : (
              <div className="bg-white rounded-xl p-2">
                <div className="flex flex-wrap justify-between items-center p-2">
                  <div className="flex-col">
                    <div className={defaultTdContent}>
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden capitalize text-[12px] sm:text-[16px]">
                        Sales Price
                      </span>
                    </div>
                    <div className={defaultTdContent}>
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden text-green-600">
                        Rs. {price}
                      </span>
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className={defaultTdContent}>
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden capitalize text-[12px] sm:text-[16px]">
                        Purchase Price
                      </span>
                    </div>
                    <div className={defaultTdContent}>
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden text-green-600">
                        Rs. {purchasePrice}
                      </span>
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className={defaultTdContent}>
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden capitalize text-[12px] sm:text-[16px]">
                        Quantity
                      </span>
                    </div>
                    <div className={defaultTdContentSecond}>
                      <span
                        className={`whitespace-nowrap text-ellipsis overflow-hidden  ${
                          quantity <= lowQuantityAlert
                            ? " text-red-500 "
                            : " text-green-600 "
                        }`}
                      >
                        {quantity?.toFixed(2)} {primaryUnit}
                      </span>
                    </div>
                  </div>
                </div>
                {viewMore && (
                  <>
                    <div className="flex flex-wrap justify-between items-center p-2">
                      <div className="flex-col">
                        <div className={defaultTdContent}>
                          <span className="whitespace-nowrap text-ellipsis overflow-hidden capitalize text-[12px] sm:text-[16px]">
                            Brand
                          </span>
                        </div>
                        <div className={defaultTdContent}>
                          <span className="whitespace-nowrap text-ellipsis capitalize overflow-hidden text-green-600">
                            {brand ? brand.split(" ")[0] : "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="flex-col pr-6">
                        <div className={defaultTdContent}>
                          <span className="whitespace-nowrap text-ellipsis overflow-hidden capitalize text-[12px] sm:text-[16px]">
                            Category
                          </span>
                        </div>
                        <div className={defaultTdContent}>
                          <span className="whitespace-nowrap text-ellipsis overflow-hidden text-green-600">
                            {category}
                          </span>
                        </div>
                      </div>
                      <div className="flex-col">
                        <div className={defaultTdContent}>
                          <span className="whitespace-nowrap text-ellipsis overflow-hidden capitalize text-[12px] sm:text-[16px]">
                            S. Unit
                          </span>
                        </div>
                        <div className={defaultTdContentSecond}>
                          <span className="whitespace-nowrap text-ellipsis overflow-hidden text-green-600">
                            {secondaryUnit ? secondaryUnit : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between  gap-4 p-2">
                      <div className="flex-col">
                        <div className={defaultTdContent}>
                          <span className="whitespace-nowrap text-ellipsis overflow-hidden capitalize text-[12px] sm:text-[16px]">
                            Stock Value
                          </span>
                        </div>
                        <div className={defaultTdContentSecond}>
                          <span className="whitespace-nowrap text-ellipsis overflow-hidden text-green-600">
                            Rs. {stockValue?.toFixed(1)} /-
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <hr />
                <div className="flex flex-wrap pt-3 gap-2 text-[12px] sm:text-[15px] text-green-700 items-center justify-center cursor-pointer">
                  <div onClick={() => setViewMore(!viewMore)}>
                    See {viewMore ? "less" : "more"} Details
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="w-full my-4 sm:mb-1">
            <TransactionByProductID
              data={data}
              initLoading={initLoading}
              id={id}
            />
            {data && initLoading === "idle" && (
              <Pagination
                pageCount={pageCount}
                currentPage={page}
                setPageNumber={setPageNumberProduct}
              />
            )}
          </div>
        </div>
        <div className="w-full lg:w-2/6 pl-4 pr-4 sm:pl-4 sm:pr-2">
          {(productDetails !== null || initLoading !== "loading") && (
            <div className="md:px-1 mb-4 sm:mb-2 flex gap-3">
              <Button
                onClick={() => setIsAdd(true)}
                size="sm"
                half={1}
                active={isAdd === true}
                inActive={isAdd === false}
              >
                <div className="flex items-center gap-2">Add Stock</div>
              </Button>
              <Button
                onClick={() => setIsAdd(false)}
                size="sm"
                half={1}
                danger={1}
                active={isAdd === false}
                inActive={isAdd === true}
              >
                <div className="flex items-center gap-2">Reduce Stock</div>
              </Button>
            </div>
          )}
          <div className="mb-2">
            <AddStock isAdd={isAdd} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailScreen;
