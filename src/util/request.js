/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import env from './environments';

const init = () =>
{
  const token = localStorage.getItem('token');
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  return options;
};

export const get = (url) =>
{
  const options = init();
  return axios.get(`${env.API_URL}/${url}`, options);
};

export const post = (url, body) =>
{
  const options = init();
  return axios.post(`${env.API_URL}/${url}`, body, options);
};

export const put = (url, body) =>
{
  const options = init();
  return axios.put(`${env.API_URL}/${url}`, body, options);
};

export const del = (url) =>
{
  const options = init();
  return axios.delete(`${env.API_URL}/${url}`, options);
};
