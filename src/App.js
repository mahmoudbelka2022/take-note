import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // State for password
  const [registeredUsers, setRegisteredUsers] = useState([]); // To store username-password pairs
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [font, setFont] = useState('Montserrat'); // Default font
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [isRegistered, setIsRegistered] = useState(false); // Track registration status
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  // Load notes when username is set
  useEffect(() => {
    if (username) {
      const savedNotes = localStorage.getItem(`${username}_notes`);
      setNotes(savedNotes ? JSON.parse(savedNotes) : []);
    }
  }, [username]);

  // Save notes when they change
  useEffect(() => {
    if (username && isLoggedIn) {
      localStorage.setItem(`${username}_notes`, JSON.stringify(notes));
    }
  }, [notes, username, isLoggedIn]);

  // Update the current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000); // Update time every second

    return () => clearInterval(timer); // Cleanup the timer on unmount
  }, []);

  const handleAddNote = () => {
    if (noteInput) {
      setNotes([...notes, noteInput]);
      setNoteInput('');
    }
  };

  const handleDeleteNote = (index) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
  };

  const handleFontChange = (event) => {
    setFont(event.target.value);
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    if (username.trim() === '' || password.trim() === '') {
      alert('Please enter a valid username and password.');
      return; // Don't proceed if username or password is invalid
    }

    const userExists = registeredUsers.some(user => user.username === username);
    if (userExists) {
      alert('Username already exists. Please choose a different one.');
    } else {
      // Add username and password to the registered users list
      setRegisteredUsers([...registeredUsers, { username, password }]);
      setIsRegistered(true); // Switch to login mode
      alert('Registration successful! You can now log in with your username and password.');
    }
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    const user = registeredUsers.find(user => user.username === username);
    if (!user) {
      alert('Username not found. Please register first.');
    } else if (user.password !== password) {
      alert('Incorrect password. Please try again.');
    } else {
      // Load notes for the registered user
      const savedNotes = localStorage.getItem(`${user.username}_notes`);
      setNotes(savedNotes ? JSON.parse(savedNotes) : []);
      setIsLoggedIn(true); // Set the login status
      alert(`Welcome back, ${username}!`); // Welcome message
    }
  };

  return (
    <div className="App">
      <h1 style={{ fontFamily: font }}>Note App</h1>
      <p style={{ fontFamily: font, color: '#666' }}>{currentTime}</p>

      {!isRegistered ? (
        <form onSubmit={handleRegisterSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a username to register"
            required
          />
          <input
            type="password" // Password input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a password"
            required
          />
          <button type="submit">Register</button>
        </form>
      ) : !isLoggedIn ? (
        <form onSubmit={handleLoginSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button type="submit">Log In</button>
        </form>
      ) : (
        <>
          <h2>Welcome, {username}!</h2>
          <div className="settings">
            <select value={font} onChange={handleFontChange}>
              <option value="Montserrat">Montserrat</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Trebuchet MS">Trebuchet MS</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Impact">Impact</option>
            </select>
          </div>
          <div className="input-container">
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Add a new note"
            />
            <button onClick={handleAddNote}>Add Note</button>
          </div>
          <ul>
            {notes.map((note, index) => (
              <li key={index}>
                {note}
                <button onClick={() => handleDeleteNote(index)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
