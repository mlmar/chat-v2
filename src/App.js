import React, { useState } from 'react';
import './App.css';
import Chat from './js/modules/Chat.js';


function App() {
  const [ room, setRoom ] = useState("");
  const [ user, setUser ] = useState("");
  const [ joined, setJoined ] = useState(false);
  const [ transition, setTransition] = useState("");

  const handleKeyPress = (e) => {
    if(e.code.toUpperCase().includes("ENTER") && room.length > 0 && user.length > 0)
      handleJoin();
  }

  const handleRoomChange = (e) => {
    setRoom(e.target.value);
  }

  const handleUserChange = (e) => {
    setUser(e.target.value);
  }

  const handleJoin = () => {
    setTransition("fade out");
    setTimeout(() => {
      setJoined(true);
    }, 800)
  }
  
  return (
    <div className="App">
        <div className="main">
          { !joined ? 
            <div className={`home ${transition}`}>
              <input className="room" type="text" placeholder="room code" value={room} onChange={handleRoomChange} onKeyPress={handleKeyPress} autoFocus/>
              <input className="user" type="text" placeholder="name" value={user} onChange={handleUserChange} onKeyPress={handleKeyPress} />
              <button disabled={room.length === 0 || user.length === 0} className="join" onClick={handleJoin}> join </button>
            </div>
            :
            <Chat room={room} user={user}/>
          }
        </div>
    </div>
  );
}

export default App;
