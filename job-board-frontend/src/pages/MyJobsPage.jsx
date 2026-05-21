import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MyJobsPage() {
  const { token } = useAuth();

  const {
    data: jobs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:3000/my-jobs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data.length);
      return data;
    },
  });

  if (isLoading) return <h1>Loading my jobs...</h1>;
  if (isError) return <h1>Could not load my jobs</h1>;

  return (
    <div>
      <h1>My Jobs</h1>
      {jobs.length === 0 ? (
        <Link to="/create-job">Create your first job</Link>
      ) : (
        jobs.map((job) => (
          <div key={job.id}>
            <h2>{job.title}</h2>
            <p>{job.location}</p>
            <p>£{job.budget}</p>

            <Link to={`/jobs/${job.id}`}>View</Link>

            <Link to={`/jobs/${job.id}/applicants`}>Applicants</Link>
          </div>
        ))
      )}
    </div>
  );
}

export default MyJobsPage;
