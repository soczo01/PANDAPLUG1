const Termek = require('../models/termekModel');
const { mapToUpdateDto } = require('../dto/termek.dto');
const termekController = {};

termekController.getAll = async (req, res) => {
    try {
        const termekek = await Termek.getAll();
        res.json(termekek);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

termekController.getById = async (req, res) => {
    try {
        const termek = await Termek.getById(req.params.id);
        if (!termek) return res.status(404).json({ message: 'Termék nem található' });
        res.json(termek);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

termekController.create = async (req, res) => {
    try {
        const result = await Termek.create(req.body);
        res.json({ message: 'Termék sikeresen létrehozva', insertId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

termekController.updateById = async (req, res) => {
    try {
        const data = {
            nev: req.body.nev ?? req.body["Név"],
            markanev: req.body.marka ?? req.body["Márka"],
            ar_usd: req.body.ar_usd ?? req.body["Ár (usd)"],
            meret: req.body.meret ?? req.body["Méret"],
            tipus: req.body.tipus ?? req.body["Típus"]
        };

        // minimális validáció
        if (!data.nev || !data.markanev) {
            return res.status(400).json({ error: "Hiányzó kötelező mező" });
        }

        const result = await Termek.updateById(req.params.id, data);
        res.json({ message: 'Termék frissítve', result });
    } catch (err) {
        console.error("UPDATE ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

termekController.deleteById = async (req, res) => {
    try {
        const result = await Termek.deleteById(req.params.id);
        res.json({ message: 'Termék törölve', result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Keresés név alapján
termekController.getByNev = async (req, res) => {
    try {
        const termekek = await Termek.getByName(req.params.nev);
        res.json(termekek);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Szűrés kategória/típus szerint
termekController.getByTipus = async (req, res) => {
    try {
        const termekek = await Termek.getByCategory(req.params.tipus);
        res.json(termekek);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

termekController.filter = async (req, res) => {
    try {
        const { tipus, meret, szin, marka, minAr, maxAr } = req.query;

        const termekek = await Termek.filter({
            tipus,
            meret,
            szin,
            marka,
            minAr,
            maxAr
        });

        res.json(termekek);

    } catch (error) {
        console.error("Hiba szűréskor:", error);
        res.status(500).json({ error: "Hiba a szűrés közben" });
    }
};

exports.filter = async (req, res) => {
    const { tipus, szin, meret, marka, page = 1 } = req.query;

    const limit = 16;
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM view1 WHERE 1=1";
    let params = [];

    if (tipus) {
        query += " AND Típus = ?";
        params.push(tipus);
    }

    if (szin) {
        query += " AND Szín = ?";
        params.push(szin);
    }

    if (meret) {
        query += " AND Méret = ?";
        params.push(meret);
    }

    if (marka) {
        query += " AND Márka = ?";
        params.push(marka);
    }

    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    try {
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error("Filter hiba:", err);
        res.status(500).json({ error: "Szűrési hiba" });
    }
};
module.exports = termekController;