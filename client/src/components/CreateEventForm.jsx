import { useState } from 'react';
import api from '../utils/api';
import '../styles/DashboardPage.css'; 

const CreateEventForm = ({ onSuccess, eventToEdit = null }) => {
  const isEditing = !!eventToEdit;
  
  const [formData, setFormData] = useState({
    title: eventToEdit?.title || '',
    description: eventToEdit?.description || '',
    category: eventToEdit?.category || 'music',
    date: eventToEdit?.date ? new Date(eventToEdit.date).toISOString().slice(0, 16) : '',
    location: eventToEdit?.location || '',
    capacity: eventToEdit?.capacity || 10,
    price: eventToEdit?.price || 0,
  });
  const [bannerImage, setBannerImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ["music", "sports", "tech", "food", "arts", "other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setBannerImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    if (bannerImage) {
      data.append('bannerImage', bannerImage);
    }

    try {
      if (isEditing) {
        await api.put(`/events/${eventToEdit._id}`, data);
      } else {
        await api.post('/events', data);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} event. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-form-container">
      <form className="create-event-form" onSubmit={handleSubmit}>
        <h2>{isEditing ? 'Update Event' : 'Create New Event'}</h2>
        
        {error && <p className="error-message">{error}</p>}

        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="title">Event Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Give your event a catchy title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Event Date & Time</label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Venue or online link"
            />
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Capacity</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              placeholder="0 for free"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bannerImage">Banner Image {isEditing && '(Optional)'}</label>
            <input
              type="file"
              id="bannerImage"
              name="bannerImage"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Tell us more about the event..."
          ></textarea>
        </div>

        <button type="submit" className="btn-success" disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Update Event' : 'Publish Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateEventForm;
