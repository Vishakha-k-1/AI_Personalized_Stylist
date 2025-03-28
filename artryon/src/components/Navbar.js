import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Stylo</h2>
      <ul style={styles.navLinks}>
        {["Home", "Outfit Try-On", "AI Stylist", "Outfit Recommendation"].map((item, index) => (
          <li
            key={index}
            style={{
              ...styles.navItem,
              color: hoverIndex === index ? "#ffcc00" : "white",
            }}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <Link to={item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s/g, "-")}`} style={styles.link}>
              {item}
              <div style={{ ...styles.underline, transform: hoverIndex === index ? "scaleX(1)" : "scaleX(0)" }} />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#921A40",
    color: "white",
    padding: "10px 20px",
    boxShadow: "0 4px 10px rgba(198, 0, 0, 0.1)",
  },
  logo: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold",
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "20px",
    padding: 0,
    margin: 0,
  },
  navItem: {
    position: "relative",
    paddingBottom: "5px",
    transition: "color 0.3s ease-in-out",
  },
  link: {
    textDecoration: "none",
    fontSize: "16px",
    color: "inherit",
    position: "relative",
    display: "inline-block",
  },
  underline: {
    position: "absolute",
    left: 0,
    bottom: "-2px",
    width: "100%",
    height: "2px",
    backgroundColor: "#ffcc00",
    transformOrigin: "right",
    transition: "transform 0.3s ease-in-out",
  },
};

export default Navbar;
