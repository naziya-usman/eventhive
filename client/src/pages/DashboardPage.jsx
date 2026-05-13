import { useState, useEffect } from "react";
import api from "../utils/api";
import { getUser } from "../utils/auth";
import { formatDate } from "../utils/formatDate";
import { getImageUrl } from "../utils/getImageUrl";
import CreateEventForm from "../components/CreateEventForm";
import "../styles/DashboardPage.css"; 

const DashboardPage = () => {  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
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
      setError("Failed to fetch events");
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
        alert("Failed to delete event");
      }
    }
  };

  if (loading && events.length === 0)
    return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Organizer Dashboard</h1>
        <button
          className="btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancel" : "Create New Event"}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-event-section">
          <CreateEventForm
            onSuccess={() => {
              setShowCreateForm(false);
              fetchEvents();
            }}
          />
        </div>
      )}

      {error && <p className="error-text">{error}</p>}

      <div className="events-grid">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="event-dashboard-card">
              {event.bannerImage && (
                <div 
                  className="card-bg-blur" 
                  style={{ backgroundImage: `url(${getImageUrl(event.bannerImage)})` }}
                ></div>
              )}
              <div className="card-content">
                <h3>{event.title}</h3>
                <p className="event-date">{formatDate(event.date)}</p>
                <div className="registration-status">
                  <span className="status-label">Registrations:</span>
                  <span className="status-count">
                    {event.registrations?.length || 0} / {event.capacity}
                  </span>
                </div>
                <div className="card-actions">
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(event._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No events yet. Start by creating your first event!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
