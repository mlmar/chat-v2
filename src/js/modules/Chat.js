import React, { useState, useEffect, useRef } from 'react';
import Message from './Message.js';

import io from 'socket.io-client';
var socket = null;

/*  Chat component with output and input subcomponents
 *    room : room code
 *    user : user nickname
 */
function Chat({ room, user }) {
  const [scrolled, setScrolled] = useState(false);

  const [users, setUsers] = useState([]);
  const [output, setOutput] = useState([]);
  const [message, setMessage] = useState("");

  const messageBox = useRef(null);
  const latest = useRef(null);

  /* Create socket connection
   * Listen for server messages
   * Set nickname
   * Join room
   * Send join message
   */
  useEffect(() => {
    socket = io();

    socket.emit('set_nick', user);
    socket.emit('join_room', room);

    socket.on('users', data => {
      setUsers(data);
    })

    document.title = room;

    return () => { 
      socket.off('server_response');
    };

  }, [room, user]);

  useEffect(() => {
    // append all incoming messages to state array
    socket.on('server_response', data => {
      setOutput(prev => [...prev, data]);
    });
  }, [])

  useEffect(() => {
    if(!scrolled)
      latest?.current?.scrollIntoView();
  }, [output])

  /* focus on message input when user presses enter anywhere on the document
   */
  useEffect(() => {
    document.addEventListener("keydown", handleFocus);
    return () => document.removeEventListener("keydown", handleFocus);
  }, []);

  const handleFocus = e => {
    if(e.code.toUpperCase().includes("ENTER")) {
      messageBox.current.focus();
    }
  }

  const handleScroll = e => {
    setScrolled(e.target.scrollHeight - e.target.scrollTop !== e.target.clientHeight); 
  }

  // send message if connection exists, mesage exists and enter key was pressed
  const handleSend = e => {
    if(socket && message !== "" && e.code.toUpperCase().includes("ENTER")) {
      socket.emit('client_message', { id : socket.id, user : user, message : message, room : room, time : new Date() });
      setMessage("");
    }
  }
  
  // update message state as user types
  const handleMessageChange = e => {
    setMessage(e.target.value);
  }

  return (
    <div className="chat fade in">
      <label className="room"> {room} </label>
      <span className="users"> 
        <label className="sub fade in quick"> {users.length} online: </label>
        { users?.map((u, i) => <label className="sub fade in quick" key={i}> {u} </label>) } 
      </span>
      <br/>
      <div className="output" onScroll={handleScroll}>
        {
          output.map((data, i) => {
            var date = new Date(data.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}).toLowerCase();
            var ref = i === output.length - 1 ? latest : null;
            if(data.id === "server") {
              return (
                <React.Fragment key={i}>
                  <br/>
                  <label className="sub fade in quick" ref={ref}> {data.message} &mdash; {date} </label>
                  <br/>
                </React.Fragment>
              )
            } else {
              var right = data.user === user ? "right" : ""; // determine if message is from the user
              var name = output[i - 1]?.id === data.id ? null : <label className={`sub ${right} `}> {data.user} &mdash; {date} </label>; // hide name for consecutive messages
              return (
                <React.Fragment key={i}>
                  {name}
                  <Message right={data.user === user} message={data.message}/>
                  <span ref={ref}></span>
                </React.Fragment>
              )
            }
          })
        }
      </div>
      <input placeholder="say something" type="text" value={message} onKeyPress={handleSend} onChange={handleMessageChange} ref={messageBox} autoFocus
      />
    </div>

  )
}

export default Chat;