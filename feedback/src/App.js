import React, {useState} from "react";
import "./App.css"

function App() {
    const [role, setRole] = useState("");
  
    const handleRoleChange = (event) => {
      setRole(event.target.value);
    };
  
    const renderContent = () => {
      if (role === "professor") {
        return (
          <div className="boxTeacher">
            <label htmlFor="factivity">Activity:</label>
            <input type="text" id="activity" name="factivity" />
            <label htmlFor="fdate">Date:</label>
            <input type="date" id="date" name="fdate" />
            <label htmlFor="faccess">Access Code:</label>
            <input type="number" id="numbers" name="faccess" placeholder="1000-9999" min="1000" max="9999"/>
            <label htmlFor="ftime">Time:</label>
            <input type="number" id="numbers" name="ftime" placeholder="60-7800s" min="60" max="7800"/>
            <button name="SaveBtnTeacher" id="savebtnteacher">Save</button>
          </div>
        );
      } else if (role === "student") {
        return (
          <div className="boxStudent">
            <label htmlFor="scode">Search by code:</label>
            <input type="number" id="code" name="scode" />
            <button name="SaveBtnStudent" id="savebtnstudent">Search</button>
          </div>
        );
      }
    };
  
    return (
      <div className="container">
        <h2>Who's using?</h2>
        <div className="options-container">
          <div className="option" id="prof">
            <input
              type="radio"
              id="professor"
              name="role"
              value="professor"
              onChange={handleRoleChange}
            />
            <label htmlFor="professor">Professor</label>
          </div>
          <div className="option" id="stud">
            <input
              type="radio"
              id="student"
              name="role"
              value="student"
              onChange={handleRoleChange}
            />
            <label htmlFor="student">Student</label>
          </div>
        </div>
        {renderContent()}
      </div>
    );
  }
export default App;  