import mongoose from "mongoose";

const clientSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      default: "N/A",
    },
    image: { type: String },
    mobileNo: { type: String },
    billingAddress: { type: String, default: "N/A" },
    totalAmountToPay: { type: Number, default: 0 },
    openingBalance: { type: Number, default: 0 },
    clientType: { type: String, default: "Customer" },
  },
  {
    timestamps: true,
  }
);

const clientModel = mongoose.model("clients", clientSchema);

export default clientModel;
