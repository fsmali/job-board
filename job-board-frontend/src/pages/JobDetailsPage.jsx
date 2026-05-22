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
  const { user, token } = useAuth();

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
      await axios.delete(`http://localhost:3000/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      navigate('/my-jobs');
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
  const { data: myApplications = [] } = useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const { data } = await axios.get(
        'http://localhost:3000/my-applications',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return data;
    },
    enabled: !!token && user?.role === 'freelancer',
  });

  if (isLoading) return <h1>Loading job...</h1>;
  if (isError) return <h1>Job not found</h1>;
  const alreadyApplied = myApplications.some(
    (application) => application.job_id === Number(id),
  );

  return (
    <>
      {job.length === 0 && <p>No jobs found for this search.</p>}
      <div>
        <Link to={'/my-jobs'}>Back To My Jobs</Link>
        <h1>{job.title}</h1>
        <p>{job.location}</p>
        <p>{job.category}</p>
        <p>£{job.budget}</p>
        <p>{job.description}</p>

        {user?.role === 'employer' && user?.id === job.user_id && (
          <>
            <Link to={`/jobs/${job.id}/edit`}>
              <button>Edit Job</button>
            </Link>

            <button onClick={() => deleteJobMutation.mutate()}>
              Delete Job
            </button>
          </>
        )}
      </div>
      {user?.role === 'freelancer' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (alreadyApplied) return;
            applyMutation.mutate();
          }}
        >
          <h2
            style={{
              display:
                applyMutation.isPending || alreadyApplied ? 'none' : 'block',
            }}
          >
            Apply this job
          </h2>
          <textarea
            placeholder=" write a short message about yourself"
            value={message}
            style={{
              display:
                applyMutation.isPending || alreadyApplied ? 'none' : 'block',
            }}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <div>
            <button
              type="submit"
              disabled={applyMutation.isPending || alreadyApplied}
            >
              {alreadyApplied
                ? 'Already applied'
                : applyMutation.isPending
                  ? 'Applying'
                  : 'Apply'}
            </button>
            {applyMutation.isError && (
              <p>
                {applyMutation.error.response?.data?.error ||
                  applyMutation.error.response?.data?.errors?.[0] ||
                  'You have already applied this job'}
              </p>
            )}
          </div>
        </form>
      )}
    </>
  );
}

export default JobDetailsPage;
