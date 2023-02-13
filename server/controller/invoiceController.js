import mongoose from "mongoose";
import invoiceModel from "../models/invoiceModel.js";
import {
  createTransaction,
  deleteTransactionOfPaymentInOrSales,
  updateTransaction,
} from "./transactionController.js";

export const getInvoices = async (req, res) => {
  try {
    const invoice = await invoiceModel.find();
    const detailList = invoice.map((item) => {
      const { _id, ...rest } = item._doc;
      return { id: _id, ...rest };
    });

    const data = invoice.map((item) => {
      const {
        _id,
        invoiceNo,
        statusIndex,
        statusName,
        totalAmount,
        paidAmount,
        dueDate,
        createdDate,
        clientDetail,
      } = item;
      return {
        id: _id,
        invoiceNo,
        statusIndex,
        statusName,
        totalAmount,
        paidAmount,
        dueDate,
        createdDate,
        clientName: clientDetail?.name,
      };
    });

    res.status(200).json({ data, detailList });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}; // end of getInvoices

export const getInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    const invoice = await invoiceModel.findById(id);
    res.status(200).json({ data: invoice });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}; // end of getInvoice

export const NewInvoiceNo = async (req, res) => {
  try {
    const lastInvoice = await invoiceModel
      .findOne({
        invoiceType: "Sale",
      })
      .sort({ _id: -1 });
    const lastInvoiceNo = lastInvoice?.invoiceNo || 0;
    let newInvoiceNo;
    if (lastInvoiceNo === 1000) {
      newInvoiceNo = 1;
    } else {
      newInvoiceNo = lastInvoiceNo + 1;
    }
    res.status(200).json({ data: newInvoiceNo });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}; // end of NewInvoiceNo
export const createInvoice = async (req, res) => {
  const invoice = req.body;
  const newInvoice = new invoiceModel(invoice);
  const invoiceNo = invoice.invoiceNo || "";
  try {
    const transaction = {
      transactionNumber: newInvoice._id,
      transactionType: newInvoice.invoiceType,
      partyDetails: newInvoice.clientDetail,
      productDetails: newInvoice.products,
      receviedAmount: newInvoice.paidAmount,
      status: newInvoice.statusName,
      amount: newInvoice.totalAmount,
      note: newInvoice.note,
      billNumber: invoiceNo,
      createdDate: invoice.createdDate,
    };
    await createTransaction(transaction);
    await newInvoice.save();
    res
      .status(201)
      .json({ data: newInvoice, message: "Invoice created successfully." });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}; // end of createInvoice

export const updateInvoice = async (req, res) => {
  const { id } = req.params;
  const invoice = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No invoice with id: ${id}`);
  const invoiceNo = invoice.invoiceNo || "";
  const transaction = {
    transactionNumber: id,
    partyDetails: invoice.clientDetail,
    productDetails: invoice.products,
    status: invoice.statusName,
    transactionType: invoice.invoiceType,
    amount: invoice.totalAmount,
    receviedAmount: invoice.paidAmount,
    note: invoice.note,
    billNumber: invoiceNo,
  };
  await updateTransaction(transaction);
  const updatedInvoice = await invoiceModel.findByIdAndUpdate(
    id,
    { ...invoice, id },
    { new: true }
  );
  res
    .status(200)
    .json({ data: updatedInvoice, message: "Invoice updated successfully." });
}; // end of updateInvoice

export const deleteInvoice = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No invoice with id: ${id}`);
  await deleteTransactionOfPaymentInOrSales(id);
  await invoiceModel.findByIdAndRemove(id);
  res.json({ message: "Invoice deleted successfully." });
}; // end of deleteInvoice

// get client purchase history by client id from invoiceModel
export const getClientPurchaseHistory = async (req, res) => {
  const { id } = req.params;
  try {
    // find all invoices by client id and exclude statusIndex 1 (draft)
    const invoice = await invoiceModel.find({
      "clientDetail._id": id,
      statusIndex: { $ne: "1" },
    });
    const data = invoice.map((item) => {
      const {
        _id,
        invoiceNo,
        statusName,
        statusIndex,
        totalAmount,
        paidAmount,
        dueDate,
        clientDetail,
        products,
      } = item;
      return {
        _id,
        invoiceNo,
        statusName,
        totalAmount,
        paidAmount,
        dueDate,
        statusIndex,
        clientDetail,
        products: products.map((product) => {
          return {
            id: product.id,
            name: product.name,
            quantity: product.quantity,
            amount: product.amount,
          };
        }),
      };
    });
    res.status(200).json({ data });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}; // end of getClientPurchaseHistory

export const deleteinvoiceByClientID = async (id) => {
  try {
    const allInvoice = await invoiceModel.find({
      "clientDetail._id": id,
    });
    allInvoice.forEach(async (invoice) => {
      await invoiceModel.findByIdAndRemove(invoice._id);
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteAllInvoices = async () => {
  try {
    await invoiceModel.deleteMany({});
  } catch (error) {
    console.log(error, "error");
  }
};
