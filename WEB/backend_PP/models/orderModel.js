const pool = require("../config/db");

const Order = {};

Order.createOrder = async (data) => {
    const conn = await pool.getConnection();
    const formattedDate =
    new Date(data.datum)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    try {
        await conn.beginTransaction();
        // ORDER
        const [orderResult] = await conn.query(
            `INSERT INTO orders 
            (nev, email, telefon, cim, osszeg, datum, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                data.felhasznalo.nev,
                data.felhasznalo.email,
                data.felhasznalo.telefon,
                data.felhasznalo.cim,
                data.osszeg,
                formattedDate,
                data.userId // users tábla id mezője
            ]
        );
        const orderId = orderResult.insertId;
        // ITEMS
        for (const item of data.termekek) {
            await conn.query(
                `INSERT INTO order_items
                (order_id, termek_id, nev, meret, ar)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    orderId,
                    item.termek_id || null,
                    item.Név || "",
                    item.Méret || "",
                    Number(item["Ár(usd)"] || 0)
                ]
            );
        }
        await conn.commit();
        return orderId;
    } catch (err) {
        await conn.rollback();
        console.error("ORDER SQL HIBA:", err);
        throw err;
    } finally {
        conn.release();
    }
};

Order.getOrdersByEmail = async (email) => {
    try {
        const [orders] = await pool.query(
            `SELECT * FROM orders WHERE email = ? ORDER BY datum DESC`,
            [email]
        );
        return orders;
    } catch (err) {
        console.error("ORDER LEKÉRDEZÉS HIBA:", err);
        throw err;
    }
};

Order.getOrdersByUserId = async (userId) => {
    try {
        // Lekérjük az összes rendelést a users tábla id mezője alapján
        const [orders] = await pool.query(
            `SELECT * FROM orders WHERE user_id = ? ORDER BY datum DESC`,
            [userId]
        );
        for (const order of orders) {
            const [items] = await pool.query(
                `SELECT * FROM order_items WHERE order_id = ?`,
                [order.id]
            );
            order.items = items;
        }
        return orders;
    } catch (err) {
        console.error("ORDER LEKÉRDEZÉS HIBA:", err);
        throw err;
    }
};

module.exports = Order;
