import Transaction from "../models/allTransactionsModel.js";
import clientModel from "../models/clientModel.js";
import InvoiceModel from "../models/invoiceModel.js";
import productModel from "../models/productModel.js";
import { getPaginatedData } from "../Utils/pagination.js";
import pkg from "jsonwebtoken";
const { jwt } = pkg;

export const createTransaction = async (req) => {
  const {
    transactionNumber,
    transactionType,
    partyDetails,
    productDetails,
    receviedAmount,
    createdDate,
    status,
    amount,
    note,
    billNumber,
  } = req;
  if (productDetails !== null) {
    productDetails.forEach((product) => {
      product.quantity = Number(product.quantity);
    });
  }
  if (partyDetails._id !== null) {
    const client = await clientModel.findById(partyDetails?._id);
    if (client !== null) {
      if (transactionType === "Sale" || transactionType === "Purchase") {
        client.totalAmountToPay += amount;
        client.totalAmountToPay -= receviedAmount;
        await client.save();
      } else if (
        transactionType === "PaymentIn" ||
        transactionType === "PaymentOut"
      ) {
        client.totalAmountToPay -= amount;
        await client.save();
      } else if (transactionType === "OpeningBalance") {
        client.totalAmountToPay += amount;
        await client.save();
      }
    }
  }
  let NoNullProductDetail = [];
  let newProductDetails = [];
  if (productDetails !== null) {
    NoNullProductDetail = productDetails.filter((product) => {
      return product.productID !== null && product.productID !== "";
    });
    NoNullProductDetail.forEach(async (product) => {
      const productDetail = await productModel.findById(product.productID);
      if (productDetail !== null) {
        if (transactionType === "Sale") {
          if (product.isSecondaryUnitChecked) {
            productDetail.quantity -=
              product.quantity / product.conversionRatio;
          } else {
            productDetail.quantity -= product.quantity;
          }
          await productDetail.save();
        } else if (transactionType === "Purchase") {
          if (product.isSecondaryUnitChecked) {
            productDetail.quantity +=
              product.quantity / product.conversionRatio;
          } else {
            productDetail.quantity += product.quantity;
          }
          await productDetail.save();
        } else if (transactionType === "AddQuantity") {
          if (product.isSecondaryUnitChecked) {
            productDetail.quantity +=
              product.quantity / product.conversionRatio;
          } else {
            productDetail.quantity += product.quantity;
          }
          await productDetail.save();
        } else if (transactionType === "ReduceQuantity") {
          if (product.isSecondaryUnitChecked) {
            productDetail.quantity -=
              product.quantity / product.conversionRatio;
          } else {
            productDetail.quantity -= product.quantity;
          }
          await productDetail.save();
        }
      }
    });
    newProductDetails = NoNullProductDetail.map((product) => {
      return {
        productID: product.productID,
        productName: product.name,
        quantity: product.quantity,
        isSecondaryUnitChecked: product.isSecondaryUnitChecked,
        unit: product.isSecondaryUnitChecked
          ? product.secondaryUnit
          : product.primaryUnit,
      };
    });
  }
  // create a new transaction
  const newTransaction = new Transaction({
    transactionNumber,
    transactionType,
    partyDetails,
    productDetails: newProductDetails,
    receviedAmount,
    createdDate: createdDate ? createdDate : Date.now(),
    status,
    amount,
    note,
    billNumber,
  });

  try {
    await newTransaction.save();
  } catch (error) {
    console.log(error.message);
  }
};

