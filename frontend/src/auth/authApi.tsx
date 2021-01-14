import axios from 'axios';
import {baseUrl, withLogs} from '../core';

const authUrl = `http://${baseUrl}/user/login`;

export interface AuthProps {
    token: string;
}

export interface SignupProps {
    message: string;
}

// the methods contained in this file
// are making requests for the login and signup functionalities
// once the answers are received, the user interface is updated
export const login: (username?: string, password?: string) => Promise<AuthProps> = (username, password) => {
    const username_not_null = username == undefined ? '' : username
    const password_not_null = password == undefined ? '' : password
    return withLogs(axios({
        method: 'post',
        url: authUrl,
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            username: username_not_null,
            password: password_not_null
        },
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
