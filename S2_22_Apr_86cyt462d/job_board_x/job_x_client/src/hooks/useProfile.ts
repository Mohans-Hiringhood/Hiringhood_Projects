import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import useAuth from './useAuth';

interface ProfileData {
  _id: string;
  user: string;
  bio: string;
  location: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  resumeUrl: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Experience {
  _id?: string;
  title: string;
  company: string;
  location: string;
  from: string;
  to?: string;
  current: boolean;
  description: string;
}

interface Education {
  _id?: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  from: string;
  to?: string;
  current: boolean;
  description: string;
}

interface UpdateProfileData {
  bio?: string;
  location?: string;
  skills?: string[] | string;
  experience?: Experience[];
  education?: Education[];
  resumeUrl?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Fetch profile data
  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.get(`${API_URL}/api/profile/me`);
      setProfile(res.data);
    } catch (err: any) {
      // If profile not found, it's not an error for a new user
      if (err.response?.status === 404) {
        setProfile(null);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      }
    } finally {
      setLoading(false);
    }
  };

  // Create or update profile
  const updateProfile = async (profileData: UpdateProfileData) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    setUpdateSuccess(false);
    
    try {
      const res = await axios.post(`${API_URL}/api/profile`, profileData);
      setProfile(res.data);
      setUpdateSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setUpdateSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Load profile on initial render if user is logged in
  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  return {
    profile,
    loading,
    error,
    updateSuccess,
    fetchProfile,
    updateProfile,
  };
};

export default useProfile;
export type { ProfileData, Experience, Education, UpdateProfileData };