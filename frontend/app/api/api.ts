import axios from 'axios';
import { API_URL } from '../constants';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const uploadFiles : any = async (formData: FormData) => {
    const response = await api.post('/uploadFiles', formData, {
        headers: {
        'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
} 
