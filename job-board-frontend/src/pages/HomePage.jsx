import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import StarsBackground from '../components/StarsBackground';
import '../styles/home.css';

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

  /*
data is undefined during the initial render
while the request is still loading.

an empty array as a fallback so jobs.map()
does not crash before the API response arrives.
*/

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
  // Fetch the logged-in freelancer's applications

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
    // we use optional chaining that return undifiend instead of crashing app.
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

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(input);
    setInput({
      category: '',
      location: '',
    });
  };

  if (isLoading) {
    return (
      <main className="home-page" aria-busy="true">
        <h1 role="status" aria-live="polite">
          Loading jobs...
        </h1>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="home-page">
        <h1 role="alert">Something went wrong</h1>
      </main>
    );
  }

  return (
    <main className="home-page" aria-labelledby="home-title">
      <StarsBackground />

      <div className="home-content">
        <section className="home-hero">
          <h1 id="home-title">Freelancer Job Board</h1>
        </section>

        <form
          className="home-filters"
          onSubmit={handleSearch}
          aria-label="Filter jobs"
        >
          <div>
            <label htmlFor="category">Filter by category</label>
            <input
              id="category"
              type="text"
              name="category"
              placeholder="Filter by category"
              value={input.category}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="location">Filter by location</label>
            <input
              id="location"
              type="text"
              name="location"
              placeholder="Filter by location"
              value={input.location}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Search</button>

          <button type="button" className="reset-btn" onClick={handleReset}>
            Reset
          </button>

          {token && user?.role === 'employer' && (
            <Link className="create-job-link" to="/create-job">
              Create a job
            </Link>
          )}
        </form>

        {jobs.length === 0 && (
          <p className="empty-message" role="status" aria-live="polite">
            No jobs found
          </p>
        )}

        <section className="jobs-list" aria-label="Available jobs">
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
        </section>
      </div>
    </main>
  );
}

export default HomePage;
