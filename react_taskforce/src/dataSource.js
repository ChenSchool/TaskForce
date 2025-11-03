import axios from 'axios';

export const API_BASE = 'http://localhost:5000';

export default axios.create
({
  baseURL: API_BASE,
});