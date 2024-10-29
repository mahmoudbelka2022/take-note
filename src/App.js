import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [noteDateTime, setNoteDateTime] = useState('');
  const [font, setFont] = useState('Montserrat');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [noteDate, setNoteDate] = useState('');
  const [noteTime, setNoteTime] = useState('');


  // Update current time every second
 useEffect(() => {
   const interval = setInterval(() => {
     const now = new Date();
     const formattedTime = now.toLocaleString('en-US', {
       weekday: 'long',
       year: 'numeric',
       month: 'long',
       day: 'numeric',
       hour: '2-digit',
       minute: '2-digit',
       second: '2-digit',
     });
     setCurrentTime(formattedTime);
   }, 1000);

   return () => clearInterval(interval); // Cleanup the interval on unmount
 }, []);

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

  const handleAddNote = () => {
if (noteInput) {
 let formattedTimestamp = "";

 if (noteDate && noteTime) {
   formattedTimestamp = `${noteDate} ${noteTime}`;
 } else {
   formattedTimestamp = new Date().toLocaleString(); // Default to current date and time
 }

 const newNote = {
   text: noteInput,
   timestamp: formattedTimestamp,
 };

 setNotes((prevNotes) => [...prevNotes, newNote]);
 setNoteInput('');
 setNoteDate('');
 setNoteTime('');
}
};

  // const handleAddNote = () => {
  //   if (noteInput) {
  //     let formattedTimestamp = "";
  //
  //     if (noteDateTime) {
  //       const dateObj = new Date(noteDateTime);
  //
  //       // Check if the date object is valid
  //       if (!isNaN(dateObj.getTime())) {
  //         formattedTimestamp = dateObj.toLocaleString();
  //       } else {
  //         console.log("Invalid datetime input"); // Debug log
  //         formattedTimestamp = "Invalid Date";
  //       }
  //     } else {
  //       formattedTimestamp = new Date().toLocaleString(); // Default to current date and time
  //     }
  //
  //     const newNote = {
  //       text: noteInput,
  //       timestamp: formattedTimestamp,
  //     };
  //
  //     setNotes((prevNotes) => [...prevNotes, newNote]);
  //     setNoteInput('');
  //     setNoteDateTime('');
  //   }
  // };

  const handleDeleteNote = (index) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
  };

  const handleFontChange = (event) => {
    setFont(event.target.value);
  };

  return (
    <div className="App">
      <h1 style={{ fontFamily: font }}>Note App</h1>

      {!isRegistered ? (
        <form onSubmit={(e) => { e.preventDefault(); setIsRegistered(true); }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a username to register"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a password"
            required
          />
          <button type="submit">Register</button>
        </form>
      ) : !isLoggedIn ? (
        <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }}>
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
<input
type="date"
value={noteDate}
onChange={(e) => setNoteDate(e.target.value)}
placeholder="Select date"
/>
<input
type="time"
value={noteTime}
onChange={(e) => setNoteTime(e.target.value)}
placeholder="Select time"
/>
<button onClick={handleAddNote}>Add Note</button>
</div>



          <ul>
            {notes.map((note, index) => (
              <li key={index}>
                <p>{note.text}</p>
                <small>{note.timestamp}</small>
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
