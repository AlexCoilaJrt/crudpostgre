const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

router.get('/products', controllers.getProducts);
router.get('/products/:id', controllers.getProductById);
router.post('/products', controllers.createProduct);
router.put('/products/:id', controllers.updateProduct);
router.delete('/products/:id', controllers.deleteProduct);

module.exports = router;
