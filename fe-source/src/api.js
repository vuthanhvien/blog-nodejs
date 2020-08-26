import axios from 'axios';

const baseUrl = 'http://localhost:3000';
export const get = (url) => {
  return axios.get(baseUrl + url).then(res => res.data)
}

export const post = (url, data) => {
  return axios.post(baseUrl + url, data).then(res => res.data)
}