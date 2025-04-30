import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import useAuth from './useAuth';

export interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
  };
  jobSeeker: {
    _id: string;
    name: string;
    email: string;
  };
  coverLetter: string;
  resumeUrl: string;
  status: 'pending' | 'reviewed' | 'interviewed' | 'rejected' | 'accepted';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationCreateData {
  jobId: string;
  coverLetter: string;
  resumeUrl: string;
}

export interface StatusUpdateData {
  status: 'pending' | 'reviewed' | 'interviewed' | 'rejected' | 'accepted';
  notes?: string;
}

const useApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobApplications, setJobApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Apply to a job (job seeker only)
  const applyToJob = async (applicationData: ApplicationCreateData) => {
    if (!user || user.role !== 'jobSeeker') return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await axios.post(`${API_URL}/api/applications`, applicationData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  // Get job seeker's applications (job seeker only)
  const getMyApplications = async () => {
    if (!user || user.role !== 'jobSeeker') return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.get(`${API_URL}/api/applications/me`);
      setApplications(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch your applications');
    } finally {
      setLoading(false);
    }
  };

  // Get applications for a job (employer only)
  const getJobApplications = async (jobId: string) => {
    if (!user || user.role !== 'employer') return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.get(`${API_URL}/api/applications/job/${jobId}`);
      setJobApplications(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  // Update application status (employer only)
  const updateApplicationStatus = async (applicationId: string, statusData: StatusUpdateData) => {
    if (!user || user.role !== 'employer') return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await axios.put(`${API_URL}/api/applications/${applicationId}`, statusData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update application status');
    } finally {
      setLoading(false);
    }
  };

  // Reset success state
  const resetSuccess = () => {
    setSuccess(false);
  };

  return {
    applications,
    jobApplications,
    loading,
    error,
    success,
    applyToJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus,
    resetSuccess,
  };
};

export default useApplications;