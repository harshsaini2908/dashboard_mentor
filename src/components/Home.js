
import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Navbar from './navbar';
import './Home.css';
import EditMarksModal from './edit_marks';
import { useNavigate } from 'react-router-dom';
// import ViewPage from './Viewpage';

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const navigate = useNavigate();
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);




  const handleOpenModal = (studentId) => {
    setSelectedStudentId(studentId); // Set the selected student ID
    setShowEditModal(true); // Open the modal
  };
  const handleCloseModal = () => setShowEditModal(false);



  // Function to fetch students' data from the backend
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/students');
      setStudents(response.data);
      setShowModal(true); // Show modal after data is fetched
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  // Function to add selected student
  const addStudent = (student) => {
    setSelectedStudents([...selectedStudents, student]);
  };

  const addMentorId = async (studentId, mentorId) => {
    // console.log(studentId);
    try {
        // console.log(studentId);
        if (selectedStudents.length < 4) {
            await axios.put(`http://localhost:3001/students/${studentId}/add-mentor/${mentorId}`);
            // Remove the selected student from the list
            const selectedStudent = students.find((student) => student.student_id === studentId);
            setSelectedStudents([...selectedStudents, selectedStudent]);
            const updatedStudents = students.filter(student => student.student_id !== studentId);
            setStudents(updatedStudents);
          } else {
            // Display a warning alert
            alert('Maximum limit of 4 students reached.');
          }
     
    //   console.log(studentId);
    } catch (error) {
      console.error('Error adding mentor ID to student:', error);
    }
  };

  const handleRemove = async (studentId) => {
    try {
      // Make a PUT request to update the student's mentor_id to NULL
      await axios.put(`http://localhost:3001/students/${studentId}/remove-mentor`);
      
      // Remove the student from the selectedStudents list
      const updatedStudents = selectedStudents.filter((student) => student.student_id !== studentId);
      setSelectedStudents(updatedStudents);
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };


//   const handleSubmitbtnClose = () => setShowSuccessMessage(false);
//   const handleSubmitbtnShow = () => setShowSuccessMessage(true);




const handleSubmission = async () => {
    if (selectedStudents.length >= 3) {
        // Proceed with the submission process
        console.log('Submitting data:', selectedStudents);
        setShowSuccessMessage(true);
        // You can send the selected students' data to the backend or perform other actions here
      } else {
        // Display an alert if at least 3 students need to be selected
        alert('Please select at least 3 students for submission.');
      }
    }
  

  function goToView()
  {
    const id=5;
    navigate("/Veiw",{ state: { data: selectedStudents } });
  }
  


  return (
    <div className="home-container">
      <Navbar mentorName="Harsh Saini" />
      <div className="content">
        <h1 className="main-heading">Welcome to the Mentor's Dashboard</h1>
        <p className="sub-heading">Evaluate your students with ease</p>
        {/* Button to trigger fetching and displaying student data */}
        <div className="add-student-box">
          <button className="action-link" onClick={fetchStudents}>
            Add Students
          </button>
        </div>
        {/* Modal to display the fetched student data */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Student List</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  {/* Add more table headers for additional student fields */}
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index}>
                    <td>{student.student_id}</td>
                    <td>{student.student_name}</td>
                    <td>{student.student_email}</td>
                    <td>
                      <Button variant="primary" onClick={() => addMentorId(student.student_id, 4)}>
                        Add
                      </Button>
                    </td>
                    {/* Add more table cells for additional student fields */}
                  </tr>
                ))}
              </tbody>
            </table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="selected-students-container">
              <h2>Selected Students</h2>
                     <table className="table table-striped">
                        <thead>
                          <tr>
                           <th scope="col">id</th>
                           <th scope="col">Name</th>
                           <th scope="col">Email</th>
                           <th scope="col">Edit/Remove</th>
                        </tr>
                      </thead>
                     <tbody>
                      {selectedStudents.map((student, index) => (
                        <tr key={index}>
                          <th scope="row">{student.student_id}</th>
                           <td>{student.student_name}</td>
                          <td>{student.student_email}</td>
                          <td>
                             {/* <button onClick={() => handleEdit(student.id)}>Edit</button> */}
                             {/* <button onClick={() => handleRemove(student.id)}>Remove</button> */}
                             
                               <Button style={{ marginRight: '10px' }} onClick={()=> handleOpenModal(student.student_id)} >Edit</Button>
                               <Button variant="warning" onClick={() => handleRemove(student.student_id)}>Remove</Button>
                               <EditMarksModal
                                          show={showEditModal}
                                         onHide={handleCloseModal}
                                         studentId={selectedStudentId} // Pass the selected student ID to the modal
                                />
                         </td>
                        </tr>
                     ))}
                     
                  </tbody>
                </table>

                
                <div className="button-container">
                   <Button variant="primary"  onClick={goToView}>View</Button>
                   <Button variant="success" onClick={handleSubmission} >Submit</Button>
                   <Modal show={showSuccessMessage} onHide={() => setShowSuccessMessage(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Submission Successful</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          Your Evaluation submitted  successfully!
          </Modal.Body>
         
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSuccessMessage(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
                   
               </div>
   
               
             
       </div>
        
      </div>
    </div>
  );

  
}

export default Home;