export const updateTransaction = async (req) => {
  const {
    transactionNumber,
    transactionType,
    partyDetails,
    productDetails,
    receviedAmount,
    createdDate,
    status,
    amount,
    note,
    billNumber,
  } = req;

  if (productDetails !== null) {
    productDetails.forEach((product) => {
      product.quantity = Number(product.quantity);
    });
  }

  const client = await clientModel.findById(partyDetails._id);
  const transaction = await Transaction.findOne({ transactionNumber });
  if (client) {
    let amountDifference = 0;
    if (amount !== transaction.amount) {
      amountDifference = amount - transaction.amount;
    }

    if (transactionType === "Sale" || transactionType === "Purchase") {
      client.totalAmountToPay -=
        amountDifference + receviedAmount - transaction.receviedAmount;
      await client.save();
    }

    if (transactionType === "PaymentIn" || transactionType === "PaymentOut") {
      client.totalAmountToPay += -amountDifference;
      await client.save();
    }

    if (transactionType === "OpeningBalance") {
      client.totalAmountToPay += amountDifference;
      await client.save();
    }
  }
  let newProductDetails = [];
  if (transaction) {
    let NoNullProductDetail = [];
    if (productDetails !== null) {
      NoNullProductDetail = productDetails.filter((product) => {
        return product.productID !== null && product.productID !== "";
      });
      if (NoNullProductDetail.length > 0) {
        let productIDs = transaction.productDetails
          ? transaction.productDetails.map(
              (productDetail) => productDetail.productID
            )
          : [];
        const previousProductIDs = [...productIDs];
        for (let i = 0; i < NoNullProductDetail.length; i++) {
          const product = NoNullProductDetail[i];
          const isProductIDExist = productIDs.includes(product.productID);
          let productDetail = await productModel.findById(product.productID);
          if (!productDetail) {
            return;
          }
          if (!isProductIDExist) {
            transaction.productDetails.push(productDetail);
            if (transactionType === "Sale") {
              productDetail.quantity -= product.isSecondaryUnitChecked
                ? product.quantity / productDetail.conversionRatio
                : product.quantity;
            } else if (transactionType === "Purchase") {
              productDetail.quantity += product.isSecondaryUnitChecked
                ? product.quantity / productDetail.conversionRatio
                : product.quantity;
            }
            await productDetail.save();
          } else {
            // update existing product details
            const existingProductDetail = transaction.productDetails.find(
              (p) => p.productID === product.productID
            );
            let diff = 0;
            if (
              existingProductDetail.isSecondaryUnitChecked !==
              product.isSecondaryUnitChecked
            ) {
              if (existingProductDetail.isSecondaryUnitChecked) {
                diff =
                  existingProductDetail.quantity /
                  productDetail.conversionRatio;
                diff = product.quantity - diff;
              } else {
                diff = product.quantity / productDetail.conversionRatio;
                diff = diff - existingProductDetail.quantity;
              }
            } else {
              if (existingProductDetail.isSecondaryUnitChecked) {
                diff =
                  existingProductDetail.quantity /
                  productDetail.conversionRatio;
                diff = product.quantity / productDetail.conversionRatio - diff;
              } else {
                diff = product.quantity - existingProductDetail.quantity;
              }
            }
            if (diff !== 0) {
              if (transactionType === "Sale") {
                if (diff < 0) {
                  productDetail.quantity += Math.abs(diff);
                  await productDetail.save();
                } else {
                  productDetail.quantity -= diff;
                  await productDetail.save();
                }
              } else if (transactionType === "Purchase") {
                if (diff < 0) {
                  productDetail.quantity -= Math.abs(diff);
                  await productDetail.save();
                } else {
                  productDetail.quantity += Math.abs(diff);
                  await productDetail.save();
                }
              }
            }
            // remove from previousProductIDs so that at the end we are left with only deleted products
            previousProductIDs.splice(
              previousProductIDs.indexOf(product.productID),
              1
            );
          }
        }
        for (let i = 0; i < previousProductIDs.length; i++) {
          const productID = previousProductIDs[i];
          const product = await productModel.findById(productID);
          const productDetail = transaction.productDetails.find(
            (p) => p.productID === productID
          );
          if (product) {
            if (transactionType === "Sale") {
              if (productDetail.isSecondaryUnitChecked) {
                product.quantity +=
                  transaction.productDetails.find(
                    (p) => p.productID === productID
                  ).quantity / product.conversionRatio;
              } else {
                product.quantity += transaction.productDetails.find(
                  (p) => p.productID === productID
                ).quantity;
              }
              await product.save();
            } else if (transactionType === "Purchase") {
              if (productDetail.isSecondaryUnitChecked) {
                product.quantity -=
                  transaction.productDetails.find(
                    (p) => p.productID === productID
                  ).quantity / product.conversionRatio;
              } else {
                product.quantity -= transaction.productDetails.find(
                  (p) => p.productID === productID
                ).quantity;
              }
              await product.save();
            }
          }
        }
        await transaction.save();
      } else {
        for (let i = 0; i < transaction.productDetails.length; i++) {
          const productDetail = transaction.productDetails[i];
          const product = await productModel.findById(productDetail.productID);
          if (product) {
            if (transactionType === "Sale") {
              if (productDetail.isSecondaryUnitChecked) {
                product.quantity +=
                  productDetail.quantity / product.conversionRatio;
                await product.save();
              } else {
                product.quantity += productDetail.quantity;
                await product.save();
              }
            } else if (transactionType === "Purchase") {
              if (productDetail.isSecondaryUnitChecked) {
                product.quantity -=
                  productDetail.quantity / product.conversionRatio;
                await product.save();
              } else {
                product.quantity -= productDetail.quantity;
                await product.save();
              }
            }
          }
        }
        transaction.productDetails = [];
        await transaction.save();
      }
      newProductDetails = NoNullProductDetail.map((product) => {
        return {
          productID: product.productID,
          productName: product.productName,
          quantity: product.quantity,
          isSecondaryUnitChecked: product.isSecondaryUnitChecked,
          unit: product.isSecondaryUnitChecked
            ? product.secondaryUnit
            : product.primaryUnit,
        };
      });
    }
  }
  // update the transaction
  const updatedTransaction = await Transaction.findOne({
    transactionNumber,
  });
  updatedTransaction.transactionType = transactionType;
  updatedTransaction.partyDetails = partyDetails;
  updatedTransaction.productDetails = newProductDetails;
  updatedTransaction.receviedAmount = receviedAmount;
  updatedTransaction.status = status;
  updatedTransaction.amount = amount;
  updatedTransaction.note = note;
  updatedTransaction.billNumber = billNumber;
  updatedTransaction.createdDate = createdDate ? createdDate : new Date();
  try {
    await updatedTransaction.save();
    // return {
  } catch (error) {
    console.log(error.message);
  }
};

