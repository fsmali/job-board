import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import StarsBackground from '../components/StarsBackground';
import api from '../api/axios';
import '../styles/myApplications.css';

const MyApplicationPage = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (user && user.role !== 'freelancer') {
      navigate('/');
    }
  }, [token, user, navigate]);

  const {
    data: applications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['my-applications', token],
    queryFn: async () => {
      const { data } = await api.get('/my-applications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    },
    enabled: Boolean(token && user?.role === 'freelancer'),
  });

  const total = applications.length;
  const pending = applications.filter((app) => app.status === 'pending').length;
  const accepted = applications.filter(
    (app) => app.status === 'accepted',
  ).length;
  const rejected = applications.filter(
    (app) => app.status === 'rejected',
  ).length;

  if (isLoading) {
    return <h1 className="page-message">Loading applications...</h1>;
  }

  if (isError) {
    return <h1 className="page-message">Could not load applications</h1>;
  }

  return (
    <main className="applications-page">
      <StarsBackground />

      <div className="applications-content">
        <Link className="back-link" to="/">
          ← Back
        </Link>

        <section className="applications-hero">
          <h1>My Applications</h1>
          <p>Track the jobs you have applied for.</p>
        </section>

        <section
          className="applications-stats"
          aria-label="Application summary"
        >
          <div className="stat-card">
            <span>Total</span>
            <strong>{total}</strong>
          </div>

          <div className="stat-card pending">
            <span>Pending</span>
            <strong>{pending}</strong>
          </div>

          <div className="stat-card accepted">
            <span>Accepted</span>
            <strong>{accepted}</strong>
          </div>

          <div className="stat-card rejected">
            <span>Rejected</span>
            <strong>{rejected}</strong>
          </div>
        </section>

        {applications.length === 0 ? (
          <section className="empty-card">
            <p>You have not applied to any jobs yet.</p>
            <Link to="/">Browse jobs</Link>
          </section>
        ) : (
          <section
            className="applications-list"
            aria-label="My job applications"
          >
            {applications.map((application) => (
              <article className="application-card" key={application.id}>
                <div className="application-header">
                  <div>
                    <h2>{application.job?.title}</h2>
                    <p>{application.job?.location}</p>
                  </div>

                  <span className={`application-status ${application.status}`}>
                    {application.status}
                  </span>
                </div>

                <p className="application-description">
                  {application.job?.description?.slice(0, 100)}...
                </p>

                <Link
                  className="details-link"
                  to={`/jobs/${application.job?.id}`}
                  state={{ from: '/my-applications' }}
                >
                  View job details
                </Link>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

export default MyApplicationPage;
