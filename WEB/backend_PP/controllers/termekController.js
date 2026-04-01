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
        const id = req.params.id;

        const {
            nev,
            ar_usd,
            szin_id,
            meret_id,
            elerhetoseg_id,
            tipus_id,
            marka_id,
            kep_id
        } = req.body;

        const data = {};

        if (nev !== undefined) data.nev = nev;
        if (ar_usd !== undefined) data.ar_usd = ar_usd;
        if (szin_id !== undefined) data.szin_id = szin_id;
        if (meret_id !== undefined) data.meret_id = meret_id;
        if (elerhetoseg_id !== undefined) data.elerhetoseg_id = elerhetoseg_id;
        if (tipus_id !== undefined) data.tipus_id = tipus_id;
        if (marka_id !== undefined) data.marka_id = marka_id;
        if (kep_id !== undefined) data.kep_id = kep_id;

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ error: "Nincs frissíthető mező" });
        }

        const result = await Termek.updateById(id, data);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Nincs ilyen termék" });
        }

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

module.exports = termekController;