/*
  Program:  E-commerce API MVP requirements
  Programmer: Vien Mendiola
  Section:  BSCSAN22
  Start Date: July 17 2023
  End Date:   July 17 2023
*/

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productControllers');
const auth = require('../auth');

// use to create product in postman
router.post('/create', auth.verify, auth.isAdmin, (req, res) => {
  productController.createProduct(req.body).then((resultFromController) => {
    if (resultFromController) {
      res.send(resultFromController);
      } else {
        res.status(500).send('Error creating product');
    }
  });
});

// use to show all product in postman
router.get("/all", (req, res) => {
  productController
    .getAllProducts()
    .then((products) => res.json(products))
    .catch((error) => res.status(500).json({ error: error.message }));
});

// use to show all active products in postman
router.get('/active', (req, res) => {
  productController.getActiveProducts().then((resultFromController) => {
    if (resultFromController) {
      res.send(resultFromController);
    } else {
      res.status(404).send('No active products found');
    }
  });
});

// use to show a specific product in postman
router.get('/:productId', (req, res) => {
  productController.getProductById(req.params.productId).then((resultFromController) => {
    if (resultFromController) {
      res.send(resultFromController);
    } else {
      res.status(404).send('Product not found');
    }
  });
});

// use to update product information in postman
router.put('/:productId/update', auth.verify, auth.isAdmin, (req, res) => {
  productController.updateProduct(req.params.productId, req.body).then((resultFromController) => {
    if (resultFromController) {
      res.send(resultFromController);
    } else {
      res.status(500).send('Error updating product');
    }
  });
});

// use to make product into isActive false in postman
router.put('/:productId/archive', auth.verify, auth.isAdmin, (req, res) => {
  productController.archiveProduct(req.params.productId).then((resultFromController) => {
    if (resultFromController) {
      res.send(resultFromController);
    } else {
      res.status(500).send('Error archiving product');
    }
  });
});

//use to activate product in postman
router.put("/:productId/activate", auth.verify, auth.isAdmin, (req, res) => {
  productController.activateProduct(req.params.productId)
    .then((resultFromController) => {
      if (resultFromController) {
        res.json(resultFromController);
      } else {
        res.status(500).send("Error activating product");
      }
    })
    .catch((error) => {
      res.status(500).send("Error activating product");
    });
});


module.exports = router;