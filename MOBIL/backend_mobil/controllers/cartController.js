const Cart = require('../models/cartModel');

const cartController = {};

cartController.getCart = async (req, res) => {
    try {
        const cart = await Cart.getCart(req.params.user_id);
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

cartController.addToCart = async (req, res) => {
    try {
        const result = await Cart.addToCart(req.body);
        res.json({ message: "Kosár frissítve", result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

cartController.removeItem = async (req, res) => {
    try {
        const result = await Cart.removeItem(req.params.item_id);
        res.json({ message: "Tétel törölve", result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

cartController.clearCart = async (req, res) => {
    try {
        const result = await Cart.clearCart(req.params.user_id);
        res.json({ message: "Kosár kiürítve", result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = cartController;
