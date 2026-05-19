import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JobDetailsPage from './pages/JobDetailsPage';
import CreateJobPage from './pages/CreateJobPage';
import EditJobPage from './pages/EditJobPage';
import LoginPage from './pages/LoginPage';
import MyApplicationPage from './pages/MyApplicationPage';
import JobApplicantsPage from './pages/JobApplicantsPage';
import Navbar from './components/Navbar';
import MyJobsPage from './pages/MyJobsPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/create-job" element={<CreateJobPage />} />
        <Route path="/jobs/:id/edit" element={<EditJobPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/my-applications" element={<MyApplicationPage />} />
        <Route path="/jobs/:id/applicants" element={<JobApplicantsPage />} />
        <Route path="/my-jobs" element={<MyJobsPage />} />
      </Routes>
    </>
  );
}

export default App;
