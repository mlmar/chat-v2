import React from 'react';

function Message({ message, right, className}) {
  var rightClass = right ? "right" : "";
  return (
    <p className={`message ${rightClass} ${className}`}> {message} </p> 
  )
}

export default Message;