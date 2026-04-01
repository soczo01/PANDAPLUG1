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
exports.login = async (req, res, next) => {
  try {
    // A React-től érkező 'user' (felhasználónév) és 'pwd' (jelszó) változókat fogadjuk
    // MEGJEGYZÉS: Ha a React kódban 'user'-nek nevezted el a mezőt, a backend-nek azt kell várnia
    const { username, jelszo } = req.body; 

    // A Modellben 'findByUsername' van, nem 'findByEmail'!
    const user = await Felhasznalo.findByUsername(username);
    
    if (!user) {
      return res.status(400).json({ message: "Hibás felhasználónév vagy jelszó." });
    }

    // Jelszó ellenőrzés (az adatbázisban 'password' az oszlop neve a képed alapján!)
    const isMatch = await bcrypt.compare(jelszo, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Hibás felhasználónév vagy jelszó." });
    }

    // Access token generálása
    // Fontos: a mezőnevek (id, username, role) egyezzenek az adatbázissal!
    const accessToken = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        szerep: user.role // A képeden 'role' az oszlop neve
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: "Sikeres bejelentkezés!",
      accessToken
    });

  } catch (error) {
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