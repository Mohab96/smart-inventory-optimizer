import { setCredentials, setLoading, setError, logout } from '../features/authSlice';

// Login action
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    // Replace with your API call
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    dispatch(setCredentials(data));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

// Logout action
export const logoutUser = () => (dispatch) => {
  // Add any cleanup logic here
  dispatch(logout());
};