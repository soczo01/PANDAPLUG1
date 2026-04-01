import { useEffect, useState } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";

export default function Filter({ filters, onFilterChange }) {
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(null);

  useEffect(() => {
    // MÉRETEK
    fetch("http://localhost:8080/api/filters/sizes")
      .then(res => res.json())
      .then(data => setSizes(Array.isArray(data) ? data : []));

    // SZÍNEK
    fetch("http://localhost:8080/api/filters/colors")
      .then(res => res.json())
      .then(data => setColors(Array.isArray(data) ? data : []));

    // MÁRKÁK
    fetch("http://localhost:8080/api/filters/brands")
      .then(res => res.json())
      .then(data => setBrands(Array.isArray(data) ? data : []));

    // ÁRTARTOMÁNY
    fetch("http://localhost:8080/api/filters/prices")
      .then(res => res.json())
      .then(data => setPriceRange(data));
  }, []);

  // 🔹 Segédfüggvény: visszaállít minden filtert ALL-ra
  const resetFilter = (key) => {
    onFilterChange({ [key]: "ALL" });
  };

  // ---- AKTÍV FILTEREK ÖSSZEGYŰJTÉSE ----
const activeFilters = [];

if (filters?.brand && filters.brand !== "ALL") {
  activeFilters.push(filters.brand);
}

if (filters?.size && filters.size !== "ALL") {
  activeFilters.push(filters.size);
}

if (filters?.color && filters.color !== "ALL") {
  activeFilters.push(filters.color);
}

if (filters?.price === "ASC") {
  activeFilters.push("Ár ↑");
}

if (filters?.price === "DESC") {
  activeFilters.push("Ár ↓");
}

// Title string
const dropdownTitle =
  activeFilters.length > 0
    ? `Szűrés (${activeFilters.join(", ")})`
    : "Szűrés";
  return (
    <NavDropdown title={dropdownTitle} id="filter-dropdown" className="text-white">

      {/* ---- MÁRKA ---- */}
      <NavDropdown.Header>Márka</NavDropdown.Header>
      <NavDropdown.Item style={{ color: '#fff', fontWeight: 500 }} onClick={() => resetFilter("brand")}>
        Összes
      </NavDropdown.Item>
      {brands.map((b) => (
        <NavDropdown.Item
          key={b.markanev}
          style={{ color: '#fff', fontWeight: 500 }}
          onClick={() => onFilterChange({ brand: b.markanev })}
        >
          {b.markanev}
        </NavDropdown.Item>
      ))}
      <NavDropdown.Divider />

      {/* ---- MÉRET ---- */}
      <NavDropdown.Header>Méret</NavDropdown.Header>
      <NavDropdown.Item style={{ color: '#fff', fontWeight: 500 }} onClick={() => resetFilter("size")}>
        Összes
      </NavDropdown.Item>
      {sizes.map((s) => (
        <NavDropdown.Item
          key={s.meretnev}
          style={{ color: '#fff', fontWeight: 500 }}
          onClick={() => onFilterChange({ size: s.meretnev })}
        >
          {s.meretnev}
        </NavDropdown.Item>
      ))}
      <NavDropdown.Divider />

      {/* ---- SZÍN ---- */}
      <NavDropdown.Header>Szín</NavDropdown.Header>
      <NavDropdown.Item style={{ color: '#fff', fontWeight: 500 }} onClick={() => resetFilter("color")}>
        Összes
      </NavDropdown.Item>
      {colors.map((c) => (
        <NavDropdown.Item
          key={c.szinnev}
          style={{ color: '#fff', fontWeight: 500 }}
          onClick={() => onFilterChange({ color: c.szinnev })}
        >
          {c.szinnev}
        </NavDropdown.Item>
      ))}
      <NavDropdown.Divider />

      {/* ---- ÁR ---- */}
      <NavDropdown.Header>Ár</NavDropdown.Header>
      <NavDropdown.Item style={{ color: '#fff', fontWeight: 500 }} onClick={() => resetFilter("price")}>
        Összes
      </NavDropdown.Item>
      <NavDropdown.Item style={{ color: '#fff', fontWeight: 500 }} onClick={() => onFilterChange({ price: "ASC" })}>
        Ár: alacsony → magas
      </NavDropdown.Item>
      <NavDropdown.Item style={{ color: '#fff', fontWeight: 500 }} onClick={() => onFilterChange({ price: "DESC" })}>
        Ár: magas → alacsony
      </NavDropdown.Item>
    </NavDropdown>
  );
}
