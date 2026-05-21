import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyApplicationPage = () => {
  const { token } = useAuth();

  // protects the Create Job page on the frontend.
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
      console.log(data);
      return data;
    },
  });

  if (isLoading) return <h1>Loading applications...</h1>;
  if (isError) return <h1>Could not load applications</h1>;

  return (
    <div>
      {applications.length === 0 && (
        <p>
          You have not applied to any jobs yet.{' '}
          <Link to={'/'}>
            <p>apply a job</p>
          </Link>
        </p>
      )}
      {applications.map((application) => (
        <div key={application.id}>
          <h2>{application.job.title}</h2>
          <p>{application.job.location}</p>
          <p>{application.job.category}</p>
          <p>£{application.job.budget}</p>
          <p>{application.job.description}</p>
          <p>Status: {application.status}</p>
        </div>
      ))}
    </div>
  );
};
export default MyApplicationPage;
