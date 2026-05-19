import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CreateJobPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    budget: '',
  });

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
      setFormData({
        title: '',
        description: '',
        location: '',
        category: '',
        budget: '',
      });
      navigate('/');
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

    createJobMutation.mutate(formData);
  };

  return (
    <div>
      <h1>Create Job</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Job title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="number"
            name="budget"
            placeholder="Budget"
            value={formData.budget}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={createJobMutation.isPending}>
          {createJobMutation.isPending ? 'Creating...' : 'Create Job'}
        </button>
        {createJobMutation.isError && (
          <p>Could not create job. Please check the form.</p>
        )}
      </form>
    </div>
  );
}

export default CreateJobPage;
