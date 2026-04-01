import { useState, useEffect } from "react";
import api from "../../http-common";


export default function Userprofile() {
    const [uprofile, setUprofile] = useState(null);
    const [error, setError] = useState(null);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get("/auth/userprofile");
            setUprofile(response.data);
        } catch (err) {
            setError("Hiba a profil lekérésekor");
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <div>
            <h2>Profil</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {uprofile && (
                <div>
                    <p>Felhasználónév: {uprofile.username}</p>
                    <p>Email: {uprofile.email}</p>
                </div>
            )}
        </div>
    );
}