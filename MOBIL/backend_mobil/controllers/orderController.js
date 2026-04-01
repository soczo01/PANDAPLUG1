const Order = require("../models/orderModel");

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

module.exports = orderController;
