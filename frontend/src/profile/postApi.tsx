import axios from 'axios';
import {baseUrl, withLogs,authConfig} from '../core';

import { PostProps } from './PostProps';
const postUrl = `http://${baseUrl}/post`;
const newsUrl = `http://${baseUrl}/post/newsfeed`;


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

export const getUserPersonalData = async (username : string) => {
    const response=await axios({
      method: 'get',
      url:'http://localhost:9000/user'  ,

      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        "username": username,
      }),
    });
    console.log(response);
}

export const remove: (token:string, postId:string) => Promise<any> = (token, postId) => {
  return withLogs(
    axios({
      method: 'delete',
      url: `${postUrl}/${postId}`,
      ...authConfig(token),
    }), 'Remove Post');
}