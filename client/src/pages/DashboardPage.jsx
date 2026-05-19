import { useState, useEffect } from "react";
import api from "../utils/api";
import { getApiErrorMessage } from "../utils/errorMessage";
import { getUser } from "../utils/auth";
import { formatDate } from "../utils/formatDate";
import { getImageUrl } from "../utils/getImageUrl";
import CreateEventForm from "../components/CreateEventForm";
import ErrorMessage from "../components/ErrorMessage";
import "../styles/DashboardPage.css"; 

const DashboardPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const user = getUser();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/events");
      // Filter events where organiser matches logged-in user ID
      const myEvents = response.data.filter(event => 
        (event.organiser?._id || event.organiser) === user?.id
      );
      setEvents(myEvents);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to fetch events"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this event?")) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents(); // Re-fetch on success
      } catch (err) {
        alert(getApiErrorMessage(err, "Failed to delete event"));
      }
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSuccess = () => {
    setShowCreateForm(false);
    setEditingEvent(null);
    fetchEvents();
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingEvent(null);
  };

  if (loading && events.length === 0)
    return <div className="loading">Loading dashboard...</div>;

  const totalTickets = events.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0);
  const totalCapacity = events.reduce((acc, curr) => acc + curr.capacity, 0);

  return (
    <div className="saas-dashboard">
      <div className="saas-container">
        <header className="saas-header">
          <div className="header-text">
            <h1>Management <span className="text-dim">/ Overview</span></h1>
            <p>Monitor your events performance and manage attendee registrations.</p>
          </div>
          <button className="saas-btn-primary" onClick={() => setShowCreateForm(true)}>
            <span className="plus">+</span> New Event
          </button>
        </header>

        {/* Stats Strip */}
        <section className="saas-stats-strip">
          <div className="stat-item stat-events">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <span className="stat-label">Events</span>
              <span className="stat-value">{events.length}</span>
            </div>
          </div>
          <div className="stat-item stat-tickets">
            <div className="stat-icon">🎟️</div>
            <div className="stat-content">
              <span className="stat-label">Sold</span>
              <span className="stat-value">{totalTickets}</span>
            </div>
          </div>
          <div className="stat-item stat-rate">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <span className="stat-label">Fill Rate</span>
              <span className="stat-value">
                {totalCapacity > 0 ? Math.round((totalTickets / totalCapacity) * 100) : 0}%
              </span>
            </div>
          </div>
        </section>

        {showCreateForm && (
          <div className="saas-modal-overlay">
            <div className="saas-slide-panel">
              <div className="panel-header">
                <h2>{editingEvent ? "Edit Event" : "Create Event"}</h2>
                <button className="panel-close" onClick={handleCancel}>✕</button>
              </div>
              <div className="panel-body">
                <CreateEventForm
                  onSuccess={handleFormSuccess}
                  eventToEdit={editingEvent}
                />
              </div>
            </div>
          </div>
        )}

        {error && <ErrorMessage message={error} />}

        <main className="saas-main-list">
          <div className="list-header">
            <div className="col-event">Event Details</div>
            <div className="col-status">Registration Status</div>
            <div className="col-actions">Actions</div>
          </div>

          <div className="list-body">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event._id} className="saas-list-row">
                  <div className="col-event">
                    <div className="row-event-info">
                      <div className="row-img-thumb">
                        <img 
                          src={event.bannerImage ? getImageUrl(event.bannerImage) : "https://via.placeholder.com/100"} 
                          alt={`${event.title} event thumbnail`}
                        />
                      </div>
                      <div className="row-text-details">
                        <h3 className="row-title">{event.title}</h3>
                        <p className="row-meta">
                          <span className="row-cat">{event.category}</span>
                          <span className="divider">|</span>
                          <span className="row-date">{formatDate(event.date, "short")}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-status">
                    <div className="status-progress-wrapper">
                      <div className="progress-labels">
                        <span>{event.registeredCount || 0} / {event.capacity}</span>
                        <span>{Math.round(((event.registeredCount || 0) / event.capacity) * 100)}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${((event.registeredCount || 0) / event.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="col-actions">
                    <div className="action-buttons-group">
                      <button className="action-btn edit" onClick={() => handleEdit(event)}>
                        Edit
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(event._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="saas-empty-state">
                <p>No active events found. Create one to get started.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
