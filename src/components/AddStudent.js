// In src/components/AddStudent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddStudent() {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Fetch students who don't have assigned mentors
  useEffect(() => {
    axios.get('/api/students/unassigned').then((response) => {
      setStudents(response.data);
    });
  }, []);

  const handleSelectStudent = (studentId) => {
    const isSelected = selectedStudents.includes(studentId);
    if (isSelected) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleSubmit = () => {
    if (selectedStudents.length >= 3 && selectedStudents.length <= 4) {
      // Submit the selected students to the backend
      console.log('Selected Students:', selectedStudents);
      // axios.post('/api/path_to_assign_students', { selectedStudents });
    } else {
      alert('Please select between 3 to 4 students.');
    }
  };

  return (
    <div>
      <h2>Select Students</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedStudents.includes(student.id)}
                onChange={() => handleSelectStudent(student.id)}
              />
              {student.name}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Select</button>
    </div>
  );
}

export default AddStudent;
