import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

function HomePage() {
  const {
    data: jobs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:3000/jobs');
      return data;
    },
  });

  if (isLoading) return <h1>Loading jobs...</h1>;
  if (isError) return <h1>Something went wrong</h1>;

  return (
    <div>
      <h1>Freelancer Job Board</h1>
      <Link to="/create-job">Create a job</Link>
      {jobs.map((job) => (
        <div key={job.id}>
          <h2>{job.title}</h2>
          <p>{job.location}</p>
          <p>£{job.budget}</p>

          <Link to={`/jobs/${job.id}`}>View details</Link>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
