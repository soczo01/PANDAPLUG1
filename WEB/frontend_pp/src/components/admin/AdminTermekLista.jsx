import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const LIMIT = 16;

export default function AdminTermekLista({ user }) {
    const [termekek, setTermekek] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [editProduct, setEditProduct] = useState(null);
    const [saving, setSaving] = useState(false);

    // legördülő opciók
    const [markak, setMarkak] = useState([]);
    const [meretek, setMeretek] = useState([]);
    const [tipusok, setTipusok] = useState([]);
    const [szinek, setSzinek] = useState([]);
    const [elerhetosegek, setElerhetosegek] = useState([]);

    const observerRef = useRef(null);

    const loadMore = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const res = await fetch(
                `/api/termekek/paged?page=${page}&limit=${LIMIT}`
            );
            if (!res.ok) throw new Error();

            const data = await res.json();

            setTermekek(prev => [...prev, ...data]);
            setHasMore(data.length === LIMIT);
            setPage(prev => prev + 1);
        } catch {
            setError("Nem sikerült betölteni a termékeket!");
        } finally {
            setLoading(false);
        }
    };

    // első betöltés – termékek + legördülős listák
    useEffect(() => {
        loadMore();

        // opciók betöltése
        const loadOptions = async () => {
            try {
                const [markaRes, meretRes, tipusRes, szinRes, elerhetRes] =
                    await Promise.all([
                        fetch("/api/termekek/markak"),
                        fetch("/api/termekek/meretek"),
                        fetch("/api/termekek/tipusok"),
                        fetch("/api/termekek/szinek"),
                        fetch("/api/termekek/elerhetosegek")
                    ]);

                if (!markaRes.ok || !meretRes.ok || !tipusRes.ok || !szinRes.ok || !elerhetRes.ok) {
                    throw new Error();
                }

                const [markakJson, meretekJson, tipusokJson, szinekJson, elerhetJson] =
                    await Promise.all([
                        markaRes.json(),
                        meretRes.json(),
                        tipusRes.json(),
                        szinRes.json(),
                        elerhetRes.json()
                    ]);

                setMarkak(markakJson);
                setMeretek(meretekJson);
                setTipusok(tipusokJson);
                setSzinek(szinekJson);
                setElerhetosegek(elerhetJson);
            } catch (e) {
                console.error("Nem sikerült az opciókat betölteni!", e);
            }
        };

        loadOptions();

    }, []);

    // infinite scroll observer
    useEffect(() => {
        if (!observerRef.current) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                loadMore();
            }
        });

        observer.observe(observerRef.current);

        return () => observer.disconnect();

    }, [observerRef.current, hasMore, loading]);

    // törlés
    const handleDelete = async (id) => {
        if (!window.confirm("Biztosan törlöd ezt a terméket?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/termekek/admin/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error();

            setTermekek(prev => prev.filter(t => t.termek_id !== id));
        } catch {
            alert("Hiba a törlés során!");
        }
    };

    // szerkesztés – termek objektumból készítünk editProduct-ot ID-kkel
    const handleEdit = (termek) => {
        // megtaláljuk a hozzá tartozó ID-kat a szövegek alapján
        const markaObj = markak.find(m => m.markanev === termek["Márka"]);
        const meretObj = meretek.find(m => m.meret === termek["Méret"]);
        const tipusObj = tipusok.find(t => t.tipus === termek["Típus"]);
        const szinObj = szinek.find(s => s.szin === termek["Szín"]);
        const elerhetObj = elerhetosegek.find(e => e.statusz === termek["Státusz"]);

        setEditProduct({
            termek_id: termek.termek_id,
            nev: termek["Név"] || termek.nev || "",
            ar_usd: termek["Ár(usd)"] || termek.ar_usd || "",
            marka_id: markaObj ? markaObj.id : "",
            meret_id: meretObj ? meretObj.id : "",
            tipus_id: tipusObj ? tipusObj.id : "",
            szin_id: szinObj ? szinObj.id : "",
            elerhetoseg_id: elerhetObj ? elerhetObj.id : "",
            kep_id: termek.kep_id || ""
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSave = async () => {
        if (!editProduct) return;

        // minimális validáció – ezek a mezők NOT NULL-ok a DB-ben
        if (!editProduct.nev || !editProduct.ar_usd ||
            !editProduct.marka_id || !editProduct.meret_id ||
            !editProduct.szin_id || !editProduct.tipus_id ||
            !editProduct.elerhetoseg_id) {
            alert("Minden kötelező mezőt ki kell tölteni!");
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem("token");

            const bodyToSend = {
                nev: editProduct.nev,
                ar_usd: Number(editProduct.ar_usd),
                marka_id: Number(editProduct.marka_id),
                meret_id: Number(editProduct.meret_id),
                tipus_id: Number(editProduct.tipus_id),
                szin_id: Number(editProduct.szin_id),
                elerhetoseg_id: Number(editProduct.elerhetoseg_id),
                kep_id: editProduct.kep_id
            };

            const res = await fetch(
                `/api/termekek/admin/${editProduct.termek_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(bodyToSend)
                }
            );

            if (!res.ok) throw new Error();

            // új display szövegek a kiválasztott ID-k alapján
            const markaLabel =
                markak.find(m => m.id === Number(editProduct.marka_id))?.markanev;
            const meretLabel =
                meretek.find(m => m.id === Number(editProduct.meret_id))?.meret;
            const tipusLabel =
                tipusok.find(t => t.id === Number(editProduct.tipus_id))?.tipus;
            const szinLabel =
                szinek.find(s => s.id === Number(editProduct.szin_id))?.szin;
            const statuszLabel =
                elerhetosegek.find(e => e.id === Number(editProduct.elerhetoseg_id))?.statusz;

            // lista frissítése
            setTermekek(prev =>
                prev.map(t =>
                    t.termek_id === editProduct.termek_id
                        ? {
                            ...t,
                            "Név": editProduct.nev,
                            "Ár(usd)": bodyToSend.ar_usd,
                            "Márka": markaLabel || t["Márka"],
                            "Méret": meretLabel || t["Méret"],
                            "Típus": tipusLabel || t["Típus"],
                            "Szín": szinLabel || t["Szín"],
                            "Státusz": statuszLabel || t["Státusz"],
                            kep_id: editProduct.kep_id
                        }
                        : t
                )
            );

            setEditProduct(null);
        } catch {
            alert("Hiba a szerkesztés során!");
        } finally {
            setSaving(false);
        }
    };

    if (error) return <div className="text-danger text-center mt-5">{error}</div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Admin terméklista</h2>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Név</th>
                        <th>Márka</th>
                        <th>Ár (USD)</th>
                        <th>Méret</th>
                        <th>Típus</th>
                        <th>Kép</th>
                        <th>Művelet</th>
                    </tr>
                </thead>
                <tbody>
                    {termekek.map(t => (
                        <tr key={t.termek_id}>
                            <td>{t.termek_id}</td>
                            <td>{t["Név"]}</td>
                            <td>{t["Márka"]}</td>
                            <td>{t["Ár(usd)"]}</td>
                            <td>{t["Méret"]}</td>
                            <td>{t["Típus"]}</td>
                            <td>
                                <img
                                    src={`/images/${t.kep_id}.png`}
                                    alt="kep"
                                    style={{ width: 60 }}
                                />
                            </td>
                            <td>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(t.termek_id)}
                                >
                                    Törlés
                                </Button>{" "}
                                <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() => handleEdit(t)}
                                >
                                    Szerkesztés
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* infinite scroll sentinel */}
            <div ref={observerRef} style={{ height: 1 }} />

            {loading && (
                <div className="text-center my-3">Betöltés…</div>
            )}

            {!hasMore && (
                <div className="text-center text-muted my-3">
                    Nincs több termék
                </div>
            )}

            {/* Szerkesztő modal */}
            <Modal show={!!editProduct} onHide={() => setEditProduct(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Termék szerkesztése</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editProduct && (
                        <Form>
                            {/* Név */}
                            <Form.Group className="mb-2">
                                <Form.Label>Név</Form.Label>
                                <Form.Control
                                    name="nev"
                                    value={editProduct.nev || ""}
                                    onChange={handleEditChange}
                                />
                            </Form.Group>

                            {/* Ár */}
                            <Form.Group className="mb-2">
                                <Form.Label>Ár (USD)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="ar_usd"
                                    value={editProduct.ar_usd || ""}
                                    onChange={handleEditChange}
                                />
                            </Form.Group>

                            {/* Márka */}
                            <Form.Group className="mb-2">
                                <Form.Label>Márka</Form.Label>
                                <Form.Select
                                    name="marka_id"
                                    value={editProduct.marka_id || ""}
                                    onChange={handleEditChange}
                                >
                                    <option value="">Válassz márkát</option>
                                    {markak.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.markanev}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            {/* Méret */}
                            <Form.Group className="mb-2">
                                <Form.Label>Méret</Form.Label>
                                <Form.Select
                                    name="meret_id"
                                    value={editProduct.meret_id || ""}
                                    onChange={handleEditChange}
                                >
                                    <option value="">Válassz méretet</option>
                                    {meretek.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.meret}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            {/* Típus */}
                            <Form.Group className="mb-2">
                                <Form.Label>Típus</Form.Label>
                                <Form.Select
                                    name="tipus_id"
                                    value={editProduct.tipus_id || ""}
                                    onChange={handleEditChange}
                                >
                                    <option value="">Válassz típust</option>
                                    {tipusok.map(t => (
                                        <option key={t.id} value={t.id}>
                                            {t.tipus}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            {/* Szín */}
                            <Form.Group className="mb-2">
                                <Form.Label>Szín</Form.Label>
                                <Form.Select
                                    name="szin_id"
                                    value={editProduct.szin_id || ""}
                                    onChange={handleEditChange}
                                >
                                    <option value="">Válassz színt</option>
                                    {szinek.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.szin}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            {/* Elérhetőség */}
                            <Form.Group className="mb-2">
                                <Form.Label>Elérhetőség</Form.Label>
                                <Form.Select
                                    name="elerhetoseg_id"
                                    value={editProduct.elerhetoseg_id || ""}
                                    onChange={handleEditChange}
                                >
                                    <option value="">Válassz státuszt</option>
                                    {elerhetosegek.map(e => (
                                        <option key={e.id} value={e.id}>
                                            {e.statusz}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            {/* Kép ID */}
                            <Form.Group className="mb-2">
                                <Form.Label>Kép ID</Form.Label>
                                <Form.Control
                                    name="kep_id"
                                    value={editProduct.kep_id || ""}
                                    onChange={handleEditChange}
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditProduct(null)}>
                        Mégse
                    </Button>
                    <Button variant="primary" onClick={handleEditSave} disabled={saving}>
                        {saving ? "Mentés..." : "Mentés"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}