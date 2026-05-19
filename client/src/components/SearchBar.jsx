import { useState, useEffect } from "react";
import "../styles/SearchBar.css";

const SearchBar = ({ onSearch, initialValue = "" }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  // Sync state with initialValue if it changes externally (e.g. Clear Filters)
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  useEffect(() => {
    // Set up a timer to call onSearch after 400ms
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 400);

    // Clean up the timer if the user types again before 400ms is up
    // This is the core of debouncing
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  return (
    <div className="search-bar-container">
      <label htmlFor="event-search" className="sr-only">
        Search events by title
      </label>
      <input
        type="text"
        id="event-search"
        name="event-search"
        placeholder="Search events by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="search-icon" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          width="20"
          height="20"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;
