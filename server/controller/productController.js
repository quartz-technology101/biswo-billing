import productModel from "../models/productModel.js";
import { getPaginatedData } from "../Utils/pagination.js";
import {
  createTransaction,
  deleteTransactionByProductID,
} from "./transactionController.js";

export const getproductPage = async (req, res) => {
  try {
    const {
      page,
      searchBy: { name, anything },
      filterBy,
      sortBy,
      limit,
    } = req.query;
    let docxLimit = parseInt(limit) || 8;
    let regexSearch = name;
    let regexFilter = filterBy;
    let regexAnything = anything;
    let sort = parseInt(sortBy);
    if (sort === 1) {
      sort = { createdAt: -1 };
    } else if (sort === 2) {
      sort = { title: 1 };
    } else if (sort === 3) {
      sort = { title: -1 };
    } else if (sort === 4) {
      sort = { createdAt: 1 };
    }
    if (regexSearch) {
      regexSearch = new RegExp(regexSearch, "i");
    }
    if (regexFilter) {
      regexFilter = new RegExp(regexFilter, "i");
    }
    let OrCondition = [];
    if (regexAnything) {
      regexAnything = new RegExp(regexAnything, "i");
      OrCondition = [
        {
          brand: regexAnything,
        },
        {
          itemCode: regexAnything,
        },
      ];
    }
    const { data, pageCount } = await getPaginatedData({
      page: page,
      limit: docxLimit,
      modelName: productModel,
      inside: OrCondition,
      mainSearch: regexSearch ? { name: "title", value: regexSearch } : "",
      filterBy: regexFilter ? { name: "category", value: regexFilter } : "",
      oneAndCondition: [],
      sortBy: sort,
    });
    res.status(200).json({ data, pageCount });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createproductPage = async (req, res) => {
  const {
    title,
    brand,
    image,
    category,
    price,
    purchasePrice,
    primaryUnit,
    secondaryUnit,
    conversionRatio,
    quantity,
    lowQuantityAlert,
    sold,
    remarks,
    createdDate,
  } = req.body;
  try {
    if (!title) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }
    if (!price) {
      return res.status(400).json({
        message: "Please provide a price",
      });
    }
    if (purchasePrice === undefined || purchasePrice === null) {
      purchasePrice = 0;
    }
    const lastItemCode = await productModel.find().sort({ itemCode: -1 });
    let lastItemCodeNumber;
    if (lastItemCode.length > 0) {
      lastItemCodeNumber = parseInt(lastItemCode[0].itemCode);
    } else {
      lastItemCodeNumber = 0;
    }
    const newItemCode = lastItemCodeNumber + 1;
    const productPageData = new productModel({
      itemCode: newItemCode,
      title,
      brand,
      image,
      category,
      price,
      purchasePrice,
      primaryUnit,
      secondaryUnit,
      conversionRatio,
      quantity,
      lowQuantityAlert,
      sold,
      remarks,
    });
    const savedproductPage = await productPageData.save();
    const transaction = {
      transactionNumber: savedproductPage._id.toString(),
      transactionType: "OpeningBalance",
      partyDetails: { _id: null },
      productDetails: [
        {
          productID: savedproductPage._id.toString(),
          quantity: quantity,
          isSecondaryUnitChecked: false,
          primaryUnit,
          secondaryUnit,
        },
      ],
      note: savedproductPage.remarks,
      createdDate: createdDate,
    };
    await createTransaction(transaction);
    res.status(200).json({
      data: savedproductPage,
      message: `${savedproductPage.title} created successfully`,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

export const addOrReduceProductQuantity = async (req, res) => {
  const { quantity, isAdd, note, stockDate, isSecondaryUnitChecked } = req.body;
  const { id } = req.params;
  try {
    if (isAdd) {
      const updatedProduct = await productModel.findById(id);
      const transaction = {
        transactionNumber: updatedProduct._id.toString(),
        transactionType: "AddQuantity",
        partyDetails: { _id: null },
        productDetails: [
          {
            productID: updatedProduct._id.toString(),
            quantity: quantity,
            isSecondaryUnitChecked: isSecondaryUnitChecked,
            conversionRatio: updatedProduct.conversionRatio,
            primaryUnit: updatedProduct.primaryUnit,
            secondaryUnit: updatedProduct.secondaryUnit,
          },
        ],
        createdDate: stockDate,
        note: note,
      };
      createTransaction(transaction);
      res.status(200).json({
        data: updatedProduct,
        message: `${updatedProduct.title} stock ${
          isAdd ? "added" : "reduced"
        } successfully`,
      });
    } else {
      const updatedProduct = await productModel.findById(id);
      const transaction = {
        transactionNumber: updatedProduct._id.toString(),
        transactionType: "ReduceQuantity",
        partyDetails: { _id: null },
        productDetails: [
          {
            productID: updatedProduct._id.toString(),
            quantity: quantity,
            isSecondaryUnitChecked: isSecondaryUnitChecked,
            conversionRatio: updatedProduct.conversionRatio,
            primaryUnit: updatedProduct.primaryUnit,
            secondaryUnit: updatedProduct.secondaryUnit,
          },
        ],
        createdDate: stockDate,
        note: note,
      };
      createTransaction(transaction);
      res.status(200).json({
        data: updatedProduct,
        message: `${updatedProduct.title} stock ${
          isAdd ? "added" : "reduced"
        } successfully`,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const createMultipleProduct = async (req, res) => {
  const { products: ArrayOfProduct, createdDate } = req.body;
  const lastItemCode = await productModel.find().sort({ itemCode: -1 });
  let lastItemCodeNumber;
  if (lastItemCode.length > 0) {
    lastItemCodeNumber = parseInt(lastItemCode[0].itemCode);
  } else {
    lastItemCodeNumber = 0;
  }
  let newItemCode = lastItemCodeNumber + 1;
  ArrayOfProduct.forEach((product) => {
    product.itemCode = newItemCode;
    newItemCode++;
  });

  try {
    const savedMultipleProduct = await productModel.insertMany(ArrayOfProduct);
    savedMultipleProduct.forEach(async (product) => {
      const transaction = {
        transactionNumber: product._id.toString(),
        transactionType: "OpeningBalance",
        partyDetails: { _id: null },
        productDetails: [
          {
            productID: product._id.toString(),
            quantity: product.quantity,
            isSecondaryUnitChecked: false,
            primaryUnit: product.primaryUnit,
            secondaryUnit: product.secondaryUnit,
          },
        ],
        note: product.remarks,
        createdDate: createdDate,
      };
      await createTransaction(transaction);
    });
    res.status(200).json({
      data: savedMultipleProduct,
      message: `${savedMultipleProduct.length} product created successfully`,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateProductById = async (req, res) => {
  const { id } = req.params;
  const {
    itemCode,
    title,
    brand,
    image,
    category,
    price,
    purchasePrice,
    primaryUnit,
    secondaryUnit,
    conversionRatio,
    quantity,
    lowQuantityAlert,
    sold,
    remarks,
  } = req.body;
  try {
    if (!title) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }
    if (!price) {
      return res.status(400).json({
        message: "Please provide a price",
      });
    }
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        itemCode,
        title,
        brand,
        image,
        category,
        price,
        purchasePrice,
        primaryUnit,
        secondaryUnit,
        conversionRatio,
        quantity,
        lowQuantityAlert,
        sold,
        remarks,
      },
      { new: true }
    );
    res.status(200).json({
      data: updatedProduct,
      message: `${updatedProduct.title} updated successfully`,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteProductById = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteTransactionByProductID(id);
    await productModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const ProductById = await productModel.findById(id);
    const title = ProductById.title;
    res.json({ data: ProductById, message: "Product " + title });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const getfilterProduct = async (req, res) => {
  try {
    const data = await productModel.find({}).select("brand category");
    const pages = await productModel.find().countDocuments();
    const limit = 8;
    const totalPages = Math.ceil(pages / limit);
    const pageArray = [];
    for (let i = 1; i <= totalPages; i++) {
      pageArray.push(i);
    }
    const brand = data.map((item) => item.brand);
    const category = data.map((item) => item.category);
    const allBrand = brand.reduce((acc, val) => acc.concat(val), []);
    const allCategory = category.reduce((acc, val) => acc.concat(val), []);
    const brandFilter = allBrand.filter(
      (item) => item !== undefined && item !== null
    );
    const categoryFilter = allCategory.filter(
      (item) => item !== undefined && item !== null
    );
    const brandCapatalize = brandFilter.map(
      (item) => item.charAt(0).toUpperCase() + item.slice(1)
    );
    const categoryCapatalize = categoryFilter.map(
      (item) => item.charAt(0).toUpperCase() + item.slice(1)
    );
    const uniqueBrand = [...new Set(brandCapatalize)];
    const uniqueCategory = [...new Set(categoryCapatalize)];
    res.json({
      data: {
        brand: uniqueBrand,
        category: uniqueCategory,
        pageNumbers: pageArray,
      },
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
