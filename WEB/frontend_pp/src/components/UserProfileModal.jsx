import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { getProfile } from "../api";

export default function UserProfileModal({ show, onClose, userId }) {
    const [uprofile, setUprofile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!show) return;
        getProfile()
            .then(profile => {
                setUprofile(profile.user || profile);
                // Rendelések lekérése userId alapján
                const id = (profile.user || profile).id || userId;
                if (id) {
                    fetch(`http://localhost:8080/api/orders/user-id/${id}`)
                        .then(res => res.json())
                        .then(data => setOrders(data || []));
                }
            })
            .catch(() => setError("Hiba a profil lekérésekor"));
    }, [show, userId]);

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Profil</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {uprofile && (
                    <div>
                        <p style={{fontWeight:'bold',fontSize:'1.1rem',color:'#fff',background:'#23272f',padding:'8px 16px',borderRadius:'8px',marginBottom:'10px'}}>
                            <span style={{color:'#ffb347'}}>Felhasználónév:</span> {uprofile.username}
                        </p>
                    </div>
                )}
                <hr style={{borderColor:'#444'}} />
                <h5 style={{color:'#ffb347',fontWeight:'bold'}}>Korábbi rendelések</h5>
                {orders.length === 0 ? (
                    <p style={{color:'#bbb'}}>Nincs korábbi rendelés.</p>
                ) : (
                    <div style={{marginTop: '1rem'}}>
                        {orders.map(order => {
                            // Dátum formázás: csak év-hónap-nap
                            let dateStr = order.datum;
                            if (dateStr) {
                                const d = new Date(dateStr);
                                dateStr = `${d.getFullYear()}. ${String(d.getMonth()+1).padStart(2,'0')}. ${String(d.getDate()).padStart(2,'0')}`;
                            }
                            return (
                                <div key={order.id} style={{background:'#23272f',border:'1px solid #444',borderRadius:8,padding:'12px',marginBottom:'16px',color:'#fff',boxShadow:'0 2px 8px #0002'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <span style={{fontWeight: 'bold', fontSize: '1.1rem',color:'#ffb347'}}>Rendelés #{order.id}</span>
                                        <span style={{color: '#bbb'}}>{dateStr}</span>
                                    </div>
                                    <div style={{marginTop: 8}}>
                                        <span style={{fontWeight: 'bold',color:'#ffb347'}}>Összeg:</span> {order.osszeg} USD
                                    </div>
                                    {order.items && order.items.length > 0 && (
                                        <div style={{marginTop: 8}}>
                                            <span style={{fontWeight: 'bold',color:'#ffb347'}}>Termékek:</span>
                                            <ul style={{marginLeft: 16}}>
                                                {order.items.map((item, idx) => (
                                                    <li key={item.order_item_id ? `item-${item.order_item_id}` : `item-${order.id}-${idx}`} style={{color:'#fff'}}>
                                                        {item.nev} ({item.meret}) - {item.ar} USD
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Bezárás</Button>
            </Modal.Footer>
        </Modal>
    );
}
