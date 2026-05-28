import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import StarsBackground from '../components/StarsBackground';
import '../styles/jobApplicants.css';
import Swal from 'sweetalert2';
import api from '../api/axios';

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
      const { data } = await api.get(`/jobs/${id}/job_applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status }) => {
      const { data } = await api.patch(
        `/job_applications/${applicationId}`,
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

    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['job-applications', id] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });

      await Swal.fire({
        icon: 'success',
        title: variables.status === 'accepted' ? 'Accepted!' : 'Rejected!',
        text:
          variables.status === 'accepted'
            ? 'The applicant has been accepted.'
            : 'The applicant has been rejected.',
        timer: 2000,
        showConfirmButton: false,
      });
    },

    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Could not update the application status.',
      });
    },
  });

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
                  <span className={`application-status ${application.status}`}>
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
                    onClick={async () => {
                      const result = await Swal.fire({
                        title: 'Accept Applicant?',
                        text: `Do you want to accept ${application.user.name}?`,
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, accept',
                        cancelButtonText: 'Cancel',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                      });

                      if (result.isConfirmed) {
                        updateStatusMutation.mutate({
                          applicationId: application.id,
                          status: 'accepted',
                        });
                      }
                    }}
                  >
                    Accept
                  </button>

                  <button
                    className="reject-btn"
                    type="button"
                    disabled={updateStatusMutation.isPending}
                    onClick={async () => {
                      const result = await Swal.fire({
                        title: 'Reject Applicant?',
                        text: `Do you want to reject ${application.user.name}?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, reject',
                        cancelButtonText: 'Cancel',
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                      });

                      if (result.isConfirmed) {
                        updateStatusMutation.mutate({
                          applicationId: application.id,
                          status: 'rejected',
                        });
                      }
                    }}
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
