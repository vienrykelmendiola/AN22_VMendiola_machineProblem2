/*
  Program:  E-commerce API MVP requirements
  Programmer: Vien Mendiola
  Section:  BSCSAN22
  Start Date: July 17 2023
  End Date:   July 17 2023
*/

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const auth = require('../auth');

// register command for postman
router.post('/register', (req, res) => {
  userController.registerUser(req.body).then((resultFromController) => {
    res.send(resultFromController);
  });
});

// login command for postman
router.post('/login', (req, res) => {
  userController.loginUser(req.body).then((resultFromController) => {
    res.send(resultFromController);
  });
});

// display all user details in postman
router.get("/details", auth.verify, auth.isAdmin, (req, res) => {
  userController.getAllUsers()
    .then((resultFromController) => {
      res.json(resultFromController);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error retrieving user details." });
    });
});

// display specific user details in postman
router.get('/:userId/userDetails', auth.verify, (req, res) => {
  const userData = auth.decode(req.headers.authorization);
  userController.getProfile({ userId: userData.id }).then((resultFromController) => {
    res.send(resultFromController);
  });
});

// use for non admin to checkout/order in postman 
router.post('/checkout', auth.verify, (req, res) => {
  userController.createOrder(req.headers.authorization, req.body).then((resultFromController) => {
    if (resultFromController) {
      res.send(resultFromController);
    } else {
      res.status(401).send('Unauthorized');
    }
  });
});

// use to show a users orders by using checklist in postman
router.get('/myOrders', auth.verify, (req, res) => {
  const token = req.headers.authorization;
  const userData = auth.decode(token);
  if (userData) {
    userController.getUserOrders(userData.id).then((resultFromController) => {
      res.send(resultFromController);
    });
  } else {
    res.status(401).send('Unauthorized');
  }
});

// use to show all users order in postman
router.get('/orders', auth.verify, auth.isAdmin, (req, res) => {
  userController.getAllOrders()
    .then((resultFromController) => {
      res.json(resultFromController);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error retrieving orders" });
    });
});

// use to make user into admin in postman (note that a single admin should exist for this command to make sense)
router.put('/:userId/setAsAdmin', auth.verify, auth.isAdmin, (req, res) => {
  userController.setUserAsAdmin(req.params.userId).then((resultFromController) => {
    if (resultFromController) {
      res.send(resultFromController);
    } else {
      res.status(404).send('User not found');
    }
  });
});

module.exports = router;