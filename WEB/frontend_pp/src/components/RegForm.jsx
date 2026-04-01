import { useState } from "react";
import { register } from "../api";
import "../App.css";

export default function RegForm({ onSwitchToLogin }) {
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const [userdata, setUserdata] = useState({
        username: "",
        email: "",
        password: "",
        role: "user",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserdata((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            await register(
                userdata.username,
                userdata.password,
                userdata.email,
                userdata.role
            );
            setMessage("Sikeres regisztráció! Most jelentkezz be.");
            setTimeout(() => {
                onSwitchToLogin();
            }, 1500);
        } catch (err) {
            setError(err.message || "Hiba a regisztráció során");
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Regisztráció</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="auth-form-group">
                    <label>Felhasználónév:</label>
                    <input
                        type="text"
                        name="username"
                        value={userdata.username}
                        onChange={handleChange}
                        required
                        className="auth-input"
                    />
                </div>
                <div className="auth-form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={userdata.email}
                        onChange={handleChange}
                        required
                        className="auth-input"
                    />
                </div>
                <div className="auth-form-group">
                    <label>Jelszó:</label>
                    <input
                        type="password"
                        name="password"
                        value={userdata.password}
                        onChange={handleChange}
                        required
                        className="auth-input"
                    />
                </div>
                <button type="submit" className="auth-btn">
                    Regisztráció
                </button>
            </form>

            {message && <p className="auth-success">{message}</p>}
            {error && <p className="auth-error">{error}</p>}

            <p className="auth-switch">
                Már van fiókod?{" "}
                <button
                    type="button"
                    className="auth-link"
                    onClick={onSwitchToLogin}
                >
                    Bejelentkezés
                </button>
            </p>
        </div>
    );
}
