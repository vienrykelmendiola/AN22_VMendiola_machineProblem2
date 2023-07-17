/*
  Program:  E-commerce API MVP requirements
  Programmer: Vien Mendiola
  Section:  BSCSAN22
  Start Date: July 17 2023
  End Date:   July 17 2023
*/

const Product = require('../models/product');

module.exports.createProduct = (productData) => {
  let newProduct = new Product({
    name: productData.name,
    description: productData.description,
    price: productData.price,
    isActive: true, // By default, a newly created product is active
  });

  return newProduct.save().then((product, error) => {
    if (error) {
      return false;
    } else {
      return true;
    }
  });
};

module.exports.getAllProducts = () => {
  return Product.find({}).then((products) => {
    return products;
  }).catch((error) => {
    throw new Error('Error retrieving products');
  });
};

module.exports.getActiveProducts = () => {
  return Product.find({ isActive: true }).then((products) => {
    return products;
  });
};

module.exports.getProductById = (productId) => {
  return Product.findById(productId).then((product) => { 
    return product; 
  });
};

module.exports.updateProduct = (productId, updateData) => {
  return Product.findByIdAndUpdate(productId, updateData, { new: true }).then((updatedProduct) => { 
    return updatedProduct;
  });
};

module.exports.archiveProduct = (productId) => {
  return Product.findByIdAndUpdate(productId, { isActive: false }, { new: true }).then((archiveProduct) => { 
    return archiveProduct;
  });
};







