import axios from 'axios';
import { baseUrl, config, withLogs } from '../core';

const authUrl = `http://${baseUrl}/user/registration`;

export interface AuthProps {
  token: string;
}

export const login: (username?: string, password?: string) => Promise<AuthProps> = (username, password) => {
  const username_not_null= username==undefined ? '' : username
  const password_not_null= password==undefined ? '' : password
  return withLogs(axios({
    method: 'post',
    url:authUrl  ,
    //withCredentials: true,
    auth:{
        username: username_not_null ,
        password: password_not_null
    },
    headers: {
        'Content-Type': 'application/json',
    },
    data : null
}), 'Login');
}
