import  store  from '../redux/store';
import { loginSuccess, logout } from '../redux/actions/authActions';

const TOKEN_KEY = 'token';
const apiUrl = 'http://recipeburst-backend.us-east-1.elasticbeanstalk.com/'; 

const INITIALS_KEY = 'initials';

export const initializeAuth = async () => {
  const storedToken = localStorage.getItem(TOKEN_KEY);

  if (storedToken) {
    try {
      const userData = await fetchUserData(storedToken);

      const initials = userData?.firstName[0].toUpperCase() + userData?.lastName[0].toUpperCase();
      localStorage.setItem(INITIALS_KEY, initials);

      store.dispatch(loginSuccess(userData));
    } catch (error) {
      console.error('Error fetching user data:', error);
      store.dispatch(logout());
    }
  }
};


  const fetchUserData = async (token: string): Promise<any> => {
    try {
      const response = await fetch(`${apiUrl}user-data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        console.error('Failed to fetch user data:', response.status, response.statusText);
        throw new Error('Failed to fetch user data');
      }
  
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        console.error('Invalid response format. Expected JSON.');
        throw new Error('Invalid response format');
      }
  
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error('Failed to fetch user data');
    }
  };