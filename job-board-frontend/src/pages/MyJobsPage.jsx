import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import StarsBackground from '../components/StarsBackground';
import '../styles/myJobs.css';

function MyJobsPage() {
  const { token, user } = useAuth();

  const navigate = useNavigate();

  // protects the my job page on the frontend.
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (user && user.role !== 'employer') {
      navigate('/');
    }
  }, [token, user, navigate]);

  const {
    data: jobs = [],
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

      return data;
    },
  });

  if (isLoading) {
    return (
      <main className="my-jobs-page" aria-busy="true">
        <StarsBackground />

        <h1 role="status" aria-live="polite">
          Loading my jobs...
        </h1>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="my-jobs-page">
        <StarsBackground />

        <h1 role="alert">Could not load my jobs</h1>
      </main>
    );
  }

  return (
    <main className="my-jobs-page" aria-labelledby="my-jobs-title">
      <StarsBackground />

      <div className="my-jobs-content">
        <Link className="back-link" to={'/'}>
          ← Back To Home
        </Link>
        <section className="my-jobs-hero">
          <h1 id="my-jobs-title">My Jobs</h1>
        </section>

        {jobs.length === 0 ? (
          <p className="empty-message">
            You have not created any jobs yet.{' '}
            <Link to="/create-job">Create your first job</Link>
          </p>
        ) : (
          <section className="my-jobs-list" aria-label="Jobs you created">
            {jobs.map((job) => (
              <article className="my-job-item" key={job.id}>
                <h2>{job.title}</h2>
                <p className="posted-date">
                  Posted{' '}
                  {new Date(job.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>

                <p>
                  <strong>Location:</strong> {job.location}
                </p>

                <p>
                  <strong>Budget:</strong> £{job.budget}
                </p>

                <div
                  className="my-job-actions"
                  aria-label={`Actions for ${job.title}`}
                >
                  <p>
                    <strong>
                      {job.applications_count > 0
                        ? `${job.applications_count} applicant${
                            job.applications_count === 1 ? '' : 's'
                          }`
                        : 'No applicants yet'}
                    </strong>
                  </p>
                  <Link to={`/jobs/${job.id}`} state={{ from: '/my-jobs' }}>
                    Edit/Delete
                  </Link>

                  <Link to={`/jobs/${job.id}/applicants`}>Applicants</Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default MyJobsPage;
