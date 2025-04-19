import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

export default function UserForm() {
  const [inputName, setInputName] = useState('');
  const [error, setError] = useState('');
  const { setName } = useContext(UserContext);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    
    // Validate name input
    const trimmedName = inputName.trim();
    if (!trimmedName) {
      setError('Please enter a valid name');
      return;
    }

    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }

    // Clear any previous errors
    setError('');

    // Set name and navigate
    setName(trimmedName);
    navigate('/quiz');
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Welcome to the Personality Quiz!</h2>
      <label>
        Enter Your Name:
        <input 
          type="text" 
          value={inputName}
          onChange={(e) => {
            setInputName(e.target.value);
            setError(''); // Clear error when user starts typing
          }}
          placeholder="Your name"
          aria-describedby="name-error"
        />
      </label>
      {error && (
        <p 
          id="name-error" 
          style={{ color: 'red', marginTop: '10px' }}
        >
          {error}
        </p>
      )}
      <button type="submit">Start Quiz</button>
    </form>
  );
}