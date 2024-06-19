import { LOGIN_SUCCESS, LOGOUT, SIGNUP_SUCCESS, UPDATE_USER_PROFILE } from '../constants/userConstant';


interface User {
  name: string;
  initials: string;
}

export const loginSuccess = (user: { name: string; initials: string,userId: string, firstName:string, lastName:string,emailId:string }) => ({
    type: LOGIN_SUCCESS,
    payload: user,
  });
  

export const logout = () => ({
  type: LOGOUT as typeof LOGOUT,
});

export const signupSuccess = (user: User) => ({
  type: SIGNUP_SUCCESS as typeof SIGNUP_SUCCESS,
  payload: user,
});

export const updateUserProfile = (user: User) => ({
  type: UPDATE_USER_PROFILE,
  payload: user,
});