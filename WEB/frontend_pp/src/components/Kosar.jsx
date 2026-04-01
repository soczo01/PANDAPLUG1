import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api";

export default function Kosar({ userId }) {
    const { cart, setCart } = useCart();
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:8080/api/cart/${userId}`)
                .then(res => res.json())
                .then(data => setCart(data));
        }
    }, [setCart, userId]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCheckout = () => {
        handleClose();
        navigate("/checkout");
    };

    const removeItem = (itemId) => {
        if (!userId) return;
        fetch(`http://localhost:8080/api/cart/remove/${itemId}?user_id=${userId}`, {
            method: "DELETE"
        })
        .then(() =>
            fetch(`http://localhost:8080/api/cart/${userId}`)
                .then(res => res.json())
                .then(cartData => setCart(cartData))
        );
    };

    const clearCart = () => {
        if (!userId) return;
        fetch(`http://localhost:8080/api/cart/clear/${userId}`, {
            method: "DELETE"
        })
        .then(() => setCart([]));
    };

    const total = cart.reduce((sum, item) => sum + Number(item["Ár(usd)"] || 0), 0);

    const handleAddToCart = (termek_id) => {
        if (!userId) {
            console.error('Nincs userId, nem lehet kosárba rakni!');
            return;
        }
        fetch("http://localhost:8080/api/cart/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userId,
                termek_id,
                mennyiseg: 1,
            }),
        })
            .then(async res => {
                if (!res.ok) {
                    const err = await res.text();
                    console.error('Kosárba rakás hiba:', err);
                    return;
                }
                return res.json();
            })
            .then(() => {
                fetch(`http://localhost:8080/api/cart/${userId}`)
                    .then(res => res.json())
                    .then(cartData => setCart(cartData));
            })
            .catch(err => {
                console.error('Kosárba rakás fetch hiba:', err);
            });
    };

    if (!Array.isArray(cart)) {
        return <div style={{color:'red'}}>Hiba: a kosár tartalma nem tömb!</div>;
    }

    return (
        <>
            <Button variant="outline-dark" onClick={handleShow} className="cart-btn">
                <FaShoppingCart size={28} />
                {cart.length > 0 && (
                    <span className="cart-badge">{cart.length}</span>
                )}
            </Button>
            <Modal show={show} onHide={handleClose} centered contentClassName="cart-modal-overlay">
                <div className="cart-modal-card">
                    <Modal.Header closeButton className="cart-modal-header">
                        <Modal.Title className="cart-modal-title">Kosár tartalma</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="cart-modal-body">
                        {cart.length === 0 ? (
                            <p className="cart-modal-empty">A kosár üres.</p>
                        ) : (
                            <>
                                {cart.map(item => (
                                    <div className="cart-modal-item" key={item.item_id}>
                                        <img
                                            src={`http://localhost:8080/images/${item.kep_id}.png`}
                                            alt={item.Név}
                                            className="cart-modal-image"
                                        />
                                        <div className="cart-modal-details">
                                            <h2 className="cart-modal-title2">{item.Név}</h2>
                                            <p className="cart-modal-price">${item["Ár(usd)"]}</p>
                                            <p><strong>Méret:</strong> {item["Méret"]}</p>
                                            <Button size="sm" variant="danger" className="cart-modal-remove" onClick={() => removeItem(item.item_id)}>Törlés</Button>
                                        </div>
                                    </div>
                                ))}
                                <div className="cart-modal-summary">
                                    <div className="cart-modal-total-row">
                                        <span>Összesen:</span>
                                        <span className="cart-modal-total">${total.toFixed(2)}</span>
                                    </div>
                                    <Button 
                                        className="cart-modal-order-btn" 
                                        variant="success" 
                                        onClick={handleCheckout}
                                        style={{ width: '100%', marginTop: '10px' }}
                                    >
                                        ➔ Tovább a megrendeléshez
                                    </Button>
                                </div>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="cart-modal-footer">
                        {cart.length > 0 && (
                            <Button className="cart-modal-clear" variant="secondary" onClick={clearCart}>Kosár ürítése</Button>
                        )}
                        <Button className="cart-modal-close" variant="primary" onClick={handleClose}>Bezárás</Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </>
    );
}