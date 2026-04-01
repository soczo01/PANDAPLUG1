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
            (nev, email, telefon, cim, osszeg, datum)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.felhasznalo.nev,
                data.felhasznalo.email,
                data.felhasznalo.telefon,
                data.felhasznalo.cim,
                data.osszeg,
                formattedDate
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

module.exports = Order;
