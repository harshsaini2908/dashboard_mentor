import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddStudent from './components/AddStudent';
import Home from './components/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
// import ViewPage from './components/Viewpage';
import Veiw from './components/Veiw'



function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/add-student" element={<AddStudent />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/Veiw" element={<Veiw/>} />
        {/* <Route path="/ViewPage" element={<ViewPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
