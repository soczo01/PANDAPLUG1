const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// --- MÉRETEK ---
router.get("/sizes", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT meret AS meretnev FROM meret ORDER BY id"
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Nem sikerült lekérni a méreteket" });
    }
});

// --- SZÍNEK ---
router.get("/colors", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT szin AS szinnev FROM szin ORDER BY id"
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Nem sikerült lekérni a színeket" });
    }
});


router.get("/brands", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT markanev FROM marka ORDER BY id"
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Nem sikerült lekérni a márkákat" });
    }
});


// --- ÁR TARTOMÁNY ---
router.get("/prices", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT MIN(`Ár(usd)`) AS min, MAX(`Ár(usd)`) AS max FROM view1;");
        res.json(rows[0]);
    } catch (err) {
        console.error("Ár lekérési hiba:", err);
        res.status(500).json({ error: "Hiba az árak lekérésekor" });
    }
});

module.exports = router;
