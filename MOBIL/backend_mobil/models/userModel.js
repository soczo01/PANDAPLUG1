const pool = require('../config/db');
console.log("🔥 USERMODEL FUT – ROLE VERSION 🔥");
const bcrypt = require("bcryptjs")
const users = {}



users.create = async (username, email ,password, role) =>{
    try{
        const passwordencrypt = await bcrypt.hash(password, 10)
        const [result] = await pool.query("INSERT INTO users (username, email ,password, role) VALUES (?, ?, ?, ?) ", [username, email ,passwordencrypt, role])
        return  result.insertId
    }
    catch(error){
        console.error(error)
        throw error
    }

}

users.getById = async (id) =>{
    try {
        const [result] = await pool.query("SELECT * FROM users WHERE id = ?",  [id])
        return result[0]
    }
    catch(error){
        console.error(error)
        throw error
    }
}
users.findByUsername = async (username) =>{
    try{
        const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username])
        return rows[0]
    }
    catch(err){
        throw err
    }

}

users.findByUsernameandPassword = async (username, password) => {
    const user = await users.findByUsername(username)

    if (!user){
        return null
    }
    const invalid = await bcrypt.compare(password, user.password)
    if (!invalid) return null
    return user
}

module.exports = users