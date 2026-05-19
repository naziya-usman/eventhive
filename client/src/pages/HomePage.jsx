import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import EventCard from "../components/EventCard";
import { getImageUrl } from "../utils/getImageUrl";
import heroImg from "../assets/hero.png";
import "../styles/HomePage.css";

const CATEGORIES = [
  { name: "Music", icon: "🎵", color: "#FF4D4D", count: "120+ Events" },
  { name: "Sports", icon: "⚽", color: "#4D94FF", count: "80+ Events" },
  { name: "Tech", icon: "💻", color: "#4DFF88", count: "45+ Events" },
  { name: "Food", icon: "🍔", color: "#FFB347", count: "60+ Events" },
  { name: "Arts", icon: "🎨", color: "#B366FF", count: "30+ Events" },
  { name: "Other", icon: "✨", color: "#FF66B3", count: "25+ Events" }
];

const HomePage = () => {
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/events", { params: { limit: 4 } });
        const events = response.data;
        if (events.length > 0) {
          setFeaturedEvent(events[0]);
          setTrendingEvents(events.slice(1, 4));
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching home data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-v2">
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">Spark your curiosity</span>
            <h1>Discover moments that <span className="text-gradient">matter.</span></h1>
            <p>From underground concerts to tech summits, find the events that define your vibe.</p>
            <div className="hero-actions">
              <Link to="/events" className="btn-primary-lg">Explore Events</Link>
              <Link to="/register" className="btn-secondary-lg">Host an Event</Link>
            </div>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>
      </section>

      {/* Featured Spotlight - NEW FEATURE */}
      {featuredEvent && (
        <section className="spotlight-section">
          <div className="container">
            <div className="spotlight-card">
              <div className="spotlight-image">
                <img
                  src={getImageUrl(featuredEvent.bannerImage) || heroImg}
                  alt={`${featuredEvent.title} featured event banner`}
                />
                <div className="spotlight-tag">Editor's Choice</div>
              </div>
              <div className="spotlight-info">
                <span className="info-category">{featuredEvent.category}</span>
                <h2>{featuredEvent.title}</h2>
                <p>{featuredEvent.description?.substring(0, 150)}...</p>
                <div className="spotlight-meta">
                  <div className="meta-item">
                    <span>📅</span> {new Date(featuredEvent.date).toLocaleDateString()}
                  </div>
                  <div className="meta-item">
                    <span>📍</span> {featuredEvent.location}
                  </div>
                </div>
                <Link to={`/events/${featuredEvent._id}`} className="btn-spotlight">Get Tickets</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Find your interest</h2>
              <p>Browse by the categories you love most</p>
            </div>
            <Link to="/events" className="view-all">View all categories →</Link>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link 
                key={cat.name} 
                to={`/events?category=${cat.name.toLowerCase()}`}
                className="category-card"
                style={{ "--cat-color": cat.color }}
              >
                <span className="cat-icon">{cat.icon}</span>
                <div className="cat-text">
                  <span className="cat-name">{cat.name}</span>
                  <span className="cat-count">{cat.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - NEW FEATURE */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header centered">
            <h2>How EventHive Works</h2>
            <p>Your journey from discovery to unforgettable memories</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Discover</h3>
              <p>Explore thousands of unique events tailored to your interests and location.</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Book</h3>
              <p>Secure your spot instantly with our seamless and secure ticketing system.</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Enjoy</h3>
              <p>Show up, scan your ticket, and immerse yourself in an amazing experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="trending-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Trending near you</h2>
              <p>Don't miss out on what's happening right now.</p>
            </div>
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="trending-grid">
              {trendingEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
          
          <div className="trending-footer">
            <Link to="/events" className="btn-outline">Explore All Events</Link>
          </div>
        </div>
      </section>

      {/* Host CTA - NEW FEATURE */}
      <section className="host-cta">
        <div className="container">
          <div className="host-card">
            <div className="host-content">
              <h2>Ready to host your own event?</h2>
              <p>Whether it's a small workshop or a massive festival, EventHive gives you the tools to succeed.</p>
              <Link to="/register" className="btn-host">Get Started for Free</Link>
            </div>
            <div className="host-image-container">
              <img 
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Crowd at a live concert with stage lighting" 
                className="host-img"
              />
              <div className="host-animation-overlay">
                <div className="light-beam lb-1"></div>
                <div className="light-beam lb-2"></div>
                <div className="prism-leak"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspiration Quote */}
      <section className="inspiration-container">
        <div className="inspiration-box">
          <span className="inspiration-quote">“</span>
          <p className="inspiration-text">
            Life is not measured by the number of breaths we take, but by the moments that take our breath away.
          </p>
          <span className="inspiration-tag">#EventHiveMoments</span>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
