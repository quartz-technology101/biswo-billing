import React from "react";
import PageTitle from "../../components/Common/PageTitle";
import InvoiceTable from "../../components/Invoice/InvoiceTable";
function InvoiceListScreen() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row flex-wrap p-4">
        <div className="sm:mr-4">
          <PageTitle title="Transactions" />
        </div>
      </div>

      <div className="flex flex-wrap">
        <div className="w-full px-4 mb-4 sm:mb-1">
          <InvoiceTable showAdvanceSearch={true} />
        </div>
      </div>
    </div>
  );
}

export default InvoiceListScreen;
