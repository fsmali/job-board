import { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/createJob.css';
import StarsBackground from '../components/StarsBackground';
import Swal from 'sweetalert2';

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

  //useMutation CREATE / UPDATE / DELETE data

  const createJobMutation = useMutation({
    //The parameter newJob exists  because mutationFn needs data to send to the server. newJob === formData
    mutationFn: async (newJob) => {
      const { data } = await axios.post(
        'http://localhost:3000/jobs',
        {
          // in here we use job key as back end aspect job = current_user.jobs.new(job_params)
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

      Swal.fire({
        icon: 'success',
        title: 'Job Created!',
        text: 'Your job has been published successfully.',
      });

      setFormData({
        title: '',
        description: '',
        location: '',
        category: '',
        budget: '',
      });

      navigate('/my-jobs');
    },

    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Could not create the job.',
      });
    },
  });
  // This function runs every time an input changes.
  const handleChange = (e) => {
    setFormData({
      // copies the existing object properties into a new object.
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.location.trim() ||
      !formData.category.trim() ||
      !formData.budget
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all fields.',
      });

      return;
    }

    const result = await Swal.fire({
      title: 'Create Job?',
      text: 'Do you want to publish this job posting?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, create it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      createJobMutation.mutate(formData);
    }
  };

  return (
    <main className="create-job-page" aria-labelledby="create-job-title">
      <StarsBackground />

      <div className="create-job-content">
        <Link className="back-link" to="/">
          ← Back to Home
        </Link>

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
          </form>
        </section>
      </div>
    </main>
  );
}

export default CreateJobPage;
