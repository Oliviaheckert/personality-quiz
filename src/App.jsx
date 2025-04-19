import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Question from './components/Question';
import Results from './components/Results';
import UserForm from './components/UserForm';
import { UserProvider } from './components/UserContext';

function App() {
  // Quiz data
  const questions = [
    {
      question: "What's your favorite color?",
      options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
    },
    {
      question: "What's your preferred activity?",
      options: ["Adventuring 🏔️", "Relaxing 🏖️", "Learning 📚", "Socializing 🎉"],
    }
  ];

  const keywords = {
    Fire: "fire",
    Water: "water",
    Earth: "earth",
    Air: "air",
  };

  const elements = {
    "Red 🔴": "Fire",
    "Blue 🔵": "Water",
    "Green 🟢": "Earth",
    "Yellow 🟡": "Air",
    "Adventuring 🏔️": "Fire",
    "Relaxing 🏖️": "Water",
    "Learning 📚": "Earth",
    "Socializing 🎉": "Air",
  };

  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [element, setElement] = useState("");
  const [artwork, setArtwork] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use useCallback to memoize functions
  const handleAnswer = useCallback((answer) => {
    setAnswers(prevAnswers => [...prevAnswers, answer]);
    setCurrentQuestionIndex(prev => prev + 1);
  }, []);

   // Memoize element determination function
   const determineElement = useCallback((answers) => {
    const counts = answers.reduce((acc, answer) => {
      const element = elements[answer];
      acc[element] = (acc[element] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).reduce((a, b) => 
      b[1] > a[1] ? b : a
    )[0];
  }, [elements]);

  // Use useCallback for API fetch
  const fetchArtwork = useCallback(async (keyword) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${keyword}`);
      const data = await response.json();
      
      if (data.objectIDs && data.objectIDs.length > 0) {
        const objectId = data.objectIDs[Math.floor(Math.random() * data.objectIDs.length)];
        const artworkResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`);
        const artworkData = await artworkResponse.json();
        setArtwork(artworkData);
      }
    } catch (error) {
      console.error("Error fetching artwork:", error);
      setError("Failed to fetch artwork");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // UseEffect to handle quiz completion
  useEffect(() => {
    if (currentQuestionIndex === questions.length) {
      const selectedElement = determineElement(answers);
      setElement(selectedElement);
      fetchArtwork(keywords[selectedElement]);
    }
  }, [currentQuestionIndex, answers, determineElement, fetchArtwork, keywords]);

  // Reset quiz function
  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setElement("");
    setArtwork(null);
  }, []);

  return (
    <UserProvider>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<UserForm />} />
          <Route
            path="/quiz"
            element={
              currentQuestionIndex < questions.length ? (
                <Question 
                  question={questions[currentQuestionIndex].question} 
                  options={questions[currentQuestionIndex].options} 
                  onAnswer={handleAnswer} 
                />
              ) : (
                <Results 
                  element={element} 
                  artwork={artwork} 
                  isLoading={isLoading}
                  error={error}
                  onReset={resetQuiz}
                />
              )
            }
          />
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;