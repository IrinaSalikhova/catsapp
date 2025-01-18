import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import './App.css'

function App() {

return (
  <Router basename="/admin"> 
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/page" element={<AdminPage />} />
    </Routes>
  </Router>
);
}

export default App
