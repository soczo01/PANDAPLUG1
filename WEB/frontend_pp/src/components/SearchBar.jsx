import { useEffect, useState } from "react";

export default function SearchBar({ onQuery }) {
    const [query, setQuery] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            onQuery(query.trim());
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <input
            type="text"
            className="form-control mb-3"
            placeholder="Keresés..."
            value={query}
            onChange={e => setQuery(e.target.value)}
        />
    );
}
