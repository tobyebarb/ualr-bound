import React from "react";

const ColumnData = ({request, handleAppend, handleDelete}) => {
  function handleBothEvents(requestID){
    handleAppend(requestID);
    handleDelete(requestID);
  }
  
  return(
    <tr>
    <td>{request.id}</td>
    <td>{request.name}</td>
    <td>{request.username}</td>
    <td>{request.email}</td>
    <td>{request.accessLevel}</td>
    <td>{request.dateCreated}</td>
    <td>
      <button onClick={()=> handleBothEvents(request.id)}>
        Approve
      </button>
      <button onClick={()=> handleDelete(request.id)}>
        Deny
      </button>
    </td>

  </tr>
  )
}

export default ColumnData