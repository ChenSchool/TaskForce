/**
 * Dashboard API service module.
 * Handles fetching dashboard statistics and metrics.
 */
import axios from '../dataSource';

/**
 * Fetch aggregated dashboard statistics including task counts, personnel distribution, and training metrics.
 */
export const getDashboardStats = async () => {
  const token = localStorage.getItem('accessToken');
  const response = await axios.get('/dashboard/stats', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};
