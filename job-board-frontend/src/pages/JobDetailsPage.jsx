import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import StarsBackground from '../components/StarsBackground';
import '../styles/jobDetails.css';

function JobDetailsPage() {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, token } = useAuth();
  const location = useLocation();

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
            message,
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
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });

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

  if (isLoading) {
    return <h1 className="page-message">Loading job...</h1>;
  }

  if (isError || !job) {
    return <h1 className="page-message">Job not found</h1>;
  }

  const alreadyApplied = myApplications.some(
    (application) => application.job_id === Number(id),
  );
  const isOwner = user?.role === 'employer' && user?.id === job.user_id;
  const backTo = location.state?.from || (isOwner ? '/my-jobs' : '/');

  return (
    <main className="job-details-page">
      <StarsBackground />

      <div className="job-details-content">
        <Link className="back-link" to={backTo}>
          ← Back
        </Link>

        <section className="job-details-card" aria-labelledby="job-title">
          <div className="job-details-header">
            <div>
              <h1 id="job-title">{job.title}</h1>
            </div>
          </div>

          <dl className="job-meta">
            <div>
              <dt>Category</dt>
              <dd>{job.category}</dd>
            </div>

            <div>
              <dt>Location</dt>
              <dd>{job.location}</dd>
            </div>

            <div>
              <dt>Budget</dt>
              <dd>£{job.budget}</dd>
            </div>
          </dl>

          <div className="job-description">
            <h2>Job description</h2>
            <p>{job.description}</p>
          </div>

          {isOwner && (
            <div className="owner-actions" aria-label="Job owner actions">
              <Link className="edit-link" to={`/jobs/${job.id}/edit`}>
                Edit Job
              </Link>

              <button
                type="button"
                className="delete-btn"
                disabled={deleteJobMutation.isPending}
                onClick={() => deleteJobMutation.mutate()}
              >
                {deleteJobMutation.isPending ? 'Deleting...' : 'Delete Job'}
              </button>
            </div>
          )}
          {user?.role === 'freelancer' && (
            <section className="apply-card" aria-labelledby="apply-title">
              {alreadyApplied ? (
                <p className="already-applied">You have already applied.</p>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    if (!message.trim()) return;

                    applyMutation.mutate();
                  }}
                >
                  <h2 id="apply-title">Apply for this job</h2>

                  <label htmlFor="application-message">
                    Message to employer
                  </label>

                  <textarea
                    id="application-message"
                    placeholder="Write a short message about yourself"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />

                  <button type="submit" disabled={applyMutation.isPending}>
                    {applyMutation.isPending ? 'Applying...' : 'Apply'}
                  </button>
                </form>
              )}
            </section>
          )}
        </section>
      </div>
    </main>
  );
}

export default JobDetailsPage;
