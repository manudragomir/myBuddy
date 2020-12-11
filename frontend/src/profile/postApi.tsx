import axios from 'axios';
import {baseUrl, withLogs,authConfig} from '../core';

import { PostProps } from './PostProps';
const postUrl = `http://${baseUrl}/post`;


export const add: (date: string,type: string,token:string, body?: string, tags?: string[])=> Promise<PostProps> = (date,type,token,body, tags) => {
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
            }
        }), 'Add Post');
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