const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('../models/userModel');
const bcrypt = require('bcryptjs');

const router = express.Router();

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// Token generálás
function generateAccessToken(user) {
    return jwt.sign(user, ACCESS_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
    return jwt.sign(user, REFRESH_SECRET, { expiresIn: '7d' });
}

// Auth middleware (védett útvonalak)
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, ACCESS_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: "Minden mező kitöltése kötelező" });
    }

    const existingUser = await users.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: "A felhasználónév már foglalt" });
    }

    const userId = await users.create(username, email, password, role || 'user');

    return res.status(201).json({ message: "Sikeres regisztráció", userId });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🟦 LOGIN – DB alapú bejelentkezés + JWT + refresh cookie
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Minden mező kitöltése kötelező" });
        }

        const user = await users.findByUsername(username);
        if (!user) {
            return res.status(401).json({ error: "Hibás a felhasználónév vagy jelszó" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Hibás a felhasználónév vagy jelszó" });
        }

        const payload = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,       // HTTPS esetén legyen true
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ accessToken });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// 🟧 TOKEN FRISSÍTÉS
router.post('/refresh', (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken == null) return res.sendStatus(401);

    jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

    const newAccessToken = generateAccessToken({
        id: user.id,
        username: user.username,
        role: user.role
    });

        res.json({ accessToken: newAccessToken });
    });
});

// 🟥 LOGOUT
router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
    });
    res.sendStatus(204);
});
 
// 🟩 VÉDETT ÚTVONAL PÉLDA
router.get('/profile', authenticateToken, async (req, res) => {
    const iat = new Date(req.user.iat * 1000).toLocaleString();
    const exp = new Date(req.user.exp * 1000).toLocaleString();
    // Csak a felhasználónév, id, role, token info
    res.json({
        message: "Sikeres hozzáférés a védett erőforráshoz",
        user: {
            id: req.user.id,
            username: req.user.username,
            role: req.user.role
        },
        token_info: { iat, exp }
    });
});

module.exports = router;
