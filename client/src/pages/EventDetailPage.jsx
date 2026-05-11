import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import { formatDate } from "../utils/formatDate";
import { getImageUrl } from "../utils/getImageUrl";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import "../styles/EventDetailPage.css";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError(
          err.response?.data?.message || "Failed to load event details.",
        );
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleRegister = async () => {
    const token = localStorage.getItem("eventhive_token");
    if (!token) {
      toast.error("Please login to register for this event.");
      navigate("/login");
      return;
    }

    try {
      setRegistering(true);
      const response = await api.post(`/events/${id}/register`);
      toast.success(
        `Registered successfully! Ticket ID: ${response.data.ticketId}`,
      );
      // Refresh event data to update registeredCount
      const updatedEvent = await api.get(`/events/${id}`);
      setEvent(updatedEvent.data);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("You are already registered for this event.");
      } else {
        toast.error(
          err.response?.data?.message ||
            "Registration failed. Please try again.",
        );
      }
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorMessage message={error} />;

  if (!event) return null;

  const formattedDate = formatDate(event.date, "long");

  const bannerSrc = event.bannerImage
    ? getImageUrl(event.bannerImage)
    : "https://via.placeholder.com/1200x400?text=No+Banner+Image";

  const spotsLeft = event.capacity - event.registeredCount;
  const isFull = spotsLeft <= 0;

  return (
    <div className="event-detail-page">
      <div className="event-banner">
        <img src={bannerSrc} alt={event.title} />
        <div className="event-category-badge">{event.category}</div>
      </div>

      <header className="event-header">
        <div className="event-main-content">
          <h1>{event.title}</h1>
          <p className="event-description">{event.description}</p>
        </div>

        <div className="registration-action-card">
          <div className="action-price-container">
            <span className="price-label">Price</span>
            <p className="price-tag">
              {event.price === 0 ? "Free" : `$${event.price}`}
            </p>
          </div>
          <button
            className={`register-button ${isFull ? "disabled" : ""}`}
            onClick={handleRegister}
            disabled={isFull || registering}
          >
            {registering
              ? "Processing..."
              : isFull
                ? "Event Full"
                : "Register for this Event"}
          </button>
          {isFull && (
            <p className="full-notice">Sorry, all spots have been filled!</p>
          )}
        </div>
      </header>

      <main className="event-body-content">
        <section className="details-boxes-grid">
          <div className="detail-box">
            <span className="info-icon">📍</span>
            <div className="info-text">
              <span className="info-label">Location</span>
              <span className="info-value">{event.location}</span>
            </div>
          </div>

          <div className="detail-box">
            <span className="info-icon">📅</span>
            <div className="info-text">
              <span className="info-label">Date & Time</span>
              <span className="info-value">{formattedDate}</span>
            </div>
          </div>

          <div className="detail-box">
            <span className="info-icon">🎟️</span>
            <div className="info-text">
              <span className="info-label">Availability</span>
              <span className={`info-value ${isFull ? "full" : ""}`}>
                {isFull ? "Event Full" : `${spotsLeft} spots left`}
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EventDetailPage;
