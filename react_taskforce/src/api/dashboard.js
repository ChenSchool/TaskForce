import axios from '../dataSource';

export const getDashboardStats = async () => {
  const token = localStorage.getItem('accessToken');
  const response = await axios.get('/dashboard/stats', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};
