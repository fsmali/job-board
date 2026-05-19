import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

const MyApplicationPage = () => {
  const { token } = useAuth();

  const {
    data: applications,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`my-applications`],
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
  });

  if (isLoading) return <h1>Loading applications...</h1>;
  if (isError) return <h1>Could not load applications</h1>;

  return (
    <div>
      {applications.map((application) => (
        <div key={application.id}>
          <h2>{application.job.title}</h2>
          <p>{application.job.location}</p>
          <p>{application.job.category}</p>
          <p>Status: {application.status}</p>
        </div>
      ))}
    </div>
  );
};
export default MyApplicationPage;
