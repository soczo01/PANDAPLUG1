import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import Details from "./Details";
import Spinner from 'react-bootstrap/Spinner';
import Toast from 'react-bootstrap/Toast';

export default function TermekLista({ selectedCategory, filters, searchQuery, userId }) {
    const [termekek, setTermekek] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const { cart,setCart } = useCart();

    //keresési módban lapozva töltsük be az eredményeket
    const loadProducts = async (nextPage = 1, query = "") => {
        try {
            let url;
            if (query && query.trim() !== "") {
                url = `http://localhost:8080/api/termekek/search?q=${encodeURIComponent(query)}&page=${nextPage}&limit=16`;
            } else {
                url = `http://localhost:8080/api/termekek/paged?page=${nextPage}&limit=16`;
            }
            const res = await fetch(url);
            const data = await res.json();
            if (!Array.isArray(data)) {
                setHasMore(false);
                return;
            }
            if (data.length === 0) {
                setHasMore(false);
                return;
            }
            if (nextPage === 1) {
                setTermekek(data);
            } else {
                setTermekek(prev => [...prev, ...data]);
            }
        } catch (err) {
            setHasMore(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Első betöltés vagy keresés váltás
    useEffect(() => {
        setLoading(true);
        setPage(1);
        setHasMore(true);
        loadProducts(1, searchQuery);
    }, [selectedCategory, filters?.brand, filters?.size, filters?.color, filters?.price, searchQuery, userId]);

    // Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (!hasMore || loadingMore) return;
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
                setLoadingMore(true);
                setPage(prev => prev + 1);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, loadingMore]);

    useEffect(() => {
        if (page > 1) loadProducts(page, searchQuery);
    }, [page, searchQuery]);

    // ---------------- SZŰRÉS------------------
    const filteredProducts = termekek
        .filter((t) => {
            // KATEGÓRIA
            if (selectedCategory !== "ALL") {
                const map = {
                    shirts: "polo",
                    hoodies: "pulover",
                    pants: "nadrag",
                    shorts: "rovidnadrag"
                };
                if (t["Típus"] !== map[selectedCategory]) return false;
            }

            if (filters.brand !== "ALL" && t["Márka"] !== filters.brand) return false;
            if (filters.size !== "ALL" && t["Méret"] !== filters.size) return false;
            if (filters.color !== "ALL" && t["Szín"] !== filters.color) return false;

            return true;
        })
        .sort((a, b) => {
            if (filters.price === "ASC") return a["Ár(usd)"] - b["Ár(usd)"];
            if (filters.price === "DESC") return b["Ár(usd)"] - a["Ár(usd)"];
            return 0;
        });

    // ------------ KOSÁRBA --------------
    const handleAddToCart = (termek_id) => {

    // ---- ELLENŐRZÉS ----
    const alreadyInCart = cart?.some(
        (item) => item.termek_id === termek_id
    );

    if (alreadyInCart) {
        alert("A termék már a kosárban van!");
        return;
    }

    // ---- HA NINCS BENNE ----
    fetch("http://localhost:8080/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: userId,
            termek_id,
            mennyiseg: 1,
        }),
    })
        .then(res => res.json())
        .then(() => {
            fetch(`http://localhost:8080/api/cart/${userId}`)
                .then(res => res.json())
                .then(cartData => setCart(cartData));
            setShowToast(true); // Visszajelzés!
            setTimeout(() => setShowToast(false), 2000);
        });
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{minHeight: '40vh'}}>
            <Spinner animation="border" variant="light" role="status" style={{width: '3rem', height: '3rem'}}>
                <span className="visually-hidden">Betöltés...</span>
            </Spinner>
        </div>
    );

    return (
        <div className="container mt-4">

            {/* Toast visszajelzés */}
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                delay={2000}
                autohide
                style={{ position: 'fixed', top: 80, right: 20, zIndex: 9999 }}
            >
                <Toast.Body style={{ background: '#222', color: '#fff', fontWeight: 'bold' }}>
                    Termék a kosárba került!
                </Toast.Body>
            </Toast>

            {/* Részletes nézet */}
            <Details
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={handleAddToCart}
                onSelectProduct={(p) => setSelectedProduct(p)}
            />

            <h1 className="mb-4 text-center">Termékek</h1>

            <div className="row g-4">
                {filteredProducts.map((t) => (
                    <div
                        className="col-6 col-md-4 col-lg-3"
                        key={t.termek_id}
                        onClick={() => setSelectedProduct(t)}
                        style={{ cursor: "pointer" }}
                    >
                        <div className="card h-100 text-center shadow-sm">

                            <img
                                src={`http://localhost:8080/images/${t.kep_id}.png`}
                                className="card-img-top p-3"
                                style={{ height: "250px", objectFit: "contain" }}
                                alt={t.Nev}
                            />

                            <div className="card-body">
                                <h5 className="card-title">{t["Név"]}</h5>
                                <p className="card-text.fw-bold">${t["Ár(usd)"]}</p>
                                <p className="text-muted mb-2">
                                    Méret: <strong>{t["Méret"]}</strong>
                                </p>

                                <button
                                    className="btn btn-dark w-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(t.termek_id);
                                    }}
                                >
                                    Kosárba
                                </button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            {loadingMore && <p className="text-center mt-4">Töltés...</p>}

            {!hasMore && (
                <p className="text-center mt-4 text-muted">
                    Nincsen több termék.
                </p>
            )}
        </div>
    );
}