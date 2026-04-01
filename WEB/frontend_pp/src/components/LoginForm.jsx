import { useState } from "react";
import { login } from "../api";
import { jwtDecode } from "jwt-decode";
import "../App.css";

function LoginForm({ onLogin, onSwitchToRegister }) {
    const [user, setUser] = useState("");
    const [pwd, setPwd] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await login(user, pwd);
            const decoded = jwtDecode(data.accessToken);
            onLogin(
                { username: decoded.username, role: decoded.szerep || decoded.role },
                decoded.user_id || decoded.sub
            );
        } catch (err) {
            setError("Hibás felhasználónév vagy jelszó");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-container">
            <h2 className="auth-title">Bejelentkezés</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="auth-form-group">
                    <label>Felhasználónév:</label>
                    <input
                        type="text"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        required
                        className="auth-input"
                    />
                </div>
                <div className="auth-form-group">
                    <label>Jelszó:</label>
                    <input
                        type="password"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        required
                        className="auth-input"
                    />
                </div>
                <button type="submit" className="auth-btn" disabled={loading}>
                    {loading ? "Belépés..." : "Bejelentkezés"}
                </button>
            </form>
            {error && <p className="auth-error">{error}</p>}
            <p className="auth-switch">
                Nincs még fiókod?{' '}
                <button type="button" className="auth-link" onClick={onSwitchToRegister}>Regisztráció</button>
            </p>
        </div>
    );
}

export default LoginForm;
