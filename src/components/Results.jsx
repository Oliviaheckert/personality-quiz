import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import PropTypes from 'prop-types';

export default function Results({ 
  element, 
  artwork, 
  isLoading, 
  error, 
  onReset 
}) {
  const { name } = useContext(UserContext);

  if (isLoading) {
    return <div>Loading your results...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={onReset}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="results-container">
      <h2>Your Results</h2>
      <p>
        <strong>{name}</strong>, your element is: {element}
      </p>
      {artwork ? (
        <div className="artwork">
          <h3>{artwork.title || 'Untitled'}</h3>
          <img 
            src={artwork.primaryImage} 
            alt={artwork.title || 'Artwork'} 
            onError={(e) => {
              e.target.src = '/placeholder-image.png'; // Add a fallback image
            }}
          />
          <p>Artist: {artwork.artistDisplayName || 'Unknown'}</p>
          <p>Date: {artwork.objectDate || 'N/A'}</p>
        </div>
      ) : (
        <p>No artwork found for your element.</p>
      )}
      <button onClick={onReset}>Take Quiz Again</button>
    </div>
  );
}

// Add prop type validation
Results.propTypes = {
  element: PropTypes.string,
  artwork: PropTypes.shape({
    title: PropTypes.string,
    primaryImage: PropTypes.string,
    artistDisplayName: PropTypes.string,
    objectDate: PropTypes.string
  }),
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onReset: PropTypes.func.isRequired
};

Results.defaultProps = {
  element: '',
  artwork: null,
  isLoading: false,
  error: null
};