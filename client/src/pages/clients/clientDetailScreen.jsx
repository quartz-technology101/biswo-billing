import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import { useParams } from "react-router-dom";
import PaymentIn from "../../components/Clients/clientDetail/paymentIn";
import TransactionByID from "../../components/Clients/clientDetail/transactionByID";
import PageTitle from "../../components/Common/PageTitle";
import { IoIosCall, IoIosArrowForward } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  getByTransactionID,
  getTransactionDetailByIDSelector,
  getTransactionPageNumberSelector,
  getTransactionStatusSelector,
} from "../../stateManagement/slice/transactionSlice";
import EmptyBar from "../../components/Common/EmptyBar";
import {
  getClientDetails,
  getClientDetailsSelector,
  setClientDetails,
  setDeleteId,
  setEditedId,
} from "../../stateManagement/slice/clientSlice";
import Button from "../../components/Button/Button";
import {
  getInvoiceNewForm,
  updateNewInvoiceForm,
} from "../../stateManagement/slice/invoiceSlice";
import { useNavigate } from "react-router-dom";

const ClientDetailScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultTdContent =
    "w-full flex flex-wrap flex-row items-center justify-start text-default-color font-title text-[12px] sm:text-base my-1";

  const defaultTdContentSecond =
    "w-full flex flex-wrap flex-row items-center justify-center text-default-color font-title text-[11px] text-gray-600 sm:text-base";
  4;

  const clientDetailArray = [
    {
      title: "Mail",
      Icon: MdEmail,
    },
    {
      title: "Call",
      Icon: IoIosCall,
    },
    {
      title: "SMS",
      Icon: IoMdNotifications,
    },
    {
      title: "Map",
      Icon: FaMapMarkerAlt,
    },
  ];

  const handleDelete = useCallback(
    (item) => {
      dispatch(setDeleteId(item._id));
    },
    [dispatch]
  );

  const handleEdit = useCallback(
    (item) => {
      dispatch(setEditedId(item._id));
    },
    [dispatch]
  );
  const clientDetail = useSelector(getClientDetailsSelector);
  const newInvoiceForm = useSelector(getInvoiceNewForm);
  const initLoading = useSelector(getTransactionStatusSelector);
  const data = useSelector(getTransactionDetailByIDSelector);
  const page = useSelector(getTransactionPageNumberSelector);
  React.useEffect(() => {
    dispatch(getByTransactionID({ id: id, page: page }));
  }, [id, dispatch]);
  React.useEffect(() => {
    dispatch(getClientDetails(id));
    return () => {
      dispatch(setClientDetails(null));
    };
  }, [id, dispatch]);
  return (
    <div>
      <div className="py-2 px-6 sm:pl-6 sm:pr-2 capitalize flex justify-between items-center">
        <PageTitle title={`${clientDetail?.name || "Client Detail"}`} />
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
          <MenuItem onClick={() => handleEdit(clientDetail)}>Edit</MenuItem>
          <MenuItem onClick={() => handleDelete(clientDetail)}>Delete</MenuItem>
        </Menu>
      </div>
      <div className="flex flex-wrap mb-1">
        <div className="w-full lg:w-4/6 px-4 mb-4 sm:mb-2">
          <div className="w-full mb-4 sm:mb-1">
            {data?.length <= 0 || initLoading === "loading" ? (
              <EmptyBar title={"No Data Found"} initLoading={initLoading} />
            ) : (
              <div className="bg-white rounded-xl p-2">
                <div className="flex flex-wrap gap-4 p-2">
                  <div className="flex-col flex-1">
                    <div className={defaultTdContent}>
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden capitalize text-[14px] sm:text-[18px]">
                        {clientDetail?.totalAmountToPay < 0
                          ? "To Pay"
                          : clientDetail?.totalAmountToPay > 0
                          ? "To Receive"
                          : "Settled"}
                      </span>
                    </div>
                    <div className={defaultTdContent}>
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden text-green-600">
                        Rs. {clientDetail?.totalAmountToPay}
                      </span>
                    </div>
                  </div>
                  {clientDetailArray?.map((item, index) => (
                    <div
                      className="flex-col flex-2 cursor-pointer mt-0.5"
                      key={index}
                      onClick={() => {
                        if (item.title === "Map") {
                          window.open(
                            `https://www.google.com/maps/place/${clientDetail?.billingAddress}`,
                            "_blank"
                          );
                        }
                        if (item.title === "Call") {
                          window.open(
                            `tel:${clientDetail?.mobileNo}`,
                            "_blank"
                          );
                        }
                        if (item.title === "Mail") {
                          window.open(
                            `mailto:${clientDetail?.email}`,
                            "_blank"
                          );
                        }
                        if (item.title === "SMS") {
                          window.open(
                            `sms:${clientDetail?.mobileNo}`,
                            "_blank"
                          );
                        }
                      }}
                    >
                      <div className={defaultTdContentSecond}>
                        <span className="h-6 w-6 sm:h-8 sm:w-8 rounded-2xl bg-green-100 flex justify-center items-center bg-blend-darken">
                          <item.Icon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                        </span>
                      </div>
                      <div className={defaultTdContentSecond}>
                        <span className="whitespace-nowrap pt-1 text-ellipsis overflow-hidden capitalize text-[11px] sm:text-[14px]">
                          {item.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <hr />
                <div className="flex flex-wrap pt-3 gap-2 text-[13px] sm:text-[15px] text-green-700 items-center justify-center cursor-pointer">
                  <div>View Report</div>
                  <div>
                    <IoIosArrowForward className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="py-2 px-2">
            <PageTitle title="All Transactions" />
          </div>
          <div className="w-full mb-4 sm:mb-1">
            <TransactionByID
              data={data}
              name={false}
              initLoading={initLoading}
            />
          </div>
        </div>
        <div className="w-full lg:w-2/6 pl-4 pr-4 sm:pl-4 sm:pr-2">
          <PaymentIn />
          <div className="py-2 px-4 bg-white rounded-xl mt-2">
            <Button
              onClick={() => {
                dispatch(
                  updateNewInvoiceForm({
                    ...newInvoiceForm,
                    clientDetail: clientDetail,
                  })
                );
                navigate("/invoices/new");
              }}
              block={1}
            >
              <span className="inline-block"> Sell Products </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailScreen;
