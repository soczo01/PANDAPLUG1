var express = require('express');
var router = express.Router();
var cartController = require('../controllers/cartController');

// Kosár lekérése
router.get('/:user_id', (req, res) => {
    cartController.getCart(req, res);
});

// Tétel hozzáadása a kosárhoz
router.post('/add', (req, res) => {
    cartController.addToCart(req, res);
});

// Tétel eltávolítása
router.delete('/remove/:item_id', (req, res) => {
    cartController.removeItem(req, res);
});

// Kosár ürítése
router.delete('/clear/:user_id', (req, res) => {
    cartController.clearCart(req, res);
});

module.exports = router;
