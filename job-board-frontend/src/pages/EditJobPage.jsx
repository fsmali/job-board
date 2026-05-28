import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StarsBackground from '../components/StarsBackground';
import '../styles/editJob.css';
import Swal from 'sweetalert2';
import api from '../api/axios';

function EditJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    budget: '',
  });

  const {
    data: job,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const { data } = await api.get(`/jobs/${id}`);
      return data;
    },
  });

  /* 
  The form state depends on async fetched data.
  Since the data is not available during the initial render,
  useEffect listens for changes to the job object
  and populates the form once the fetch completes.
  */

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        location: job.location,
        category: job.category,
        budget: job.budget,
      });
    }
  }, [job]);

  const updateJobMutation = useMutation({
    mutationFn: async (updatedJob) => {
      const { data } = await api.patch(
        `/jobs/${id}`,
        {
          job: updatedJob,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return data;
    },

    //This cached data is outdated. Fetch fresh data.
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });

      await Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Job updated successfully.',
        timer: 2000,
        showConfirmButton: false,
      });

      navigate(`/jobs/${id}`);
    },

    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Something went wrong while updating the job.',
      });
    },
  });

  const handleChange = (e) => {
    setFormData({
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
      title: 'Update Job?',
      text: 'Do you want to save these changes?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      updateJobMutation.mutate(formData);
    }
  };
  if (isLoading) return <h1 className="page-message">Loading job...</h1>;
  if (isError) return <h1 className="page-message">Could not load job</h1>;

  return (
    <main className="edit-job-page">
      <StarsBackground />

      <div className="edit-job-content">
        <Link className="back-link" to={`/jobs/${id}`}>
          ← Back to job
        </Link>

        <section className="edit-job-card" aria-labelledby="edit-job-title">
          <div className="edit-job-header">
            <h1 id="edit-job-title">Edit Job</h1>
            <p>Update the job details below.</p>
          </div>

          <form className="edit-job-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Job title</label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Job description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                required
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  id="category"
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Category"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="budget">Budget</label>
                <input
                  id="budget"
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Budget"
                  min="0"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={updateJobMutation.isPending}>
              {updateJobMutation.isPending ? 'Updating...' : 'Update Job'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default EditJobPage;
