import axios from 'axios';
import env from './environments';

const RequestManager = {
  init()
  {
    const token = localStorage.getItem('token');
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    return options;
  },
  get(url)
  {
    const options = Request.init;
    return axios.get(`${env.API_URL}/${url}`, options);
  },
  post(body)
  {
    const options = Request.init;
    return axios.post(`${env.API_URL}`, body, options);
  },
  put(url, body)
  {
    const options = Request.init;
    return axios.put(`${env.API_URL}/${url}`, body, options);
  },
  delete(url)
  {
    const options = Request.init;
    return axios.delete(`${env.API_URL}/${url}`, options);
  },
};

export default RequestManager;
