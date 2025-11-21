// src/api/apiService.js

import { API_BASE_URL } from '../config/constants';

export const callApi = async (url, method = 'GET', body = null) => {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };

    if (body) { options.body = JSON.stringify(body); }

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'An API error occurred.');
        }
        return data;
    } catch (error) {
        alert(`Error: ${error.message}`);
        return null;
    }
};