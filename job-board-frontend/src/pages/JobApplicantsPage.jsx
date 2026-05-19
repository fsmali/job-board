import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function JobApplicantsPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: applications,
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
            status: status,
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
      queryClient.invalidateQueries({ queryKey: ['job-applications', id] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
    },
  });

  if (isLoading) return <h1>Loading applicants...</h1>;
  if (isError) return <h1>Could not load applicants</h1>;

  return (
    <div>
      <h1>Job Applicants</h1>

      {applications.map((application) => (
        <div key={application.id}>
          <p>{application.message}</p>
          <p>Status: {application.status}</p>
          <button
            onClick={() =>
              updateStatusMutation.mutate({
                applicationId: application.id,
                status: 'accepted',
              })
            }
          >
            Accept
          </button>

          <button
            onClick={() =>
              updateStatusMutation.mutate({
                applicationId: application.id,
                status: 'rejected',
              })
            }
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}

export default JobApplicantsPage;
