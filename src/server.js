

const express = require('express');
const app = express();
const port = 3001; // Port for your backend server
const { Pool } = require('pg');
const bodyParser = require('body-parser')
const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(bodyParser.json());

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mentor-dashboard',
  password: 'Saini$0001',
  port: 5432, // Default PostgreSQL port
});

// Log a message when the server starts
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  release(); // Release the client back to the pool
});

// Route to fetch students' data
app.get('/students', async (req, res) => {
  try {
    // Query to fetch students from the database
    const query = 'SELECT * FROM students WHERE mentor_id IS NULL';

    const { rows } = await pool.query(query);
    res.json(rows); // Send the fetched data as JSON response
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal Server Error' }); // Send error response
  }
});



// Route to add mentor's ID to a student's record
app.put('/students/:id/add-mentor/:mentorId', async (req, res) => {
    // console.log("welcome");
    const { id, mentorId } = req.params;
    try {
      const query = 'UPDATE students SET mentor_id = $1 WHERE student_id = $2';
      await pool.query(query, [mentorId, id]);
      res.sendStatus(200); // Send success status if update is successful
    } catch (error) {
      console.error('Error adding mentor ID to student:', error);
      res.status(500).json({ error: 'Internal Server Error' }); // Send error response
    }
  });

  // server.js

// PUT endpoint to remove mentor from a student
app.put('/students/:id/remove-mentor', async (req, res) => {

    const { id } = req.params;
    try {
      // Update the mentor_id of the student to NULL
      const query = 'UPDATE students SET mentor_id = NULL WHERE student_id = $1';
      await pool.query(query, [id]);

      const deleteMarksQuery = 'DELETE FROM marks WHERE student_id = $1';
        await pool.query(deleteMarksQuery, [id]);

      res.sendStatus(200); // Send success status if update is successful
    } catch (error) {
      console.error('Error removing mentor from student:', error);
      res.status(500).json({ error: 'Internal Server Error' }); // Send error response
    }
  });

  // In your server.js or routes file

// Import your PostgreSQL pool instance

// PUT route to update marks for a student
app.put('/students/:studentId/marks', async (req, res) => {
    console.log("welcome");
  try {
    // const { ideation_marks, execution_marks, viva_marks } = req.body;
    // console.log(req.body);
    const ideation_marks=req.body.ideation_marks;
    const execution_marks=req.body.execution_marks;
    const viva_marks=req.body.viva_marks;
    const student_id = req.params.studentId;
   

    // Calculate total marks
    const total_marks = parseInt(ideation_marks) + parseInt(execution_marks) + parseInt(viva_marks);
    console.log(total_marks);

    // Check if the student exists in the database
    const checkStudentQuery = 'SELECT * FROM marks WHERE student_id = $1';
    const { rows } = await pool.query(checkStudentQuery, [student_id]);

    if (rows.length === 0) {
      // Student does not exist, insert a new record
      const insertQuery = `
        INSERT INTO marks (student_id, ideation_marks, execution_marks, viva_marks, total_marks)
        VALUES ($1, $2, $3, $4, $5)
      `;
      await pool.query(insertQuery, [student_id, ideation_marks, execution_marks, viva_marks, total_marks]);
    } else {
      // Student exists, update their marks and total marks
      const updateQuery = `
        UPDATE marks
        SET ideation_marks = $1, execution_marks = $2, viva_marks = $3, total_marks = $4
        WHERE student_id = $5
      `;
      await pool.query(updateQuery, [ideation_marks, execution_marks, viva_marks, total_marks, student_id]);
    }

    res.status(200).json({ message: 'Marks updated successfully' });
  } catch (error) {
    console.error('Error updating marks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  

app.post('/check-missing-student-ids', async (req, res) => {
    console.log("welcome");
    try {
      // Extract student IDs from the request body
      console.log(req.body);
      const studentIds = req.body.studentIds;
  
      // Query to check for missing student IDs in the marks table
      const query = `
        SELECT student_id
        FROM students
        WHERE student_id = ANY($1)
      `;
  
      // Execute the query
      const { rows } = await pool.query(query, [studentIds]);
  
      // Extract existing student IDs from the query result
      const existingStudentIds = rows.map(row => row.student_id);
  
      // Find missing student IDs
      const missingStudentIds = studentIds.filter(id => !existingStudentIds.includes(id));
  
      // Send response with missing student IDs
      res.json({ missingStudentIds });
    } catch (error) {
      console.error('Error checking missing student IDs:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.get('/students/:student_id', async (req, res) => {
    console.log("welcome to students");
    const { student_id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM students WHERE student_id = $1', [student_id]);
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Student not found' });
      } else {
        res.json(result.rows[0]); // Send the first (and only) row as JSON response
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.get('/marks/:student_id', async (req, res) => {
    console.log("welcome to marks");
    const { student_id } = req.params;
    try {
      const result = await pool.query('SELECT ideation_marks, execution_marks, viva_marks, total_marks FROM marks WHERE student_id = $1', [student_id]);
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Marks not found for the student' });
      } else {
        // Exclude the first column (presumably student ID) from the response
        const marks = result.rows[0];
        delete marks.student_id;
        res.json(marks); // Send the marks data as JSON response
      }
    } catch (error) {
      console.error('Error fetching marks data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