export const getTransactions = async (req, res) => {
  try {
    const {
      page,
      draft,
      searchBy: { name, anything },
      filterBy,
      sortBy,
      date: { startDate, endDate },
    } = req.query;
    const pageNumber = parseInt(page);
    const showDraft = draft === "true" ? true : false;
    let regexSearch = name;
    let regexAnything = anything;
    let sort = parseInt(sortBy);
    if (sort === 1) {
      sort = { createdAt: -1 };
    } else if (sort === 2) {
      sort = { transactionType: 1 };
    } else if (sort === 3) {
      sort = { transactionType: -1 };
    } else if (sort === 4) {
      sort = { createdAt: 1 };
    }
    if (regexSearch) {
      regexSearch = new RegExp(regexSearch, "i");
    }
    let OrCondition = [];
    if (regexAnything) {
      regexAnything = new RegExp(anything, "i");
      OrCondition = [
        {
          "partyDetails.clientType": regexAnything,
        },
        {
          "productDetails.productName": regexAnything,
        },
        {
          billNumber: regexAnything,
        },
      ];
    }
    const oneAndCondition =
      showDraft === true
        ? [{ status: "Draft" }]
        : [
            {
              status: { $ne: "Draft" },
            },
            {
              transactionType: { $ne: "OpeningBalance" },
            },
            {
              transactionType: { $ne: "AddQuantity" },
            },
            {
              transactionType: { $ne: "ReduceQuantity" },
            },
          ];
    const { data, pageCount } = await getPaginatedData({
      page: pageNumber,
      limit: 8,
      modelName: Transaction,
      inside: OrCondition,
      oneAndCondition: oneAndCondition,
      mainSearch: regexSearch
        ? { name: "partyDetails.name", value: regexSearch }
        : "",
      filterBy: filterBy ? { name: "transactionType", value: filterBy } : "",
      sortBy: sort,
      startDate: startDate ? new Date(startDate) : "",
      endDate: endDate ? new Date(endDate) : "",
    });
    res.status(200).json({ data, pageCount });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getTransactionByUser = async (req, res) => {
  const { id } = req.params;
  try {
    const page = parseInt(req.query.page);
    const { data, pageCount } = await getPaginatedData({
      page: page,
      limit: 50,
      modelName: Transaction,
      inside: [{ "partyDetails._id": id }],
    });
    res.status(200).json({ data: data, pageCount: pageCount });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const deleteAllTransactions = async () => {
  try {
    await Transaction.deleteMany({});
  } catch (error) {
    console.log(error);
  }
};

export const getTransactionByProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const page = parseInt(req.query.page);
    const { data, pageCount } = await getPaginatedData({
      page: page,
      limit: 8,
      modelName: Transaction,
      inside: [{ "productDetails.productID": id }],
    });
    res.status(200).json({ data: data, pageCount: pageCount });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteTransactionByClientID = async (id) => {
  try {
    const allTransaction = await Transaction.find({
      "partyDetails._id": id,
    });
    allTransaction.forEach(async (transaction) => {
      // increase the quantity of the product in the transaction
      if (transaction.productDetails.length > 0) {
        const updateProductQuantity = async (
          productID,
          quantity,
          isSecondaryUnitChecked,
          method
        ) => {
          const product = await productModel.findById(productID);
          if (product) {
            if (method === "Sale") {
              if (isSecondaryUnitChecked) {
                product.quantity += quantity / product.conversionRatio;
                await product.save();
              } else {
                product.quantity += quantity;
                await product.save();
              }
            } else if (method === "Purchase") {
              if (isSecondaryUnitChecked) {
                product.quantity -= quantity / product.conversionRatio;
                await product.save();
              } else {
                product.quantity -= quantity;
                await product.save();
              }
            }
          }
        };
        transaction.productDetails.forEach(async (product) => {
          const productID = product.productID;
          const quantity = product.quantity;
          const isSecondaryUnitChecked = product.isSecondaryUnitChecked;
          const method = transaction.transactionType;
          await updateProductQuantity(
            productID,
            quantity,
            isSecondaryUnitChecked,
            method
          );
        });
      }
      await Transaction.findByIdAndDelete(transaction._id);
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteTransactionOfPaymentInOrSales = async (id) => {
  try {
    const transaction = await Transaction.findOne({
      transactionNumber: id,
    });
    const products = transaction.productDetails;
    const method = transaction.transactionType;
    if (products.length > 0) {
      const updateProductQuantity = async (
        productID,
        quantity,
        isSecondaryUnitChecked,
        method
      ) => {
        const product = await productModel.findById(productID);
        if (product) {
          if (isSecondaryUnitChecked) {
            product.quantity =
              method === "Sale"
                ? product.quantity + quantity / product.conversionRatio
                : product.quantity - quantity / product.conversionRatio;
          } else {
            product.quantity =
              method === "Sale"
                ? product.quantity + quantity
                : product.quantity - quantity;
          }
          await product.save();
        }
      };
      for (let i = 0; i < products.length; i++) {
        updateProductQuantity(
          products[i].productID,
          products[i].quantity,
          products[i].isSecondaryUnitChecked
        );
      }
    }
    const client = await clientModel.findById(transaction.partyDetails._id);
    if (client !== null) {
      if (method === "PaymentIn") {
        client.totalAmountToPay += transaction.amount;
      } else if (method === "PaymentOut") {
        client.totalAmountToPay -= transaction.amount;
      } else if (method === "Sale") {
        const unpaid = transaction.amount - transaction.receviedAmount;
        client.totalAmountToPay -= unpaid;
      } else if (method === "Purchase") {
        const unpaid = transaction.amount - transaction.receviedAmount;
        client.totalAmountToPay += unpaid;
      }
      await client.save();
    }
    await Transaction.findOneAndDelete({
      transactionNumber: id,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteTransactionByProductID = async (id) => {
  try {
    const allTransaction = await Transaction.find({
      "productDetails.productID": id,
    });
    const allInvoice = await InvoiceModel.find({
      "products.productID": id,
    });
    allTransaction.forEach(async (transaction) => {
      const client = await clientModel.findById(transaction.partyDetails._id);
      if (client) {
        for (let i = 0; i < transaction.productDetails.length; i++) {
          if (transaction.productDetails[i].productID === id) {
            if (transaction.transactionType === "Sale") {
              const unpaid = transaction.amount - transaction.receviedAmount;
              client.totalAmountToPay -= unpaid;
            } else if (transaction.transactionType === "Purchase") {
              const unpaid = transaction.amount - transaction.receviedAmount;
              client.totalAmountToPay += unpaid;
            }
            await client.save();
          }
        }
      }
      const productDetails = transaction.productDetails.filter(
        (product) => product.productID !== id
      );
      if (productDetails.length === 0) {
        await Transaction.findByIdAndDelete(transaction._id);
      } else {
        const reduceTransactionTotalAmountByID =
          transaction.productDetails.filter(
            (product) => product.productID === id
          );
        const product = await productModel.findById(id);
        const productPrice = reduceTransactionTotalAmountByID[0]
          .isSecondaryUnitChecked
          ? product.price / product.conversionRatio
          : product.price;
        transaction.amount -=
          productPrice * reduceTransactionTotalAmountByID[0].quantity;
        if (transaction.amount > transaction.receviedAmount) {
          transaction.status = "Unpaid";
        } else {
          transaction.status = "Paid";
        }
        transaction.productDetails = productDetails;
        await transaction.save();
      }
    });
    allInvoice.forEach(async (invoice) => {
      const products = invoice.products.filter(
        (product) => product.productID !== id
      );
      if (products.length === 0) {
        await InvoiceModel.findByIdAndDelete(invoice._id);
      } else {
        const reduceInvocieTotalAmountByID = invoice.products.filter(
          (product) => product.productID === id
        );
        invoice.totalAmount -=
          reduceInvocieTotalAmountByID[0].amount *
          reduceInvocieTotalAmountByID[0].quantity;
        invoice.products = products;
        await invoice.save();
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const generateToken = (data) => {
  return jwt.sign({ data }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
