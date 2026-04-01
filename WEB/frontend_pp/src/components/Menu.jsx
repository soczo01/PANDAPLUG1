import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import UserProfileModal from "./UserProfileModal";

function Menu({ onCategoryChange, onFilterChange, onSearch, user }) {
  const [showProfile, setShowProfile] = useState(false);
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
      <Container>
        {/* FŐOLDAL */}
        <Navbar.Brand
          style={{ cursor: "pointer" }}
          onClick={() => {
            onCategoryChange("ALL");
            if (typeof onSearch === "function") onSearch(""); // kereső mező ürítése
          }}
        >
          Pandaplug
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* KATEGÓRIÁK */}
          <Nav className="ms-auto" style={{ alignItems: "center" }}>
            <Nav.Link onClick={() => onCategoryChange("shirts")}>PÓLÓK</Nav.Link>
            <Nav.Link onClick={() => onCategoryChange("hoodies")}>PULÓVEREK</Nav.Link>
            <Nav.Link onClick={() => onCategoryChange("pants")}>NADRÁGOK</Nav.Link>
            <Nav.Link onClick={() => onCategoryChange("shorts")}>RÖVIDNADRÁGOK</Nav.Link>
            {/* Admin link csak adminnak */}
            {user?.role === "admin" && (
              <Nav.Link as={Link} to="/admin/termekek">
                Admin terméklista
              </Nav.Link>
            )}
            {/* Profil ikon minden bejelentkezett usernek */}
            {user && (
              <Nav.Link style={{ padding: "0 10px" }} onClick={() => setShowProfile(true)}>
                <FaUser size={22} />
              </Nav.Link>
            )}
          </Nav>
          {/* Kereső a navbar jobb oldalán */}
        </Navbar.Collapse>
      </Container>
      {/* Profil modal */}
      <UserProfileModal show={showProfile} onClose={() => setShowProfile(false)} userId={user?.id} />
    </Navbar>
  );
}

export default Menu;
