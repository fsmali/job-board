import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

function JobDetailsPage() {
  const { id } = useParams();
  const [message, setMessage] = useState('');
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
  const applyMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(
        `http://localhost:3000/jobs/${id}/job_applications`,
        {
          job_application: {
            message: message,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setMessage('');
      navigate('/');
    },
  });

  if (isLoading) return <h1>Loading job...</h1>;
  if (isError) return <h1>Job not found</h1>;

  return (
    <>
      ≈
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          applyMutation.mutate();
        }}
      >
        <h2>Apply this job</h2>
        <textarea
          placeholder=" write a short message about yourself"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <div>
          <button type="submit" disabled={applyMutation.isPending}>
            {applyMutation.isPending ? 'Applying' : 'Apply'}
          </button>
          {applyMutation.isError && (
            <p>
              {applyMutation.error.data?.error ||
                applyMutation.error.data?.errors?.[0] ||
                'You have already applied this job'}
            </p>
          )}
        </div>
      </form>
    </>
  );
}

export default JobDetailsPage;
