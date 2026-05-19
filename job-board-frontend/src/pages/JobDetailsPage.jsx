import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { use } from 'react';

function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { token } = useAuth();

  const {
    data: job,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/jobs/${id}`);
      return data;
    },
  });
  const deleteJobMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`http://localhost:3000/jobs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      navigate('/');
    },
  });

  if (isLoading) return <h1>Loading job...</h1>;
  if (isError) return <h1>Job not found</h1>;

  return (
    <div>
      <Link to="/">Back to jobs</Link>
      <h1>{job.title}</h1>
      <p>{job.description}</p>
      <p>{job.location}</p>
      <p>{job.category}</p>
      <p>£{job.budget}</p>
      <Link to={`/jobs/${job.id}/edit`}>
        <button>Edit Job</button>
      </Link>
      <button onClick={() => deleteJobMutation.mutate()}>Delete Job</button>
    </div>
  );
}

export default JobDetailsPage;
