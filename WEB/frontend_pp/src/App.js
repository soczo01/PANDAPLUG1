import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Menu from "./components/Menu";
import Kosar from "./components/Kosar";
import Filter from "./components/Filter";
import TermekLista from "./components/TermekLista";
import CheckoutPage from "./components/CheckoutPage"; // Új import
import { CartProvider } from "./context/CartContext";
import React, { useEffect, useState, useRef } from "react";
import LoginForm from "./components/LoginForm";
import RegForm from "./components/RegForm";
import { jwtDecode } from "jwt-decode";
import { getToken, logout, getCart } from "./api";
//  Router importok
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SearchBar from "./components/SearchBar"; // SearchBar import
import AdminTermekLista from "./components/admin/AdminTermekLista";

function App() {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [showRegister, setShowRegister] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // keresési szöveg

    //  KATEGÓRIA
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    //  FILTEREK
    const [filters, setFilters] = useState({
        size: "ALL",
        color: "ALL",
        brand: "ALL",
        price: "ALL",
    });

    const [cart, setCart] = useState([]);

    const handleFilterChange = (newFilter) => {
        setFilters((prev) => ({
            ...prev,
            ...newFilter,
        }));
    };

    useEffect(() => {
        const token = getToken();
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({ username: decoded.username, role: decoded.role });
                // Bármilyen user id mező (user_id, sub, id) támogatása
                const userId = decoded.user_id || decoded.sub || decoded.id;
                setUserId(userId);
                // Kosár frissítése userId alapján
                if (userId) {
                    fetch(`http://localhost:8080/api/cart/${userId}`)
                        .then(res => res.json())
                        .then(data => setCart(data || []));
                }
            } catch (e) {
                console.error("Hibás token");
            }
        }
    }, []);

    // Login/Regisztráció után kosár frissítés
    const handleLogin = (userObj, userId) => {
        setUser(userObj);
        setUserId(userId);
        if (userId) {
            fetch(`http://localhost:8080/api/cart/${userId}`)
                .then(res => res.json())
                .then(data => setCart(data || []));
        }
    };

    const kosarRef = useRef();

    return (
        <Router>
            <CartProvider>
                <div className="App">
                    {/* Hero Header */}
                    <div className="hero-header"></div>
                    {!user ? (
                        <div className="container mt-5 d-flex justify-content-center">
                            {showRegister ? (
                                <RegForm onSwitchToLogin={() => setShowRegister(false)} />
                            ) : (
                                <LoginForm
                                    onLogin={handleLogin}
                                    onSwitchToRegister={() => setShowRegister(true)}
                                />
                            )}
                        </div>
                    ) : (
                        <>
                            {user?.role === "admin" && (
                                <div style={{background:'#23272f',color:'#ffb347',fontWeight:'bold',fontSize:'1.3rem',borderRadius:10,padding:'10px 0',textAlign:'center',margin:'20px 0',letterSpacing:1}}>
                                    ADMIN FELÜLET
                                </div>
                            )}
                            <Menu onCategoryChange={setSelectedCategory} onSearch={setSearchQuery} user={user} />
                            {/* Globális gombok/elemek */}
                            <div className="container d-flex justify-content-between align-items-center mt-3">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        logout();
                                        setUser(null);
                                        setUserId(null);
                                    }}
                                >
                                    Kijelentkezés
                                </button>
                                <Kosar userId={userId} cart={cart} setCart={setCart} />
                            </div>

                            <Routes>
                                {/* ADMIN TERMÉKLISTA OLDAL */}
                                {user?.role === "admin" && (
                                    <Route path="/admin/termekek" element={<AdminTermekLista user={user} />} />
                                )}
                                {/* FŐOLDAL: Szűrő + SearchBar + Terméklista */}
                                <Route path="/" element={
                                    <>
                                        <div className="container mt-4">
                                            <Filter
                                                filters={filters}
                                                onFilterChange={handleFilterChange}
                                            />
                                        </div>
                                        <div className="container mt-4">
                                            <SearchBar onQuery={setSearchQuery} />
                                        </div>
                                        <TermekLista
                                            selectedCategory={selectedCategory}
                                            filters={filters}
                                            searchQuery={searchQuery}
                                            userId={userId}
                                        />
                                    </>
                                } />

                                {/* PÉNZTÁR OLDAL */}
                                <Route path="/checkout" element={<CheckoutPage />} />

                                {/* Ha nem létező oldalra megy, vissza a főoldalra */}
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </>
                    )}
                </div>
            </CartProvider>
        </Router>
    );
}

export default App;
