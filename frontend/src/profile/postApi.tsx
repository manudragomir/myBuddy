import axios from 'axios';
import {baseUrl, withLogs,authConfig} from '../core';

import { PostProps } from './PostProps';
const postUrl = `http://${baseUrl}/post`;
const newsUrl = `http://${baseUrl}/post/newsfeed`;

//  The method is interfering with the API , requesting the adding of a post
export const add: (date: string,type: string,token:string, body?: string, tags?: string[],latitude?: number,longitude?:number)=> Promise<PostProps> = (date,type,token,body, tags,latitude,longitude) => {
    return withLogs(
        axios({
            method: 'post',
            url: postUrl,
            ...authConfig(token),
            data: {
                body: body,
                date: date,
                tags: tags,
                type: type,
                latitude:latitude,
                longitude: longitude,
            }
        }), 'Add Post');
}

//  The method is interfering with the API , requesting the getting of the existent posts in the application
export const getUserPosts: (page: number, size: number) => Promise<PostProps[]> = (page, size) => {
    let filterProps = JSON.stringify({page: {nrOrd: page, size: size}});

    return withLogs(
        axios({
            method: 'post',
            url: newsUrl,
            headers: {
                'Content-Type': 'application/json',
            },
            data: filterProps,

        }), 'Get Posts FOR USER');
}

//  The method is interfering with the AWS API , requesting the adding of a file containg the picture of a post
export const submitFile = async (file : FileList ,id: string) => {
    try {
      if (!file) {
        throw new Error('Select a file first!');
      }
      const formData = new FormData();
      formData.append('file', file[0]);
      formData.get('file');
      await axios({
        method: 'post',
        url:`http://localhost:9000/set-name`  ,
       
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          "name": id
        }),
       });

      await axios({
        method: 'post',
        url:`http://localhost:9000/test-upload`  ,
       
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data : formData
       });
  
      // handle success
    } catch (error) {
      // handle error
    }
}

//  The method is interfering with the API , requesting from it to provide the personal data for a specific user
export const getUserPersonalData = async (username : string) => {
    const response=await axios({
      method: 'post',
      url:'http://localhost:9000/find-user'  ,

      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        "username": username,
      })
    });
    return response.data
}

export const uploadUserPersonalData = async (username : string,email:string,phone:string,desc:string,has:boolean) => {
  const response=await axios({
    method: 'post',
    url:`http://localhost:9000/user`  ,

    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      "username": username,
      "email":email,
      "phone":phone,
      "desc":desc,
      "has":has
    })
  });
  return response.data;
}

//  The method is interfering with the API , requesting the removing of a post
export const remove: (token:string, postId:string) => Promise<any> = (token, postId) => {
  return withLogs(
    axios({
      method: 'delete',
      url: `${postUrl}/${postId}`,
      ...authConfig(token),
    }), 'Remove Post');
}