import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import { getApiErrorMessage } from "../utils/errorMessage";
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
  const [registrationError, setRegistrationError] = useState("");
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
        setError(getApiErrorMessage(err, "Failed to load event details."));
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
      setRegistrationError("");
      const response = await api.post(`/registrations/${id}`);
      toast.success(
        `Registered successfully! Ticket ID: ${response.data.ticketId}`,
      );
      // Refresh event data to update registeredCount
      const updatedEvent = await api.get(`/events/${id}`);
      setEvent(updatedEvent.data);
    } catch (err) {
      setRegistrationError(
        getApiErrorMessage(err, "Registration failed. Please try again."),
      );
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
    <div className="minimal-split-page">
      <div className="split-container">
        {/* Left Side: The "Pin" Image */}
        <div className="split-visual">
          <div className="pin-image-wrapper">
            <img
              src={bannerSrc}
              alt={`${event.title} event banner at ${event.location}`}
              className="pin-image"
            />
            <div className="pin-category">{event.category}</div>
          </div>
        </div>

        {/* Right Side: The Details */}
        <div className="split-details">
          <div className="details-content-inner">
            <header className="details-header">
              <div className="meta-row">
                <span className="date-pill">{formattedDate}</span>
                <span className="price-pill">
                  {event.price === 0 ? "Free" : `$${event.price}`}
                </span>
              </div>
              <h1 className="details-title">{event.title}</h1>

              <div className="organiser-minimal">
                <div className="mini-avatar">
                  {event.organiser?.name?.charAt(0) || "O"}
                </div>
                <div className="mini-info">
                  <span className="hosted-by">Hosted by</span>
                  <span className="host-name">
                    {event.organiser?.name || "EventHive"}
                  </span>
                </div>
              </div>
            </header>

            <section className="details-section">
              <h3 className="section-label">Where</h3>
              <p className="location-text">📍 {event.location}</p>
            </section>

            <section className="details-section">
              <h3 className="section-label">About</h3>
              <div className="about-text">
                <p>{event.description}</p>
              </div>
            </section>

            <section className="details-section">
              <h3 className="section-label">Availability</h3>
              <div className="capacity-container">
                <div className="capacity-stat">
                  <span className="count">{spotsLeft}</span>
                  <span className="label">Spots left</span>
                </div>
                <div className="capacity-stat">
                  <span className="count">{event.capacity}</span>
                  <span className="label">Total capacity</span>
                </div>
              </div>
            </section>

            {/* Floating/Fixed Action Area */}
            <div className="action-footer">
              {registrationError && (
                <p className="registration-error" role="alert">
                  {registrationError}
                </p>
              )}
              <button
                className={`minimal-register-btn ${isFull ? "disabled" : ""}`}
                onClick={handleRegister}
                disabled={isFull || registering}
                aria-label={
                  isFull
                    ? `${event.title} is fully booked`
                    : `Register for ${event.title}`
                }
              >
                {registering
                  ? "Processing..."
                  : isFull
                    ? "Fully Booked"
                    : "Register Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
