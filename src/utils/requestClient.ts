import axios, { AxiosInstance } from 'axios';
import { createAdminApiAuthToken } from './auth';

export default (entity: string) => ((): AxiosInstance => {
  // get authorization token
  const authToken = createAdminApiAuthToken(entity);
  // make request
  return axios.create({
    baseURL: process.env.ADMIN_API_URL!,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
      workspace: 'a2a',
    },
  });
})();
