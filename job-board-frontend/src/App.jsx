import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JobDetailsPage from './pages/JobDetailsPage';
import CreateJobPage from './pages/CreateJobPage';
import EditJobPage from './pages/EditJobPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/jobs/:id" element={<JobDetailsPage />} />
      <Route path="/create-job" element={<CreateJobPage />} />
      <Route path="/jobs/:id/edit" element={<EditJobPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
