import { config } from '../../config';
import axios from 'axios';

const API_KEY = 'YOUR_GOOGLE_API_KEY'; // Ganti dengan API Key Google Anda

export const getAddress = async () => {
  const { token } = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : {};

  return await axios.get(`${config.api_host}/api/delivery-address?limit=`, {
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};

export const getLocation = async (lokasi, kodeInduk) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: kodeInduk,
        key: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching location data:', error);
    throw error;
  }
};

export const createAddress = async data => {
  const { token } = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : {};

  return await axios.post(`${config.api_host}/api/delivery-address`, data, {
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};
