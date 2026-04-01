const pool = require('../config/db');

const Termek = {};

// Összes termék (view1-ből!)
Termek.getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM view1');
    return rows;
};

// Termék ID alapján (view1)
Termek.getById = async (id) => {
    const [rows] = await pool.query(
        'SELECT * FROM view1 WHERE termek_id = ?',
        [id]
    );
    return rows[0];
};

// Termék létrehozása (termekek tábla)
Termek.create = async (data) => {
    const [rows] = await pool.query(
        'INSERT INTO termekek SET ?',
        [data]
    );
    return rows;
};

// Termék frissítése (termekek tábla)
Termek.updateById = async (id, data) => {
    const [rows] = await pool.query(
        'UPDATE termekek SET ? WHERE id = ?',
        [data, id]
    );
    return rows;
};
// Termék törlése
Termek.deleteById = async (id) => {
    const [rows] = await pool.query(
        'DELETE FROM termekek WHERE id = ?',
        [id]
    );
    return rows;
};

// KERESÉS név alapján (view1)
Termek.getByName = async (nev) => {
    const [rows] = await pool.query(
        'SELECT * FROM view1 WHERE Nev LIKE ?',
        [`%${nev}%`]
    );
    return rows;
};

// SZŰRÉS kategória/típus szerint (view1)
Termek.getByCategory = async (tipus) => {
    const [rows] = await pool.query(
        'SELECT * FROM view1 WHERE Típus = ?',
        [tipus]
    );
    return rows;
};

Termek.filter = async ({ tipus, meret, szin, marka, minAr, maxAr }) => {
    let sql = "SELECT * FROM view1 WHERE 1=1 ";
    const params = [];

    if (tipus) {
        sql += " AND Típus = ? ";
        params.push(tipus);
    }

    if (meret) {
        sql += " AND Méret = ? ";
        params.push(meret);
    }

    if (szin) {
        sql += " AND Szín = ? ";
        params.push(szin);
    }

    if (marka) {
    sql += " AND Márka = ? ";
    params.push(marka);
    }

    if (minAr) {
        sql += " AND `Ár(usd)` >= ? ";
        params.push(minAr);
    }

    if (maxAr) {
        sql += " AND `Ár(usd)` <= ? ";
        params.push(maxAr);
    }

    const [rows] = await pool.query(sql, params);
    return rows;
};



module.exports = Termek;