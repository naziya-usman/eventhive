import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";
import EventCard from "../components/EventCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import SearchBar from "../components/SearchBar";
import "../styles/HomePage.css"; 

const CATEGORIES = [
  { name: "All", icon: "✨" },
  { name: "Music", icon: "🎵" },
  { name: "Sports", icon: "⚽" },
  { name: "Tech", icon: "💻" },
  { name: "Food", icon: "🍔" },
  { name: "Arts", icon: "🎨" },
  { name: "Other", icon: "🌈" }
];

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentSearch = searchParams.get("search") || "";
  const isFree = searchParams.get("free") === "true";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const params = {};
        if (currentSearch) params.search = currentSearch;
        if (currentCategory !== "all") params.category = currentCategory;
        if (isFree) params.free = "true";

        const response = await api.get("/events", { params });
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentSearch, currentCategory, isFree]);

  const handleSearch = useCallback((term) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (term) {
        newParams.set("search", term);
      } else {
        newParams.delete("search");
      }
      return newParams;
    });
  }, [setSearchParams]);

  const handleCategoryChange = useCallback((category) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      const lowerCategory = category.toLowerCase();
      if (lowerCategory !== "all") {
        newParams.set("category", lowerCategory);
      } else {
        newParams.delete("category");
      }
      return newParams;
    });
  }, [setSearchParams]);

  const toggleFreeFilter = useCallback(() => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (newParams.get("free") === "true") {
        newParams.delete("free");
      } else {
        newParams.set("free", "true");
      }
      return newParams;
    });
  }, [setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return (
    <div className="events-page">
      <div className="container">
        <header className="page-header">
          <span className="page-badge">Discovery</span>
          <h1>Find your next <span className="text-gradient">vibe.</span></h1>
          <p>Explore curated events tailored to your unique taste</p>
        </header>

        <section className="filter-experience">
          <div className="search-glass-wrapper">
            <SearchBar onSearch={handleSearch} initialValue={currentSearch} />
          </div>
          
          <div className="category-scroller">
            <div className="category-tags">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  className={`aesthetic-tag ${currentCategory === cat.name.toLowerCase() ? "active" : ""}`}
                  onClick={() => handleCategoryChange(cat.name)}
                >
                  <span className="tag-icon">{cat.icon}</span>
                  <span className="tag-name">{cat.name}</span>
                </button>
              ))}
              <div className="tag-divider"></div>
              <button
                className={`aesthetic-tag filter-tag ${isFree ? "active" : ""}`}
                onClick={toggleFreeFilter}
              >
                <span className="tag-icon">🎟️</span>
                <span className="tag-name">Free Only</span>
              </button>
            </div>
          </div>

          {(currentSearch || currentCategory !== "all" || isFree) && (
            <div className="active-filters-info">
              <button className="clear-all-pill" onClick={clearFilters}>
                Clear all filters ×
              </button>
            </div>
          )}
        </section>

        <main className="events-grid-container">
          {error && <ErrorMessage message={error} />}

          {!error && (
            <>
              <div className="results-meta">
                {!loading && (
                  <p className="results-count">
                    Showing <strong>{events.length}</strong> {events.length === 1 ? "event" : "events"}
                  </p>
                )}
                <div className="sort-placeholder">Recommended for you</div>
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : events.length > 0 ? (
                <div className="events-grid">
                  {events.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="aesthetic-empty-state">
                  <div className="empty-icon">🏜️</div>
                  <h2>No events found</h2>
                  <p>Try adjusting your search or filters to find what you're looking for.</p>
                  <button className="btn-primary-lg" onClick={clearFilters}>
                    Reset Discovery
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default EventsPage;
