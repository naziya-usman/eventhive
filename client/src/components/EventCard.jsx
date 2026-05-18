import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';
import { getImageUrl } from '../utils/getImageUrl';
import '../styles/EventCard.css';

const EventCard = ({ event }) => {
  const { _id, title, bannerImage, category, date, location, price, capacity, registeredCount } = event;

  const formattedDate = formatDate(date, 'short');
  const [day, month] = formattedDate.split(' ');

  const bannerSrc = bannerImage 
    ? getImageUrl(bannerImage) 
    : 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80';

  const spotsLeft = capacity - registeredCount;
  const isFull = spotsLeft <= 0;

  return (
    <Link to={`/events/${_id}`} className="editorial-card-link">
      <div className="editorial-card">
        <div className="editorial-visual">
          <img src={bannerSrc} alt={title} className="editorial-img" />
          
          <div className="editorial-top-chips">
            <span className="chip category">{category}</span>
            <span className="chip price">{price === 0 ? 'Free' : `$${price}`}</span>
          </div>

          <div className="editorial-date-chip">
            <span className="day">{day}</span>
            <span className="month">{month}</span>
          </div>
        </div>

        <div className="editorial-content-glass">
          <div className="editorial-meta">
            <span className="availability">
              {isFull ? 'Sold Out' : `${spotsLeft} spots remaining`}
            </span>
          </div>
          <h3 className="editorial-title">{title}</h3>
          <div className="editorial-location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {location}
          </div>
          
          <div className="editorial-action">
            <span>Discover more</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
