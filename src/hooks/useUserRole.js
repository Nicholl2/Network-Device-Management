import { useState, useEffect } from 'react';
import { authService } from '../lib/authService';

export const useUserRole = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await authService.getCurrentUserWithRole();
      setUser(userData);
      setLoading(false);
    };
    loadUser();
  }, []);

  const isAdmin = user?.role === 'admin';
  const isObserver = user?.role === 'observer';

  return { user, loading, isAdmin, isObserver, reload: async () => {
    const userData = await authService.getCurrentUserWithRole();
    setUser(userData);
  } };
};