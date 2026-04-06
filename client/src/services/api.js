const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiCall = async (method, endpoint, data = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const authToken = token || localStorage.getItem('token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    if (!response.ok) {
      throw new Error(`Server error (${response.status}). Make sure the backend is running.`);
    }

    const text = await response.text();
    throw new Error(`Unexpected response: ${text.substring(0, 100)}`);
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'API request failed');
  }

  return result;
};

export default apiCall;
