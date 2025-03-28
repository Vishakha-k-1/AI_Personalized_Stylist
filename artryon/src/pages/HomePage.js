// pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      
      <section className="hero-section">
        <h1>Welcome to Stylo!</h1>
        <p>Your personal fashion assistant powered by AI & AR</p>
      </section>

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
          <h3>Find your Outfit</h3>
          <p>Discover outfit colors that match your skin tone!</p>
          <Link to="/outfit-recommend">
            <button>Try Now</button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
