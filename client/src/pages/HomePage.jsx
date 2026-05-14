import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";
import EventCard from "../components/EventCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import SearchBar from "../components/SearchBar";
import "../styles/HomePage.css";

const CATEGORIES = ["All", "Music", "Sports", "Tech", "Food", "Arts", "Other"];

const HomePage = () => {
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

  if (loading && events.length === 0) return <LoadingSpinner />;

  return (
    <div className="home-page">
      <header className="hero-section">
        <h1>Discover Amazing Events</h1>
        <p>Join the best local events and meet new people.</p>
      </header>

      <section className="filter-section">
        <SearchBar onSearch={handleSearch} initialValue={currentSearch} />

        <div className="category-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${currentCategory === cat.toLowerCase() ? "active" : ""}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
          <button
            className={`filter-btn ${isFree ? "active" : ""}`}
            onClick={toggleFreeFilter}
          >
            Free
          </button>
          {(currentSearch || currentCategory !== "all" || isFree) && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      </section>

      <main className="events-grid-container">
        {error && <ErrorMessage message={error} />}

        {!error && (
          <>
            <div className="results-header">
              {!loading && (
                <p className="event-count">
                  {events.length} {events.length === 1 ? "event" : "events"}{" "}
                  found
                </p>
              )}
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
              <div className="no-results-container">
                <p className="no-events">
                  No events found matching your criteria.
                </p>
                <button className="btn-secondary" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default HomePage;
