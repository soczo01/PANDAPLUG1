const Order = require("../models/orderModel");
const { getById } = require("../models/userModel");

const orderController = {};

orderController.createOrder = async (req, res) => {
    try {
        const orderId = await Order.createOrder(req.body);

        res.status(201).json({
            message: "Rendelés sikeresen mentve",
            orderId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    console.log(JSON.stringify(req.body, null, 2));

};

orderController.getOrdersByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        if (!email) return res.status(400).json({ error: "Email szükséges" });
        const orders = await Order.getOrdersByEmail(email);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

orderController.getOrdersByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) return res.status(400).json({ error: "userId szükséges" });
        // Ellenőrizzük, hogy létezik-e a user
        const user = await getById(userId);
        if (!user) return res.status(404).json({ error: "Felhasználó nem található" });
        const orders = await Order.getOrdersByUserId(userId);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = orderController;
