import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';

function HomePage() {
  const { user, token } = useAuth();
  const [input, setInput] = useState({
    category: '',
    location: '',
  });

  const [search, setSearch] = useState({
    category: '',
    location: '',
  });

  const {
    data: jobs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['jobs', search.category, search.location],
    queryFn: async () => {
      const params = {};

      if (search.category.trim() !== '') {
        params.category = search.category;
      }

      if (search.location.trim() !== '') {
        params.location = search.location;
      }

      const { data } = await axios.get('http://localhost:3000/jobs', {
        params,
      });

      return data;
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

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    setInput({
      category: '',
      location: '',
    });

    setSearch({
      category: '',
      location: '',
    });
  };

  const handleSearch = () => {
    setSearch(input);
    setInput({
      category: '',
      location: '',
    });
  };

  if (isLoading) return <h1>Loading jobs...</h1>;
  if (isError) return <h1>Something went wrong</h1>;

  return (
    <div>
      <h1>Freelancer Job Board</h1>

      <input
        type="text"
        name="category"
        placeholder="Filter by category"
        value={input.category}
        onChange={handleChange}
      />

      <input
        type="text"
        name="location"
        placeholder="Filter by location"
        value={input.location}
        onChange={handleChange}
      />

      <button onClick={handleSearch}>Search</button>
      <button onClick={handleReset}>Reset</button>

      <br />

      {token && user?.role === 'employer' && (
        <Link to="/create-job">Create a job</Link>
      )}

      {jobs.length === 0 && <p>No jobs found</p>}

      {jobs.map((job) => {
        const alreadyApplied = myApplications.some(
          (application) => application.job_id === job.id,
        );

        return (
          <JobCard
            key={job.id}
            job={job}
            user={user}
            alreadyApplied={alreadyApplied}
          />
        );
      })}
    </div>
  );
}

export default HomePage;
