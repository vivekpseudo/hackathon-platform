import {makePostRequest} from '../libs/axios';

export const login = async (email: string, password: string) => {
  const response = await makePostRequest('auth/local', { identifier: email, password });
  return response.data;
};