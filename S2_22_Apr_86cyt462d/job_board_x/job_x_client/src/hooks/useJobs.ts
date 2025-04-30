import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import useAuth from './useAuth';

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  type: string;
  salary: string;
  skills: string[];
  applicationDeadline: string;
  isActive: boolean;
  applicationsCount: number;
  employer: {
    _id: string;
    name: string;
    company: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  search?: string;
  location?: string;
  type?: string;
  company?: string;
  page?: number;
  limit?: number;
}

export interface JobCreateData {
  title: string;
  location: string;
  description: string;
  requirements: string;
  type: string;
  salary?: string;
  skills?: string[] | string;
  applicationDeadline?: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const useJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [employerJobs, setEmployerJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [success, setSuccess] = useState(false);

  // Get all jobs with optional filtering
  const getJobs = async (filters: JobFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.company) queryParams.append('company', filters.company);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      
      const res = await axios.get(`${API_URL}/api/jobs?${queryParams}`);
      setJobs(res.data.jobs);
      setPagination(res.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  // Get a single job by ID
  const getJobById = async (id: string) => {
    setLoading(true);
    setError(null);
    setJob(null);
    
    try {
      const res = await axios.get(`${API_URL}/api/jobs/${id}`);
      setJob(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch job');
    } finally {
      setLoading(false);
    }
  };

  // Create a new job (employer only)
  const createJob = async (jobData: JobCreateData) => {
    if (!user || user.role !== 'employer') return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await axios.post(`${API_URL}/api/jobs`, jobData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  // Update an existing job (employer only)
  const updateJob = async (id: string, jobData: Partial<JobCreateData>) => {
    if (!user || user.role !== 'employer') return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await axios.put(`${API_URL}/api/jobs/${id}`, jobData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  // Delete a job (employer only)
  const deleteJob = async (id: string) => {
    if (!user || user.role !== 'employer') return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await axios.delete(`${API_URL}/api/jobs/${id}`);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete job');
    } finally {
      setLoading(false);
    }
  };

  // Get employer's jobs (employer only)
  const getEmployerJobs = async () => {
    if (!user || user.role !== 'employer') return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.get(`${API_URL}/api/jobs/employer`);
      setEmployerJobs(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch your jobs');
    } finally {
      setLoading(false);
    }
  };

  // Reset success state
  const resetSuccess = () => {
    setSuccess(false);
  };

  return {
    jobs,
    job,
    employerJobs,
    loading,
    error,
    pagination,
    success,
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getEmployerJobs,
    resetSuccess,
  };
};

export default useJobs;