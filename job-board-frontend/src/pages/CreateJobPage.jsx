import { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/createJob.css';
import StarsBackground from '../components/StarsBackground';
import { toast } from 'react-toastify';

function CreateJobPage() {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    budget: '',
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (user && user.role !== 'employer') {
      navigate('/');
    }
  }, [token, user, navigate]);

  const createJobMutation = useMutation({
    mutationFn: async (newJob) => {
      const { data } = await axios.post(
        'http://localhost:3000/jobs',
        {
          job: newJob,
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

      toast.success('Job created successfully', {
        autoClose: 1000,
      });

      setFormData({
        title: '',
        description: '',
        location: '',
        category: '',
        budget: '',
      });

      setTimeout(() => {
        navigate('/');
      }, 1000);
    },
    onError: () => {
      toast.error('Could not create job');
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.location.trim() ||
      !formData.category.trim() ||
      !formData.budget
    ) {
      toast.warning('Please fill out all fields');
      return;
    }

    if (toast.isActive('create-job-confirm')) return;

    toast.info(
      <div>
        <p style={{ marginBottom: '12px' }}>Create this job posting?</p>

        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <button
            onClick={() => {
              createJobMutation.mutate(formData);
              toast.dismiss('create-job-confirm');
            }}
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              background: '#4f46e5',
              color: 'white',
            }}
          >
            Create
          </button>

          <button
            onClick={() => toast.dismiss('create-job-confirm')}
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
        toastId: 'create-job-confirm',
        autoClose: false,
        closeOnClick: false,
      },
    );
  };

  return (
    <main className="create-job-page" aria-labelledby="create-job-title">
      <StarsBackground />
      <section className="create-job-card">
        <h1 id="create-job-title">Create Job</h1>

        <form onSubmit={handleSubmit} aria-label="Create job form">
          <div className="form-group">
            <label htmlFor="title">Job title</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Job title"
              value={formData.title}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="budget">Budget</label>
            <input
              id="budget"
              type="number"
              name="budget"
              placeholder="Budget"
              value={formData.budget}
              onChange={handleChange}
              required
              aria-required="true"
              min="0"
            />
          </div>

          <button type="submit" disabled={createJobMutation.isPending}>
            {createJobMutation.isPending ? 'Creating...' : 'Create Job'}
          </button>

          {/* {createJobMutation.isError && (
            <p role="alert" aria-live="assertive" className="form-error">
              Could not create job. Please check the form.
            </p>
          )} */}
        </form>
      </section>
    </main>
  );
}

export default CreateJobPage;
