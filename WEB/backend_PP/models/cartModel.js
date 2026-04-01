const pool = require('../config/db');

const Cart = {};

Cart.getCart = async (
    user_id) => {
    const [rows] = await pool.query(
        `SELECT 
            cart_items.id AS item_id,
            cart_items.mennyiseg,
            termekek.id AS termek_id,
            v.Név,
            v.\`Ár(usd)\`,
            v.Típus,
            v.Szín,
            v.Méret,
            v.Státusz,
            v.Márka,
            v.kep_id
        FROM cart
        JOIN cart_items ON cart.id = cart_items.cart_id
        JOIN view1 v ON cart_items.termek_id = v.termek_id
        JOIN termekek ON cart_items.termek_id = termekek.id
        WHERE cart.user_id = ?`,
        [user_id]
    );
    return rows;
};

Cart.addToCart = async ({ user_id, termek_id, mennyiseg }) => {
    // Kosár keresése
    const [cartRows] = await pool.query(
        "SELECT id FROM cart WHERE user_id = ?",
        [user_id]
    );

    let cart_id;

    // Ha nincs kosár → létrehozzuk
    if (cartRows.length === 0) {
        const [result] = await pool.query(
            "INSERT INTO cart (user_id) VALUES (?)",
            [user_id]
        );
        cart_id = result.insertId;
    } else {
        cart_id = cartRows[0].id;
    }

    // Ha már van ilyen termék → mennyiség növelése
    const [existing] = await pool.query(
        "SELECT id, mennyiseg FROM cart_items WHERE cart_id = ? AND termek_id = ?",
        [cart_id, termek_id]
    );

    if (existing.length > 0) {
        return pool.query(
            "UPDATE cart_items SET mennyiseg = mennyiseg + ? WHERE id = ?",
            [mennyiseg, existing[0].id]
        );
    }

    // Új tétel hozzáadása
    return pool.query(
        "INSERT INTO cart_items (cart_id, termek_id, mennyiseg) VALUES (?, ?, ?)",
        [cart_id, termek_id, mennyiseg]
    );
};

Cart.removeItem = async (item_id) => {
    return pool.query("DELETE FROM cart_items WHERE id = ?", [item_id]);
};

Cart.clearCart = async (user_id) => {
    const [cartRows] = await pool.query(
        "SELECT id FROM cart WHERE user_id = ?",
        [user_id]
    );
    if (cartRows.length === 0) return;
    const cart_id = cartRows[0].id;

    return pool.query("DELETE FROM cart_items WHERE cart_id = ?", [cart_id]);
};

module.exports = Cart;
