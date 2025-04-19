import React from "react";
import PropTypes from 'prop-types';

export default function Question({ question, options, onAnswer }) {
  return (
    <div className="question-container">
      <h2>{question}</h2>
      <div className="options-container">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onAnswer(option)}
            aria-label={`Select ${option}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

// Add prop type validation
Question.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAnswer: PropTypes.func.isRequired
};