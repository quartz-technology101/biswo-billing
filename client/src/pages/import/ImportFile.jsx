import React, { useCallback, useState } from "react";
import PageTitle from "../../components/Common/PageTitle";
import { read, utils, writeFile } from "xlsx";
import { MdCloudUpload } from "react-icons/md";
import MissingAlert from "./missingAlert";
import SuccessAlert from "./SuccessAlert";
import FoxAnimateIcon from "../../components/Icons/FoxAnimateIcon";
import Button from "../../components/Button/Button";
function ImportFile() {
  const requiredToSubmit = [
    "title",
    "category",
    "price",
    "quantity",
    "lowQuantityAlert",
  ];
  const requiredCustomerToSubmit = ["name", "mobileNo"];
  const [isProductImported, setIsProductImported] = useState(true);
  const [missingMessage, setMissingMessage] = useState([]);
  const [isConfirmClicked, setIsConfirmClicked] = useState(false);
  const [missing, setMissing] = useState(false);
  const [data, setData] = useState([]);
  const [success, setSuccess] = useState(false);

  function writeFileXLSX(data, fileName) {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sheet1");
    writeFile(wb, fileName);
  }
  const downloadProductFile = useCallback(() => {
    const data = [
      {
        itemCode: "Optional",
        title: "Required",
        brand: "Optional",
        category: "Required",
        price: "Required",
        purchasePrice: "Optional",
        primaryUnit: "Optional",
        secondaryUnit: "Optional",
        conversionRatio: "Optional",
        quantity: "Required",
        lowQuantityAlert: "Required",
        remarks: "Optional",
      },
    ];
    writeFileXLSX(data, "productSample.xlsx");
  }, []);
  const downloadCusotmerFile = useCallback(() => {
    const data = [
      {
        name: "Required",
        email: "Optional",
        image: "Optional",
        mobileNo: "Required",
        billingAddress: "Optional",
        openingBalance: "Optional",
      },
    ];
    writeFileXLSX(data, "cusotmerSample.xlsx");
  }, []);
  const handleCustomerFile = useCallback(async (e) => {
    const file = e.target.files[0];
    if (
      file.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setMissing(true);
      setMissingMessage(["File type is not supported"]);
      e.target.value = "";
      return;
    }
    const data = await file.arrayBuffer();
    const workbook = read(data, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = utils.sheet_to_json(worksheet);
    const missingPropertiesArray = []; // Added this line
    const DataArray = []; // Added this line
    json.forEach((item, index) => {
      const missingProperties = requiredCustomerToSubmit.filter(
        (property) => !item.hasOwnProperty(property)
      );
      if (missingProperties.length > 0) {
        missingPropertiesArray.push(
          `Row: ${index + 1}, properties: ${missingProperties}`
        );
      }
      DataArray.push(item);
    });
    if (missingPropertiesArray.length > 0) {
      setMissing(true);
      if (missingPropertiesArray.length < 5) {
        setMissingMessage(missingPropertiesArray); // Added this line
      } else {
        setMissingMessage([
          "More than 5 Missing Properties, Please check the file",
        ]);
      }
    } else {
      setSuccess(true);
      setData(DataArray);
    }
    e.target.value = "";
  }, []);
  const handleFile = useCallback(async (e) => {
    const file = e.target.files[0];
    if (
      file.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setMissing(true);
      setMissingMessage(["File type is not supported"]);
      e.target.value = "";
      return;
    }
    const data = await file.arrayBuffer();
    const workbook = read(data, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = utils.sheet_to_json(worksheet);
    const missingPropertiesArray = []; // Added this line
    const DataArray = []; // Added this line
    json.forEach((item, index) => {
      const missingProperties = requiredToSubmit.filter(
        (property) => !item.hasOwnProperty(property)
      );
      if (missingProperties.length > 0) {
        missingPropertiesArray.push(
          `Row: ${index + 1}, properties: ${missingProperties}`
        );
      }
      DataArray.push(item);
    });
    if (missingPropertiesArray.length > 0) {
      setMissing(true);
      if (missingPropertiesArray.length < 5) {
        setMissingMessage(missingPropertiesArray); // Added this line
      } else {
        setMissingMessage([
          "More than 5 Missing Properties, Please check the file",
        ]);
      }
    } else {
      setSuccess(true);
      setData(DataArray);
    }
    e.target.value = "";
  }, []);
  const size = window.innerWidth > 640 ? "" : "sm";
  return (
    <div>
      <div className="sm:mr-4 p-4">
        <PageTitle title="Import File" />
      </div>
      <div className="flex gap-4 sm:mx-10 mx-4">
        <Button
          onClick={() => setIsProductImported(true)}
          active={isProductImported}
          inActive={!isProductImported}
          half={1}
          roundedSmall={true}
        >
          Import Products
        </Button>
        <Button
          inActive={isProductImported}
          active={!isProductImported}
          onClick={() => setIsProductImported(false)}
          half={1}
          roundedSmall={true}
        >
          Import Customers
        </Button>
      </div>
      {isProductImported ? (
        <div className="flex flex-wrap bg-white shadow-md rounded-lg mx-3 md:mx-6 my-4 pt-5 sm:pt-10 pb-10">
          <p className="w-full px-4 lg:px-16 mb-4 sm:mb-1 text-gray-700 text-base font-title text-justify">
            Import product items in bulk from an excel file. Note that your file
            should have same format like the give sample sheet. Download the
            sample sheet file and input your items details and then upload the
            file. You can add as many items as you want.
          </p>
          <p className="mx-auto mt-3 mb-4 sm:mb-0">
            <Button roundedSmall={true} onClick={downloadProductFile}>
              Download Sample File
            </Button>
          </p>
          <div className="w-full px-4 mb-4 sm:mb-1">
            <label
              htmlFor="file"
              className="flex flex-col justify-center items-center border-2 border-dashed border-gray-300
             bg-gray-50 rounded-lg h-60 lg:w-11/12 mt-2 lg:mt-10 mx-auto cursor-pointer"
            >
              <input
                type={"file"}
                onChange={(e) => handleFile(e)}
                id="file"
                className="hidden"
              />
              {data.length === 0 && (
                <>
                  <MdCloudUpload
                    className="w-20 h-20 primary-self-text"
                    size={60}
                  />
                  <span className="text-gray-700 text-sm">
                    Select a excel file to upload
                  </span>
                </>
              )}
            </label>
          </div>
          <MissingAlert
            missingMessage={missingMessage}
            missing={missing}
            setMissing={setMissing}
            setMissingMessage={setMissingMessage}
          />
          <SuccessAlert
            success={success}
            setSuccess={setSuccess}
            data={data}
            setData={setData}
            setIsConfirmClicked={setIsConfirmClicked}
          />
          {isConfirmClicked ? (
            <div
              className={
                "w-full h-full fixed block top-30 left-0 z-50 flex flex-col justify-center items-center"
              }
            >
              <div className="fixed inset-0 bg-[#eeeeee] bg-opacity-100 transition-opacity"></div>
              <span className="bg-white inline-block py-6 px-12 rounded-xl border border-gray-200 relative font-title">
                <FoxAnimateIcon className="w-20 h-20 block " />
                <span className="inline-block pt-4 text-xl">
                  Uploading ...{" "}
                </span>
              </span>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-wrap bg-white shadow-md rounded-lg mx-3 md:mx-6 my-4 pt-5 sm:pt-10 pb-10">
          <p className="w-full px-4 lg:px-16 mb-4 sm:mb-1 text-gray-700 text-base font-title text-justify">
            Import customers in bulk from an excel file. Note that your file
            should have same format like the give sample sheet. Download the
            sample sheet file and input your items details and then upload the
            file. You can add as many items as you want.
          </p>
          <p className="mx-auto mt-3 mb-4 sm:mb-0">
            <Button roundedSmall={true} onClick={downloadCusotmerFile}>
              Download Sample File
            </Button>
          </p>
          <div className="w-full px-4 mb-4 sm:mb-1">
            <label
              htmlFor="file"
              className="flex flex-col justify-center items-center border-2 border-dashed border-gray-300
           bg-gray-50 rounded-lg h-60 lg:w-11/12 mt-2 lg:mt-10 mx-auto cursor-pointer"
            >
              <input
                type={"file"}
                onChange={(e) => handleCustomerFile(e)}
                id="file"
                className="hidden"
              />
              {data.length === 0 && (
                <>
                  <MdCloudUpload
                    className="w-20 h-20 primary-self-text"
                    size={60}
                  />
                  <span className="text-gray-700 text-sm">
                    Select a excel file to upload
                  </span>
                </>
              )}
            </label>
          </div>
          <MissingAlert
            missingMessage={missingMessage}
            missing={missing}
            setMissing={setMissing}
            setMissingMessage={setMissingMessage}
            customer={true}
          />
          <SuccessAlert
            success={success}
            setSuccess={setSuccess}
            data={data}
            setData={setData}
            setIsConfirmClicked={setIsConfirmClicked}
            customer={true}
          />
          {isConfirmClicked ? (
            <div
              className={
                "w-full h-full fixed block top-30 left-0 z-50 flex flex-col justify-center items-center"
              }
            >
              <div className="fixed inset-0 bg-[#eeeeee] bg-opacity-100 transition-opacity"></div>
              <span className="bg-white inline-block py-6 px-12 rounded-xl border border-gray-200 relative font-title">
                <FoxAnimateIcon className="w-20 h-20 block " />
                <span className="inline-block pt-4 text-xl">
                  Uploading ...{" "}
                </span>
              </span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default ImportFile;
