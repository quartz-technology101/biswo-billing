import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import React, { lazy, Suspense, useCallback, useEffect } from "react";
import Container from "./components/Container/Container";
import ProductEditModal from "./components/Product/ProductEditModal";
import ProductDeleteConfirm from "./components/Product/ProductDeleteConfirm";
import ProductChoosenModal from "./components/Product/ProductChoosenModal";
// product end
import ClientEditModal from "./components/Clients/ClientEditModal";
import ClientDeleteConfirm from "./components/Clients/ClientDeleteConfirm";
import ClientChoosenModal from "./components/Clients/ClientChooseModal";
import MerchantChoosenModel from "./components/Clients/MerchantChooseModel";
import ClientEditPayment from "./components/Clients/clientDetail/editPayment";
// client end
import InvoiceConfirmModal from "./components/Invoice/InvoiceConfirmModal";
import InvoiceDeleteConfirm from "./components/Invoice/InvoiceDeleteConfirm";
// invoice end
import PageLoading from "./components/Common/PageLoading";
import FloatingActionButton from "./components/Common/floatingActionButton";
// transaction start
import TransactionFilter from "./components/Filtering/transactionFilter";
import {
  SecureClient,
  handleContextMenu as SecureClientKeyType,
  handleKeydown as SecureClientRight,
} from "./components/Common/Secure";

const ProductLazy = lazy(() =>
  wait(1000).then(() => import("./pages/products/ProductListScreen"))
);
const ProductDetailLazy = lazy(() =>
  wait(1000).then(() => import("./pages/products/ProductDetailScreen"))
);
const ClientDetailLazy = lazy(() =>
  wait(1000).then(() => import("./pages/clients/clientDetailScreen"))
);
const ClientLazy = lazy(() =>
  wait(1000).then(() => import("./pages/clients/ClientListScreen"))
);

const MerchantDetailLazy = lazy(() =>
  wait(1000).then(() => import("./pages/merchants/merchantDetailScreen"))
);
const MerchantLazy = lazy(() =>
  wait(1000).then(() => import("./pages/merchants/merchantListScreen"))
);
const InvoiceLazy = lazy(() =>
  wait(1000).then(() => import("./pages/invoices/InvoiceListScreen"))
);
const InvoiceDetailLazy = lazy(() =>
  wait(1000).then(() => import("./pages/invoices/InvoiceDetailScreen"))
);
const PurchaseDetailLazy = lazy(() =>
  wait(1000).then(() => import("./pages/purchase/PurchaseDetailScreen"))
);
const ImportFileLazy = lazy(() =>
  wait(1000).then(() => import("./pages/import/ImportFile"))
);
const AboutLazy = lazy(() =>
  wait(1000).then(() => import("./pages/about/AboutScreen"))
);

const App = () => {
  useEffect(() => {
    SecureClient();
  }, [SecureClientKeyType, SecureClientRight]);
  return (
    <BrowserRouter>
      <Container>
        <Suspense fallback={<PageLoading firstRender={true} />}>
          <Routes>
            <Route path="products">
              <Route path="" element={<ProductLazy />} exact />
              <Route path=":id" element={<ProductDetailLazy />} />
            </Route>
            <Route path="customer">
              <Route path="" element={<ClientLazy />} exact />
              <Route path=":id" element={<ClientDetailLazy />} />
            </Route>
            <Route path="merchant">
              <Route path="" element={<MerchantLazy />} exact />
              <Route path=":id" element={<MerchantDetailLazy />} />
            </Route>
            <Route path="invoices">
              <Route path=":id" element={<InvoiceDetailLazy />} />
            </Route>
            <Route path="transactions">
              <Route path="" element={<InvoiceLazy />} />
            </Route>
            <Route path="purchases">
              <Route path=":id" element={<PurchaseDetailLazy />} />
            </Route>
            <Route path="import" element={<ImportFileLazy />} />
            <Route path="about" element={<AboutLazy />} />
            <Route path="*" element={<Navigate to="/transactions" replace />} />
          </Routes>
        </Suspense>
      </Container>
      {/* this is pop up model for product */}
      <ProductEditModal />
      <ProductDeleteConfirm />
      <ProductChoosenModal />
      {/* model close */}
      {/* this is pop up model for client */}
      <ClientEditModal />
      <ClientEditPayment />
      <ClientDeleteConfirm />
      <ClientChoosenModal />
      <MerchantChoosenModel />
      {/* model close */}
      {/* this is pop up model for invoice */}
      <InvoiceConfirmModal />
      <InvoiceDeleteConfirm />
      {/* transaction start  */}
      <TransactionFilter />
      {/* end */}
      {/* model close */}
      <FloatingActionButton />
      <PageLoading />
    </BrowserRouter>
  );
};

export default App;

function wait(ms = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
