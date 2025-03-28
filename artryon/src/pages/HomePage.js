import React from "react";
import { Link } from "react-router-dom";
import "../HomePage.css";
import heroImage from "../assets/hero.jpg"; // Add a stylish hero image

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="fade-in">Welcome to <span className="brand">Stylo!</span></h1>
          <p className="fade-in-delay">Your personal fashion assistant powered by AI & AR</p>
          <Link to="/ai-stylist">
            <button className="cta-button">Get Styled Now</button>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="hero-image">
          <img src={heroImage} alt="Fashion AI Stylist" className="fade-in-scale" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <h3>AR Try-On</h3>
          <p>Try outfits virtually with augmented reality. See how clothes fit you in real-time!</p>
          <Link to="/outfit-tryon">
            <button>Try Now</button>
          </Link>
        </div>

        <div className="feature-card">
          <h3>Personal AI Stylist</h3>
          <p>Get personalized outfit suggestions based on your preferences and current trends.</p>
          <Link to="/ai-stylist">
            <button>Get Styled</button>
          </Link>
        </div>

        <div className="feature-card">
          <h3>Find Your Outfit</h3>
          <p>Discover outfit colors that match your skin tone!</p>
          <Link to="/outfit-recommendation">
            <button>Try Now</button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
