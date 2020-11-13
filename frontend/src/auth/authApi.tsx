import axios from 'axios';
import {baseUrl, withLogs} from '../core';

const authUrl = `http://${baseUrl}/user/login`;

export interface AuthProps {
    token: string;
}

export interface SignupProps {
    message: string;
}

export const login: (username?: string, password?: string) => Promise<AuthProps> = (username, password) => {
    const username_not_null = username == undefined ? '' : username
    const password_not_null = password == undefined ? '' : password
    return withLogs(axios({
        method: 'post',
        url: authUrl,
        //withCredentials: true,
        auth: {
            username: username_not_null,
            password: password_not_null
        },
        headers: {
            'Content-Type': 'application/json',
        },
        data: null
    }), 'Login');
}

export const signup: (firstName: string, lastName: string, dateOfBirth: string, username: string, email: string, password: string, confirmPassword: string) => Promise<SignupProps> = (firstName, lastName, dateOfBirth, username, email, password, confirmPassword) => {
    return withLogs(
        axios({
            method: 'post',
            url: "http://localhost:8080/user/registration",
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: dateOfBirth,
                username: username,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            }
        }), 'Signup');
}
