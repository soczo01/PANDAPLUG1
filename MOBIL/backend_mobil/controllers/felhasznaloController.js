const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Felhasznalo = require("../models/felhasznaloModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

//1. regisztráció
exports.register = async (req, res, next) => {
  try {
    // validációs hibák ellenőrzése
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nev, email, jelszo, telefon, cim } = req.body;

    // email létezik-e?
    const userExists = await Felhasznalo.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: "A megadott email már foglalt." });
    }

    // jelszó hash
    const hashedPassword = await bcrypt.hash(jelszo, 10);

    // felhasználó mentése
    await Felhasznalo.createUser({
      nev,
      email,
      jelszo: hashedPassword,
      telefon,
      cim
    });

    // válasz
    res.status(201).json({ message: "Sikeres regisztráció!" });

  } catch (error) {
    next(error);
  }
};

//2. bejelentkezés
// felhasznaloController.js - LOGIN JAVÍTÁSA
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Felhasznalo = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.login = async (req, res, next) => {
  try {
    const { username, jelszo } = req.body;

    console.log("LOGIN BODY:", req.body);

    const user = await Felhasznalo.findByUsername(username);
    console.log("LOGIN USER:", user);

    if (!user) {
      console.log("NINCS ILYEN USER");
      return res.status(400).json({ message: "Hibas felhasznalonev vagy jelszo." });
    }

    const isMatch = await bcrypt.compare(jelszo, user.password);
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      console.log("ROSSZ JELSZO");
      return res.status(400).json({ message: "Hibas felhasznalonev vagy jelszo." });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        szerep: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("LOGIN SIKER");

    res.json({
      message: "Sikeres bejelentkezes!",
      accessToken
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    next(error);
  }
};

//3. refresh token kezelése
exports.refreshToken = (req, res) => {
  try {
    // Cookie kiolvasása
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Nincs refresh token." });
    }

    // Refresh token ellenőrzése
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);

    // Új access token generálása
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email, szerep: decoded.szerep },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Küldjük vissza az új access tokent
    return res.json({
      accessToken: newAccessToken,
    });

  } catch (error) {
    return res.status(403).json({ message: "Érvénytelen vagy lejárt refresh token." });
  }
};

//4. védett útvonal - profil lekérése
exports.profil = async (req, res, next) => {
  try {
    const user = await Felhasznalo.getById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Felhasználó nem található." });
    }

    
    res.json({ user });

  } catch (error) {
    next(error);
  }
};