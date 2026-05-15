import { useState, useEffect } from 'react';
import api from '../utils/api';
import { getImageUrl } from '../utils/getImageUrl';
import { formatDate } from '../utils/formatDate';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/MyTicketsPage.css';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [printingId, setPrintingId] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/registrations/my-tickets');
        setTickets(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handlePrint = (ticketId) => {
    setPrintingId(ticketId);
    // Use a small timeout to allow React to update the DOM before printing
    setTimeout(() => {
      window.print();
      setPrintingId(null);
    }, 100);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className={`container my-tickets-page ${printingId ? 'printing-active' : ''}`}>
      <h1 className="no-print">My Tickets</h1>
      
      {tickets.length === 0 ? (
        <p className="empty-state no-print">You haven't registered for any events yet.</p>
      ) : (
        <div className="tickets-grid">
          {tickets.map((ticket) => (
            <div 
              key={ticket._id} 
              className={`ticket-card ${printingId === ticket._id ? 'to-print' : ''} ${printingId && printingId !== ticket._id ? 'hide-on-print' : ''}`}
            >
              <div className="ticket-banner">
                <img src={getImageUrl(ticket.event.bannerImage)} alt={ticket.event.title} />
              </div>
              
              <div className="ticket-content">
                <div className="ticket-main-info">
                  <h2>{ticket.event.title}</h2>
                  <p className="event-date">{formatDate(ticket.event.date, 'long')}</p>
                  <p className="event-location">
                    <span className="icon">📍</span> {ticket.event.location}
                  </p>
                  <div className="ticket-id-section">
                    <span className="label">TICKET ID</span>
                    <code className="ticket-id">{ticket.ticketId}</code>
                  </div>
                </div>
                
                <div className="ticket-qr-section">
                  <img 
                    src={ticket.qrCodeData} 
                    alt="QR Code" 
                    className="qr-code" 
                    style={{ width: 120 }} 
                  />
                  <p className="qr-hint">Scan at entry</p>
                </div>
              </div>
              
              <div className="ticket-footer no-print">
                <button 
                  onClick={() => handlePrint(ticket._id)}
                  className="print-btn"
                >
                  🖨️ Print Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
