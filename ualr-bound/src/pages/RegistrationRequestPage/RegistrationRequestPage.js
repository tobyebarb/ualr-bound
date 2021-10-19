import { Link, BrowserRouter } from "react-router-dom";
import { useState, useMemo } from "react";
import makeData from "./RegisterData.json"
import "./RegistrationRequestPage.css";
import ColumnData from "./Columns";

const RegistrationRequestPage = () => {
  const [requests, setRequests] = useState(useMemo(() => makeData, []))
  const [approvedRequest, setApprovedRequest] = useState([])
  const [search, setSearch] = useState("");


 const handleDelete = (requestId) => {
   const newRequest = [...requests];
   const index = requests.findIndex((request) => request.id === requestId);
   newRequest.splice(index, 1);
   setRequests(newRequest);
 }

 const handleAppend = (requestId) => {
  const newRequest = [...requests];
  const index = requests.findIndex((request) => request.id === requestId);
  setApprovedRequest(approvedRequest.concat(newRequest.splice(index,1)))
 }

  return (
    <>
    <input 
      type="text" 
      placeholder="Search..."
      onChange={(e) => {
        setSearch(e.target.value)}}
    />
    <div>
      <table className ="request-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Access Level</th>
            <th>Date Created</th>
            <th>Appove/Deny</th>
          </tr>
        </thead>
        <tbody>
          {requests.filter((value)=>{
            if(search ===""){
              return value
            }
            else if(
              value.id.toLowerCase().includes(search.toLowerCase()) ||
              value.name.toLowerCase().includes(search.toLowerCase()) ||
              value.username.toLowerCase().includes(search.toLowerCase()) ||
              value.email.toLowerCase().includes(search.toLowerCase())
            ){
              return value;
            }
          }).map((request) => (
            <ColumnData 
              key={request.id}
              request={request}
              handleDelete={handleDelete}
              handleAppend={handleAppend}/>
          ))}
        </tbody>
      </table>
    </div>
      <p>
        <BrowserRouter>
          <Link to="/"
           onClick={() => {
              window.location.href = "/";
              }}
            >
              Dashboard
          </Link>
        </BrowserRouter>
      </p>
      <p>
        {approvedRequest.map((list) => (
          <li key={list.id}>
            {list.id}
          </li>
        ))}
      </p>
    </>
  )
};

export default RegistrationRequestPage;
