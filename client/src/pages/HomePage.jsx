import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './HomePage.css';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/events');
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="home-page">
      <header className="hero-section">
        <h1>Discover Amazing Events</h1>
        <p>Join the best local events and meet new people.</p>
      </header>
      
      <main className="events-grid-container">
        {events.length > 0 ? (
          <div className="events-grid">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <p className="no-events">No events found.</p>
        )}
      </main>
    </div>
  );
};

export default HomePage;
