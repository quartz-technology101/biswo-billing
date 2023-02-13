import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";
import { toast } from "react-toastify";
import domtoimage from "dom-to-image";
import InvoiceTopBar from "../../components/Invoice/InvoiceTopBar";
import {
  getAllInvoiceDetailSelector,
  getInvoiceStatusSelector,
  getInvoiceNewForm,
  getIsConfirm,
  setIsConfirm,
  createNewInvoice,
  updatedInvoice,
  updateNewInvoiceForm,
  getByIdInvoice,
  setDeleteId,
  setAllInvoiceDetailList,
} from "../../stateManagement/slice/invoiceSlice";
import {
  getSelectedMerchant,
  setOpenMerchantSelector,
} from "../../stateManagement/slice/clientSlice";
import {
  getSelectedProduct,
  setOpenProductSelector,
} from "../../stateManagement/slice/productSlice";
import {
  setToggleNavbar as toggleNavbar,
  setEscapeOverflow,
  getShowNavbar,
} from "../../stateManagement/slice/InitialMode";
import { getCompanyData } from "../../stateManagement/slice/companySlice";
import { defaultInputSmStyle, IconStyle } from "../../constants/defaultStyles";
import Button from "../../components/Button/Button";
import ClientPlusIcon from "../../components/Icons/ClientPlusIcon";
import InvoiceIcon from "../../components/Icons/InvoiceIcon";
import PlusCircleIcon from "../../components/Icons/PlusCircleIcon";
import { nanoid } from "nanoid";
import DeleteIcon from "../../components/Icons/DeleteIcon";
import TaxesIcon from "../../components/Icons/TaxesIcon";
import DollarIcon from "../../components/Icons/DollarIcon";
import CheckCircleIcon from "../../components/Icons/CheckCircleIcon";
import SecurityIcon from "../../components/Icons/SecurityIcon";
import {
  getTotalTaxesWithPercent,
  minusTotalDiscountAmount,
  sumProductTotal,
  sumTotalTaxes,
} from "../../utils/match";
import PageTitle from "../../components/Common/PageTitle";
import { ChooseUnit } from "../../components/Product/dropdown";
import EmptyBar from "../../components/Common/EmptyBar";
import MyToggleButton from "../../components/Common/toggleButton";
import PrintPurchase from "./printPurchase";
import NepaliDatePicker from "../../components/Common/NepaliDatePicker";
import { todayNepaliDate } from "../../components/Common/todayNepaliDate";

