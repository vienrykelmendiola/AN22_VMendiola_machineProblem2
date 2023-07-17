/*
  Program:  E-commerce API MVP requirements
  Programmer: Vien Mendiola
  Section:  BSCSAN22
  Start Date: July 17 2023
  End Date:   July 17 2023
*/
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  orderedProducts: [
    {
      products: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product Id is required"],
          },
          productName: {
            type: String,
            required: [true, "Product Name is required"],
          },
          productDescription: {
            type: String,
            required: [true, "Description is required"],
          },
          quantity: {
            type: Number,
            required: [true, "Quantity is required"],
          },
          price: {
            type: Number,
            required: [true, "Price is required"],
          },
          totalAmount: {
            type: Number,
            required: [true, "Total amount is required"],
          },
        },
      ],
    },
  ],
  purchasedOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);