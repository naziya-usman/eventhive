import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';
import { getImageUrl } from '../utils/getImageUrl';
import '../styles/EventCard.css';

const EventCard = ({ event }) => {
  const { _id, title, bannerImage, category, date, location, price, capacity, registeredCount } = event;

  const formattedDate = formatDate(date, 'short');

  const bannerSrc = bannerImage 
    ? getImageUrl(bannerImage) 
    : 'https://via.placeholder.com/400x200?text=No+Image';

  const spotsLeft = capacity - registeredCount;
  const isFull = spotsLeft <= 0;

  return (
    <Link to={`/events/${_id}`} className="event-card-link">
      <div className="event-card">
        <div className="event-card-image">
          <img src={bannerSrc} alt={title} />
          <span className="event-category-badge">{category}</span>
        </div>
        <div className="event-card-content">
          <p className="event-date">{formattedDate}</p>
          <h3 className="event-title">{title}</h3>
          <p className="event-location">📍 {location}</p>
          <div className="event-availability">
            <span className={`availability-text ${isFull ? 'full' : ''}`}>
              {isFull ? 'Event Full' : `${spotsLeft} spots left`}
            </span>
          </div>
          <p className="event-price">
            {price === 0 ? 'Free' : `$${price}`}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