function PurchaseDetailScreen(props) {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showNavbar = useSelector(getShowNavbar);

  const componentRef = useRef(null);

  const invoiceNewForm = useSelector(getInvoiceNewForm);
  const allInvoiceDetails = useSelector(getAllInvoiceDetailSelector);
  const initLoading = useSelector(getInvoiceStatusSelector);
  const company = useSelector(getCompanyData);
  const selectedMerchant = useSelector(getSelectedMerchant);
  const selectedProduct = useSelector(getSelectedProduct);
  const isConfirm = useSelector(getIsConfirm);

  const [invoiceForm, setInvoiceForm] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeUnit, setActiveUnit] = useState("");

  const handleDownloadImg = useCallback(async () => {
    if (showNavbar) {
      dispatch(toggleNavbar());
    }
    dispatch(setEscapeOverflow(true));
    setIsViewMode(true);

    // make componentRef.current margin to 0
    componentRef.current.style.margin = "0";
    componentRef.current.style.borderRadius = "0";
    domtoimage
      .toJpeg(componentRef.current, { quality: 1 })
      .then(async (dataUrl) => {
        try {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          let a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "invoice.jpeg";
          a.hidden = true;
          document.body.appendChild(a);
          a.click();
          a.remove();
        } finally {
          componentRef.current.style.margin = "auto";
          componentRef.current.style.borderRadius = "0.5rem";
          dispatch(setEscapeOverflow(false));
        }
      });
  }, [setEscapeOverflow, showNavbar, toggleNavbar, dispatch]);

  const toggleViewMode = useCallback(() => {
    setIsViewMode((prev) => !prev);
  }, [invoiceForm, isViewMode]);

  const openChooseMerchant = useCallback(() => {
    dispatch(setOpenMerchantSelector(true));
  }, [dispatch]);

  const openChooseProduct = useCallback(() => {
    if (invoiceForm?.products?.length >= 30) {
      toast.warn("You can't add more than 30 products", {
        position: "bottom-center",
        autoClose: 3000,
      });
      return;
    }
    dispatch(setOpenProductSelector(true));
  }, [dispatch, invoiceForm]);

  const addEmptyProduct = useCallback(() => {
    if (invoiceForm?.products?.length >= 30) {
      toast.warn("You can't add more than 30 products", {
        position: "bottom-center",
        autoClose: 3000,
      });
      return;
    }
    const emptyProduct = {
      id: nanoid(),
      name: "Empty Product",
      productID: "",
      amount: 100,
      quantity: 1,
    };

    setInvoiceForm((prev) => {
      let updatedData = { ...prev };
      const updateProducts = [...prev.products, emptyProduct];
      const subTotalAmount = sumProductTotal(updateProducts);
      const updateTaxes = getTotalTaxesWithPercent(prev.taxes, subTotalAmount);
      updatedData.products = updateProducts;
      updatedData.taxes = updateTaxes;
      updatedData.totalAmount = minusTotalDiscountAmount(
        subTotalAmount,
        sumTotalTaxes(updateTaxes)
      );
      return updatedData;
    });
  }, [invoiceForm]);

  const onDeleteProduct = useCallback((prodID) => {
    setInvoiceForm((prev) => {
      let updatedData = { ...prev };
      const updateProducts = prev.products.filter((prod) => prod.id !== prodID);
      const subTotalAmount = sumProductTotal(updateProducts);
      const updateTaxes = getTotalTaxesWithPercent(prev.taxes, subTotalAmount);
      updatedData.products = updateProducts;
      updatedData.taxes = updateTaxes;
      updatedData.totalAmount = minusTotalDiscountAmount(
        subTotalAmount,
        sumTotalTaxes(updateTaxes)
      );
      return updatedData;
    });
  }, []);

  const handlerInvoiceValue = useCallback((event, keyName) => {
    const value =
      typeof event === "string" ? new Date(event) : event?.target?.value;

    setInvoiceForm((prev) => {
      return { ...prev, [keyName]: value };
    });
  }, []);

  const handlerProductValue = useCallback(
    (event, keyName, productID, maxValue) => {
      const value = event.target.value;

      if ((keyName === "quantity" || keyName === "amount") && value <= -1) {
        return;
      }

      if (keyName === "quantity") {
        const isFindIndex = invoiceForm.products.findIndex(
          (prod) => prod.id === productID
        );
        const product = invoiceForm.products[isFindIndex];
        if (product.isSecondaryUnitChecked) {
          const secondaryMaxValue =
            product.maxQuantity * product.conversionRatio;
          if (value > secondaryMaxValue) {
            toast.warn("Stock is not enough", {
              position: "bottom-center",
              autoClose: 3000,
            });
            return;
          }
        } else {
          if (value > maxValue) {
            toast.warn("Stock is not enough", {
              position: "bottom-center",
              autoClose: 3000,
            });
            return;
          }
        }
      }

      let updatedData = { ...invoiceForm };
      let updateProducts = [...invoiceForm.products];

      const isFindIndex = updateProducts.findIndex(
        (prod) => prod.id === productID
      );

      if (isFindIndex !== -1) {
        updateProducts[isFindIndex] = {
          ...updateProducts[isFindIndex],
          [keyName]: value,
        };

        updatedData.products = [...updateProducts];
      }

      if (keyName === "quantity" || keyName === "amount") {
        const subTotalAmount = sumProductTotal(updateProducts);
        const updateTaxes = getTotalTaxesWithPercent(
          invoiceForm.taxes,
          subTotalAmount
        );
        updatedData.taxes = updateTaxes;
        updatedData.totalAmount = minusTotalDiscountAmount(
          subTotalAmount,
          sumTotalTaxes(updateTaxes)
        );
      }
      setInvoiceForm(updatedData);
    },
    [invoiceForm]
  );

  const handlerTaxesValue = useCallback(
    (event, keyName, taxID) => {
      const value = event.target.value;
      let updateTaxes = [...invoiceForm.taxes];
      const isFindIndex = updateTaxes.findIndex((prod) => prod.id === taxID);
      const currentTax = updateTaxes[isFindIndex];

      if (currentTax.type === "percentage" && keyName === "value") {
        if (value <= -1 || value > 100) {
          return toast.warn("Discount amount must be between 0 to 100", {
            position: "bottom-center",
            autoClose: 3000,
          });
        }
      }

      if (currentTax.type === "flat" && keyName === "value") {
        if (value <= -1 || value > 100000) {
          return toast.warn("Amount must be between 0 to 100000", {
            position: "bottom-center",
            autoClose: 3000,
          });
        }
      }

      setInvoiceForm((prev) => {
        let taxes = [...prev.taxes];

        if (keyName === "value") {
          const subTotalAmount = sumProductTotal(prev.products);
          const amount = (value / 100) * subTotalAmount;
          taxes[isFindIndex] = {
            ...taxes[isFindIndex],
            [keyName]: value,
            amount: currentTax.type !== "percentage" ? value : amount,
          };
          const totalAmount = minusTotalDiscountAmount(
            subTotalAmount,
            sumTotalTaxes(taxes)
          );
          return { ...prev, taxes: taxes, totalAmount: totalAmount };
        } else {
          taxes[isFindIndex] = {
            ...taxes[isFindIndex],
            [keyName]: value,
          };
          return { ...prev, taxes: taxes };
        }
      });
    },
    [invoiceForm]
  );

  const handlerInvoiceClientValue = useCallback((event, keyName) => {
    const value =
      typeof event === "string" ? new Date(event) : event?.target?.value;
    if (keyName === "name" && value.length >= 15) {
      return toast.warn("Name must be less than 15 characters", {
        position: "bottom-center",
        autoClose: 3000,
      });
    }
    setInvoiceForm((prev) => {
      return {
        ...prev,
        clientDetail: { ...prev.clientDetail, [keyName]: value },
      };
    });
  }, []);

  // Calculation for Showing
  const subTotal = useMemo(() => {
    if (!invoiceForm) {
      return 0;
    }

    if (!invoiceForm?.products) {
      return 0;
    }
    return sumProductTotal(invoiceForm.products);
  }, [invoiceForm]);

  const totalPercentTax = useMemo(() => {
    const isSomeTax = invoiceForm?.taxes?.some(
      (tax) => tax.type === "percentage"
    );

    if (!isSomeTax) {
      return 0;
    }

    const findIndex = invoiceForm?.taxes?.findIndex(
      (tax) => tax.type === "percentage"
    );

    return findIndex !== -1
      ? Number.isInteger(invoiceForm.taxes[findIndex].amount)
        ? invoiceForm.taxes[findIndex].amount
        : invoiceForm.taxes[findIndex].amount.toFixed(4).toString().slice(0, -2)
      : 0;
  }, [invoiceForm]);

  const addPercentageTax = useCallback(() => {
    const isSomeTaxes = invoiceForm.taxes.some(
      (form) =>
        form.uniqueTitle === "Discount By Amount" || form.type === "percentage"
    );
    if (isSomeTaxes) {
      toast.error("Already Have Add Discount", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }

    setInvoiceForm((prev) => {
      const subTotalAmount = sumProductTotal(prev.products);
      const amount = (10 / 100) * subTotalAmount;
      const percentageTax = {
        id: nanoid(),
        uniqueTitle: "Discount %",
        title: "Discount %",
        type: "percentage",
        value: 10,
        amount,
      };
      const updateTaxes = [percentageTax, ...prev.taxes];
      const totalAmount = minusTotalDiscountAmount(
        subTotalAmount,
        sumTotalTaxes(updateTaxes)
      );

      return {
        ...prev,
        taxes: updateTaxes,
        totalAmount: totalAmount,
      };
    });
  }, [invoiceForm]);

  const addEmptyTax = useCallback(() => {
    const isSomeTaxes = invoiceForm.taxes.some(
      (form) =>
        form.uniqueTitle === "Discount By Amount" || form.type === "percentage"
    );
    if (isSomeTaxes) {
      toast.error("Already Have Add Discount", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }
    setInvoiceForm((prev) => {
      const subTotalAmount = sumProductTotal(prev.products);
      const emptyTax = {
        id: nanoid(),
        uniqueTitle: "Discount By Amount",
        title: "Discount (AMT)",
        type: "flat",
        value: 1,
        amount: 1,
      };
      const updateTaxes = [...prev.taxes, emptyTax];
      const totalAmount = minusTotalDiscountAmount(
        subTotalAmount,
        sumTotalTaxes(updateTaxes)
      );
      return { ...prev, taxes: updateTaxes, totalAmount };
    });
  }, [invoiceForm]);

  const addExtraFee = useCallback(() => {
    const isSomeTaxes = invoiceForm.taxes.some(
      (form) => form.uniqueTitle === "Extra Fee"
    );
    if (isSomeTaxes) {
      toast.error("Already Have Add Extra Fee", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }
    setInvoiceForm((prev) => {
      const subTotalAmount = sumProductTotal(prev.products);
      const emptyTax = {
        id: nanoid(),
        uniqueTitle: "Extra Fee",
        title: "Extra Fee",
        type: "flat",
        value: 1,
        amount: 1,
      };
      const updateTaxes = [...prev.taxes, emptyTax];
      const totalAmount = minusTotalDiscountAmount(
        subTotalAmount,
        sumTotalTaxes(updateTaxes)
      );
      return { ...prev, taxes: updateTaxes, totalAmount };
    });
  }, [invoiceForm]);

  const onDeleteTax = useCallback((taxID) => {
    setInvoiceForm((prev) => {
      const updateTaxes = prev.taxes.filter((prod) => prod.id !== taxID);
      let updatedData = { ...prev, taxes: updateTaxes };
      const subTotalAmount = sumProductTotal(prev.products);
      const totalAmount = minusTotalDiscountAmount(
        subTotalAmount,
        sumTotalTaxes(updateTaxes)
      );
      updatedData.totalAmount = totalAmount;
      return updatedData;
    });
  }, []);

  const saveAs = useCallback(
    (status) => {
      if (invoiceForm?.clientDetail?._id) {
        if (!invoiceForm?.clientDetail?.name) {
          return toast.error("Client name is required", {
            position: "bottom-center",
            autoClose: 2000,
          });
        }
      }
      if (invoiceForm?.paidAmount > invoiceForm?.totalAmount) {
        return toast.warn("Paid amount can't be greater than total amount", {
          position: "bottom-center",
          autoClose: 2000,
        });
      }
      setInvoiceForm((prev) => {
        return {
          ...prev,
          statusName: status,
          statusIndex:
            status === "Draft"
              ? "1"
              : status === "Unpaid"
              ? "2"
              : status === "Paid"
              ? "3"
              : "4",
        };
      });
      dispatch(setIsConfirm(true));
    },
    [invoiceForm?.clientDetail?.name, invoiceForm?.statusName, dispatch]
  );
  const goInvoiceList = useCallback(() => {
    navigate("/transactions");
  }, [navigate]);

  useEffect(() => {
    if (isConfirm) {
      dispatch(setIsConfirm(false));
      if (params.id !== "new") {
        dispatch(updatedInvoice(invoiceForm));
      } else {
        dispatch(
          createNewInvoice({
            ...invoiceForm,
            invoiceType: "Purchase",
          })
        );

        setInvoiceForm({
          ...invoiceForm,
          products: [],
          taxes: [],
          totalAmount: 0,
        });
      }
      navigate("/transactions");
    }
  }, [isConfirm, dispatch, invoiceForm, params.id, navigate]);
  useEffect(() => {
    if (params.id === "new" && invoiceForm !== null) {
      dispatch(updateNewInvoiceForm(invoiceForm));
    }
  }, [dispatch, invoiceForm, params]);
  useEffect(() => {
    if (params.id === "new" && invoiceForm === null) {
      setInvoiceForm({
        ...invoiceNewForm,
        companyDetail: { ...company },
        dueDate: "",
        createdDate: todayNepaliDate(new Date()),
      });
    }
    if (params.id !== "new" && invoiceForm === null) {
      dispatch(getByIdInvoice(params.id));
      if (allInvoiceDetails !== null) {
        setInvoiceForm({
          ...allInvoiceDetails,
          companyDetail: { ...allInvoiceDetails?.companyDetail },
          dueDate:
            allInvoiceDetails?.dueDate !== null
              ? allInvoiceDetails?.dueDate.split("T")[0]
              : "",
          createdDate: allInvoiceDetails?.createdDate.split("T")[0],
        });
      }
      setIsViewMode(true);
    }
    return () => {
      dispatch(setAllInvoiceDetailList(null));
    };
  }, [
    params,
    invoiceForm,
    invoiceNewForm,
    company,
    dispatch,
    allInvoiceDetails,
  ]);
  useEffect(() => {
    if (selectedMerchant !== null) {
      // If Choosen Exisiting Client And This form is news
      setInvoiceForm((prev) => {
        return {
          ...prev,
          clientDetail: { ...selectedMerchant },
        };
      });
    }
  }, [selectedMerchant]);
  useEffect(() => {
    if (selectedProduct !== null) {
      const {
        title: name,
        _id: productID,
        price: amount,
        quantity: maxQuantity,
        primaryUnit,
        lowQuantityAlert,
        secondaryUnit,
        conversionRatio,
      } = selectedProduct;
      const newProduct = {
        id: nanoid(),
        name,
        productID,
        amount,
        quantity: 1,
        maxQuantity,
        primaryUnit,
        lowQuantityAlert,
        secondaryUnit,
        prevAmount: amount,
        conversionRatio,
        isSecondaryUnitChecked: false,
      };
      // if the productID is already exist in the invoiceForm.products
      // then we will update the quantity
      const isProductExist = invoiceForm.products.some(
        (prod) => prod.productID === productID
      );
      if (isProductExist) {
        toast.error("Product Already Exist", {
          position: "bottom-center",
          autoClose: 2000,
        });
        return;
      }
      if (maxQuantity <= 0) {
        toast.error("Product is out of stock", {
          position: "bottom-center",
          autoClose: 2000,
        });
        return;
      }
      if (maxQuantity <= lowQuantityAlert) {
        const remainingQuantity = lowQuantityAlert - maxQuantity;
        toast.warn(
          `Stock is low, only ${lowQuantityAlert - remainingQuantity} left`,
          {
            position: "bottom-center",
            autoClose: 2000,
          }
        );
      }
      setInvoiceForm((prev) => {
        let updatedData = { ...prev };
        const updateProducts = [...prev.products, newProduct];
        const subTotalAmount = sumProductTotal(updateProducts);
        const updateTaxes = getTotalTaxesWithPercent(
          prev.taxes,
          subTotalAmount
        );
        updatedData.products = updateProducts;
        updatedData.taxes = updateTaxes;
        updatedData.totalAmount = minusTotalDiscountAmount(
          subTotalAmount,
          sumTotalTaxes(updateTaxes)
        );
        return updatedData;
      });
    }
  }, [selectedProduct]);

  if (invoiceForm === null || initLoading === "loading")
    return (
      <div className="p-4">
        <EmptyBar title={"invoice detail"} initLoading={initLoading} />
      </div>
    );

  return (
    <div>
      <div className="p-4">
        <PageTitle
          title={
            <>
              {params.id === "new"
                ? "New Purchase"
                : `Purchase Detail ${invoiceForm?.statusName || ""}`}
            </>
          }
        />
      </div>
      <div className="px-4 pb-3">
        <InvoiceTopBar
          onClickBack={goInvoiceList}
          viewMode={isViewMode}
          onClickViewAs={toggleViewMode}
          onClickDownloadImg={handleDownloadImg}
          subTotal={subTotal}
          merchant={true}
        />
      </div>

      {invoiceForm && (
        <>
          <div className="relative">
            <PrintPurchase
              invoiceForm={invoiceForm}
              id="InvoiceWrapper"
              isExporting={isExporting}
              isViewMode={isViewMode}
              componentRef={componentRef}
            />
          </div>
          <div
            className={isViewMode ? "hidden" : "bg-white mx-4 rounded-xl mb-1"}
          >
            {/* Merchant Billing Info */}
            <div
              className={
                isExporting
                  ? "flex flex-row pt-2 px-8"
                  : "flex flex-col sm:flex-row pt-3 px-8"
              }
            >
              <div className="flex-1">
                <div className="flex flex-row">
                  <div className="font-title font-bold">Purchase From </div>
                  <div className="w-1/2 relative ml-3" style={{ top: "-3px" }}>
                    {!isViewMode && (
                      <Button
                        size="sm"
                        outlined={1}
                        onClick={openChooseMerchant}
                      >
                        <ClientPlusIcon className="w-4 h-4" /> Exisiting
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex flex-row w-full justify-between items-center mb-1">
                  <div className="font-title flex-1"> Merchant Name </div>
                  <div className="font-title flex-1 text-right">
                    <input
                      autoComplete="nope"
                      placeholder="Merchant Name"
                      className={
                        defaultInputSmStyle +
                        " sm:text-left sm:w-11/12 md:w-3/4 text-right"
                      }
                      value={
                        invoiceForm?.clientDetail?.name
                          .slice(0, 1)
                          .toUpperCase() +
                        invoiceForm?.clientDetail?.name.slice(1, 15)
                      }
                      onChange={(e) => handlerInvoiceClientValue(e, "name")}
                    />
                  </div>
                </div>
                <div className="flex flex-row w-full justify-between items-center mb-1">
                  <div className="font-title flex-1"> Merchant Number </div>
                  <div className="font-title flex-1 text-right">
                    <input
                      autoComplete="nope"
                      placeholder="Merchant Number"
                      className={
                        defaultInputSmStyle +
                        " sm:text-left sm:w-11/12 md:w-3/4 text-right"
                      }
                      value={invoiceForm?.clientDetail?.mobileNo}
                      onChange={(e) => handlerInvoiceClientValue(e, "mobileNo")}
                    />
                  </div>
                </div>
                <div className="flex flex-row w-full justify-between items-center mb-1">
                  <div className="font-title flex-1"> Merchant Address </div>
                  <div className="font-title flex-1 text-right">
                    <input
                      autoComplete="nope"
                      placeholder="Merchant Address"
                      className={
                        defaultInputSmStyle +
                        " sm:text-left sm:w-11/12 md:w-3/4 text-right"
                      }
                      value={invoiceForm?.clientDetail?.billingAddress}
                      onChange={(e) =>
                        handlerInvoiceClientValue(e, "billingAddress")
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-row justify-between items-center mb-1">
                  <div className="font-title flex-1"> Bill No # </div>
                  <div className="font-title flex-1 text-right">
                    <input
                      autoComplete="nope"
                      placeholder="Bill No"
                      className={defaultInputSmStyle + " text-right"}
                      defaultValue={invoiceForm.invoiceNo}
                      onChange={(e) => handlerInvoiceValue(e, "invoiceNo")}
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-between items-center mb-1">
                  <div className="font-title flex-1"> Creation Date </div>
                  <div className="font-title flex-1 text-right">
                    <NepaliDatePicker
                      className={
                        !isViewMode
                          ? defaultInputSmStyle + " border-gray-300 text-right"
                          : " text-right bg-white"
                      }
                      disabled={true}
                      setData={setInvoiceForm}
                      name="createdDate"
                      data={invoiceForm}
                      value={invoiceForm?.createdDate}
                      id={"nepali-datepicker-9"}
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-between items-center mb-1">
                  <div className="font-title flex-1"> Due Date </div>
                  <div className="font-title flex-1 text-right">
                    <NepaliDatePicker
                      className={
                        !isViewMode
                          ? defaultInputSmStyle + " border-gray-300 text-right"
                          : " text-right bg-white"
                      }
                      setData={setInvoiceForm}
                      name="dueDate"
                      data={invoiceForm}
                      value={invoiceForm?.dueDate}
                      id={"nepali-datepicker-10"}
                      disabled={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Merchant Billing Info Finished */}

            {/* Products */}
            <div className="py-2 px-4">
              <div className="font-title font-bold mx-3 sm:hidden">
                Products
              </div>
              <div className="hidden sm:flex rounded-lg invisible sm:visible w-full flex-col sm:flex-row px-4 py-2 text-white bg-[#00684a]">
                <div
                  className={
                    "font-title " +
                    (isExporting
                      ? " text-sm w-1/4 text-right pr-10"
                      : " w-full sm:w-1/4 text-right sm:pr-10")
                  }
                >
                  <span className="inline-block">Description</span>
                </div>
                <div
                  className={
                    "font-title " +
                    (isExporting
                      ? " text-sm  w-1/4 text-right pr-10"
                      : " w-full sm:w-1/4 text-right sm:pr-10")
                  }
                >
                  Price
                </div>
                <div
                  className={
                    "font-title " +
                    (isExporting
                      ? " text-sm  w-1/4 text-right pr-10"
                      : " w-full sm:w-1/4 text-right sm:pr-10")
                  }
                >
                  Qty
                </div>
                <div
                  className={
                    "font-title" +
                    (isExporting
                      ? " text-sm w-1/4 text-right pr-10"
                      : "  w-full sm:w-1/4 text-right sm:pr-10")
                  }
                >
                  Total
                </div>
              </div>
              {invoiceForm?.products?.map((product, index) => (
                <div
                  key={`${index}_${product.id}`}
                  className={
                    (isExporting
                      ? "flex flex-row rounded-lg w-full px-4 py-1 items-center relative text-sm"
                      : "flex flex-col sm:flex-row rounded-lg sm:visible w-full px-4 py-2 items-center relative") +
                    (index % 2 !== 0 ? " bg-gray-50 " : "")
                  }
                >
                  <div
                    className={
                      isExporting
                        ? "font-title w-1/4 text-right pr-8 flex flex-row block"
                        : "font-title w-full sm:w-1/4 text-right sm:pr-8 flex flex-row sm:block"
                    }
                  >
                    {!isExporting && (
                      <span className="sm:hidden w-1/2 flex flex-row items-center">
                        Description
                      </span>
                    )}
                    <span
                      className={
                        isExporting
                          ? "inline-block w-full mb-0"
                          : "inline-block w-1/2 sm:w-full mb-1 sm:mb-0"
                      }
                    >
                      {!isViewMode ? (
                        <input
                          autoComplete="nope"
                          value={product.name}
                          placeholder="Product Name"
                          className={defaultInputSmStyle + " text-right"}
                          onChange={(e) =>
                            handlerProductValue(
                              e,
                              "name",
                              product.id,
                              product?.maxQuantity
                            )
                          }
                        />
                      ) : (
                        <span className="pr-3">{product.name}</span>
                      )}
                    </span>
                  </div>
                  <div
                    className={
                      isExporting
                        ? "font-title w-1/4 text-right pr-8 flex flex-row block"
                        : "font-title w-full sm:w-1/4 text-right sm:pr-8 flex flex-row sm:block"
                    }
                  >
                    {!isExporting && (
                      <span className="sm:hidden w-1/2 flex flex-row items-center">
                        Price
                      </span>
                    )}
                    <span
                      className={
                        isExporting
                          ? "inline-block w-full mb-0"
                          : "inline-block w-1/2 sm:w-full mb-1 sm:mb-0"
                      }
                    >
                      {!isViewMode ? (
                        <input
                          autoComplete="nope"
                          value={product.amount}
                          placeholder="Price"
                          type={"number"}
                          className={defaultInputSmStyle + " text-right"}
                          onChange={(e) =>
                            handlerProductValue(
                              e,
                              "amount",
                              product.id,
                              product?.maxQuantity
                            )
                          }
                        />
                      ) : (
                        <span className="pr-3">
                          <NumericFormat
                            value={product.amount}
                            className=""
                            displayType={"text"}
                            thousandSeparator={true}
                            renderText={(value, props) => (
                              <span {...props}>{value}</span>
                            )}
                          />
                        </span>
                      )}
                    </span>
                  </div>
                  <div
                    className={
                      isExporting
                        ? "font-title w-1/4 text-right pr-8 flex flex-row block"
                        : "font-title w-full sm:w-1/4 text-right sm:pr-8 flex flex-row sm:block"
                    }
                  >
                    {!isExporting && (
                      <span className="sm:hidden w-1/2 flex flex-row items-center">
                        Quantity
                      </span>
                    )}
                    <span
                      className={
                        isExporting
                          ? "inline-block w-full mb-0"
                          : "inline-block w-1/2 sm:w-full mb-1 sm:mb-0"
                      }
                    >
                      {!isViewMode ? (
                        <div className="relative">
                          <input
                            autoComplete="nope"
                            value={product.quantity}
                            type={"number"}
                            placeholder="Quantity"
                            className={
                              product?.secondaryUnit
                                ? defaultInputSmStyle + " text-left pr-16"
                                : defaultInputSmStyle + " text-left"
                            }
                            onChange={(e) =>
                              handlerProductValue(
                                e,
                                "quantity",
                                product.id,
                                product?.maxQuantity
                              )
                            }
                          />
                          {product?.secondaryUnit && (
                            <span
                              className={
                                activeUnit === product?.id
                                  ? `absolute right-1 top-1/2 transform -translate-y-1/2 rounded-xl text-default-color text-[11px] cursor-pointer
                               hover:bg-gray-100 hover:text-default-color z-[1000]`
                                  : `absolute right-1 top-1/2 transform -translate-y-1/2 rounded-xl text-default-color text-[11px] cursor-pointer
                               hover:bg-gray-100 hover:text-default-color`
                              }
                            >
                              <ChooseUnit
                                primaryUnit={product?.primaryUnit}
                                secondaryUnit={product?.secondaryUnit}
                                setInvoiceForm={setInvoiceForm}
                                invoiceForm={invoiceForm}
                                setActiveUnit={setActiveUnit}
                                productID={product.id}
                                subTotal={subTotal}
                              />
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="pr-3">
                          <NumericFormat
                            value={product.quantity}
                            className=""
                            displayType={"text"}
                            thousandSeparator={true}
                            renderText={(value, props) => (
                              <span {...props}>{value}</span>
                            )}
                          />
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="font-title w-full sm:w-1/4 text-right sm:pr-9 flex flex-row sm:block">
                    {!isExporting && (
                      <span className="sm:hidden w-1/2 flex flex-row items-center">
                        Total
                      </span>
                    )}

                    <span className="inline-block w-1/2 sm:w-full">
                      <NumericFormat
                        value={
                          Number.isInteger(product.quantity * product.amount)
                            ? product.quantity * product.amount
                            : (product.quantity * product.amount)
                                .toFixed(4)
                                .toString()
                                .slice(0, -2)
                        }
                        className=""
                        displayType={"text"}
                        thousandSeparator={true}
                        renderText={(value, props) => (
                          <span {...props}>
                            {invoiceForm?.currencyUnit} {value}
                          </span>
                        )}
                      />
                    </span>
                  </div>
                  {!isViewMode && (
                    <div
                      className="w-full sm:w-10 sm:absolute sm:right-0"
                      onClick={() => onDeleteProduct(product.id)}
                    >
                      <div className="w-full text-red-500 font-title h-8 sm:h-8 sm:w-8 cursor-pointer rounded-2xl bg-red-200 mr-2 flex justify-center items-center">
                        <DeleteIcon className="h-4 w-4" style={IconStyle} />
                        <span className="block sm:hidden">Delete Product</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {invoiceForm?.products?.length === 0 && (
                <div className="text-center my-2 text-gray-600">
                  Click on the add product button to add a product
                </div>
              )}
              {/* Add Product Actions */}
              {!isViewMode && (
                <div className="flex flex-col md:flex-row rounded-lg md:visible w-full px-4 py-2 items-center md:justify-end">
                  <div className="font-title w-full md:w-1/3 lg:w-1/4 text-right md:pr-8 flex flex-row md:block mb-1">
                    <Button
                      size="sm"
                      block={1}
                      onClick={openChooseProduct}
                      changeColor={"#00684a"}
                    >
                      <InvoiceIcon style={IconStyle} className="w-5 h-5" />
                      Add Exisiting Product
                    </Button>
                  </div>
                  <div className="font-title w-full md:w-1/3 lg:w-1/4 text-right md:pr-8 flex flex-row md:block mb-1">
                    <Button
                      size="sm"
                      block={1}
                      onClick={addEmptyProduct}
                      changeColor={"#00684a"}
                    >
                      <PlusCircleIcon style={IconStyle} className="h-5 w-5" />
                      Add Empty Product
                    </Button>
                  </div>
                </div>
              )}
              {/* Add Product Actions Finished*/}
              {/* Subtotal Start */}
              {subTotal > 0 && (
                <div
                  className={
                    isExporting
                      ? "flex flex-row rounded-lg w-full px-4 py-1 justify-end items-end relative text-sm"
                      : "flex flex-row sm:flex-row sm:justify-end rounded-lg sm:visible w-full px-4 py-1 items-center "
                  }
                >
                  <div
                    className={
                      isExporting
                        ? "font-title w-1/4 text-right pr-9 flex flex-row block justify-end text-sm "
                        : "font-title w-1/2 sm:w-1/4 text-right sm:pr-8 flex flex-row sm:block mb-1 sm:mb-0"
                    }
                  >
                    Subtotal
                  </div>
                  <div
                    className={
                      isExporting
                        ? "font-title w-1/4 text-right pr-9 flex flex-row block justify-end text-sm "
                        : "font-title w-1/2 sm:w-1/4 text-right sm:pr-9 flex flex-row justify-end sm:block mb-1"
                    }
                  >
                    <NumericFormat
                      value={subTotal}
                      className="inline-block"
                      displayType={"text"}
                      thousandSeparator={true}
                      renderText={(value, props) => (
                        <span {...props}>
                          {invoiceForm?.currencyUnit} {value}
                        </span>
                      )}
                    />
                  </div>
                </div>
              )}
              {/* Subtotal Finished */}
              {/* Taxes */}
              {invoiceForm?.taxes?.map((tax, index) => (
                <div
                  key={`${index}_${tax.id}`}
                  className={
                    "flex flex-col sm:flex-row sm:justify-end rounded-lg sm:visible w-full px-4 py-1 items-center relative"
                  }
                >
                  <div
                    className={
                      "font-title w-full sm:w-3/5 text-right sm:pr-8 flex flex-row sm:block"
                    }
                  >
                    {!isExporting && (
                      <div className="sm:hidden w-1/3 flex flex-row items-center">
                        {tax.title}
                      </div>
                    )}
                    <div
                      className={
                        "w-2/3 sm:w-full mb-1 sm:mb-0 flex flex-row items-center sm:justify-end"
                      }
                    >
                      <div className={"w-1/2 sm:w-1/3 pr-1"}>
                        {!isViewMode && (
                          <input
                            autoComplete="nope"
                            value={tax.title}
                            type={"text"}
                            placeholder="Discount Type"
                            className={defaultInputSmStyle + " text-right"}
                            onChange={(e) =>
                              handlerTaxesValue(e, "title", tax.id)
                            }
                          />
                        )}
                      </div>
                      <div
                        className={
                          "w-1/2 sm:w-1/3 relative flex flex-row items-center" +
                          (isViewMode ? " justify-end" : " pr-4")
                        }
                      >
                        <input
                          autoComplete="nope"
                          value={tax.value}
                          type={"number"}
                          placeholder="Percentage"
                          className={defaultInputSmStyle + " text-right"}
                          onChange={(e) =>
                            handlerTaxesValue(e, "value", tax.id)
                          }
                        />
                        <span className="ml-1">
                          {tax.type === "percentage" ? "%" : "/-"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      isExporting
                        ? "font-title w-1/4 text-right pr-9 flex flex-row text-sm"
                        : "font-title w-full sm:w-1/4 text-right sm:pr-9 flex flex-row sm:block"
                    }
                  >
                    {!isExporting && (
                      <span className="sm:hidden w-1/2 flex flex-row items-center">
                        Amount
                      </span>
                    )}
                    <span
                      className={
                        isExporting
                          ? "inline-block w-full"
                          : "inline-block w-1/2 sm:w-full"
                      }
                    >
                      <>
                        <div className="w-full">
                          <NumericFormat
                            value={
                              tax.type === "percentage"
                                ? totalPercentTax
                                : tax.amount
                            }
                            className=""
                            displayType={"text"}
                            thousandSeparator={true}
                            renderText={(value, props) => (
                              <span {...props}>
                                {invoiceForm?.currencyUnit} {value}
                              </span>
                            )}
                          />
                        </div>
                      </>
                    </span>
                  </div>
                  {!isViewMode && (
                    <div
                      className="w-full sm:w-10 sm:absolute sm:right-0"
                      onClick={() => onDeleteTax(tax.id)}
                    >
                      <div className="w-full text-red-500 font-title h-8 sm:h-8 sm:w-8 cursor-pointer rounded-2xl bg-red-200 mr-2 flex justify-center items-center">
                        <DeleteIcon className="h-4 w-4" style={IconStyle} />
                        <span className="block sm:hidden">Delete</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {/* Taxes Finished*/}
              {subTotal > 0 && (
                <>
                  {/* Add Tax Action */}
                  <div className="flex flex-col md:flex-row rounded-lg md:visible w-full px-4 py-2 items-center md:justify-end">
                    <div className="font-title w-full md:w-1/3 lg:w-1/4 text-right md:pr-8 flex flex-row md:block mb-1">
                      <Button
                        size="sm"
                        block={1}
                        onClick={addPercentageTax}
                        changeColor={"#00684a"}
                      >
                        <TaxesIcon style={IconStyle} className="h-5 w-5" />
                        Add Discount (%)
                      </Button>
                    </div>
                    <div className="font-title w-full md:w-1/3 lg:w-1/3 text-right md:pr-8 flex flex-row md:block mb-1">
                      <Button
                        size="sm"
                        block={1}
                        onClick={addEmptyTax}
                        changeColor={"#00684a"}
                      >
                        <DollarIcon style={IconStyle} className="w-5 h-5" />
                        Add Discount (Amount)
                      </Button>
                    </div>
                    <div className="font-title w-full md:w-1/3 lg:w-1/4 text-right md:pr-8 flex flex-row md:block mb-1">
                      <Button
                        size="sm"
                        block={1}
                        onClick={addExtraFee}
                        changeColor={"#00684a"}
                      >
                        <DollarIcon style={IconStyle} className="w-5 h-5" />
                        Add Extra Fee
                      </Button>
                    </div>
                  </div>
                  {/* Add Tax Action Finished*/}

                  {/* Subtotal Start and received Amount */}
                  <div className="flex flex-row sm:flex-row sm:justify-end w-full items-center text-white mt-2">
                    <div className="w-full sm:w-1/2 px-4 py-1 mx-6 sm:mx-0 flex flex-row rounded-xl items-center text-white bg-[#00684a]">
                      <div className="font-title text-lg w-1/2 text-right sm:pr-9 flex flex-row sm:block items-center">
                        Total
                      </div>
                      <div className="font-title text-lg w-1/2 text-right sm:pr-9 flex flex-row justify-end sm:block items-center">
                        <NumericFormat
                          value={invoiceForm?.totalAmount}
                          className=""
                          displayType={"text"}
                          thousandSeparator={true}
                          renderText={(value, props) => (
                            <span {...props}>
                              <span className={"text-base"}>
                                {invoiceForm?.currencyUnit}
                              </span>{" "}
                              {value}
                            </span>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mx-6 sm:mx-0">
                    <div className="flex flex-col sm:flex-row sm:justify-end w-full items-center text-white mt-2 relative">
                      <MyToggleButton
                        fullPayment={
                          invoiceForm?.paidAmount === invoiceForm?.totalAmount
                            ? true
                            : false
                        }
                        invoiceForm={invoiceForm}
                        setInvoiceForm={setInvoiceForm}
                      />
                      <div className="w-full sm:w-1/2 px-4 py-1 flex flex-row rounded-xl items-center mt-1 sm:mt-0 text-white bg-[#00684a]">
                        <div className="font-title lg:text-lg w-1/2 text-right lg:pr-9 flex flex-row lg:block items-center">
                          Paid Amount
                        </div>
                        <div
                          className={
                            "font-title text-lg w-1/2 text-right sm:pr-9 flex flex-row justify-end sm:block items-center"
                          }
                        >
                          <input
                            autoComplete="nope"
                            value={invoiceForm?.paidAmount}
                            type={"number"}
                            placeholder="Paid Amount"
                            className={
                              defaultInputSmStyle +
                              " text-right w-full md:w-9/12 lg:w-6/12 ml-[10px] md:mr-[-15px] md:ml-auto text-black"
                            }
                            onChange={(e) => {
                              setInvoiceForm({
                                ...invoiceForm,
                                paidAmount:
                                  invoiceForm?.totalAmount < e.target.value
                                    ? invoiceForm?.totalAmount
                                    : e.target.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-row sm:justify-end w-full items-center text-white mt-2">
                    <div className="w-full sm:w-9/12 lg:w-1/3 px-4 mx-6 sm:mx-0 py-1 flex flex-row rounded-xl items-center text-white bg-[#00684a]">
                      <div className="font-title text-lg w-full sm:w-5/12 lg:w-1/3 text-right sm:pl-2 flex flex-row items-center">
                        Note
                      </div>
                      <div className="font-title text-lg w-full text-right sm:pr-9 flex flex-row justify-end sm:block items-center">
                        <input
                          autoComplete="nope"
                          value={invoiceForm?.note}
                          type={"text"}
                          placeholder="Add note"
                          className={
                            defaultInputSmStyle +
                            " text-right ml-[10px] md:mr-[-15px] md:ml-auto text-black"
                          }
                          onChange={(e) => {
                            setInvoiceForm({
                              ...invoiceForm,
                              note: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              {/* Subtotal Finished and received Amount  */}
            </div>
            {/* Products Finished */}
          </div>
        </>
      )}

      {subTotal > 0 && (
        <div className="px-4 pt-3">
          <div className="bg-white rounded-xl px-3 py-3">
            <div className="flex flex-col flex-wrap sm:flex-row">
              {params.id === "new" && (
                <div className="w-full flex-1 my-1 sm:my-1 md:my-0 px-1">
                  <Button
                    outlined={1}
                    size="sm"
                    block={1}
                    secondary={1}
                    onClick={() => saveAs("Draft")}
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-1" /> Save As Draft
                  </Button>
                </div>
              )}
              {(params.id !== "new" && isViewMode) ||
                ((invoiceForm.paidAmount === 0 ||
                  invoiceForm.paidAmount === "0" ||
                  invoiceForm.paidAmount === "") && (
                  <div className="w-full flex-1 my-1 sm:my-1 md:my-0 px-1">
                    <Button
                      outlined={1}
                      size="sm"
                      block={1}
                      danger={1}
                      onClick={() => saveAs("Unpaid")}
                    >
                      <DollarIcon className="h-5 w-5 mr-1" />{" "}
                      {params.id === "new" ? "Save" : "Update"} As Unpaid
                    </Button>
                  </div>
                ))}
              {params.id !== "new" && isViewMode && (
                <div className="w-full flex-1 my-1 sm:my-1 md:my-0 px-1">
                  <Button
                    outlined={1}
                    size="sm"
                    block={1}
                    danger={1}
                    onClick={() => {
                      dispatch(setDeleteId(invoiceForm._id));
                    }}
                  >
                    Delete Sales
                  </Button>
                </div>
              )}
              {invoiceForm.paidAmount > 0 &&
                invoiceForm.paidAmount < invoiceForm.totalAmount && (
                  <div className="w-full flex-1 my-1 sm:my-1 md:my-0 px-1">
                    <Button
                      outlined={1}
                      size="sm"
                      block={1}
                      danger={1}
                      onClick={() => saveAs("Partial")}
                    >
                      <DollarIcon className="h-5 w-5 mr-1" />{" "}
                      {params.id === "new" ? "Save" : "Update"} As Partial Paid
                    </Button>
                  </div>
                )}
              {invoiceForm.paidAmount >= invoiceForm.totalAmount && (
                <div className="w-full flex-1 my-1 sm:my-1 md:my-0 px-1">
                  <Button
                    size="sm"
                    block={1}
                    success={1}
                    onClick={() => saveAs("Paid")}
                  >
                    <SecurityIcon className="h-5 w-5 mr-1" />{" "}
                    {params.id === "new" ? "Save" : "Update"} As Paid
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {invoiceForm && (
        <div className="p-4">
          <InvoiceTopBar
            onClickBack={goInvoiceList}
            viewMode={isViewMode}
            onClickViewAs={toggleViewMode}
            onClickDownloadImg={handleDownloadImg}
            subTotal={subTotal}
            merchant={true}
          />
        </div>
      )}
    </div>
  );
}

export default PurchaseDetailScreen;
