
import React from 'react';
import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function ViewPage() {
    const location=useLocation();
    const students = location.state?.data;
    // const [studentIds, setStudentIds] = useState([]);
    const studentIds = students.map((student) => student.student_id);
    // const [studentData, setStudentData] = useState([]);

  const [studentData, setStudentData] = useState({});
  const [marksData, setMarksData] = useState({});
  const [unmarkedStudents, setUnmarkedStudents] = useState([]);
//   const studentIds = [1, 2, 3]; // Example array of student IDs

  useEffect(() => {
    const fetchData = async () => {
      try {
        for (const studentId of studentIds) {
          // Fetch student data
          const studentResponse = await axios.get(`http://localhost:3001/students/${studentId}`);
          const studentInfo = studentResponse.data;

          // Fetch marks data
          const marksResponse = await axios.get(`http://localhost:3001/marks/${studentId}`);
          const marksInfo = marksResponse.data;

          // Update state with student and marks data
          setStudentData(prevState => ({ ...prevState, [studentId]: studentInfo }));
          setMarksData(prevState => ({ ...prevState, [studentId]: marksInfo }));

          if (Object.keys(marksInfo).length === 0) {
            setUnmarkedStudents(prevState => [...prevState, studentInfo]);
          }

        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [studentIds]);

  return (
    <div>
        {/* <nav className="navbar navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand" href="/">Home Page</a>
        </div>
      </nav> */}

<nav className="navbar navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand" href="/">View Page</a>
          <div className="navbar-nav ml-auto">
            <button className="btn btn-outline-warning" onClick={() => console.log(unmarkedStudents)}>
              Unmarked Students ({unmarkedStudents.length})
            </button>
          </div>
        </div>
      </nav>
      
      {Object.keys(studentData).map(studentId => (
        <div key={studentId}>
          <h2>Student Details - {studentId}</h2>
          <table className="table">
            <tbody>
              <tr>
                <th>Student ID</th>
                <td>{studentData[studentId].student_id}</td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{studentData[studentId].student_name}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{studentData[studentId].student_email}</td>
              </tr>
            </tbody>
          </table>

          {/* Display marks data */}
          <h2>Marks</h2>
          <table className="table">
            <tbody>
              <tr>
                <th>Ideation Marks</th>
                <td>{marksData[studentId].ideation_marks}</td>
              </tr>
              <tr>
                <th>Execution Marks</th>
                <td>{marksData[studentId].execution_marks}</td>
              </tr>
              <tr>
                <th>Viva/Pitch Marks</th>
                <td>{marksData[studentId].viva_marks}</td>
              </tr>
              <tr>
                <th>Total Marks</th>
                <td>{marksData[studentId].total_marks}</td>
              </tr>
              {/* Add more marks data here */}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default ViewPage;

