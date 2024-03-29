import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function EditMarksModal({ show, onHide, studentId }) {
  const [marks, setMarks] = useState({
    ideation: '',
    execution: '',
    vivaPitch: '',
  });

  const handleChange = (subject, value) => {
    setMarks({
      ...marks,
      [subject]: value,
    });
  };

  const handleSaveMarks = async (studentId) => {
    try {
      // Send a PUT request to update the marks in the database
      
    //   const { ideation_marks, execution_marks , viva_marks } = (marks);
    const ideation_marks=marks.ideation;
    const execution_marks=marks.execution;
    const viva_marks=marks.vivaPitch;
      
      await axios.put(`http://localhost:3001/students/${studentId}/marks`, {ideation_marks: ideation_marks,
      execution_marks: execution_marks,
      viva_marks: viva_marks,});
      onHide(); // Close the modal after saving marks
    } catch (error) {
      console.error('Error saving marks:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Marks</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <label>Ideation</label>
          <input
            type="range"
            min="0"
            max="10"
            value={marks.ideation}
            onChange={(e) => handleChange('ideation', e.target.value)}
          />
          <span>{marks.ideation}</span>
        </div>
        <div>
          <label>Execution</label>
          <input
            type="range"
            min="0"
            max="10"
            value={marks.execution}
            onChange={(e) => handleChange('execution', e.target.value)}
          />
          <span>{marks.execution}</span>
        </div>
        <div>
          <label>Viva/Pitch</label>
          <input
            type="range"
            min="0"
            max="10"
            value={marks.vivaPitch}
            onChange={(e) => handleChange('vivaPitch', e.target.value)}
          />
          <span>{marks.vivaPitch}</span>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={()=> handleSaveMarks(studentId)}>
          Save Marks
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditMarksModal;

