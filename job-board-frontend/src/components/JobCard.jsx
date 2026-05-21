import { Link } from 'react-router-dom';

const JobCard = ({ user, job, alreadyApplied = false }) => {
  return (
    <div key={job.id}>
      <h2>{job.title}</h2>
      <p>{job.location}</p>
      <p>£{job.budget}</p>
      <p>{job.description.slice(0, 100)} ...</p>
      {user?.role === 'freelancer' && alreadyApplied && <p>Already applied</p>}
      {user ? (
        <Link to={`/jobs/${job.id}`}>View details</Link>
      ) : (
        <Link to="/login">Login to view details and apply</Link>
      )}
    </div>
  );
};
export default JobCard;
