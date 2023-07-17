/*
  Program:  E-commerce API MVP requirements
  Programmer: Vien Mendiola
  Section:  BSCSAN22
  Start Date: July 17 2023
  End Date:   July 17 2023
*/

const User = require('../models/user');
const bcrypt = require('bcrypt');
const auth = require('../auth');

//use to register the user
module.exports.registerUser = (reqBody) => {
  let newUser = new User({
    email: reqBody.email,
    password: bcrypt.hashSync(reqBody.password, 10),
  });

  return newUser.save().then((user, error) => {
    if (error) {
      return false;
    } else {
      return true;
    }
  });
};

//used to login the user (get access token)
module.exports.loginUser = (reqBody) => {
  return User.findOne({ email: reqBody.email }).then((result) => {
    if (result == null) {
      return false;
    } else {
      const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password);
      if (isPasswordCorrect) {
        return { access: auth.createAccessToken(result) };
      } else {
        return false;
      }
    }
  });
};

//use to get the all the details of the user
module.exports.getAllUsers = () => {
  return User.find({})
    .select("-password")
    .then((users) => {
      return users;
    })
    .catch((error) => {
      throw new Error(error.message);
    });
};

//use to get a specific user details using ID
module.exports.getProfile = (userData) => {
  const userId = userData.userId;
  return User.findById(userId)
    .select("-password")
    .then((result) => {
      if (!result) {
        throw new Error("User not found.");
      }
      result.password = "";
      return result;
    })
    .catch((error) => {
      throw new Error(error.message);
    });
};

//use for the checkout function
module.exports.createOrder = (token, orderData) => {
  const userData = auth.decode(token);
  if (!userData) {
    return Promise.resolve(false);
  }
  if (userData.isAdmin) {
    return Promise.resolve(false);
  }
  const newOrder = {
    products: orderData.products.map((product) => ({
      productId: product.productId,
      productName: product.productName,
      productDescription: product.productDescription,
      price: product.price,
      quantity: product.quantity,
      totalAmount: product.price * product.quantity,
    })),
  };

  // Add a missing closing curly brace for the createOrder function
  return User.findByIdAndUpdate(
    userData.id,
    {
      $push: { orderedProducts: newOrder },
    },
    { new: true }
  );
};

//use to show the current user order in postman
module.exports.getUserOrders = (userId) => {
  return User.findById(userId, 'orderedProducts')
    .then((user) => {
      if (!user) {
        return null;
      }
      return user.orderedProducts.map(order => {
        return {
          userId: user._id,
          orders: order.products.map(product => {
            return {
              productId: product.productId,
              productName: product.productName,
              quantity: product.quantity,
            };
          }),
          totalAmount:Array.from(order.products.map(product => {
            console.log(product)
            return product.price*product.quantity;
          })).reduce((partialSum, a) => partialSum + a, 0)
        };
      });
    })
    .catch((error) => {
      throw new Error(error.message);
    });
};


//use to show all orders in postman
module.exports.getAllOrders = () => {
  return User.find({}, 'orderedProducts')
    .then((users) => {
      const allOrders = users.reduce((orders, user) => {
        return orders.concat(user.orderedProducts);
      }, []);
      return allOrders.map(order => {
        return {
          userId: order._id,
          orders: order.products.map(product => {
            return {
              productId: product.productId,
              productName: product.productName,
              quantity: product.quantity,
            };
          }),
          totalAmount:Array.from(order.products.map(product => {
            console.log(product)
            return product.price*product.quantity;
          })).reduce((partialSum, a) => partialSum + a, 0)
        };
      });
    })
    .catch((error) => {
      throw new Error(error.message);
    });
};


//use to set a not admin user into admin
module.exports.setUserAsAdmin = (userId) => {
  return User.findByIdAndUpdate(userId, { isAdmin: true }, { new: true }).then((user) => {
    return user;
  });
};