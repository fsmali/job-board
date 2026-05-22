import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import StarsBackground from '../components/StarsBackground';
import '../styles/jobApplicants.css';
import { toast } from 'react-toastify';

function JobApplicantsPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
    data: applications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['job-applications', id],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/jobs/${id}/job_applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status }) => {
      const { data } = await axios.patch(
        `http://localhost:3000/job_applications/${applicationId}`,
        {
          job_application: {
            status,
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

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['job-applications', id] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });

      toast.success(
        variables.status === 'accepted'
          ? 'Applicant accepted'
          : 'Applicant rejected',
        { autoClose: 1000 },
      );
    },

    onError: () => {
      toast.error('Could not update applicant status');
    },
  });

  const confirmStatusUpdate = ({ applicationId, status }) => {
    const toastId = `${status}-application-${applicationId}`;

    if (toast.isActive(toastId)) return;

    toast.info(
      <div>
        <p style={{ marginBottom: '12px' }}>
          {status === 'accepted'
            ? 'Accept this applicant?'
            : 'Reject this applicant?'}
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              updateStatusMutation.mutate({ applicationId, status });
              toast.dismiss(toastId);
            }}
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              background: status === 'accepted' ? '#059669' : '#991b1b',
              color: 'white',
            }}
          >
            {status === 'accepted' ? 'Accept' : 'Reject'}
          </button>

          <button
            onClick={() => toast.dismiss(toastId)}
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              background: '#374151',
              color: 'white',
            }}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        toastId,
        autoClose: false,
        closeOnClick: false,
      },
    );
  };

  if (isLoading) {
    return <h1 className="page-message">Loading applicants...</h1>;
  }

  if (isError) {
    return <h1 className="page-message">Could not load applicants</h1>;
  }

  return (
    <main className="applicants-page">
      <StarsBackground />

      <div className="applicants-content">
        <Link className="back-link" to="/my-jobs">
          ← Back to My Jobs
        </Link>

        <section className="applicants-hero">
          <h1>Job Applicants</h1>
          <p>Manage candidates for this position.</p>
        </section>

        {applications.length === 0 ? (
          <section className="empty-card">
            <p>No applicants found yet.</p>

            <Link to="/my-jobs">Back To My Jobs</Link>
          </section>
        ) : (
          <section className="applicants-list" aria-label="Job applicants">
            {applications.map((application) => (
              <article className="applicant-card" key={application.id}>
                <div className="applicant-header">
                  <span className="application-status">
                    {application.status}
                  </span>
                </div>

                <div className="applicant-contact">
                  <p>
                    <strong>Name:</strong> {application.user.name}
                  </p>

                  <p>
                    <strong>Email:</strong> {application.user.email}
                  </p>

                  <p>
                    <strong>Phone:</strong> {application.user.phone_number}
                  </p>
                </div>

                <p className="application-message">{application.message}</p>

                <div className="applicant-actions">
                  <button
                    className="accept-btn"
                    type="button"
                    disabled={updateStatusMutation.isPending}
                    onClick={() =>
                      confirmStatusUpdate({
                        applicationId: application.id,
                        status: 'accepted',
                      })
                    }
                  >
                    Accept
                  </button>

                  <button
                    className="reject-btn"
                    type="button"
                    disabled={updateStatusMutation.isPending}
                    onClick={() =>
                      confirmStatusUpdate({
                        applicationId: application.id,
                        status: 'rejected',
                      })
                    }
                  >
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default JobApplicantsPage;
